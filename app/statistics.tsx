import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { api } from "./services/api";
import { Statistics } from "./types";
import { BouncyButton } from "./components/BouncyButton";
import {
  DetailedTimerPearl,
  DetailedCompassIcon,
  DetailedAquaFlame,
} from "./components/ui/DetailedAquaticAssets";
import { CoralStatsIcon } from "./components/ui/AquaticIcons";

export default function StatisticsScreen() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await api.getStatistics();
        setStats(data);
      } catch {
        setError("ไม่สามารถโหลดข้อมูลสถิติได้ในขณะนี้");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const formatFocusTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours} ชม. ${mins} นาที` : `${mins} นาที`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A59" />
        <Text style={styles.loadingText}>กำลังดึงข้อมูลสถิติใต้น้ำ...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <BouncyButton
          onPress={() => {
            setLoading(true);
            setError(null);
          }}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>ลองใหม่อีกครั้ง</Text>
        </BouncyButton>
      </SafeAreaView>
    );
  }

  if (!stats) return null;

  const bentoStats = [
    {
      label: "เวลาโฟกัสรวม",
      value: formatFocusTime(stats.totalFocusTime),
      iconNode: <DetailedTimerPearl size={26} />,
      bgColor: "#FEF2F2",
      textColor: "#FF7A59",
    },
    {
      label: "จำนวนเซสชัน",
      value: `${stats.sessions} ครั้ง`,
      iconNode: <DetailedCompassIcon size={26} />,
      bgColor: "#F0FDF4",
      textColor: "#16A34A",
    },
    {
      label: "เลเวลน้องปลา",
      value: `Lv. ${stats.fishLevel}`,
      iconNode: <CoralStatsIcon size={26} active={true} />,
      bgColor: "#FFFBEB",
      textColor: "#D97706",
    },
    {
      label: "ต่อเนื่อง (Streak)",
      value: `${stats.focusStreak} วัน`,
      iconNode: <DetailedAquaFlame size={26} />,
      bgColor: "#FFF1F2",
      textColor: "#E11D48",
    },
  ];

  const maxMinutes = Math.max(...stats.weeklyActivity.map((d) => d.minutes), 1);

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
          <Text style={styles.headerTitle}>สถิติการโฟกัส</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Bento Grid Stats */}
        <View style={styles.bentoGrid}>
          {bentoStats.map((stat, i) => (
            <View key={i} style={styles.bentoCard}>
              <View style={[styles.statIconBadge, { backgroundColor: stat.bgColor }]}>
                {stat.iconNode}
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statValue, { color: stat.textColor }]}>
                {stat.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Weekly Activity Bar Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>กิจกรรมประจำสัปดาห์</Text>
            <Text style={styles.chartSubtitle}>7 วันที่ผ่านมา 🌊</Text>
          </View>

          <View style={styles.chartBarsContainer}>
            {stats.weeklyActivity.map((dayData, i) => {
              const heightPct = Math.max((dayData.minutes / maxMinutes) * 100, 8);
              return (
                <View key={i} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: `${heightPct}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.barDayText}>{dayData.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Milestone Banner */}
        <View style={styles.milestoneCard}>
          <View style={styles.milestoneIconWrapper}>
            <Text style={styles.milestoneIcon}>👑</Text>
          </View>
          <View style={styles.milestoneContent}>
            <Text style={styles.milestoneTitle}>เป้าหมายการเติบโตถัดไป</Text>
            <Text style={styles.milestoneText}>
              สะสมเวลาโฟกัสเพิ่มเพื่อปลดล็อกร่างปลาทองคำพิเศษ!
            </Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F0F8FE",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    color: "#64748B",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#FF7A59",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "800",
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
  bentoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  bentoCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E0F2FE",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statIconText: {
    fontSize: 22,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "900",
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E0F2FE",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  chartSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0284C7",
  },
  chartBarsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 140,
    paddingHorizontal: 8,
  },
  barCol: {
    alignItems: "center",
    flex: 1,
  },
  barTrack: {
    width: 14,
    height: 105,
    backgroundColor: "#F1F5F9",
    borderRadius: 7,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    backgroundColor: "#FF7A59", // Warm Coral Bars
    borderRadius: 7,
  },
  barDayText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    marginTop: 8,
  },
  milestoneCard: {
    backgroundColor: "#0284C7",
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 4,
  },
  milestoneIconWrapper: {
    height: 52,
    width: 52,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  milestoneIcon: {
    fontSize: 26,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  milestoneText: {
    fontSize: 12,
    color: "#BAE6FD",
    marginTop: 2,
    lineHeight: 18,
  },
});
