import React from "react";
import { View, Text, Pressable, Alert, Image } from "react-native";
import { router } from "expo-router";
import { useFocusStore } from "../store/useFocusStore";
import { api } from "../services/api";

export default function SuccessScreen() {
  const { userId, setFish, setUser } = useFocusStore();

  const handleClaimReward = async () => {
    if (!userId) {
      Alert.alert("Error", "User not found. Please login again.");
      router.replace("/login");
      return;
    }

    try {
      // We mock the focus duration as 10 minutes for this basic demo
      const { user, fish } = await api.completeSession(userId, 10);
      setUser(user);
      setFish(fish);
      router.replace("/");
    } catch (e) {
      Alert.alert("Error", "Failed to save focus session");
    }
  };

  return (
    <View className="flex-1 bg-[#EAF8FF] items-center justify-center px-6">
      <View className="mb-8 h-64 w-64 items-center justify-center rounded-full bg-[#D5F1FF]">
      <Image source={require('../../assets/images/Group4.png')} />
      </View>

      <Text className="text-4xl font-bold text-[#163B56] text-center">
        Focus Complete!
      </Text>
      
      <Text className="mt-4 text-center text-lg text-[#6D8CA0]">
        You've fed your fish! 
        It's feeling much stronger now.
      </Text>

      <View className="mt-8 w-full max-w-sm rounded-3xl bg-white px-6 py-6 shadow-sm items-center">
        <Text className="text-sm font-medium text-[#8AA5B5]">Reward Earned</Text>
        <Text className="text-3xl font-bold text-[#208AEF]">+10 EXP</Text>
      </View>

      <Pressable
        onPress={handleClaimReward}
        className="mt-10 w-full max-w-sm items-center rounded-2xl bg-[#208AEF] py-4 active:opacity-80"
      >
        <Text className="text-lg font-bold text-white">Claim Reward</Text>
      </Pressable>
    </View>
  );
}
