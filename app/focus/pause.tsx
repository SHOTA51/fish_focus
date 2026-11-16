import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useFocusStore } from "../store/useFocusStore";
import { Fish } from "../components/Fish";

export default function PauseScreen() {
  const { fish } = useFocusStore();

  return (
    <View className="flex-1 bg-[#EAF8FF] items-center justify-center px-6">
      <View className="mb-8 h-56 w-56 items-center justify-center rounded-full bg-white shadow-md border-4 border-sky-100">
        <Fish stage={fish?.stage} mood="sleeping" size={140} interactive={true} />
      </View>

      <Text className="text-3xl font-bold text-[#163B56] text-center">
        Taking a break?
      </Text>
      
      <Text className="mt-4 text-center text-base text-[#6D8CA0]">
        {fish?.name || "Bob"} is napping peacefully. Come back when you&apos;re ready to dive back in!
      </Text>

      <View className="mt-12 w-full gap-y-4">
        <Pressable
          onPress={() => router.back()}
          className="w-full items-center rounded-2xl bg-[#208AEF] py-4 active:opacity-80"
        >
          <Text className="text-lg font-bold text-white">Resume Focus</Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/")}
          className="w-full items-center rounded-2xl bg-white py-4 border border-[#D5F1FF] active:opacity-80"
        >
          <Text className="text-lg font-bold text-[#6D8CA0]">Give Up</Text>
        </Pressable>
      </View>
    </View>
  );
}
