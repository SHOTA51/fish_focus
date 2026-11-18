import React from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet, StatusBar } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusStore } from "./store/useFocusStore";
import { Fish } from "./components/Fish";
import { BouncyButton } from "./components/BouncyButton";
import {
  DetailedDiverHelmet,
  DetailedJournalDex,
} from "./components/ui/DetailedAquaticAssets";

export default function ProfileScreen() {
  const { fish, user, userId, setUserId, resetFishState } = useFocusStore();

  const handleLogout = async () => {
    // Clear per-user fish cache before resetting userId
    if (userId) {
      await AsyncStorage.removeItem(`local_fish_meta_${userId}`);
    }
    // Also clear legacy key (from old versions without per-user cache)
    await AsyncStorage.removeItem('local_fish_meta');
    await AsyncStorage.multiRemove(["userId", "token"]);
    resetFishState();
    await setUserId(null);
    router.replace("/login");
  };

  const level = fish?.level || 1;
  const exp = fish?.experience || 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <BouncyButton onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </BouncyButton>
          <Text style={styles.headerTitle}>โปรไฟล์ของฉัน</Text>
          <View style={styles.placeholder} />
        </View>

        {/* User Avatar & Info */}
        <View style={styles.userSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarInner}>
              <DetailedDiverHelmet size={44} />
            </View>
            <View style={styles.onlineStatusBadge} />
          </View>
          <Text style={styles.userName}>{user?.username || "Explorer"}</Text>
          <Text style={styles.userEmail}>{user?.email || "user@example.com"}</Text>
        </View>

        {/* Companion Card */}
        <View style={styles.companionCard}>
          <View style={styles.companionCardHeader}>
            <Text style={styles.companionCardTitle}>ปลาคู่หูของฉัน</Text>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>กำลังว่ายน้ำอยู่ 🌊</Text>
            </View>
          </View>

          <View style={styles.companionBody}>
            <View style={styles.fishBox}>
              <Fish stage={fish?.stage} size={88} interactive={true} />
            </View>
            <View style={styles.fishDetails}>
              <Text style={styles.fishNameText}>{fish?.name || "น้องส้ม"}</Text>
              <Text style={styles.fishLevelText}>
                เลเวล {level} • วัย{(fish?.stage || "juvenile").toUpperCase()}
              </Text>

              {/* XP Track */}
              <View style={styles.xpTrackWrapper}>
                <View style={styles.xpRow}>
                  <Text style={styles.xpTitle}>EXP</Text>
                  <Text style={styles.xpPercent}>{exp}%</Text>
                </View>
                <View style={styles.xpTrack}>
                  <View style={[styles.xpFill, { width: `${Math.min(exp, 100)}%` }]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Action List */}
        <View style={styles.actionList}>
          <BouncyButton
            onPress={() => router.push("/settings")}
            style={styles.actionItem}
          >
            <View style={styles.actionIconBadge}>
              <Text style={styles.actionIconText}>⚙️</Text>
            </View>
            <Text style={styles.actionItemText}>ตั้งค่าแอปพลิเคชัน</Text>
            <Text style={styles.actionChevron}>›</Text>
          </BouncyButton>

          <BouncyButton
            onPress={() => router.push("/quest")}
            style={styles.actionItem}
          >
            <View style={styles.actionIconBadge}>
              <DetailedJournalDex size={22} />
            </View>
            <Text style={styles.actionItemText}>ภารกิจและอาหารปลา</Text>
            <Text style={styles.actionChevron}>›</Text>
          </BouncyButton>

          <BouncyButton
            onPress={handleLogout}
            style={[styles.actionItem, styles.logoutItem]}
          >
            <View style={[styles.actionIconBadge, styles.logoutIconBadge]}>
              <Text style={styles.actionIconText}>🚪</Text>
            </View>
            <Text style={styles.logoutText}>ออกจากระบบ (Logout)</Text>
            <Text style={styles.actionChevron}>›</Text>
          </BouncyButton>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
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
  userSection: {
    alignItems: "center",
    marginVertical: 14,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatarInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 3.5,
    borderColor: "#FF7A59", // Warm Coral ring
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF7A59",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 4,
  },
  avatarText: {
    fontSize: 48,
  },
  onlineStatusBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10B981",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  userName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0F172A",
  },
  userEmail: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  companionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E0F2FE",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  companionCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  companionCardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  activeTag: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  activeTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },
  companionBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  fishBox: {
    width: 90,
    height: 90,
    borderRadius: 22,
    backgroundColor: "#F0F8FE",
    borderWidth: 1.5,
    borderColor: "#BAE6FD",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  fishDetails: {
    flex: 1,
  },
  fishNameText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  fishLevelText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },
  xpTrackWrapper: {
    marginTop: 10,
  },
  xpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  xpTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
  },
  xpPercent: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FF7A59",
  },
  xpTrack: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 9999,
    overflow: "hidden",
  },
  xpFill: {
    height: "100%",
    backgroundColor: "#FF7A59",
    borderRadius: 9999,
  },
  actionList: {
    gap: 12,
  },
  actionItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0F2FE",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#F0F8FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  actionChevron: {
    fontSize: 20,
    fontWeight: "600",
    color: "#94A3B8",
  },
  logoutItem: {
    borderColor: "#FEE2E2",
    marginTop: 4,
  },
  logoutIconBadge: {
    backgroundColor: "#FEF2F2",
  },
  logoutText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#EF4444",
  },
});
