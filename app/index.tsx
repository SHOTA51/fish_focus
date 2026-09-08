import React, { useEffect } from "react";
import { Pressable, Text, View, ScrollView, SafeAreaView, Image } from "react-native";
import { router } from "expo-router";
import { useFocusStore } from "./store/useFocusStore";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TabItemProps {
  icon: string;
  label: string;
  active?: boolean;
  onPress: () => void;
}

export default function HomeScreen() {
  const { userId, user, fish, setUserId, loadUserProfile, setUser, setFish } = useFocusStore();

  useEffect(() => {
    const initUser = async () => {
      const storedId = await AsyncStorage.getItem('userId');
      if (storedId) {
        setUserId(storedId);
        if (storedId === 'demo-id-123') {
          setUser({ id: "demo-id-123", username: "Demo User", email: "demo@example.com", totalFocusTime: 0 });
          setFish({ name: "Nemo", level: 1, stage: "fry", experience: 0 });
        } else {
          try {
            await loadUserProfile(storedId);
          } catch (error) {
            console.error("Failed to load user profile:", error);
          }
        }
      } else {
        router.replace("/login");
      }
    };
    initUser();
  }, []);

  const handleStart = () => {
    router.push("/focus/timer");
  };

  if (!user) {
    return (
      <View className="flex-1 bg-sky-50 items-center justify-center">
        <Text className="text-slate-500 font-medium">Loading your aquatic friend...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between py-6">
          <View>
            <Text className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Focus Fish
            </Text>
            <Text className="text-slate-500 font-medium">
              Welcome back, {user?.username || 'Explorer'}! 🌊
            </Text>
          </View>
          <Pressable
            onPress={() => router.push("/settings")}
            className="h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-sky-100"
          >
            <Text className="text-xl">⚙️</Text>
          </Pressable>
        </View>

        {/* The Fish Tank Area */}
        <View className="relative my-6 overflow-hidden rounded-[40px] bg-blue-500 p-8 shadow-xl h-80 items-center justify-center">
          {/* Background bubbles/decorations */}
          <View className="absolute top-10 left-10 w-4 h-4 rounded-full bg-white/20" />
          <View className="absolute bottom-20 right-12 w-6 h-6 rounded-full bg-white/10" />
          <View className="absolute top-40 right-20 w-3 h-3 rounded-full bg-white/30" />
          
          {/* The Fish (Placeholder for image) */}
          <View className="items-center justify-center">
            <View className="mb-4 h-32 w-32 items-center justify-center rounded-full bg-white/20 border-2 border-white/30">
               <Image source={require('../assets/images/Group1.png')} className="w-16 h-16" 
            resizeMode="contain"/>
            </View>
            <Text className="text-2xl font-bold text-white">
              {fish?.name || "Bob"}
            </Text>
            <Text className="text-white/80 font-medium">
              Level {fish?.level || 1} {fish?.stage || 'Baby'} Fish
            </Text>
          </View>
        </View>

        {/* Focus Card */}
        <View className="mb-8 rounded-3xl bg-white p-6 shadow-sm border border-sky-100">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-x-2">
              <Text className="text-lg font-bold text-slate-900">Current Goal</Text>
              <View className="h-2 w-2 rounded-full bg-blue-500" />
            </View>
            <Text className="text-blue-500 font-semibold text-sm">Edit</Text>
          </View>
          
          <View className="items-center py-6">
            <Text className="text-6xl font-black text-slate-900 tracking-tighter mb-2">
              25:00
            </Text>
            <Text className="text-slate-400 font-medium">Ready to dive in?</Text>
          </View>

          <Pressable
            onPress={handleStart}
            className="w-full rounded-2xl bg-blue-500 py-4 items-center shadow-md active:bg-blue-600"
          >
            <Text className="text-white font-bold text-lg">Start Focusing</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Floating Tab Bar */}
      <View className="absolute bottom-8 left-6 right-6 flex-row items-center justify-around rounded-full bg-white/90 px-4 py-3 shadow-2xl border border-white">
        <TabItem icon="🏠" label="Home" active onPress={() => router.push("/")} />
        <TabItem icon="🎯" label="Focus" onPress={() => router.push("/focus/timer")} />
        <TabItem icon="📊" label="Stats" onPress={() => router.push("/statistics")} />
        <TabItem icon="👤" label="Profile" onPress={() => router.push("/profile")} />
      </View>
    </SafeAreaView>
  );
}

function TabItem({ icon, label, active = false, onPress }: TabItemProps) {
  return (
    <Pressable onPress={onPress} className="items-center px-4 py-2 rounded-full">
      <Text className="text-2xl">{icon}</Text>
      <Text className={`text-[10px] font-bold mt-1 ${active ? 'text-blue-500' : 'text-slate-400'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
