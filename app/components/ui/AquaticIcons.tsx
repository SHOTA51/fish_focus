import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";

interface IconProps {
  size?: number;
  active?: boolean;
  color?: string;
  activeColor?: string;
}

// -------------------------------------------------------------
// 1. 🏠 SHELL HOME ICON (เปลือกหอยใต้น้ำ พร้อมไข่มุกเรืองแสง)
// -------------------------------------------------------------
export const ShellHomeIcon: React.FC<IconProps> = ({
  size = 28,
  active = false,
  color = "#94A3B8",
  activeColor = "#FF7A59",
}) => {
  const scale = useSharedValue(1);
  const pearlY = useSharedValue(0);

  useEffect(() => {
    if (active) {
      scale.value = withSequence(
        withSpring(1.25, { damping: 10, stiffness: 350 }),
        withSpring(1.0, { damping: 12, stiffness: 250 })
      );
      pearlY.value = withRepeat(
        withSequence(
          withTiming(-2, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      scale.value = withSpring(1.0);
      pearlY.value = 0;
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const currentColor = active ? activeColor : color;

  return (
    <Animated.View style={[styles.center, animatedStyle]}>
      <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <Defs>
          <LinearGradient id="shellGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={active ? "#FF9F43" : "#CBD5E1"} />
            <Stop offset="1" stopColor={currentColor} />
          </LinearGradient>
        </Defs>

        {/* Shell Base Fan */}
        <Path
          d="M16 4C10 4 5 11 6 22C6.5 25 10 27 16 27C22 27 25.5 25 26 22C27 11 22 4 16 4Z"
          fill="url(#shellGrad)"
        />

        {/* Shell Ridges */}
        <Path
          d="M16 4V27M16 4C13 10 11 18 10 26M16 4C19 10 21 18 22 26M16 4C8 12 7 20 6.5 22M16 4C24 12 25 20 25.5 22"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity={active ? 0.85 : 0.6}
        />

        {/* Glowing Pearl at Center */}
        {active && (
          <Circle
            cx="16"
            cy="23"
            r="3.5"
            fill="#FFFBEB"
            stroke="#FDE047"
            strokeWidth="1.2"
          />
        )}
      </Svg>
    </Animated.View>
  );
};

// -------------------------------------------------------------
// 2. ⏱️ BUBBLE TIMER ICON (นาฬิกาฟองสบู่ใต้น้ำ)
// -------------------------------------------------------------
export const BubbleTimerIcon: React.FC<IconProps> = ({
  size = 28,
  active = false,
  color = "#94A3B8",
  activeColor = "#FF7A59",
}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (active) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 8000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      rotation.value = withTiming(0);
    }
  }, [active]);

  const handStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const currentColor = active ? activeColor : color;

  return (
    <View style={styles.center}>
      <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        {/* Outer Bubble Ring */}
        <Circle
          cx="16"
          cy="16"
          r="12"
          stroke={currentColor}
          strokeWidth="2.5"
          fill={active ? "rgba(255, 122, 89, 0.12)" : "rgba(241, 245, 249, 0.4)"}
        />

        {/* Top Bubbles / Knobs */}
        <Circle cx="16" cy="2.5" r="1.8" fill={currentColor} />
        <Path d="M14 4H18" stroke={currentColor} strokeWidth="1.5" strokeLinecap="round" />

        {/* Bubble Shimmer Highlight */}
        <Path
          d="M9 11C10.5 8.5 13.5 7.5 16 7.5"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Center Pivot */}
        <Circle cx="16" cy="16" r="2" fill={currentColor} />

        {/* Clock Hands */}
        <Path
          d="M16 16V10M16 16L20 18"
          stroke={currentColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

// -------------------------------------------------------------
// 3. 📜 SCROLL QUEST ICON (ม้วนคัมภีร์สมบัติใต้น้ำ)
// -------------------------------------------------------------
export const ScrollQuestIcon: React.FC<IconProps> = ({
  size = 28,
  active = false,
  color = "#94A3B8",
  activeColor = "#FF7A59",
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (active) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 350 }),
        withSpring(1.0, { damping: 12, stiffness: 250 })
      );
    } else {
      scale.value = withSpring(1.0);
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const currentColor = active ? activeColor : color;

  return (
    <Animated.View style={[styles.center, animatedStyle]}>
      <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        {/* Main Scroll Parchment */}
        <Path
          d="M8 8C8 6.3 9.3 5 11 5H22C23.7 5 25 6.3 25 8V22C25 24.2 23.2 26 21 26H9C6.8 26 5 24.2 5 22C5 19.8 6.8 18 9 18H24"
          stroke={currentColor}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={active ? "rgba(255, 122, 89, 0.1)" : "none"}
        />

        {/* Top Scroll Roll */}
        <Path
          d="M8 5C6.3 5 5 6.3 5 8C5 9.7 6.3 11 8 11H23C24.7 11 26 9.7 26 8C26 6.3 24.7 5 23 5H8Z"
          fill={currentColor}
        />

        {/* Text Lines / Quests */}
        <Path
          d="M11 15H19M11 19H16"
          stroke={currentColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Star Badge on active */}
        {active && (
          <Circle cx="23" cy="18" r="2.2" fill="#F59E0B" />
        )}
      </Svg>
    </Animated.View>
  );
};

// -------------------------------------------------------------
// 4. 📊 CORAL STATS ICON (กราฟปะการัง 3 กิ่ง)
// -------------------------------------------------------------
export const CoralStatsIcon: React.FC<IconProps> = ({
  size = 28,
  active = false,
  color = "#94A3B8",
  activeColor = "#FF7A59",
}) => {
  const barHeight = useSharedValue(1);

  useEffect(() => {
    if (active) {
      barHeight.value = withSequence(
        withSpring(1.3, { damping: 10, stiffness: 300 }),
        withSpring(1.0, { damping: 12, stiffness: 200 })
      );
    } else {
      barHeight.value = withSpring(1.0);
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: barHeight.value }],
  }));

  const currentColor = active ? activeColor : color;

  return (
    <Animated.View style={[styles.center, animatedStyle]}>
      <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        {/* Baseline Seabed */}
        <Path d="M4 27H28" stroke={currentColor} strokeWidth="2.2" strokeLinecap="round" />

        {/* Coral Branch 1 (Left - Short) */}
        <Path
          d="M8 27V18C8 16 10 15 11 15C12 15 14 16 14 18V27"
          fill={currentColor}
          fillOpacity={active ? 0.8 : 0.6}
        />

        {/* Coral Branch 2 (Middle - Tall Hero) */}
        <Path
          d="M13 27V10C13 8 15 7 16 7C17 7 19 8 19 10V27"
          fill={currentColor}
        />

        {/* Coral Branch 3 (Right - Medium) */}
        <Path
          d="M18 27V14C18 12.5 20 11.5 21.5 11.5C23 11.5 25 12.5 25 14V27"
          fill={currentColor}
          fillOpacity={active ? 0.9 : 0.7}
        />

        {/* Tiny Bubbles over bars */}
        {active && (
          <>
            <Circle cx="16" cy="3.5" r="1.5" fill="#38BDF8" />
            <Circle cx="22" cy="8" r="1.2" fill="#38BDF8" />
          </>
        )}
      </Svg>
    </Animated.View>
  );
};

// -------------------------------------------------------------
// 5. 👤 DIVER PROFILE ICON (หมวกนักดำน้ำผจญภัย)
// -------------------------------------------------------------
export const DiverProfileIcon: React.FC<IconProps> = ({
  size = 28,
  active = false,
  color = "#94A3B8",
  activeColor = "#FF7A59",
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (active) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 10, stiffness: 350 }),
        withSpring(1.0, { damping: 12, stiffness: 250 })
      );
    } else {
      scale.value = withSpring(1.0);
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const currentColor = active ? activeColor : color;

  return (
    <Animated.View style={[styles.center, animatedStyle]}>
      <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        {/* Round Diver Helmet */}
        <Circle
          cx="16"
          cy="15"
          r="10"
          stroke={currentColor}
          strokeWidth="2.2"
          fill={active ? "rgba(255, 122, 89, 0.12)" : "none"}
        />

        {/* Glass Visor Faceplate */}
        <Rect
          x="10"
          y="11"
          width="12"
          height="8"
          rx="4"
          fill={active ? "#0284C7" : "#64748B"}
          stroke={currentColor}
          strokeWidth="1.5"
        />

        {/* Visor Glint Reflection */}
        <Path
          d="M12 13L15 17"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Breathing Air Pipe / Tube */}
        <Path
          d="M26 15C27 15 28 17 28 20V27"
          stroke={currentColor}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Shoulders / Base */}
        <Path
          d="M9 25C9 23 12 22 16 22C20 22 23 23 23 25V28H9V25Z"
          fill={currentColor}
        />
      </Svg>
    </Animated.View>
  );
};

// -------------------------------------------------------------
// 6. 🍲 FOOD BOWL ICON (ถ้วยอาหารปลาวิเศษ พร้อมเม็ดอาหาร)
// -------------------------------------------------------------
export const FoodBowlIcon: React.FC<{
  size?: number;
  count?: number;
  color?: string;
}> = ({ size = 26, count = 5, color = "#16A34A" }) => {
  const isEmpty = count === 0;
  const activeColor = isEmpty ? "#EF4444" : color;

  return (
    <View style={styles.center}>
      <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        {/* Bowl Body */}
        <Path
          d="M5 14C5 21 9 26 16 26C23 26 27 21 27 14H5Z"
          fill={isEmpty ? "#FEE2E2" : "#DCFCE7"}
          stroke={activeColor}
          strokeWidth="2"
        />

        {/* Bowl Rim */}
        <Path
          d="M4 14C4 13 6 12 16 12C26 12 28 13 28 14C28 15 26 16 16 16C6 16 4 15 4 14Z"
          fill={activeColor}
        />

        {/* Food Pellets inside */}
        {!isEmpty ? (
          <>
            <Circle cx="12" cy="10" r="2.2" fill="#FF9F43" />
            <Circle cx="16" cy="8.5" r="2.4" fill="#FF7A59" />
            <Circle cx="20" cy="10.2" r="2.1" fill="#FBBF24" />
          </>
        ) : (
          /* Empty steam / wind */
          <Path
            d="M13 8C13 8 14 6 16 6C18 6 19 8 19 8"
            stroke="#EF4444"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        )}
      </Svg>
    </View>
  );
};

// -------------------------------------------------------------
// 7. ⏯️ MORPHING PLAY/PAUSE ICON (ปุ่มสลับ Play/Pause)
// -------------------------------------------------------------
export const PlayPauseIcon: React.FC<{
  isActive: boolean;
  size?: number;
  color?: string;
}> = ({ isActive, size = 32, color = "#FFFFFF" }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(0.8, { damping: 10, stiffness: 400 }),
      withSpring(1.0, { damping: 12, stiffness: 300 })
    );
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.center, animatedStyle]}>
      <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        {isActive ? (
          /* Pause Bars */
          <G>
            <Rect x="10" y="8" width="4" height="16" rx="2" fill={color} />
            <Rect x="18" y="8" width="4" height="16" rx="2" fill={color} />
          </G>
        ) : (
          /* Play Triangle */
          <Path
            d="M11 8.5C11 7.2 12.4 6.4 13.5 7.1L23.5 13.6C24.5 14.3 24.5 15.7 23.5 16.4L13.5 22.9C12.4 23.6 11 22.8 11 21.5V8.5Z"
            fill={color}
          />
        )}
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});
