import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar, BackHandler } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { useFocusStore, calculateFocusRewards } from "../store/useFocusStore";
import { api } from "../services/api";
import { Fish } from "../components/Fish";
import { BouncyButton } from "../components/BouncyButton";
import { DetailedClamBowl } from "../components/ui/DetailedAquaticAssets";

export default function SuccessScreen() {
  const { userId, fish, addExperience, addFood, pendingEvolution } = useFocusStore();
  const { duration } = useLocalSearchParams<{ duration: string }>();
  const isClaimingRef = useRef(false);

  const focusDuration = duration ? parseInt(duration, 10) : 25;
  const rewards = calculateFocusRewards(focusDuration);

  // Snappy staggered badge reveal animations
  const expBadgeScale = useSharedValue(0.3);
  const foodBadgeScale = useSharedValue(0.3);

  useEffect(() => {
    expBadgeScale.value = withDelay(
      120,
      withSpring(1.0, { damping: 11, stiffness: 240 })
    );
    foodBadgeScale.value = withDelay(
      260,
      withSpring(1.0, { damping: 11, stiffness: 240 })
    );
  }, []);

  const expBadgeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: expBadgeScale.value }],
  }));

  const foodBadgeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: foodBadgeScale.value }],
  }));

  const handleClaimReward = async () => {
    if (isClaimingRef.current) return;
    isClaimingRef.current = true;

    // 1. Locally apply EXP and Food rewards
    const { evolvedTo } = addExperience(rewards.exp);
    addFood(rewards.food);

    const updatedFish = useFocusStore.getState().fish;

    // 2. Try recording session with backend
    if (userId) {
      try {
        await api.completeSession(focusDuration, userId, {
          earnedExp: rewards.exp,
          clientLevel: updatedFish?.level,
          clientStage: updatedFish?.stage,
        });
      } catch (err) {
        console.warn("Backend sync failed, offline session preserved", err);
      }
    }

    // 3. Check for Pokemon Evolution Cutscene trigger!
    if (evolvedTo || pendingEvolution || useFocusStore.getState().pendingEvolution) {
      router.replace("/focus/evolve");
    } else {
      router.replace("/");
    }
  };

  // Intercept Android hardware back button so rewards are never lost
  useEffect(() => {
    const onBackPress = () => {
      handleClaimReward();
      return true;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, [rewards, focusDuration, userId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Celebration Bubble */}
        <View style={styles.celebrationCircle}>
          <Fish
            stage={fish?.stage}
            mood="happy"
            size={165}
            interactive={true}
            showSpeech={true}
            customMessage="เย้! ทำสำเร็จแล้ว 🎉"
          />
        </View>

        <Text style={styles.title}>โฟกัสสำเร็จแล้ว! 🌟</Text>
        <Text style={styles.subtitle}>
          คุณมีสมาธิต่อเนื่อง {focusDuration} นาที ได้รับรางวัลอาหารและพลังงานสำหรับน้องปลา!
        </Text>

        {/* Reward Card */}
        <View style={styles.rewardCard}>
          <Text style={styles.rewardLabel}>รางวัลเซสชันที่ได้รับ (SESSION REWARDS)</Text>
          
          <View style={styles.rewardsRow}>
            {/* EXP Badge */}
            <Animated.View style={[styles.rewardBadgeBox, expBadgeAnimStyle]}>
              <Text style={styles.rewardBadgeIcon}>✨</Text>
              <Text style={styles.rewardBadgeValue}>+{rewards.exp}</Text>
              <Text style={styles.rewardBadgeUnit}>EXP</Text>
            </Animated.View>

            {/* Food Badge */}
            <Animated.View style={[styles.rewardBadgeBox, styles.foodBadgeBox, foodBadgeAnimStyle]}>
              <View style={{ marginBottom: 4 }}>
                <DetailedClamBowl size={26} />
              </View>
              <Text style={[styles.rewardBadgeValue, styles.foodBadgeValue]}>
                +{rewards.food}
              </Text>
              <Text style={styles.rewardBadgeUnit}>ถ้วยอาหาร</Text>
            </Animated.View>
          </View>

          <Text style={styles.rewardTip}>
            💡 นำอาหารไปป้อนน้องปลาในตู้เพื่อรับ Bonus EXP เร่งวิวัฒนาการ!
          </Text>
        </View>

        {/* Claim Coral Button */}
        <BouncyButton onPress={handleClaimReward} style={styles.claimButton}>
          <Text style={styles.claimButtonText}>รับรางวัล & กลับสู่ตู้ปลา 🐠</Text>
        </BouncyButton>
      </View>
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  celebrationCircle: {
    marginBottom: 20,
    height: 230,
    width: 230,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 115,
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: "#E0F2FE",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 6,
    textAlign: "center",
    fontSize: 13,
    color: "#64748B",
    lineHeight: 20,
    paddingHorizontal: 14,
  },
  rewardCard: {
    marginTop: 22,
    width: "100%",
    maxWidth: 330,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0F2FE",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  rewardLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  rewardsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    width: "100%",
  },
  rewardBadgeBox: {
    flex: 1,
    backgroundColor: "#FFF7ED",
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFEDD5",
  },
  foodBadgeBox: {
    backgroundColor: "#F0FDF4",
    borderColor: "#DCFCE7",
  },
  rewardBadgeIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  rewardBadgeValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FF7A59",
  },
  foodBadgeValue: {
    color: "#16A34A",
  },
  rewardBadgeUnit: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginTop: 2,
  },
  rewardTip: {
    fontSize: 11,
    fontWeight: "600",
    color: "#0284C7",
    marginTop: 14,
    textAlign: "center",
  },
  claimButton: {
    marginTop: 24,
    width: "100%",
    maxWidth: 330,
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#FF7A59", // Warm Coral Hero
    paddingVertical: 16,
    shadowColor: "#FF7A59",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 5,
  },
  claimButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
