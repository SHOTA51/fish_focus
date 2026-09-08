import React from "react";
import { View, Text, Pressable, SafeAreaView, ScrollView, Image } from "react-native";
import { router } from "expo-router";
import { useFocusStore } from "./store/useFocusStore";

export default function ProfileScreen() {
  const { fish, user } = useFocusStore();

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
          <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">My Profile</Text>
          <View className="h-12 w-12" />
        </View>

        {/* User Profile Section */}
        <View className="items-center my-8">
          <View className="relative">
            <View className="h-32 w-32 rounded-full bg-white border-4 border-blue-500 items-center justify-center shadow-xl overflow-hidden">
              <Text className="text-6xl">👤</Text>
            </View>
            <View className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-green-500 border-4 border-white" />
          </View>
          <Text className="mt-4 text-2xl font-bold text-slate-900">{user?.username || "Fish Lover"}</Text>
          <Text className="text-slate-500 font-medium">{user?.email || "user@example.com"}</Text>
        </View>

        {/* Fish Companion Card */}
        <View className="mb-8 rounded-3xl bg-white p-6 shadow-sm border border-sky-100">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-slate-900">My Companion</Text>
            <View className="px-3 py-1 rounded-full bg-blue-100">
              <Text className="text-blue-600 font-bold text-xs">ACTIVE</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-x-6">
            <View className="h-24 w-24 rounded-3xl bg-blue-50 items-center justify-center border border-blue-100 shadow-inner">
            <Image source={require('../assets/images/Group1.png')} className="w-12 h-12" 
  resizeMode="contain"/>
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-slate-900">{fish?.name || "Bob"}</Text>
              <Text className="text-slate-500 font-medium mb-3">Level {fish?.level || 1} {fish?.stage || 'Baby'} Fish</Text>
              
              {/* XP Bar */}
              <View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience</Text>
                  <Text className="text-[10px] font-bold text-blue-600">{fish?.experience || 0}%</Text>
                </View>
                <View className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <View 
                    className="h-full bg-blue-500" 
                    style={{ width: `${fish?.experience || 0}%` }} 
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Account Actions */}
        <View className="gap-y-4 mb-10">
          <Pressable className="flex-row items-center p-4 bg-white rounded-2xl border border-sky-100 shadow-sm">
             <Text className="text-xl mr-4">🔒</Text>
             <Text className="text-slate-700 font-semibold">Change Password</Text>
          </Pressable>
          
          <Pressable 
            onPress={() => router.replace("/login")}
            className="flex-row items-center p-4 bg-white rounded-2xl border border-red-100 shadow-sm"
          >
             <Text className="text-xl mr-4">🚪</Text>
             <Text className="text-red-500 font-bold">Logout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
