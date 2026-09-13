import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, SafeAreaView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { api } from "./services/api";
import { Statistics } from "./types";

export default function StatisticsScreen() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await api.getStatistics();
        setStats(data);
      } catch (e) {
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-sky-50 items-center justify-center">
        <ActivityIndicator size="large" color="#0284c7" />
        <Text className="mt-4 text-slate-500 font-medium">Loading your progress...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-sky-50 items-center justify-center px-6">
        <Text className="text-center text-slate-600 mb-4">{error}</Text>
        <Pressable 
          onPress={() => {
            setLoading(true);
            setError(null);
            // In a real app, you'd call fetchStats again
          }} 
          className="px-6 py-3 bg-blue-600 rounded-2xl"
        >
          <Text className="text-white font-bold">Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!stats) return null;

  const bentoStats = [
    { label: "Total Focus Time", value: formatFocusTime(stats.totalFocusTime), icon: "⏱️", color: "bg-blue-100", textColor: "text-blue-600" },
    { label: "Sessions", value: stats.sessions.toString(), icon: "✅", color: "bg-emerald-100", textColor: "text-emerald-600" },
    { label: "Fish Level", value: `Lv. ${stats.fishLevel}`, icon: "🐠", color: "bg-amber-100", textColor: "text-amber-600" },
    { label: "Focus Streak", value: `${stats.focusStreak} Days`, icon: "🔥", color: "bg-rose-100", textColor: "text-rose-600" },
  ];

  // Find max minutes in the week to scale the bars
  const maxMinutes = Math.max(...stats.weeklyActivity.map(d => d.minutes), 1);

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between py-6">
          <Pressable 
            onPress={() => router.back()}
            className="h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-sky-100"
          >
            <Text className="text-xl">←</Text>
          </Pressable>
          <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">Your Progress</Text>
          <View className="h-12 w-12" />
        </View>

        {/* Stats Bento Grid */}
        <View className="flex-row flex-wrap justify-between mb-8">
          {bentoStats.map((stat, i) => (
            <View key={i} className="w-[48%] rounded-3xl bg-white p-5 shadow-sm border border-sky-100 mb-4">
              <View className={`h-12 w-12 ${stat.color} items-center justify-center rounded-2xl mb-4`}>
                <Text className="text-2xl">{stat.icon}</Text>
              </View>
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {stat.label}
              </Text>
              <Text className={`text-2xl font-black ${stat.textColor}`}>
                {stat.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Activity Chart Section */}
        <View className="rounded-3xl bg-white p-6 shadow-sm border border-sky-100 mb-10">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-lg font-bold text-slate-900">Weekly Activity</Text>
            <Text className="text-blue-500 font-bold text-xs">View Full Log</Text>
          </View>
          
          <View className="flex-row items-end justify-between h-40 px-2">
            {stats.weeklyActivity.map((dayData, i) => (
              <View key={i} className="items-center">
                <View className="mb-2 h-4 w-1 rounded-full bg-slate-100" /> {/* Spacer */}
                <View 
                  className="w-3 bg-blue-500 rounded-t-full shadow-sm" 
                  style={{ height: `${(dayData.minutes / maxMinutes) * 100}%` }} 
                />
                <Text className="text-[10px] font-bold text-slate-400 mt-3">
                  {dayData.day}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievement Placeholder */}
        <View className="rounded-3xl bg-blue-600 p-6 shadow-lg mb-10 flex-row items-center">
          <View className="h-16 w-16 rounded-2xl bg-white/20 items-center justify-center mr-4">
            <Text className="text-3xl">🏆</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-lg">Next Milestone</Text>
            <Text className="text-blue-100 text-sm">Reach Level 5 to unlock a Gold Fish!</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
