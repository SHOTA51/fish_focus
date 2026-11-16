import { useState } from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import { useTimer } from "../hooks/useTimer";
import { useFocusStore } from "../store/useFocusStore";
import { Fish } from "../components/Fish";

export default function TimerScreen() {
  const { fish } = useFocusStore();
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const presets = [5, 10, 15, 25, 45, 60];

  const {
    formatTime,
    isActive,
    toggleTimer,
  } = useTimer(selectedMinutes, () => {
    router.replace({
      pathname: "/focus/success",
      params: { duration: selectedMinutes },
    });
  });

  const handleReset = () => {
    Alert.alert(
      "รีเซ็ตเวลา (Reset Timer)",
      "คุณต้องการรีเซ็ตเวลาและยกเลิกเซสชันโฟกัสนี้หรือไม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        { text: "รีเซ็ต", style: "destructive", onPress: () => router.replace("/") },
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#208AEF] pt-12">
      <View className="flex-1 px-6 py-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <Pressable
            onPress={() => router.back()}
            className="h-12 w-12 items-center justify-center rounded-2xl bg-white/20 border border-white/30 active:bg-white/30"
          >
            <Text className="text-white text-xl">←</Text>
          </Pressable>
          <Text className="text-white text-xl font-bold tracking-tight">Focus Session</Text>
          <View className="h-12 w-12" />
        </View>

        {/* Duration Selection (Presets) */}
        <View className="mb-8">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 8,
              alignItems: "center",
              justifyContent: "center",
              flexGrow: 1,
            }}
          >
            <View className="flex-row gap-x-2.5">
              {presets.map((min) => {
                const isSelected = selectedMinutes === min;
                return (
                  <Pressable
                    key={min}
                    onPress={() => !isActive && setSelectedMinutes(min)}
                    disabled={isActive}
                    className={`px-4 py-2 rounded-full border ${
                      isSelected
                        ? "bg-white border-white shadow-md"
                        : isActive
                        ? "bg-white/10 border-white/20 opacity-50"
                        : "bg-white/15 border-white/30 active:bg-white/25"
                    }`}
                  >
                    <Text
                      className={`font-bold text-sm ${
                        isSelected ? "text-blue-600" : "text-white"
                      }`}
                    >
                      {min}m
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Fish Tank Area */}
        <View className="flex-1 items-center justify-center">
          <View className="relative mb-10 h-72 w-72 items-center justify-center rounded-full bg-blue-500/30 border-4 border-white/20 shadow-2xl">
            {/* Ambient bubbles */}
            <View className="absolute top-10 left-20 w-3 h-3 rounded-full bg-white/20" />
            <View className="absolute bottom-20 right-16 w-4 h-4 rounded-full bg-white/10" />
            <View className="absolute top-40 right-12 w-2 h-2 rounded-full bg-white/30" />

            <Fish
              stage={fish?.stage}
              mood={isActive ? "focus" : "idle"}
              size={155}
              interactive={true}
            />
          </View>

          {/* Timer Display */}
          <View className="items-center mb-12">
            <Text className="text-8xl font-black text-white tracking-tighter mb-2">
              {formatTime()}
            </Text>
            <Text className="text-blue-100 font-medium text-lg">
              {isActive
                ? `${fish?.name || "Your fish"} is swimming happily... 🌊`
                : "Ready to focus?"}
            </Text>
          </View>

          {/* Controls */}
          <View className="flex-row items-center justify-center gap-x-8">
            <Pressable
              onPress={() => router.push("/focus/pause")}
              className="h-16 w-16 items-center justify-center rounded-full bg-white/20 border border-white/30 active:bg-white/30"
            >
              <Text className="text-white text-2xl">⏸️</Text>
            </Pressable>

            <Pressable
              onPress={toggleTimer}
              className={`h-24 w-48 items-center justify-center rounded-full shadow-xl ${
                isActive
                  ? "bg-amber-400 active:bg-amber-500"
                  : "bg-white active:bg-blue-50"
              }`}
            >
              <Text
                className={`text-2xl font-black ${
                  isActive ? "text-slate-900" : "text-blue-600"
                }`}
              >
                {isActive ? "PAUSE / END" : "START"}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleReset}
              className="h-16 w-16 items-center justify-center rounded-full bg-white/20 border border-white/30 active:bg-white/30"
            >
              <Text className="text-white text-2xl">🔄</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
