import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { useFocusStore } from "../store/useFocusStore";
import { api } from "../services/api";
import { Fish, FishStage } from "../components/Fish";
import { BouncyButton } from "../components/BouncyButton";

const { width } = Dimensions.get("window");

export default function EvolutionScreen() {
  const { pendingEvolution, clearPendingEvolution, fish } = useFocusStore();

  const [phase, setPhase] = useState<"intro" | "evolving" | "completed">("intro");

  const fromStage = pendingEvolution?.fromStage || "egg";
  const toStage = pendingEvolution?.toStage || (fish?.stage as FishStage) || "fry";
  const fishName = pendingEvolution?.fishName || fish?.name || "น้องส้ม";
  const level = pendingEvolution?.level || fish?.level || 2;

  // Animation shared values
  const glowScale = useSharedValue(1);
  const flashOpacity = useSharedValue(0);
  const fishScale = useSharedValue(1);
  const particleRotate = useSharedValue(0);

  useEffect(() => {
    // Phase 1: Intro buildup (2.2s)
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    const timer1 = setTimeout(() => {
      setPhase("evolving");
      // Trigger flashing evolution morph
      flashOpacity.value = withSequence(
        withTiming(0.8, { duration: 300 }),
        withTiming(0.2, { duration: 250 }),
        withTiming(1.0, { duration: 400 }),
        withTiming(0, { duration: 350 })
      );
      fishScale.value = withSequence(
        withTiming(0.7, { duration: 350 }),
        withTiming(1.35, { duration: 600, easing: Easing.back(2) }),
        withTiming(1.0, { duration: 350 })
      );
    }, 1100);

    const timer2 = setTimeout(() => {
      setPhase("completed");
    }, 2700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleSkip = () => {
    if (phase !== "completed") {
      setPhase("completed");
    } else {
      handleFinish();
    }
  };

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const morphFishStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fishScale.value }],
  }));

  const flashOverlayStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  const handleFinish = () => {
    // Explicitly guarantee the stage is locked in and saved in local storage before navigating
    const currentFish = useFocusStore.getState().fish;
    if (currentFish && toStage) {
      useFocusStore.setState({
        fish: {
          ...currentFish,
          stage: toStage,
          level: Math.max(currentFish.level, level),
        },
      });
      useFocusStore.getState().syncLocalFishState();
      // Inform backend of the evolved stage
      api.syncFish({
        stage: toStage,
        level: Math.max(currentFish.level, level),
      }).catch((e) => console.warn("Evolution sync warning:", e));
    }
    clearPendingEvolution();
    router.replace("/");
  };

  const getStageTitle = (stg: FishStage) => {
    switch (stg) {
      case "egg":
        return "ไข่ปลาฟองกลม (Egg)";
      case "fry":
        return "ลูกปลาวัยอ่อน (Fry)";
      case "juvenile":
        return "ปลาวัยรุ่นสง่างาม (Juvenile)";
      case "adult":
        return "ปลาเจ้าสมุทรทองคำ (Adult King)";
    }
  };

  const getStagePerk = (stg: FishStage) => {
    switch (stg) {
      case "fry":
        return "ฟักออกจากไข่แล้ว! เริ่มว่ายน้ำและกินอาหารได้ 🍲";
      case "juvenile":
        return "ครีบงอกยาวขึ้น ว่ายน้ำคล่องแคล่ว และกินอาหารได้เร็วขึ้น 2 เท่า! 💨";
      case "adult":
        return "ปลดล็อกร่างเจ้าสมุทรระดับตำนาน พร้อมออร่าทองคำเรืองแสง! 👑✨";
      default:
        return "พลังการเติบโตเพิ่มขึ้น";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Flash white overlay on morph */}
        <Animated.View
          pointerEvents="none"
          style={[styles.flashOverlay, flashOverlayStyle]}
        />

        {/* Ambient Top Light Beam */}
        <View style={styles.lightBeam} />

        {/* Top Skip Bar */}
        <View style={styles.topBar}>
          <View style={{ flex: 1 }} />
          {phase !== "completed" && (
            <BouncyButton onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipButtonText}>ข้าม ⏩</Text>
            </BouncyButton>
          )}
        </View>

        {/* Dynamic Header Text */}
        <View style={styles.header}>
          {phase === "intro" && (
            <>
              <Text style={styles.introSubtitle}>
                เอ๊ะ!? ร่างกายของ {fishName} กำลังเปล่งแสง...
              </Text>
              <Text style={styles.introTitle}>กำลังวิวัฒนาการ! (EVOLVING)</Text>
            </>
          )}

          {phase === "evolving" && (
            <>
              <Text style={styles.evolvingSubtitle}>
                พลังแห่งการโฟกัสกำลังแปรเปลี่ยน...
              </Text>
              <Text style={styles.evolvingTitle}>⚡ กำลังเปลี่ยนร่าง ⚡</Text>
            </>
          )}

          {phase === "completed" && (
            <>
              <Text style={styles.completedSubtitle}>🎉 ยินดีด้วยอย่างยิ่ง!</Text>
              <Text style={styles.completedTitle}>
                {fishName} วิวัฒนาการสำเร็จแล้ว!
              </Text>
            </>
          )}
        </View>

        {/* Center Creature Stage Presentation */}
        <View style={styles.creatureCenter}>
          {/* Glowing Aura Ring */}
          <Animated.View style={[styles.glowRing, glowStyle]}>
            <View style={styles.glowInnerRing} />
          </Animated.View>

          {/* Morphing Fish Companion */}
          <Animated.View style={[styles.fishWrapper, morphFishStyle]}>
            <Fish
              stage={phase === "completed" ? toStage : fromStage}
              mood="happy"
              size={180}
              interactive={false}
              showSpeech={phase === "completed"}
              customMessage="ฉันเติบโตขึ้นแล้ว! 🌟"
            />
          </Animated.View>
        </View>

        {/* Status / Perks Card when completed */}
        <View style={styles.bottomSection}>
          {phase === "completed" ? (
            <View style={styles.perksCard}>
              <View style={styles.stageBadge}>
                <Text style={styles.stageBadgeText}>
                  {getStageTitle(toStage)} • Lv. {level}
                </Text>
              </View>

              <Text style={styles.perkText}>{getStagePerk(toStage)}</Text>

              <BouncyButton onPress={handleFinish} style={styles.returnButton}>
                <Text style={styles.returnButtonText}>
                  ไปว่ายน้ำในตู้ปลาด้วยกัน (Back to Tank) 🌊
                </Text>
              </BouncyButton>
            </View>
          ) : (
            <View style={styles.waitingCard}>
              <Text style={styles.waitingText}>
                รอรับพลังแห่งความตั้งใจ... ✨
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#071D2F", // Dramatic deep abyss blue
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
    position: "relative",
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    height: 36,
    zIndex: 20,
  },
  skipButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  skipButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },
  flashOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 99,
  },
  lightBeam: {
    position: "absolute",
    top: -100,
    width: width * 1.2,
    height: 300,
    borderRadius: 200,
    backgroundColor: "rgba(56, 189, 248, 0.15)",
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  introSubtitle: {
    fontSize: 16,
    color: "#BAE6FD",
    fontWeight: "600",
    marginBottom: 4,
  },
  introTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FDE047",
    letterSpacing: 0.5,
  },
  evolvingSubtitle: {
    fontSize: 15,
    color: "#E0F2FE",
    fontWeight: "600",
    marginBottom: 4,
  },
  evolvingTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#38BDF8",
    letterSpacing: 0.5,
  },
  completedSubtitle: {
    fontSize: 16,
    color: "#FEF08A",
    fontWeight: "800",
    marginBottom: 4,
  },
  completedTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  creatureCenter: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 280,
    height: 280,
  },
  glowRing: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(56, 189, 248, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(253, 224, 71, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  glowInnerRing: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  fishWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSection: {
    width: "100%",
    paddingBottom: 16,
  },
  perksCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 28,
    padding: 22,
    alignItems: "center",
    shadowColor: "#38BDF8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
  },
  stageBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginBottom: 10,
  },
  stageBadgeText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#D97706",
  },
  perkText: {
    fontSize: 14,
    color: "#334155",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  returnButton: {
    width: "100%",
    backgroundColor: "#FF7A59", // Warm Coral Hero
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#FF7A59",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  returnButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  waitingCard: {
    paddingVertical: 20,
    alignItems: "center",
  },
  waitingText: {
    color: "#7DD3FC",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
