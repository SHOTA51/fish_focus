import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  Switch,
  StyleSheet,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { BouncyButton } from "./components/BouncyButton";

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <BouncyButton onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </BouncyButton>
          <Text style={styles.headerTitle}>การตั้งค่า</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* General App Settings */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>ประสบการณ์การโฟกัส</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>เสียงเอฟเฟกต์ฟองน้ำ</Text>
                <Text style={styles.settingDesc}>
                  เล่นเสียงผ่อนคลายเบาๆ ขณะจับเวลา
                </Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: "#E2E8F0", true: "#FF7A59" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>การสั่นตอบสนอง (Haptics)</Text>
                <Text style={styles.settingDesc}>
                  สั่นเบาๆ เมื่อเริ่มหรือหมดเวลาเซสชัน
                </Text>
              </View>
              <Switch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
                trackColor={{ false: "#E2E8F0", true: "#FF7A59" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>การแจ้งเตือนให้อาหารปลา</Text>
                <Text style={styles.settingDesc}>
                  เตือนเมื่อถึงเวลาให้อาหารและฝึกสมาธิ
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#E2E8F0", true: "#FF7A59" }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* Quick Links Card */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeader}>เมนูด่วน</Text>

            <BouncyButton
              onPress={() => router.push("/profile")}
              style={styles.menuRow}
            >
              <Text style={styles.menuIcon}>👤</Text>
              <Text style={styles.menuTitle}>โปรไฟล์ผู้สำรวจ</Text>
              <Text style={styles.menuChevron}>›</Text>
            </BouncyButton>

            <View style={styles.divider} />

            <BouncyButton
              onPress={() => router.push("/statistics")}
              style={styles.menuRow}
            >
              <Text style={styles.menuIcon}>📊</Text>
              <Text style={styles.menuTitle}>สถิติและการเติบโต</Text>
              <Text style={styles.menuChevron}>›</Text>
            </BouncyButton>

            <View style={styles.divider} />

            <BouncyButton
              onPress={() => router.push("/quest")}
              style={styles.menuRow}
            >
              <Text style={styles.menuIcon}>📜</Text>
              <Text style={styles.menuTitle}>ภารกิจและอาหารปลา</Text>
              <Text style={styles.menuChevron}>›</Text>
            </BouncyButton>
          </View>

          {/* App Info Footer */}
          <View style={styles.footer}>
            <Text style={styles.appNameText}>Focus Fish • Beta 1.0.1</Text>
            <Text style={styles.appDescText}>
              ออกแบบเพื่อช่วยคุณมีสมาธิและเติบโตเคียงข้างเพื่อนใต้น้ำ 🌊
            </Text>
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
  scrollContent: {
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0F2FE",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  settingDesc: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 10,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  menuChevron: {
    fontSize: 20,
    fontWeight: "600",
    color: "#94A3B8",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  appNameText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#94A3B8",
  },
  appDescText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
    textAlign: "center",
  },
});
