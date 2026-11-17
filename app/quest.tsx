import React from "react";
import { View, Text, ScrollView, SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { router } from "expo-router";
import { BouncyButton } from "./components/BouncyButton";
import {
  DetailedClamBowl,
  DetailedFeedIcon,
} from "./components/ui/DetailedAquaticAssets";

const QUESTS = [
  {
    id: "1",
    title: "ดำดิ่งยามเช้า (Morning Focus)",
    desc: "โฟกัสอย่างน้อย 25 นาทีก่อนเที่ยงวัน เพื่อเพิ่มความสดชื่นให้น้องปลา",
    goal: 25,
    current: 15,
    reward: 15,
    icon: "🌅",
    completed: false,
  },
  {
    id: "2",
    title: "สมาธิลึกซึ้ง (Deep Work)",
    desc: "ทำเซสชันโฟกัสครบ 2 ครั้งในวันนี้",
    goal: 50,
    current: 25,
    reward: 25,
    icon: "🧘‍♂️",
    completed: false,
  },
  {
    id: "3",
    title: "วินัยต่อเนื่อง 3 วัน (Streak Master)",
    desc: "เข้าสู่ระบบและเริ่มเซสชันโฟกัสต่อเนื่อง 3 วันติด",
    goal: 3,
    current: 2,
    reward: 50,
    icon: "🔥",
    completed: false,
  },
];

export default function QuestScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <BouncyButton onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </BouncyButton>
          <Text style={styles.headerTitle}>ภารกิจและอาหารปลา</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Subtitle / Intro card */}
          <View style={styles.introCard}>
            <DetailedClamBowl size={36} />
            <View style={styles.introTextWrapper}>
              <Text style={styles.introTitle}>สะสมอาหารให้น้องปลา</Text>
              <Text style={styles.introSubtitle}>
                ทำภารกิจโฟกัสประจำวันเพื่อรับอาหารพิเศษและช่วยให้น้องปลาโตไวขึ้น!
              </Text>
            </View>
          </View>

          {/* Quest Cards */}
          <View style={styles.questList}>
            {QUESTS.map((quest) => {
              const progressPct = Math.min(
                Math.round((quest.current / quest.goal) * 100),
                100
              );
              return (
                <View key={quest.id} style={styles.questCard}>
                  <View style={styles.questHeader}>
                    <View style={styles.titleGroup}>
                      <Text style={styles.questIcon}>{quest.icon}</Text>
                      <Text style={styles.questTitle}>{quest.title}</Text>
                    </View>
                    <View style={styles.rewardBadge}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Text style={styles.rewardText}>+{quest.reward}</Text>
                        <DetailedClamBowl size={16} />
                      </View>
                    </View>
                  </View>

                  <Text style={styles.questDesc}>{quest.desc}</Text>

                  {/* Progress section */}
                  <View style={styles.progressSection}>
                    <View style={styles.progressLabelRow}>
                      <Text style={styles.progressLabel}>
                        ความคืบหน้า: {quest.current}/{quest.goal}
                      </Text>
                      <Text style={styles.progressPercent}>{progressPct}%</Text>
                    </View>
                    <View style={styles.progressTrack}>
                      <View
                        style={[styles.progressFill, { width: `${progressPct}%` }]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  backButton: {
    height: 46,
    width: 46,
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
  backButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  placeholder: {
    width: 46,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  introCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0F2FE",
    marginBottom: 20,
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  introIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  introTextWrapper: {
    flex: 1,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  introSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    lineHeight: 18,
  },
  questList: {
    gap: 14,
  },
  questCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E0F2FE",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  questHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  titleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  questIcon: {
    fontSize: 20,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  rewardBadge: {
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFEDD5",
  },
  rewardText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FF7A59", // Warm Coral
  },
  questDesc: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 20,
    marginBottom: 16,
  },
  progressSection: {
    marginTop: 4,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FF7A59",
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 9999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF7A59",
    borderRadius: 9999,
  },
});
