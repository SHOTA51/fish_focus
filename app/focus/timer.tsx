import React from "react";
import { View, Text, Pressable, SafeAreaView, Alert, Image } from "react-native";
import { router } from "expo-router";
import { useTimer } from "../hooks/useTimer";
import { useFocusStore } from "../store/useFocusStore";

export default function TimerScreen() {
  const { fish } = useFocusStore();
  
  const { 
    formatTime, 
    isActive, 
    toggleTimer, 
    secondsLeft 
  } = useTimer(10, () => {
    router.replace("/focus/success");
  });

  const handleReset = () => {
    Alert.alert(
      "Reset Timer",
      "Are you sure you want to reset the timer?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", onPress: () => router.replace("/") },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-600">
      <View className="flex-1 px-6 py-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-12">
          <Pressable 
            onPress={() => router.back()}
            className="h-12 w-12 items-center justify-center rounded-2xl bg-white/20 border border-white/30"
          >
            <Text className="text-white text-xl">←</Text>
          </Pressable>
          <Text className="text-white text-xl font-bold tracking-tight">Focus Session</Text>
          <View className="h-12 w-12" />
        </View>

        {/* Fish Tank Area */}
        <View className="flex-1 items-center justify-center">
          <View className="relative mb-12 h-72 w-72 items-center justify-center rounded-full bg-blue-500/30 border-4 border-white/20 shadow-2xl">
            {/* Ambient bubbles */}
            <View className="absolute top-10 left-20 w-3 h-3 rounded-full bg-white/20" />
            <View className="absolute bottom-20 right-16 w-4 h-4 rounded-full bg-white/10" />
            <View className="absolute top-40 right-12 w-2 h-2 rounded-full bg-white/30" />
            
            <Image source={require('../../assets/images/Group2.png')} className="w-18 h-18" resizeMode="contain" />
          </View>

          {/* Timer Display */}
          <View className="items-center mb-16">
            <Text className="text-8xl font-black text-white tracking-tighter mb-2">
              {formatTime()}
            </Text>
            <Text className="text-blue-200 font-medium text-lg">
              {isActive ? `${fish?.name} is swimming...` : 'Ready to start?'}
            </Text>
          </View>

          {/* Controls */}
          <View className="flex-row items-center justify-center gap-x-8">
            <Pressable
              onPress={() => router.push("/focus/pause")}
              className="h-16 w-16 items-center justify-center rounded-full bg-white/20 border border-white/30"
            >
              <Text className="text-white text-2xl">⏸️</Text>
            </Pressable>

            <Pressable
              onPress={toggleTimer}
              className="h-24 w-48 items-center justify-center rounded-full bg-white shadow-xl active:bg-blue-50"
            >
              <Text className="text-blue-600 text-2xl font-black">
                {isActive ? "PAUSE" : "START"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleReset}
              className="h-16 w-16 items-center justify-center rounded-full bg-white/20 border border-white/30"
            >
              <Text className="text-white text-2xl">🔄</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
