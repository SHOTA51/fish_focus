import axios, { isAxiosError } from 'axios';
import React, { useEffect, useState } from "react";
import { Pressable, Text, View, ScrollView, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { useFocusStore } from "./store/useFocusStore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FishTank } from "./components/FishTank";
import { Fish, FishStage, FishColorTheme } from "./components/Fish";

interface TabItemProps {
  icon: string;
  label: string;
  active?: boolean;
  onPress: () => void;
}

export default function HomeScreen() {
  const { user, fish, setUserId, loadUserProfile, setFishStage } = useFocusStore();
  const [selectedStage, setSelectedStage] = useState<FishStage | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<FishColorTheme>("orange");

  useEffect(() => {
    const initUser = async () => {
      const storedId = await AsyncStorage.getItem('userId');
      const storedToken = await AsyncStorage.getItem('token');

      if (storedId && storedToken) {
        setUserId(storedId);
        try {
          await loadUserProfile(storedId);
        } catch (error) {
          if (isAxiosError(error)) {
            const status = error.response?.status;
            if (status === 401 || status === 403 || status === 404) {
              console.warn(`Session error (${status}): clearing credentials and redirecting to login`);
              await AsyncStorage.multiRemove(['userId', 'token']);
              setUserId(null);
              router.replace("/login");
              return;
            }
          }
          console.error("Network or server error loading profile:", error);
        }
      } else {
        await AsyncStorage.multiRemove(['userId', 'token']);
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
      <View className="flex-1 bg-sky-50 items-center justify-center px-6">
        <Fish stage="fry" mood="idle" size={90} interactive={false} />
        <Text className="text-slate-700 font-bold text-lg mt-4">Loading your aquatic friend...</Text>
        <Text className="text-slate-400 text-xs mt-1 text-center">Connecting to Focus Fish server...</Text>
        <Pressable
          onPress={async () => {
            await AsyncStorage.multiRemove(['userId', 'token']);
            setUserId(null);
            router.replace("/login");
          }}
          className="mt-6 px-4 py-2 bg-white rounded-full border border-sky-200 shadow-xs active:bg-sky-50"
        >
          <Text className="text-blue-500 font-bold text-xs">Back to Login</Text>
        </Pressable>
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
        <View className="my-5">
          <FishTank
            stage={selectedStage || (fish?.stage as FishStage) || "juvenile"}
            colorTheme={selectedTheme}
            fishName={fish?.name || "Bob"}
            level={fish?.level || 1}
            mode="home"
            height={320}
          />

          {/* Interactive Customization & Growth Stage Picker */}
          <View className="mt-3 bg-white/80 p-3 rounded-2xl border border-sky-100 flex-row items-center justify-between shadow-xs">
            {/* Stage Selector */}
            <View className="flex-row items-center gap-1">
              <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Stage:</Text>
              {(["egg", "fry", "juvenile", "adult"] as FishStage[]).map((stg) => {
                const isActive = (selectedStage || fish?.stage || "juvenile") === stg;
                return (
                  <Pressable
                    key={stg}
                    onPress={() => {
                      setSelectedStage(stg);
                      setFishStage(stg);
                    }}
                    className={`px-2.5 py-1 rounded-xl border ${
                      isActive
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <Text
                      className={`text-[11px] font-bold capitalize ${
                        isActive ? "text-white" : "text-slate-600"
                      }`}
                    >
                      {stg}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Theme Selector */}
            <View className="flex-row items-center gap-1.5 ml-2">
              {(
                [
                  { key: "orange", color: "#FF512F" },
                  { key: "cyan", color: "#00C6FF" },
                  { key: "golden", color: "#F9D423" },
                  { key: "sakura", color: "#FF758C" },
                ] as { key: FishColorTheme; color: string }[]
              ).map((t) => (
                <Pressable
                  key={t.key}
                  onPress={() => setSelectedTheme(t.key)}
                  style={{ backgroundColor: t.color }}
                  className={`w-5 h-5 rounded-full border-2 ${
                    selectedTheme === t.key ? "border-slate-800 scale-110" : "border-white"
                  }`}
                />
              ))}
            </View>
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
