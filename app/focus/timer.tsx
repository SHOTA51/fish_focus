import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { useTimer } from "../hooks/useTimer";
import { useFocusStore, calculateFocusRewards } from "../store/useFocusStore";
import { Fish } from "../components/Fish";
import { BouncyButton } from "../components/BouncyButton";
import {
  DetailedClamBowl,
  DetailedPauseIcon,
  DetailedPlayIcon,
  DetailedResetIcon,
  DetailedSleepBreakIcon,
} from "../components/ui/DetailedAquaticAssets";

export default function TimerScreen() {
  const router = useRouter();
  const { fish } = useFocusStore();
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const presets = [5, 10, 15, 25, 45, 60];
  const expectedRewards = calculateFocusRewards(selectedMinutes);

  const foodCount = fish?.food ?? 0;
  const currentLevel = fish?.level ?? 1;

  // Zen breathing animation for the central meditation bubble ring
  const ringScale = useSharedValue(1);
  const bubbleY1 = useSharedValue(0);
  const bubbleY2 = useSharedValue(0);

  useEffect(() => {
    bubbleY1.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 2000, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
    bubbleY2.value = withRepeat(
      withSequence(
        withTiming(-16, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2600, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const handleComplete = useCallback(() => {
    router.replace({
      pathname: "/focus/success",
      params: { duration: selectedMinutes },
    });
  }, [router, selectedMinutes]);

  const { formatTime, isActive, toggleTimer, secondsLeft } = useTimer(
    selectedMinutes,
    handleComplete
  );

  const isStarted = secondsLeft < selectedMinutes * 60;
  const isPaused = !isActive && isStarted;

  useEffect(() => {
    if (isActive) {
      ringScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 2600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.97, { duration: 2600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      ringScale.value = withSpring(1.0);
    }
  }, [isActive]);

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  const bubble1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: bubbleY1.value }],
  }));

  const bubble2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: bubbleY2.value }],
  }));

  const handleReset = () => {
    Alert.alert(
      "รีเซ็ตเวลา (Reset Timer)",
      "คุณต้องการรีเซ็ตเวลาและออกจากเซสชันนี้หรือไม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "รีเซ็ต",
          style: "destructive",
          onPress: () => router.replace("/"),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Forest-Style Top Bar */}
        <View style={styles.header}>
          <BouncyButton
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </BouncyButton>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>
              {isActive ? "🌊 ว่ายน้ำอย่างสงบนิ่ง" : "โหมดดำดิ่งโฟกัส"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {isActive ? "รักษาความตั้งใจเพื่อเลี้ยงดูน้องปลา" : "เลือกช่วงเวลาที่ต้องการโฟกัส"}
            </Text>
          </View>

          {/* Right Mascot & Food Pill Badge */}
          <View style={styles.headerRightBadges}>
            <View style={styles.glassStatPill}>
              <DetailedClamBowl size={16} />
              <Text style={styles.glassStatValue}>{foodCount}</Text>
            </View>
            <View style={[styles.glassStatPill, styles.levelPill]}>
              <Text style={styles.levelPillText}>Lv.{currentLevel}</Text>
            </View>
          </View>
        </View>

        {/* Duration Presets */}
        <View style={styles.presetSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetsScroll}
          >
            {presets.map((min) => {
              const isSelected = selectedMinutes === min;
              return (
                <BouncyButton
                  key={min}
                  onPress={() => {
                    if (!isActive) setSelectedMinutes(min);
                  }}
                  disabled={isActive}
                  style={[
                    styles.presetPill,
                    isSelected && styles.presetPillSelected,
                    isActive && styles.presetPillDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.presetText,
                      isSelected && styles.presetTextSelected,
                    ]}
                  >
                    {min} นาที
                  </Text>
                </BouncyButton>
              );
            })}
          </ScrollView>

          {/* Reward Expected Preview */}
          <View style={styles.rewardPreviewRow}>
            <Text style={styles.rewardPreviewText}>
              🎁 รางวัลเซสชัน:{" "}
              <Text style={styles.rewardPreviewHighlight}>
                +{expectedRewards.exp} EXP
              </Text>{" "}
              &{" "}
              <Text style={styles.rewardPreviewHighlight}>
                +{expectedRewards.food} อาหารปลา
              </Text>
            </Text>
          </View>
        </View>

        {/* Central Spherical Bubble Terrarium (Forest Style) */}
        <View style={styles.tankCenter}>
          <Animated.View style={[styles.bubbleTerrarium, ringAnimatedStyle]}>
            {/* Ambient decorative bubbles */}
            <Animated.View style={[styles.decorBubble1, bubble1Style]} />
            <Animated.View style={[styles.decorBubble2, bubble2Style]} />

            {/* Specular curved glass shine highlight */}
            <Svg style={StyleSheet.absoluteFill} viewBox="0 0 250 250">
              <Defs>
                <LinearGradient id="glassShine" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
                  <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </LinearGradient>
              </Defs>
              <Path
                d="M 50 45 Q 125 15 200 45 Q 175 30 125 25 Q 75 30 50 45 Z"
                fill="url(#glassShine)"
              />
              <Circle cx="188" cy="58" r="4" fill="#FFFFFF" fillOpacity="0.55" />
            </Svg>

            {/* Mascot Fish Hero */}
            <Fish
              stage={fish?.stage}
              mood={isActive ? "focus" : "idle"}
              size={155}
              interactive={true}
            />
          </Animated.View>

          {/* Large Forest-Style White Countdown Digits */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerDigits}>{formatTime()}</Text>
            <View style={styles.timerStatusBadge}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isActive ? "#34D399" : "#FBBF24" },
                ]}
              />
              <Text style={styles.timerStatusText}>
                {isActive
                  ? `${fish?.name || "น้องปลา"} กำลังดำดิ่งสู่สมาธิเคียงข้างคุณ ✨`
                  : "กดปุ่มด้านล่างเพื่อเริ่มการจดจ่อ"}
              </Text>
            </View>
          </View>
        </View>

        {/* Forest-Style Action Controls */}
        <View style={styles.controlsRow}>
          {/* Pause / Break Room button */}
          <BouncyButton
            onPress={() => router.push("/focus/pause")}
            style={styles.secondaryCircleButton}
            accessibilityLabel="พักสายตาและงีบหลับ"
          >
            <DetailedSleepBreakIcon size={24} color="#FFFFFF" />
          </BouncyButton>

          {/* Crisp White Forest-Style CTA Pill Button */}
          <BouncyButton
            onPress={toggleTimer}
            style={[
              styles.primaryWhitePillButton,
              isActive && styles.primaryActivePillButton,
            ]}
          >
            <View style={styles.primaryActionRow}>
              {isActive ? (
                <DetailedPauseIcon size={20} color="#EA580C" />
              ) : (
                <DetailedPlayIcon size={20} color="#0284C7" />
              )}
              <Text
                style={[
                  styles.primaryWhitePillText,
                  isActive && styles.primaryActivePillText,
                ]}
              >
                {isActive ? "พักชั่วคราว" : isPaused ? "โฟกัสต่อ" : "เริ่มโฟกัส"}
              </Text>
            </View>
          </BouncyButton>

          {/* Reset button */}
          <BouncyButton
            onPress={handleReset}
            style={styles.secondaryCircleButton}
            accessibilityLabel="รีเซ็ตเวลา"
          >
            <DetailedResetIcon size={22} color="#FFFFFF" />
          </BouncyButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0284C7", // Soothing Aqua Ocean Blue
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  backButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    color: "#E0F2FE",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  headerRightBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  glassStatPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  glassStatIcon: {
    fontSize: 13,
  },
  glassStatValue: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },
  levelPill: {
    backgroundColor: "#FEF08A",
    borderColor: "#FDE047",
  },
  levelPillText: {
    color: "#854D0E",
    fontWeight: "900",
    fontSize: 11,
  },
  presetSection: {
    marginVertical: 4,
  },
  presetsScroll: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  presetPill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 9999,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.28)",
  },
  presetPillSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  presetPillDisabled: {
    opacity: 0.5,
  },
  presetText: {
    color: "#E0F2FE",
    fontWeight: "700",
    fontSize: 13,
  },
  presetTextSelected: {
    color: "#0284C7",
    fontWeight: "900",
  },
  rewardPreviewRow: {
    marginTop: 8,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 9999,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  rewardPreviewText: {
    color: "#E0F2FE",
    fontSize: 11,
    fontWeight: "600",
  },
  rewardPreviewHighlight: {
    color: "#FEF08A",
    fontWeight: "800",
  },
  tankCenter: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  bubbleTerrarium: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderWidth: 2.5,
    borderColor: "rgba(255, 255, 255, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 8,
  },
  decorBubble1: {
    position: "absolute",
    top: 24,
    left: 32,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  decorBubble2: {
    position: "absolute",
    bottom: 34,
    right: 30,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(255, 255, 255, 0.28)",
  },
  timerContainer: {
    alignItems: "center",
    marginTop: 18,
  },
  timerDigits: {
    fontSize: 66,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  timerStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 9999,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timerStatusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginTop: 6,
  },
  secondaryCircleButton: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryWhitePillButton: {
    flex: 1,
    maxWidth: 220,
    height: 56,
    backgroundColor: "#FFFFFF", // Forest-style pure white capsule!
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
  },
  primaryActivePillButton: {
    backgroundColor: "#FFFBEB",
    borderWidth: 1.5,
    borderColor: "#FDE68A",
  },
  primaryActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryWhitePillText: {
    color: "#0284C7", // Aqua Ocean Blue text inside White button
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  primaryActivePillText: {
    color: "#EA580C",
  },
});
