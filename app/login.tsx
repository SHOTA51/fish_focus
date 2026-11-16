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
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { isAxiosError } from "axios";
import { api } from "./services/api";
import { useFocusStore } from "./store/useFocusStore";
import { API_CONFIG } from "./constants/config";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserId, setUser, setFish } = useFocusStore();

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      Alert.alert("กรอกข้อมูลไม่ครบ", "กรุณากรอกทั้งอีเมลและรหัสผ่าน");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.login(trimmedEmail, password);
      const { userId, user } = response;

      // Update Store
      setUser(user);
      if (user.fish) {
        setFish(user.fish);
      }

      // Persist ID
      await setUserId(userId);

      router.replace("/");
    } catch (e) {
      let errorMessage = "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง";

      if (isAxiosError(e)) {
        if (e.response) {
          // เซิร์ฟเวอร์ตอบกลับแต่ส่ง status error กลับมา (4xx, 5xx)
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
          } else if (status === 401 || status === 400) {
            errorMessage = "อีเมลหรือรหัสผ่านไม่ถูกต้อง (Invalid credentials)";
          } else if (status >= 500) {
            errorMessage = `เซิร์ฟเวอร์ขัดข้อง (Status code: ${status})`;
          } else {
            errorMessage = `เกิดข้อผิดพลาด (Status code: ${status})`;
          }
        } else if (e.request) {
          // ส่ง request ไปแล้วแต่ไม่ได้รับการตอบกลับ (Network Error, Timeout, Server Down)
          const networkDetail = e.message ? ` (${e.message})` : "";
          errorMessage =
            `ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้${networkDetail}\n\n` +
            `กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือ URL เซิร์ฟเวอร์:\n${API_CONFIG.BASE_URL}`;
        } else {
          errorMessage = e.message || "เกิดข้อผิดพลาดในการส่งคำขอไปยังเซิร์ฟเวอร์";
        }
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }

      Alert.alert("เข้าสู่ระบบไม่สำเร็จ (Login Failed)", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-sky-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 px-6"
      >
        <View className="flex-1 justify-center py-12">
          {/* Logo & Header */}
          <View className="items-center mb-10">
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

          {/* Form Fields */}
          <View className="gap-y-4 mb-8">
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
              <View className="flex-row items-center justify-between mb-2 ml-1">
                <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Password
                </Text>
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Text className="text-xs font-bold text-blue-500 mr-1">
                    {showPassword ? "ซ่อน" : "แสดง"}
                  </Text>
                </Pressable>
              </View>
              <TextInput
                className="text-lg text-slate-900"
                placeholder="••••••••"
                placeholderTextColor="#cbd5e1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-y-4">
            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              className={`rounded-2xl py-4 items-center shadow-md ${
                isLoading ? "bg-blue-300" : "bg-blue-500 active:bg-blue-600"
              }`}
            >
              {isLoading ? (
                <View className="flex-row items-center gap-x-2">
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text className="text-white text-lg font-bold">กำลังเข้าสู่ระบบ...</Text>
                </View>
              ) : (
                <Text className="text-white text-lg font-bold">Dive In</Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => router.push("/register")}
              disabled={isLoading}
              className="py-3 items-center"
            >
              <Text className="text-slate-500 font-medium">
                Don&apos;t have an account?{" "}
                <Text className="text-blue-500 font-bold">Register</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
