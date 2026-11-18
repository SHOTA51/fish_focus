import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Fish, FishStage, EvolutionEvent } from '../types';
import { api } from '../services/api';

export const MAX_FOOD_CAP = 20;

export const getStageForLevel = (level: number): FishStage => {
  if (level >= 12) return 'adult';
  if (level >= 6) return 'juvenile';
  if (level >= 2) return 'fry';
  return 'egg';
};

export const getNextLevelExp = (level: number): number => {
  if (level <= 1) return 50; // Fast onboarding: 1 session of 25m gets you to Lv 2!
  return level * 75;
};

export const calculateFocusRewards = (durationMinutes: number) => {
  if (durationMinutes <= 5) return { exp: 10, food: 1 };
  if (durationMinutes <= 10) return { exp: 20, food: 1 };
  if (durationMinutes <= 15) return { exp: 30, food: 3 };
  if (durationMinutes <= 25) return { exp: 50, food: 3 };
  if (durationMinutes <= 45) return { exp: 90, food: 6 };
  return { exp: 120, food: 8 }; // 60m
};

interface FocusState {
  userId: string | null;
  user: User | null;
  fish: Fish | null;
  pendingEvolution: EvolutionEvent | null;

  setUserId: (id: string | null) => Promise<void>;
  resetFishState: () => void;
  setUser: (user: User) => void;
  setFish: (fish: Fish) => void;
  setFishStage: (stage: FishStage) => void;
  
  // Progression & Food Mechanics
  addExperience: (amount: number) => { leveledUp: boolean; evolvedTo?: FishStage };
  addFood: (amount: number) => number; // returns new food total
  feedFish: () => { success: boolean; evolvedTo?: FishStage };
  clearPendingEvolution: () => void;

  loadUserProfile: (id?: string) => Promise<void>;
  syncLocalFishState: () => Promise<void>;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  userId: null,
  user: null,
  fish: {
    name: 'น้องส้ม (Fishy)',
    level: 1,
    experience: 0,
    stage: 'egg',
    food: 5,
  },
  pendingEvolution: null,

  setUserId: async (id) => {
    if (id) {
      await AsyncStorage.setItem('userId', id);
    } else {
      await AsyncStorage.removeItem('userId');
    }
    set({ userId: id });
  },

  // Reset fish state to fresh defaults (used on logout / account switch)
  resetFishState: () => {
    set({
      user: null,
      fish: {
        name: 'น้องส้ม (Fishy)',
        level: 1,
        experience: 0,
        stage: 'egg',
        food: 5,
      },
      pendingEvolution: null,
    });
  },

  setUser: (user) => set({ user }),

  setFish: (fish) => {
    // Preserve local food count if server doesn't have it yet
    const currentFood = get().fish?.food ?? 5;
    set({
      fish: {
        ...fish,
        food: fish.food !== undefined ? fish.food : currentFood,
      },
    });
  },

  setFishStage: (stage) =>
    set((state) => ({
      fish: state.fish
        ? { ...state.fish, stage }
        : { name: 'น้องส้ม', level: 1, experience: 0, stage, food: 5 },
    })),

  addExperience: (amount) => {
    const state = get();
    if (!state.fish) return { leveledUp: false };

    let currentExp = state.fish.experience + amount;
    let currentLevel = state.fish.level;
    let currentStage = state.fish.stage;
    let leveledUp = false;
    let evolvedTo: FishStage | undefined = undefined;

    let targetExp = getNextLevelExp(currentLevel);
    while (currentExp >= targetExp) {
      currentExp -= targetExp;
      currentLevel += 1;
      leveledUp = true;

      // Check Pokemon evolution thresholds via helper
      const newStage = getStageForLevel(currentLevel);

      if (newStage !== currentStage) {
        evolvedTo = newStage;
        set({
          pendingEvolution: {
            fromStage: currentStage,
            toStage: newStage,
            level: currentLevel,
            fishName: state.fish.name,
          },
        });
        currentStage = newStage;
      }

      targetExp = getNextLevelExp(currentLevel);
    }

    // Double check stage is strictly aligned with level
    const guaranteedStage = getStageForLevel(currentLevel);
    if (guaranteedStage !== currentStage) {
      currentStage = guaranteedStage;
    }

    set({
      fish: {
        ...state.fish,
        level: currentLevel,
        experience: currentExp,
        stage: currentStage,
      },
    });

    get().syncLocalFishState();
    return { leveledUp, evolvedTo };
  },

  addFood: (amount) => {
    const state = get();
    const currentFood = state.fish?.food ?? 0;
    const newFood = Math.min(currentFood + amount, MAX_FOOD_CAP);

    if (state.fish) {
      set({
        fish: {
          ...state.fish,
          food: newFood,
        },
      });
      get().syncLocalFishState();
    }
    return newFood;
  },

  feedFish: () => {
    const state = get();
    if (!state.fish) return { success: false };

    const currentFood = state.fish.food ?? 0;
    if (currentFood <= 0) {
      return { success: false };
    }

    // Deduct 1 food
    set({
      fish: {
        ...state.fish,
        food: currentFood - 1,
      },
    });

    // Feeding grants +10 EXP!
    const { evolvedTo } = get().addExperience(10);
    return { success: true, evolvedTo };
  },

  clearPendingEvolution: () => set({ pendingEvolution: null }),

  loadUserProfile: async (id) => {
    try {
      const user = await api.getUserProfile(id);
      // Use per-user cache key so different accounts never share fish data
      const cacheKey = id ? `local_fish_meta_${id}` : 'local_fish_meta';
      const savedLocalFish = await AsyncStorage.getItem(cacheKey);
      let localMeta = savedLocalFish ? JSON.parse(savedLocalFish) : null;

      const serverFish = user.fish;
      if (serverFish) {
        // Reconcile: NEVER downgrade the user's hard-earned level or stage!
        const localLevel = localMeta?.level ?? 1;
        const localExp = localMeta?.experience ?? 0;
        const localFood = localMeta?.food ?? 5;
        const serverLevel = serverFish.level ?? 1;
        const serverExp = serverFish.experience ?? 0;

        const resolvedLevel = Math.max(serverLevel, localLevel);

        let resolvedExp = serverExp;
        if (localLevel > serverLevel) {
          resolvedExp = localExp;
        } else if (localLevel === serverLevel) {
          resolvedExp = Math.max(serverExp, localExp);
        }

        // Strictly determine stage from the resolved level so an evolved fish NEVER reverts!
        const resolvedStage = getStageForLevel(resolvedLevel);

        const reconciledFish: Fish = {
          ...serverFish,
          level: resolvedLevel,
          experience: resolvedExp,
          stage: resolvedStage,
          food: localFood,
        };

        set({
          user,
          fish: reconciledFish,
        });

        await get().syncLocalFishState();

        // If client had more progress than the server, sync to backend in background!
        if (localLevel > serverLevel || (localLevel === serverLevel && localExp > serverExp)) {
          api.syncFish({
            level: resolvedLevel,
            experience: resolvedExp,
            stage: resolvedStage,
          }).catch((err) => console.warn('Background sync warning:', err));
        }
      } else {
        set({ user });
      }
    } catch (e) {
      console.error('Failed to load profile', e);
      throw e;
    }
  },

  syncLocalFishState: async () => {
    try {
      const { fish, userId } = get();
      if (fish) {
        // Use per-user cache key so different accounts never share fish data
        const cacheKey = userId ? `local_fish_meta_${userId}` : 'local_fish_meta';
        await AsyncStorage.setItem(
          cacheKey,
          JSON.stringify({
            food: fish.food ?? 5,
            stage: fish.stage,
            level: fish.level,
            experience: fish.experience,
          })
        );
      }
    } catch (err) {
      console.warn('Failed to persist local fish state', err);
    }
  },
}));
