import React from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { router } from "expo-router";
import { useFocusStore } from "../store/useFocusStore";
import { Fish } from "../components/Fish";
import { BouncyButton } from "../components/BouncyButton";

export default function PauseScreen() {
  const { fish } = useFocusStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Cozy Sleeping Bubble */}
        <View style={styles.bubble}>
          <Fish stage={fish?.stage} mood="sleeping" size={145} interactive={true} />
        </View>

        <Text style={styles.title}>พักหายใจสักครู่ 💤</Text>
        <Text style={styles.subtitle}>
          {fish?.name || "น้องปลา"} กำลังงีบหลับอย่างสงบ เมื่อพร้อมแล้วกลับมาดำดิ่งโฟกัสด้วยกันต่อนะ!
        </Text>

        <View style={styles.buttonGroup}>
          <BouncyButton
            onPress={() => router.back()}
            style={styles.resumeButton}
          >
            <Text style={styles.resumeText}>ว่ายน้ำต่อ (Resume Focus)</Text>
          </BouncyButton>

          <BouncyButton
            onPress={() => router.replace("/")}
            style={styles.giveUpButton}
          >
            <Text style={styles.giveUpText}>สิ้นสุดเซสชันและกลับหน้าหลัก</Text>
          </BouncyButton>
        </View>
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
  bubble: {
    marginBottom: 28,
    height: 220,
    width: 220,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 110,
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: "#E0F2FE",
    shadowColor: "#0284C7",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 15,
    color: "#64748B",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  buttonGroup: {
    marginTop: 40,
    width: "100%",
    gap: 12,
  },
  resumeButton: {
    width: "100%",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#FF7A59", // Warm Coral
    paddingVertical: 16,
    shadowColor: "#FF7A59",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  resumeText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  giveUpButton: {
    width: "100%",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  giveUpText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748B",
  },
});
