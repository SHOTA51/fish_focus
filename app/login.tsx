import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { api } from "./services/api";
import { useFocusStore } from "./store/useFocusStore";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUserId, setUser, setFish } = useFocusStore();

  const handleLogin = async () => {
    // 1. ใส่ข้อมูลหลอกๆ ให้ผ่านเงื่อนไขหน้า Home
    setUser({
      id: "demo-id-123",
      username: "Demo User",
      email: "demo@example.com",
      totalFocusTime: 0
    });
    
    // 2. เซ็ตข้อมูลปลาจำลอง (เพื่อให้หน้า Home มีข้อมูลไปแสดงผล)
    setFish({ 
      name: "Nemo", 
      level: 1, 
      stage: "fry" ,
      experience: 0
    });

    await AsyncStorage.setItem('userId', 'demo-id-123');

    // 3. เด้งไปหน้า Index ทันที
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 px-6"
      >
        <View className="flex-1 justify-center py-12">
          {/* Hero Section */}
          <View className="items-center mb-12">
            <View className="h-24 w-24 rounded-full bg-blue-500 items-center justify-center shadow-lg mb-6">
              <Text className="text-5xl">🐠</Text>
            </View>
            <Text className="text-4xl font-extrabold text-slate-900 tracking-tight text-center">
              Welcome Back!
            </Text>
            <Text className="text-slate-500 font-medium mt-2 text-center">
              Login to feed your aquatic friend 🌊
            </Text>
          </View>

          {/* Input Section */}
          <View className="gap-y-4 mb-8">
            <View className="rounded-3xl bg-white px-4 py-4 shadow-sm border border-sky-100">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Email Address</Text>
              <TextInput
                className="text-lg text-slate-900"
                placeholder="email@example.com"
                placeholderTextColor="#cbd5e1"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="rounded-3xl bg-white px-4 py-4 shadow-sm border border-sky-100">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Password</Text>
              <TextInput
                className="text-lg text-slate-900"
                placeholder="••••••••"
                placeholderTextColor="#cbd5e1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Actions */}
          <View className="gap-y-4">
            <Pressable
              onPress={handleLogin}
              className="rounded-2xl bg-blue-500 py-4 items-center shadow-md active:bg-blue-600"
            >
              <Text className="text-white text-lg font-bold">Dive In</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/register")}
              className="py-3 items-center"
            >
              <Text className="text-slate-500 font-medium">
                Don't have an account? <Text className="text-blue-500 font-bold">Register</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}