import React, { useState, useEffect } from "react";
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
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { isAxiosError } from "axios";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { api } from "./services/api";
import { useFocusStore } from "./store/useFocusStore";
import { API_CONFIG } from "./constants/config";
import { Fish } from "./components/Fish";
import { BouncyButton } from "./components/BouncyButton";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserId, setUser, setFish } = useFocusStore();

  // Floating gentle bobbing animation
  const fishY = useSharedValue(0);
  const bubbleScale = useSharedValue(0.9);

  useEffect(() => {
    fishY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    bubbleScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.9, { duration: 2200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const fishAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: fishY.value }],
  }));

  const bubbleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bubbleScale.value }],
  }));

  const handleRegister = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim();

    if (!trimmedEmail || !trimmedUsername || !password) {
      Alert.alert("กรอกข้อมูลไม่ครบ", "กรุณากรอกข้อมูลให้ครบทุกช่องเพื่อเริ่มการเดินทาง 🌊");
      return;
    }

    if (password.length < 6) {
      Alert.alert("รหัสผ่านสั้นเกินไป", "กรุณาตั้งรหัสผ่านอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.register(trimmedUsername, trimmedEmail, password);
      const { userId, user } = response;

      setUser(user);
      if (user?.fish) {
        setFish(user.fish);
      }
      await setUserId(userId);

      Alert.alert(
        "สร้างบัญชีสำเร็จ! 🎉",
        `ยินดีต้อนรับคุณ ${trimmedUsername}! น้องปลา Bob รอดำดิ่งไปกับคุณแล้ว 🐠`,
        [{ text: "เริ่มใช้งานทันที", onPress: () => router.replace("/") }]
      );
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
          } else if (status === 409 || status === 400) {
            errorMessage = "อีเมลหรือชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาลองใช้อีเมลหรือชื่ออื่น";
          } else if (status >= 500) {
            errorMessage = `เซิร์ฟเวอร์ขัดข้อง (Status code: ${status})`;
          }
        } else if (e.code === "ECONNABORTED" || e.message?.includes("timeout")) {
          errorMessage =
            "เซิร์ฟเวอร์กำลังตื่นจากการหลับ (Render Cold Start) กรุณารอสักครู่แล้วกดสร้างบัญชีใหม่อีกครั้ง 🌊";
        } else if (e.request) {
          const networkDetail = e.message ? ` (${e.message})` : "";
          errorMessage =
            `ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้${networkDetail}\n\n` +
            `กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตบนมือถือ\n(เซิร์ฟเวอร์: ${API_CONFIG.BASE_URL})`;
        } else {
          errorMessage = e.message || "เกิดข้อผิดพลาดในการส่งคำขอ";
        }
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }

      Alert.alert("ลงทะเบียนไม่สำเร็จ", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Decorative Floating Fish Hero */}
          <View style={styles.heroSection}>
            <Animated.View style={[styles.haloBubble, bubbleAnimatedStyle]} />
            <Animated.View style={[styles.fishContainer, fishAnimatedStyle]}>
              <Fish stage="fry" mood="happy" size={100} interactive={false} />
            </Animated.View>
            <Text style={styles.brandTitle}>เข้าร่วมอาณาจักรปลา</Text>
            <Text style={styles.brandSubtitle}>
              สร้างบัญชีเพื่อรับเลี้ยงและเติบโตไปพร้อมกับน้องปลา 🌊
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Username */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>EXPLORER NAME (ชื่อของคุณ)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="ชื่อเล่นเท่ๆ ของคุณ"
                placeholderTextColor="#94A3B8"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>

            {/* Email */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.textInput}
                placeholder="email@example.com"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* Password */}
            <View style={styles.fieldContainer}>
              <View style={styles.passwordHeader}>
                <Text style={styles.fieldLabel}>PASSWORD</Text>
                <Pressable
                  hitSlop={8}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.toggleText}>
                    {showPassword ? "ซ่อน" : "แสดง"}
                  </Text>
                </Pressable>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
            </View>

            {/* Coral Create Account Button */}
            <BouncyButton
              onPress={handleRegister}
              disabled={isLoading}
              style={[
                styles.primaryButton,
                isLoading && styles.primaryButtonDisabled,
              ]}
            >
              {isLoading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.primaryButtonText}>กำลังสร้างบัญชี...</Text>
                </View>
              ) : (
                <Text style={styles.primaryButtonText}>สร้างบัญชีและรับเลี้ยงปลา</Text>
              )}
            </BouncyButton>

            {/* Login Link */}
            <Pressable
              onPress={() => router.push("/login")}
              disabled={isLoading}
              style={styles.switchAuthButton}
            >
              <Text style={styles.switchAuthText}>
                มีบัญชีอยู่แล้ว?{" "}
                <Text style={styles.switchAuthHighlight}>เข้าสู่ระบบที่นี่</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F8FE",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  haloBubble: {
    position: "absolute",
    top: -8,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(224, 242, 254, 0.7)",
  },
  fishContainer: {
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
    fontWeight: "500",
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E0F2FE",
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 2,
  },
  passwordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0284C7",
    paddingHorizontal: 4,
  },
  textInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: "#FF7A59",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#FF7A59",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  switchAuthButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  switchAuthText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  switchAuthHighlight: {
    color: "#FF7A59",
    fontWeight: "800",
  },
});
