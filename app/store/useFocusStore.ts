import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Fish } from '../types';
import { api } from '../services/api';

interface FocusState {
  userId: string | null;
  user: User | null;
  fish: Fish | null;
  setUserId: (id: string | null) => Promise<void>;
  setUser: (user: User) => void;
  setFish: (fish: Fish) => void;
  setFishStage: (stage: Fish['stage']) => void;
  addExperience: (amount: number) => void;
  loadUserProfile: (id?: string) => Promise<void>;
}

export const useFocusStore = create<FocusState>((set) => ({
  userId: null,
  user: null,
  fish: {
    name: 'Bob',
    level: 1,
    experience: 25,
    stage: 'juvenile',
  },

  setUserId: async (id) => {
    if (id) {
      await AsyncStorage.setItem('userId', id);
    } else {
      await AsyncStorage.removeItem('userId');
    }
    set({ userId: id });
  },

  setUser: (user) => set({ user }),
  setFish: (fish) => set({ fish }),
  setFishStage: (stage) => set((state) => ({
    fish: state.fish ? { ...state.fish, stage } : { name: 'Bob', level: 1, experience: 0, stage }
  })),

  addExperience: (amount) => set((state) => {
    if (!state.fish) return state;
    const newExp = state.fish.experience + amount;
    const nextLevelExp = state.fish.level * 100;
    
    if (newExp >= nextLevelExp) {
      const nextLevel = state.fish.level + 1;
      let nextStage: Fish['stage'] = state.fish.stage;
      if (nextLevel >= 10) nextStage = 'adult';
      else if (nextLevel >= 5) nextStage = 'juvenile';
      else if (nextLevel >= 2 && state.fish.stage === 'egg') nextStage = 'fry';

      return {
        fish: { 
          ...state.fish, 
          level: nextLevel,
          stage: nextStage,
          experience: newExp - nextLevelExp 
        }
      };
    }
    return { fish: { ...state.fish, experience: newExp } };
  }),

  loadUserProfile: async (id) => {
    try {
      const user = await api.getUserProfile(id);
      set({ 
        user, 
        fish: user.fish || null 
      });
    } catch (e) {
      console.error("Failed to load profile", e);
      throw e;
    }
  },
}));
