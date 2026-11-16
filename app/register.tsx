import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { isAxiosError } from "axios";
import { api } from "./services/api";
import { API_CONFIG } from "./constants/config";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();

    if (!trimmedEmail || !trimmedUsername || !password) {
      Alert.alert("กรอกข้อมูลไม่ครบ", "กรุณากรอกข้อมูลให้ครบทุกช่องเพื่อเริ่มการเดินทาง 🌊");
      return;
    }

    setIsLoading(true);
    try {
      await api.register(trimmedUsername, trimmedEmail, password);
      Alert.alert("สำเร็จ!", "สร้างบัญชีเรียบร้อยแล้ว! กรุณาเข้าสู่ระบบเพื่อพบกับน้องปลาของคุณ 🐠", [
        { text: "เข้าสู่ระบบ", onPress: () => router.replace("/login") },
      ]);
    } catch (e) {
      let errorMessage = "เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง";

      if (isAxiosError(e)) {
        if (e.response) {
          const data = e.response.data;
          const status = e.response.status;

          if (data && typeof data === "object") {
            if ("error" in data && typeof data.error === "string") {
              errorMessage = data.error;
            } else if ("message" in data && typeof data.message === "string") {
              errorMessage = data.message;
            }
          } else if (typeof data === "string" && data.length > 0) {
            errorMessage = data;
          } else if (status === 409) {
            errorMessage = "อีเมลหรือชื่อผู้ใช้นี้ถูกใช้งานแล้ว";
          } else if (status >= 500) {
            errorMessage = `เซิร์ฟเวอร์ขัดข้อง (Status code: ${status})`;
          }
        } else if (e.request) {
          const networkDetail = e.message ? ` (${e.message})` : "";
          errorMessage =
            `ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้${networkDetail}\n\n` +
            `กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือ URL เซิร์ฟเวอร์:\n${API_CONFIG.BASE_URL}`;
        } else {
          errorMessage = e.message || "เกิดข้อผิดพลาดในการส่งคำขอ";
        }
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }

      Alert.alert("ลงทะเบียนไม่สำเร็จ (Registration Failed)", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-12">
          <View className="items-center mb-10">
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

          <View className="gap-y-4 mb-8">
            <View className="rounded-3xl bg-white px-4 py-4 shadow-sm border border-sky-100">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Username
              </Text>
              <TextInput
                className="text-lg text-slate-900"
                placeholder="Your cool name"
                placeholderTextColor="#cbd5e1"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>

            <View className="rounded-3xl bg-white px-4 py-4 shadow-sm border border-sky-100">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Email Address
              </Text>
              <TextInput
                className="text-lg text-slate-900"
                placeholder="email@example.com"
                placeholderTextColor="#cbd5e1"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View className="rounded-3xl bg-white px-4 py-4 shadow-sm border border-sky-100">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Password
              </Text>
              <TextInput
                className="text-lg text-slate-900"
                placeholder="••••••••"
                placeholderTextColor="#cbd5e1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading}
              />
            </View>
          </View>

          <View className="gap-y-4">
            <Pressable
              onPress={handleRegister}
              disabled={isLoading}
              className={`rounded-2xl py-4 items-center shadow-md ${
                isLoading ? "bg-blue-300" : "bg-blue-500 active:bg-blue-600"
              }`}
            >
              {isLoading ? (
                <View className="flex-row items-center gap-x-2">
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text className="text-white text-lg font-bold">กำลังสร้างบัญชี...</Text>
                </View>
              ) : (
                <Text className="text-white text-lg font-bold">Create Account</Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => router.push("/login")}
              disabled={isLoading}
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
