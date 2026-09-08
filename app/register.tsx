import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { router } from "expo-router";
import { api } from "./services/api";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !username || !password) {
      Alert.alert("Missing Info", "Please fill in all fields to start your aquatic journey. 🌊");
      return;
    }

    try {
      await api.register(email, username, password);
      Alert.alert("Success!", "Account created! Please login to meet your fish.");
      router.replace("/login");
    } catch (e) {
      Alert.alert("Registration Failed", "Something went wrong. Please try again!");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-12">
          {/* Hero Section */}
          <View className="items-center mb-12">
            <View className="h-24 w-24 rounded-full bg-blue-500 items-center justify-center shadow-lg mb-6">
              <Text className="text-5xl">🐠</Text>
            </View>
            <Text className="text-4xl font-extrabold text-slate-900 tracking-tight text-center">
              Join the Ocean!
            </Text>
            <Text className="text-slate-500 font-medium mt-2 text-center">
              Create an account and adopt a fish 🌊
            </Text>
          </View>

          {/* Input Section */}
          <View className="gap-y-4 mb-8">
            <View className="rounded-3xl bg-white px-4 py-4 shadow-sm border border-sky-100">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Username</Text>
              <TextInput 
                className="text-lg text-slate-900" 
                placeholder="Your cool name" 
                placeholderTextColor="#cbd5e1"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="words"
              />
            </View>

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
              onPress={handleRegister}
              className="rounded-2xl bg-blue-500 py-4 items-center shadow-md active:bg-blue-600"
            >
              <Text className="text-white text-lg font-bold">Create Account</Text>
            </Pressable>

            <Pressable 
              onPress={() => router.push("/login")}
              className="py-3 items-center"
            >
              <Text className="text-slate-500 font-medium">
                Already have an account? <Text className="text-blue-500 font-bold">Login</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
