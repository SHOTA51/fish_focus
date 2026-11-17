import axios, { isAxiosError } from "axios";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Modal,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { router } from "expo-router";
import { useFocusStore, getNextLevelExp, MAX_FOOD_CAP } from "./store/useFocusStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FishTank } from "./components/FishTank";
import { Fish, FishStage, FishColorTheme } from "./components/Fish";
import { BouncyButton } from "./components/BouncyButton";
import { RiveIcon } from "./components/RiveIcon";
import {
  DetailedClamBowl,
  DetailedJournalDex,
} from "./components/ui/DetailedAquaticAssets";

interface TabItemProps {
  iconNode: React.ReactNode;
  label: string;
  active?: boolean;
  onPress: () => void;
}

export default function HomeScreen() {
  const { user, fish, setUserId, loadUserProfile, pendingEvolution } = useFocusStore();
  const [selectedTheme, setSelectedTheme] = useState<FishColorTheme>("orange");
  const [showDexModal, setShowDexModal] = useState(false);

  useEffect(() => {
    // If an evolution is pending, trigger the evolution cutscene immediately!
    if (pendingEvolution) {
      router.push("/focus/evolve");
      return;
    }

    const initUser = async () => {
      const storedId = await AsyncStorage.getItem("userId");
      const storedToken = await AsyncStorage.getItem("token");

      if (storedId && storedToken) {
        setUserId(storedId);
        try {
          await loadUserProfile(storedId);
        } catch (error) {
          if (isAxiosError(error)) {
            const status = error.response?.status;
            if (status === 401 || status === 403 || status === 404) {
              console.warn(
                `Session error (${status}): clearing credentials and redirecting to login`
              );
              await AsyncStorage.multiRemove(["userId", "token"]);
              setUserId(null);
              router.replace("/login");
              return;
            }
          }
          console.error("Network or server error loading profile:", error);
        }
      } else {
        await AsyncStorage.multiRemove(["userId", "token"]);
        router.replace("/login");
      }
    };
    initUser();
  }, [pendingEvolution]);

  const handleStart = () => {
    router.push("/focus/timer");
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingCard}>
          <Fish stage="fry" mood="idle" size={90} interactive={false} />
          <Text style={styles.loadingTitle}>กำลังเรียกลูกปลาของคุณ...</Text>
          <Text style={styles.loadingSubtitle}>
            เชื่อมต่อกับ Focus Fish อาณาจักรใต้น้ำ 🌊
          </Text>
          <BouncyButton
            onPress={async () => {
              await AsyncStorage.multiRemove(["userId", "token"]);
              setUserId(null);
              router.replace("/login");
            }}
            style={styles.backToLoginButton}
          >
            <Text style={styles.backToLoginText}>กลับสู่หน้าเข้าสู่ระบบ</Text>
          </BouncyButton>
        </View>
      </SafeAreaView>
    );
  }

  const currentLevel = fish?.level || 1;
  const currentExp = fish?.experience || 0;
  const currentStage: FishStage = (fish?.stage as FishStage) || "egg";
  const currentFishName = fish?.name || "น้องส้ม (Fishy)";
  const foodCount = fish?.food ?? 5;

  const targetExp = getNextLevelExp(currentLevel);
  const expProgressPct = Math.min(Math.round((currentExp / targetExp) * 100), 100);

  const getStageThaiName = (stg: FishStage) => {
    switch (stg) {
      case "egg":
        return "🥚 ไข่ปลาฟองกลม (ฟักที่ Lv. 2)";
      case "fry":
        return "🐟 ลูกปลาวัยอ่อน (วิวัฒนาการที่ Lv. 6)";
      case "juvenile":
        return "🐠 ปลาวัยรุ่นสง่างาม (วิวัฒนาการที่ Lv. 12)";
      case "adult":
        return "👑 ปลาเจ้าสมุทรทองคำ (ร่างสูงสุด)";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.greetingRow}>
              <Text style={styles.greeting}>สวัสดี, {user?.username || "Explorer"}!</Text>
              <Text style={styles.sparkle}>✨</Text>
            </View>
            <Text style={styles.subGreeting}>
              น้องปลากำลังว่ายน้ำรอโฟกัสกับคุณอยู่ 🌊
            </Text>
          </View>
          <BouncyButton
            onPress={() => router.push("/settings")}
            style={styles.iconButton}
          >
            <Text style={styles.iconButtonText}>⚙️</Text>
          </BouncyButton>
        </View>

        {/* Companion Status Card (Frosted Glass Style) */}
        <View style={styles.companionCard}>
          <View style={styles.companionRow}>
            <View style={styles.companionLeft}>
              <View style={styles.nameRow}>
                <Text style={styles.companionName}>{currentFishName}</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>Lv. {currentLevel}</Text>
                </View>
              </View>
              <Text style={styles.companionStage}>
                {getStageThaiName(currentStage)}
              </Text>
            </View>

            {/* Food Inventory Counter Badge */}
            <BouncyButton
              onPress={() => router.push("/quest")}
              style={[
                styles.foodBadge,
                foodCount === 0 && styles.foodBadgeEmpty,
              ]}
            >
              <DetailedClamBowl size={20} />
              <Text
                style={[
                  styles.foodText,
                  foodCount === 0 && styles.foodTextEmpty,
                ]}
              >
                อาหาร: {foodCount}/{MAX_FOOD_CAP}
              </Text>
            </BouncyButton>
          </View>

          {/* XP Progress Bar towards Next Level */}
          <View style={styles.expSection}>
            <View style={styles.expHeader}>
              <Text style={styles.expLabel}>
                พลังงานสู่เลเวล {currentLevel + 1}
              </Text>
              <Text style={styles.expValue}>
                {currentExp} / {targetExp} EXP ({expProgressPct}%)
              </Text>
            </View>
            <View style={styles.expTrack}>
              <View style={[styles.expFill, { width: `${expProgressPct}%` }]} />
            </View>
          </View>
        </View>

        {/* Fish Tank View (Hero Centerpiece) */}
        <View style={styles.tankWrapper}>
          <FishTank
            stage={currentStage}
            colorTheme={selectedTheme}
            fishName={currentFishName}
            level={currentLevel}
            mode="home"
            height={330}
          />

          {/* Bottom Bar: Fish Dex & Theme Customizer */}
          <View style={styles.customizerBar}>
            {/* Fish Dex Open Button */}
            <BouncyButton
              onPress={() => setShowDexModal(true)}
              style={styles.dexButton}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <DetailedJournalDex size={18} />
                <Text style={styles.dexButtonText}>สมุดภาพปลา (Fish Dex)</Text>
              </View>
            </BouncyButton>

            {/* Theme Dots */}
            <View style={styles.themeGroup}>
              {(
                [
                  { key: "orange", color: "#FF7A59" },
                  { key: "cyan", color: "#0EA5E9" },
                  { key: "golden", color: "#FBBF24" },
                  { key: "sakura", color: "#F472B6" },
                ] as { key: FishColorTheme; color: string }[]
              ).map((t) => (
                <Pressable
                  key={t.key}
                  onPress={() => setSelectedTheme(t.key)}
                  style={[
                    styles.themeDot,
                    { backgroundColor: t.color },
                    selectedTheme === t.key && styles.themeDotActive,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Focus Launcher Card */}
        <View style={styles.focusCard}>
          <View style={styles.focusCardHeader}>
            <View style={styles.goalTitleRow}>
              <View style={styles.pulseDot} />
              <Text style={styles.focusCardTitle}>เป้าหมายการโฟกัส</Text>
            </View>
            <Pressable hitSlop={8} onPress={handleStart}>
              <Text style={styles.changePresetLink}>ตั้งเวลาใหม่</Text>
            </Pressable>
          </View>

          <View style={styles.timerDisplay}>
            <Text style={styles.timerDigits}>25:00</Text>
            <Text style={styles.timerSubtext}>
              โฟกัส 25 นาที รับทันที +50 EXP และ +3 🍲 อาหารปลา!
            </Text>
          </View>

          {/* Bouncy Coral CTA Button */}
          <BouncyButton onPress={handleStart} style={styles.startFocusButton}>
            <Text style={styles.startFocusText}>🚀 เริ่มเซสชันโฟกัส (Start Focus)</Text>
          </BouncyButton>
        </View>
      </ScrollView>

      {/* Fish Dex Modal */}
      <Modal
        visible={showDexModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDexModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.dexModalCard}>
            <View style={styles.dexHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <DetailedJournalDex size={22} />
                <Text style={styles.dexTitle}>สมุดภาพวิวัฒนาการปลา</Text>
              </View>
              <Pressable hitSlop={8} onPress={() => setShowDexModal(false)}>
                <Text style={styles.dexCloseText}>✕</Text>
              </Pressable>
            </View>
            <Text style={styles.dexSubtitle}>
              สะสมเวลาโฟกัสเพื่อเลเวลอัปและปลดล็อกทุกร่างตามลำดับโปเกมอน! 🌟
            </Text>

            {/* Stages List */}
            <View style={styles.dexList}>
              {[
                { stage: "egg" as FishStage, name: "ไข่ปลาฟองกลม", reqLv: 1, desc: "เริ่มต้นเส้นทางการโฟกัส" },
                { stage: "fry" as FishStage, name: "ลูกปลาวัยอ่อน", reqLv: 2, desc: "ฟักไข่ทันทีหลังเซสชันแรก 25 นาที" },
                { stage: "juvenile" as FishStage, name: "ปลาวัยรุ่นสง่างาม", reqLv: 6, desc: "ครีบยาว ว่ายน้ำคล่องแคล่ว" },
                { stage: "adult" as FishStage, name: "ปลาเจ้าสมุทรทองคำ", reqLv: 12, desc: "ร่างสูงสุดทรงพลัง มีออร่าเรืองแสง" },
              ].map((item) => {
                const isUnlocked = currentLevel >= item.reqLv;
                const isCurrent = currentStage === item.stage;
                return (
                  <View
                    key={item.stage}
                    style={[
                      styles.dexItem,
                      isUnlocked && styles.dexItemUnlocked,
                      isCurrent && styles.dexItemCurrent,
                    ]}
                  >
                    <View style={styles.dexItemLeft}>
                      <Text style={styles.dexItemIcon}>
                        {item.stage === "egg"
                          ? "🥚"
                          : item.stage === "fry"
                          ? "🐟"
                          : item.stage === "juvenile"
                          ? "🐠"
                          : "👑"}
                      </Text>
                      <View>
                        <Text style={styles.dexItemName}>{item.name}</Text>
                        <Text style={styles.dexItemDesc}>{item.desc}</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.dexStatusBadge,
                        isUnlocked
                          ? styles.dexStatusUnlocked
                          : styles.dexStatusLocked,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dexStatusText,
                          isUnlocked && styles.dexStatusTextUnlocked,
                        ]}
                      >
                        {isUnlocked ? "ปลดล็อกแล้ว ✔" : `ปลดล็อก Lv. ${item.reqLv}`}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <BouncyButton
              onPress={() => setShowDexModal(false)}
              style={styles.dexDoneButton}
            >
              <Text style={styles.dexDoneText}>เข้าใจแล้ว</Text>
            </BouncyButton>
          </View>
        </View>
      </Modal>

      {/* Floating Bottom Tab Bar */}
      <View style={styles.tabBarContainer}>
        <TabItem
          iconNode={<RiveIcon artboard="ShellHome" size={26} active />}
          label="หน้าหลัก"
          active
          onPress={() => router.push("/")}
        />
        <TabItem
          iconNode={<RiveIcon artboard="BubbleTimer" size={26} active={false} />}
          label="โฟกัส"
          onPress={() => router.push("/focus/timer")}
        />
        <TabItem
          iconNode={<RiveIcon artboard="ScrollQuest" size={26} active={false} />}
          label="ภารกิจ"
          onPress={() => router.push("/quest")}
        />
        <TabItem
          iconNode={<RiveIcon artboard="CoralStats" size={26} active={false} />}
          label="สถิติ"
          onPress={() => router.push("/statistics")}
        />
        <TabItem
          iconNode={<RiveIcon artboard="DiverProfile" size={26} active={false} />}
          label="โปรไฟล์"
          onPress={() => router.push("/profile")}
        />
      </View>
    </SafeAreaView>
  );
}

function TabItem({ iconNode, label, active = false, onPress }: TabItemProps) {
  const scale = useSharedValue(active ? 1.15 : 1.0);

  useEffect(() => {
    scale.value = withSpring(active ? 1.15 : 1.0, {
      damping: 14,
      stiffness: 250,
    });
  }, [active]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <BouncyButton
      onPress={onPress}
      style={[styles.tabButton, active && styles.tabButtonActive]}
    >
      <Animated.View style={[styles.tabIconWrapper, animatedIconStyle]}>
        {iconNode}
      </Animated.View>
      <Text
        style={[
          styles.tabLabel,
          active ? styles.tabLabelActive : styles.tabLabelInactive,
        ]}
      >
        {label}
      </Text>
    </BouncyButton>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F8FE",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F0F8FE",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 32,
    alignItems: "center",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E0F2FE",
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 16,
  },
  loadingSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
  },
  backToLoginButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F0F8FE",
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  backToLoginText: {
    color: "#0284C7",
    fontWeight: "700",
    fontSize: 13,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  sparkle: {
    fontSize: 18,
  },
  subGreeting: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  iconButton: {
    height: 48,
    width: 48,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0F2FE",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconButtonText: {
    fontSize: 20,
  },
  companionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0F2FE",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  companionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  companionLeft: {
    flex: 1,
    paddingRight: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  companionName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  levelBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#D97706",
  },
  companionStage: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 3,
    fontWeight: "600",
  },
  foodBadge: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  foodBadgeEmpty: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  foodText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#16A34A",
  },
  foodTextEmpty: {
    color: "#EF4444",
  },
  expSection: {
    marginTop: 4,
  },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  expLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.4,
  },
  expValue: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FF7A59",
  },
  expTrack: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 9999,
    overflow: "hidden",
  },
  expFill: {
    height: "100%",
    backgroundColor: "#FF7A59",
    borderRadius: 9999,
  },
  tankWrapper: {
    marginBottom: 16,
  },
  customizerBar: {
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E0F2FE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dexButton: {
    backgroundColor: "#F0F8FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },
  dexButtonText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0284C7",
  },
  themeGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 6,
  },
  themeDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  themeDotActive: {
    borderColor: "#0F172A",
    transform: [{ scale: 1.15 }],
  },
  focusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E0F2FE",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  focusCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  goalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  focusCardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  changePresetLink: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0284C7",
  },
  timerDisplay: {
    alignItems: "center",
    paddingVertical: 14,
  },
  timerDigits: {
    fontSize: 54,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -1,
  },
  timerSubtext: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
    marginTop: 2,
    textAlign: "center",
  },
  startFocusButton: {
    backgroundColor: "#FF7A59",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#FF7A59",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  startFocusText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  tabBarContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderRadius: 32,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1.5,
    borderColor: "rgba(224, 242, 254, 0.8)",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  tabButton: {
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: "#FFF0EB",
    borderWidth: 1,
    borderColor: "#FED7AA",
  },
  tabIconWrapper: {
    padding: 2,
    borderRadius: 12,
  },
  tabIconActive: {
    backgroundColor: "transparent",
  },
  tabIconText: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
  },
  tabLabelActive: {
    color: "#FF7A59",
  },
  tabLabelInactive: {
    color: "#94A3B8",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  dexModalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,
    width: "100%",
    maxWidth: 380,
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  dexHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  dexTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },
  dexCloseText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#94A3B8",
    padding: 4,
  },
  dexSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 16,
    lineHeight: 18,
  },
  dexList: {
    gap: 10,
    marginBottom: 20,
  },
  dexItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dexItemUnlocked: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  dexItemCurrent: {
    borderWidth: 2,
    borderColor: "#FF7A59",
  },
  dexItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  dexItemIcon: {
    fontSize: 24,
  },
  dexItemName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  dexItemDesc: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  dexStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dexStatusUnlocked: {
    backgroundColor: "#DCFCE7",
  },
  dexStatusLocked: {
    backgroundColor: "#F1F5F9",
  },
  dexStatusText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94A3B8",
  },
  dexStatusTextUnlocked: {
    color: "#16A34A",
  },
  dexDoneButton: {
    backgroundColor: "#FF7A59",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  dexDoneText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
