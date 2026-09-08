import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";

const QUESTS = [
  { id: '1', title: 'Morning Focus', desc: 'Focus for 30 mins before 10 AM', goal: 30, current: 15, reward: 10, completed: false },
  { id: '2', title: 'Deep Work', desc: 'Complete 2 sessions of 25 mins', goal: 50, current: 0, reward: 20, completed: false },
  { id: '3', title: 'Consistency', desc: 'Focus for 3 days in a row', goal: 0, current: 2, reward: 50, completed: false },
];

export default function QuestScreen() {
  return (
    <View className="flex-1 bg-[#EAF8FF] px-6 pt-14">
      <View className="flex-row items-center justify-between mb-8">
        <Pressable 
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <Text className="text-lg">←</Text>
        </Pressable>
        <Text className="text-xl font-bold text-[#163B56]">Fish Quests</Text>
        <View className="h-10 w-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-[#6D8CA0] mb-4">Complete quests to earn fish food!</Text>
        
        <View className="gap-y-4">
          {QUESTS.map(quest => (
            <View key={quest.id} className="rounded-3xl bg-white p-5 shadow-sm border-l-8 border-[#208AEF]">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-lg font-bold text-[#163B56] flex-1">{quest.title}</Text>
                <Text className="text-[#208AEF] font-bold">+{quest.reward} 🍲</Text>
              </View>
              <Text className="text-sm text-[#6D8CA0] mb-4">{quest.desc}</Text>
              
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-semibold text-[#8AA5B5]">
                  Progress: {quest.current}/{quest.goal} mins
                </Text>
                <Text className="text-xs font-bold text-[#208AEF]">
                  {Math.round((quest.current/quest.goal)*100 || 0)}%
                </Text>
              </View>
              <View className="h-2 w-full bg-[#EAF8FF] rounded-full overflow-hidden">
                <View 
                  className="h-full bg-[#208AEF]" 
                  style={{ width: `${(quest.current/quest.goal)*100 || 0}%` }} 
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
