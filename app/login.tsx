import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserId, setUser, setFish } = useFocusStore();

  // Floating gentle bobbing animation for the mascot fish
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

  const handleLogin = async () => {
    const trimmedIdentifier = email.trim();
    if (!trimmedIdentifier || !password) {
      Alert.alert("กรอกข้อมูลไม่ครบ", "กรุณากรอกอีเมลหรือชื่อผู้ใช้ และรหัสผ่าน");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.login(trimmedIdentifier, password);
      const { userId, user } = response;

      setUser(user);
      if (user?.fish) {
        setFish(user.fish);
      }
      await setUserId(userId);
      router.replace("/");
    } catch (e) {
      let errorMessage = "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง";

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
          } else if (status === 401 || status === 400) {
            errorMessage = "อีเมล/ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง";
          } else if (status >= 500) {
            errorMessage = `เซิร์ฟเวอร์ขัดข้อง (Status code: ${status})`;
          } else {
            errorMessage = `เกิดข้อผิดพลาด (Status code: ${status})`;
          }
        } else if (e.code === "ECONNABORTED" || e.message?.includes("timeout")) {
          errorMessage =
            "เซิร์ฟเวอร์กำลังตื่นจากการหลับ (Render Cold Start) กรุณารอสักครู่แล้วกดเข้าสู่ระบบใหม่อีกครั้ง 🌊";
        } else if (e.request) {
          const networkDetail = e.message ? ` (${e.message})` : "";
          errorMessage =
            `ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้${networkDetail}\n\n` +
            `กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตบนมือถือ\n(เซิร์ฟเวอร์: ${API_CONFIG.BASE_URL})`;
        } else {
          errorMessage = e.message || "เกิดข้อผิดพลาดในการส่งคำขอไปยังเซิร์ฟเวอร์";
        }
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }

      Alert.alert("เข้าสู่ระบบไม่สำเร็จ", errorMessage);
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
              <Fish stage="juvenile" mood="happy" size={110} interactive={false} />
            </Animated.View>
            <Text style={styles.brandTitle}>Focus Fish</Text>
            <Text style={styles.brandSubtitle}>
              ยินดีต้อนรับกลับสู่อาณาจักรใต้น้ำ 🌊
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Email or Username Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>EMAIL OR USERNAME (อีเมล หรือ ชื่อผู้ใช้)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="email@example.com หรือ ชื่อผู้ใช้"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* Password Field */}
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
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            {/* Coral Action Button */}
            <BouncyButton
              onPress={handleLogin}
              disabled={isLoading}
              style={[
                styles.primaryButton,
                isLoading && styles.primaryButtonDisabled,
              ]}
            >
              {isLoading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={styles.primaryButtonText}>กำลังเข้าสู่ระบบ...</Text>
                </View>
              ) : (
                <Text style={styles.primaryButtonText}>ดำดิ่งสู่สมาธิ (Dive In)</Text>
              )}
            </BouncyButton>

            {/* Register Link */}
            <Pressable
              onPress={() => router.push("/register")}
              disabled={isLoading}
              style={styles.switchAuthButton}
            >
              <Text style={styles.switchAuthText}>
                ยังไม่มีบัญชีใช่ไหม?{" "}
                <Text style={styles.switchAuthHighlight}>สมัครสมาชิกเลย</Text>
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
    marginBottom: 28,
    position: "relative",
  },
  haloBubble: {
    position: "absolute",
    top: -10,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(224, 242, 254, 0.7)",
  },
  fishContainer: {
    height: 110,
    width: 110,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
    fontWeight: "500",
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
    marginBottom: 18,
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
    fontSize: 17,
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
