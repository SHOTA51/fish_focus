import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Fish } from '../types';

interface FocusState {
  userId: string | null;
  user: User | null;
  fish: Fish | null;
  setUserId: (id: string | null) => Promise<void>;
  setUser: (user: User) => void;
  setFish: (fish: Fish) => void;
  addExperience: (amount: number) => void;
  loadUserProfile: (id: string) => Promise<void>;
}

export const useFocusStore = create<FocusState>((set, get) => ({
  userId: null,
  user: null,
  fish: null,

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

  addExperience: (amount) => set((state) => {
    if (!state.fish) return state;
    const newExp = state.fish.experience + amount;
    const nextLevelExp = state.fish.level * 100;
    
    if (newExp >= nextLevelExp) {
      return {
        fish: { 
          ...state.fish, 
          level: state.fish.level + 1, 
          experience: newExp - nextLevelExp 
        }
      };
    }
    return { fish: { ...state.fish, experience: newExp } };
  }),

  loadUserProfile: async (id) => {
    try {
      const { api } = require('../services/api');
      const user = await api.getUserProfile(id);
      set({ user, fish: user.fish });
    } catch (e) {
      console.error("Failed to load profile", e);
    }
  },
}));
