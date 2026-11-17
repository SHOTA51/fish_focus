import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
  LayoutChangeEvent,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Rect,
} from "react-native-svg";
import { Fish, FishStage, FishMood, FishColorTheme } from "./Fish";
import { RiveFish } from "./RiveFish";
import {
  DetailedFeedIcon,
  DetailedTrickIcon,
  DetailedPetIcon,
  DetailedCoralCluster,
} from "./ui/DetailedAquaticAssets";
import { useFocusStore } from "../store/useFocusStore";
import { router } from "expo-router";

export interface FishTankProps {
  stage?: FishStage;
  fishName?: string;
  level?: number;
  colorTheme?: FishColorTheme;
  mode?: "home" | "focus" | "pause" | "success";
  height?: number;
  onFeed?: () => void;
}

interface FoodPellet {
  id: number;
  x: number;
  y: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface AmbientBubble {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

export const FishTank: React.FC<FishTankProps> = ({
  stage: stageProp,
  fishName: nameProp,
  level: levelProp,
  colorTheme = "orange",
  mode = "home",
  height = 320,
  onFeed,
}) => {
  const { fish, feedFish } = useFocusStore();

  const stage: FishStage = stageProp || (fish?.stage as FishStage) || "juvenile";
  const fishName = nameProp || fish?.name || "Bob";
  const level = levelProp || fish?.level || 1;

  // State
  const [tankSize, setTankSize] = useState({ width: 340, height });
  const [isEating, setIsEating] = useState(false);
  const [isHappy, setIsHappy] = useState(false);
  const [expBonusText, setExpBonusText] = useState<string | null>(null);

  // Derived mood
  const activeMood: FishMood = isEating
    ? "eating"
    : isHappy
    ? "happy"
    : mode === "pause"
    ? "sleeping"
    : mode === "focus"
    ? "focus"
    : "idle";

  // Reanimated Positions for the swimming fish
  const fishX = useSharedValue(120);
  const fishY = useSharedValue(110);
  const fishScaleX = useSharedValue(1); // 1 = right, -1 = left
  const fishTilt = useSharedValue(0);

  // Ambient Bubbles
  const [bubbles] = useState<AmbientBubble[]>(() =>
    Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      x: 20 + i * 34 + (Math.random() * 16 - 8),
      size: 4 + Math.random() * 8,
      duration: 3200 + Math.random() * 2000,
      delay: i * 400,
    }))
  );

  // Food Pellets & Ripples state
  const [pellets, setPellets] = useState<FoodPellet[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextPelletId = useRef(0);
  const nextRippleId = useRef(0);
  const isTargetingFoodRef = useRef(false);
  const wanderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Swim animation coordinator ref
  const swimToRef = useRef<
    (targetX: number, targetY: number, speedMultiplier?: number, onArrival?: () => void) => void
  >(() => {});

  // Quick Action: Acrobatic Trick / Flip
  const doTrick = () => {
    setIsHappy(true);
    fishTilt.value = withSequence(
      withTiming(-360 * fishScaleX.value, {
        duration: 800,
        easing: Easing.out(Easing.back(1.5)),
      }),
      withTiming(0, { duration: 0 })
    );
    setTimeout(() => {
      setIsHappy(false);
    }, 1800);
  };

  // Update layout bounds
  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height: h } = event.nativeEvent.layout;
    if (width > 0 && h > 0) {
      setTankSize({ width, height: h });
      fishX.value = width / 2 - 40;
      fishY.value = h / 2 - 20;
    }
  };

  // Handle Tank Tap (Drop food & create ripple)
  const handleTankPress = (e: GestureResponderEvent) => {
    if (mode === "pause") {
      setIsHappy(true);
      setTimeout(() => setIsHappy(false), 2500);
      return;
    }

    const { locationX, locationY } = e.nativeEvent;

    // Spawn ripple
    const rippleId = nextRippleId.current++;
    setRipples((prev) => [...prev.slice(-3), { id: rippleId, x: locationX, y: locationY }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 900);

    // Check food inventory!
    const foodCount = fish?.food ?? 0;
    if (foodCount <= 0) {
      setExpBonusText("อาหารหมดแล้ว! โฟกัสเพื่อหาอาหาร 🍲");
      setTimeout(() => setExpBonusText(null), 2500);
      return;
    }

    // Deduct 1 food & grant exp
    const result = feedFish();
    if (!result.success) {
      setExpBonusText("อาหารหมดแล้ว! โฟกัสเพื่อหาอาหาร 🍲");
      setTimeout(() => setExpBonusText(null), 2500);
      return;
    }

    setExpBonusText("+10 EXP ✨ (-1 🍲)");
    setTimeout(() => setExpBonusText(null), 1800);

    // Drop food pellet (max 4 on screen)
    const pelletId = nextPelletId.current++;
    setPellets((prev) => [...prev.slice(-3), { id: pelletId, x: locationX, y: locationY }]);
  };

  // Quick Action: Drop Food button
  const dropFoodPellet = () => {
    const foodCount = fish?.food ?? 0;
    if (foodCount <= 0) {
      setExpBonusText("อาหารหมดแล้ว! โฟกัสเพื่อหาอาหาร 🍲");
      setTimeout(() => setExpBonusText(null), 2500);
      return;
    }

    const result = feedFish();
    if (!result.success) return;

    setExpBonusText("+10 EXP ✨ (-1 🍲)");
    setTimeout(() => setExpBonusText(null), 1800);

    const rx = 80 + Math.random() * (tankSize.width - 160);
    const ry = 60 + Math.random() * 80;
    const pelletId = nextPelletId.current++;
    setPellets((prev) => [...prev.slice(-3), { id: pelletId, x: rx, y: ry }]);
  };

  useEffect(() => {
    swimToRef.current = (
      targetX: number,
      targetY: number,
      speedMultiplier = 1,
      onArrival?: () => void
    ) => {
      const paddingX = 65;
      const paddingY = 55;
      const boundedX = Math.max(paddingX, Math.min(tankSize.width - paddingX, targetX));
      const boundedY = Math.max(paddingY, Math.min(tankSize.height - paddingY, targetY));

      const dx = boundedX - fishX.value;
      const dy = boundedY - fishY.value;
      const distance = Math.hypot(dx, dy);

      if (distance < 5) {
        onArrival?.();
        return;
      }

      // Smooth horizontal turn
      const newScaleX = dx >= 0 ? 1 : -1;
      if (newScaleX !== fishScaleX.value) {
        fishScaleX.value = withTiming(newScaleX, { duration: 350, easing: Easing.inOut(Easing.ease) });
      }

      // Calculate tilt based on climb/dive slope
      const targetTilt = Math.max(-18, Math.min(18, (dy / (Math.abs(dx) + 1)) * 14 * newScaleX));
      fishTilt.value = withTiming(targetTilt, { duration: 400 });

      // Swimming speed
      const baseDuration = (distance / 0.12) / speedMultiplier;
      const duration = Math.max(800, Math.min(3800, baseDuration));

      fishX.value = withTiming(boundedX, {
        duration,
        easing: Easing.inOut(Easing.quad),
      });

      fishY.value = withTiming(
        boundedY,
        {
          duration,
          easing: Easing.inOut(Easing.quad),
        },
        (finished) => {
          if (finished && onArrival) {
            runOnJS(onArrival)();
          }
        }
      );
    };
  });

  // Wandering routine
  useEffect(() => {
    if (mode === "pause") {
      const timer = setTimeout(() => {
        fishX.value = withTiming(tankSize.width * 0.5 - 40, { duration: 1500 });
        fishY.value = withTiming(tankSize.height - 85, { duration: 1500 });
        fishTilt.value = withTiming(0, { duration: 800 });
      }, 50);
      return () => clearTimeout(timer);
    }

    let isMounted = true;

    const startWandering = () => {
      if (!isMounted || isTargetingFoodRef.current) return;

      const wanderX = 40 + Math.random() * (tankSize.width - 120);
      const wanderY = 40 + Math.random() * (tankSize.height - 110);
      const speed = mode === "focus" ? 0.6 : 0.9;

      swimToRef.current(wanderX, wanderY, speed, () => {
        if (!isMounted || isTargetingFoodRef.current) return;
        const pauseTime = 1000 + Math.random() * 2000;
        wanderTimeoutRef.current = setTimeout(startWandering, pauseTime);
      });
    };

    wanderTimeoutRef.current = setTimeout(startWandering, 500);

    return () => {
      isMounted = false;
      if (wanderTimeoutRef.current) clearTimeout(wanderTimeoutRef.current);
    };
  }, [tankSize, mode]);

  // Food Seeking Loop
  useEffect(() => {
    if (pellets.length === 0 || mode === "pause") return;

    const targetPellet = pellets[0];
    isTargetingFoodRef.current = true;

    const timer = setTimeout(() => {
      setIsEating(true);
      swimToRef.current(targetPellet.x - 30, targetPellet.y - 20, 2.2, () => {
        // Chomp pellet!
        setPellets((prev) => prev.filter((p) => p.id !== targetPellet.id));
        setIsEating(false);
        setIsHappy(true);

        onFeed?.();
        setExpBonusText("+10 EXP 😋💖");
        setTimeout(() => setExpBonusText(null), 1800);

        // Check if feeding triggered an evolution!
        if (useFocusStore.getState().pendingEvolution) {
          router.push("/focus/evolve");
        }

        setTimeout(() => {
          isTargetingFoodRef.current = false;
          setIsHappy(false);
        }, 1500);
      });
    }, 20);

    return () => clearTimeout(timer);
  }, [pellets, mode, onFeed]);

  // Animated styles for Fish position inside tank
  const fishPositionAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: fishX.value },
        { translateY: fishY.value },
        { scaleX: fishScaleX.value },
        { rotate: `${fishTilt.value}deg` },
      ],
    };
  });

  return (
    <View style={[styles.tankContainer, { height }]} onLayout={onLayout}>
      {/* Background Water Surface & Ocean Gradient */}
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            {mode === "pause"
              ? [
                  <Stop key="0" offset="0%" stopColor="#0B192C" />,
                  <Stop key="1" offset="60%" stopColor="#1E3E62" />,
                  <Stop key="2" offset="100%" stopColor="#0B192C" />,
                ]
              : mode === "focus"
              ? [
                  <Stop key="0" offset="0%" stopColor="#0369A1" />,
                  <Stop key="1" offset="50%" stopColor="#0284C7" />,
                  <Stop key="2" offset="100%" stopColor="#0C4A6E" />,
                ]
              : mode === "success"
              ? [
                  <Stop key="0" offset="0%" stopColor="#0284C7" />,
                  <Stop key="1" offset="60%" stopColor="#06B6D4" />,
                  <Stop key="2" offset="100%" stopColor="#0D9488" />,
                ]
              : [
                  <Stop key="0" offset="0%" stopColor="#0284C7" />,
                  <Stop key="1" offset="45%" stopColor="#0EA5E9" />,
                  <Stop key="2" offset="100%" stopColor="#0369A1" />,
                ]}
          </LinearGradient>
          <LinearGradient id="lightRay" x1="0%" y1="0%" x2="40%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id="sandBed" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="rgba(254, 240, 138, 0.4)" />
            <Stop offset="100%" stopColor="rgba(202, 138, 4, 0.55)" />
          </LinearGradient>
        </Defs>

        {/* Deep Water Base */}
        <Rect width="100%" height="100%" fill="url(#waterGrad)" />

        {/* Ambient Sunbeam Rays */}
        <Path d="M 40 0 L 100 0 L 160 300 L 90 300 Z" fill="url(#lightRay)" />
        <Path d="M 180 0 L 250 0 L 320 300 L 240 300 Z" fill="url(#lightRay)" />

        {/* Water Surface Shimmer Wave at top */}
        <Path
          d="M 0 10 Q 50 18 100 10 T 200 10 T 300 10 T 400 10 L 400 0 L 0 0 Z"
          fill="rgba(255, 255, 255, 0.2)"
        />

        {/* Seabed Sand Layer at bottom */}
        <Path
          d={`M 0 ${height - 24} Q 90 ${height - 35} 180 ${height - 24} T 360 ${height - 26} L ${tankSize.width} ${height} L 0 ${height} Z`}
          fill="url(#sandBed)"
        />

        {/* Ambient Swaying Seaweeds */}
        <Path
          d={`M 28 ${height} Q 20 ${height - 45} 32 ${height - 75} Q 22 ${height - 105} 30 ${height - 135} Q 36 ${height - 100} 34 ${height - 45} Z`}
          fill="rgba(34, 197, 94, 0.45)"
        />
        <Path
          d={`M 40 ${height} Q 48 ${height - 40} 42 ${height - 80} Q 50 ${height - 110} 44 ${height - 120} Q 40 ${height - 70} 44 ${height} Z`}
          fill="rgba(22, 163, 74, 0.5)"
        />
        <Path
          d={`M ${tankSize.width - 35} ${height} Q ${tankSize.width - 45} ${height - 50} ${tankSize.width - 30} ${height - 90} Q ${tankSize.width - 40} ${height - 120} ${tankSize.width - 34} ${height - 140} Q ${tankSize.width - 26} ${height - 90} ${tankSize.width - 30} ${height} Z`}
          fill="rgba(34, 197, 94, 0.4)"
        />
      </Svg>

      {/* Detailed Coral Reef Bed Layer */}
      <View style={{ position: "absolute", bottom: -4, left: 8, opacity: 0.95 }} pointerEvents="none">
        <DetailedCoralCluster width={115} height={75} />
      </View>

      {/* Ambient Rising Bubbles */}
      {bubbles.map((b) => (
        <RisingBubble key={b.id} bubble={b} maxHeight={height} />
      ))}

      {/* Water Touch Ripples */}
      {ripples.map((r) => (
        <WaterRipple key={r.id} x={r.x} y={r.y} />
      ))}

      {/* Sinking Food Pellets */}
      {pellets.map((p) => (
        <SinkingPellet key={p.id} x={p.x} y={p.y} />
      ))}

      {/* EXP Reward Bonus Floating Toast */}
      {expBonusText && (
        <View style={styles.expBonusToast}>
          <Text style={styles.expBonusText}>{expBonusText}</Text>
        </View>
      )}

      {/* Tap Area for Feeding & Interaction */}
      <Pressable style={StyleSheet.absoluteFill} onPress={handleTankPress}>
        {/* Animated Swimming Fish */}
        <Animated.View style={[styles.fishActor, fishPositionAnimStyle]}>
          <Fish
            stage={stage}
            mood={activeMood}
            colorTheme={colorTheme}
            size={stage === "adult" ? 135 : stage === "fry" ? 90 : stage === "egg" ? 85 : 120}
            interactive={true}
            onPress={doTrick}
          />
        </Animated.View>
      </Pressable>

      {/* Floating HUD: Fish Name, Level, Mood Badge */}
      <View style={styles.topHudContainer} pointerEvents="box-none">
        <View style={styles.badgePill}>
          <Text style={styles.badgeFishName}>{fishName}</Text>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeLevel}>Lv. {level}</Text>
          <Text style={styles.badgeStage}>{stage.toUpperCase()}</Text>
        </View>

        <View style={[styles.badgePill, styles.moodPill]}>
          <Text style={styles.moodText}>
            {activeMood === "happy"
              ? "💖 Happy"
              : activeMood === "eating"
              ? "🍙 Munching!"
              : activeMood === "focus"
              ? "🧘 Focused"
              : activeMood === "sleeping"
              ? "😴 Resting"
              : "🌊 Swimming"}
          </Text>
        </View>
      </View>

      {/* Bottom Floating Interactive Toolbar (Detailed Custom SVG Vector Assets) */}
      {mode === "home" && (
        <View style={styles.bottomToolbar} pointerEvents="box-none">
          <Pressable style={styles.toolBtn} onPress={dropFoodPellet}>
            <DetailedFeedIcon size={24} />
            <Text style={styles.toolBtnLabel}>Feed</Text>
          </Pressable>

          <Pressable style={styles.toolBtn} onPress={doTrick}>
            <DetailedTrickIcon size={24} />
            <Text style={styles.toolBtnLabel}>Trick</Text>
          </Pressable>

          <Pressable
            style={styles.toolBtn}
            onPress={() => {
              setIsHappy(true);
              setTimeout(() => setIsHappy(false), 2000);
            }}
          >
            <DetailedPetIcon size={24} />
            <Text style={styles.toolBtnLabel}>Pet</Text>
          </Pressable>
        </View>
      )}

      {/* Subtle Interaction Hint */}
      {mode === "home" && pellets.length === 0 && (
        <View style={styles.tapHintContainer} pointerEvents="none">
          <Text style={styles.tapHintText}>Tap water to feed • Tap {fishName} for tricks</Text>
        </View>
      )}
    </View>
  );
};

// ==========================================
// SUBCOMPONENTS: RIPPLE, PELLET, BUBBLE
// ==========================================

const WaterRipple = ({ x, y }: { x: number; y: number }) => {
  const scale = useSharedValue(0.2);
  const opacity = useSharedValue(0.9);

  useEffect(() => {
    scale.value = withTiming(2.4, { duration: 800, easing: Easing.out(Easing.ease) });
    opacity.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) });
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.rippleCircle,
        animStyle,
        { left: x - 25, top: y - 25, width: 50, height: 50 },
      ]}
    />
  );
};

const SinkingPellet = ({ x, y }: { x: number; y: number }) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withSpring(1);
    translateY.value = withTiming(45, { duration: 3500, easing: Easing.inOut(Easing.quad) });
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.pellet, animStyle, { left: x - 6, top: y - 6 }]}
    >
      <View style={styles.pelletCore} />
      <View style={styles.pelletGlow} />
    </Animated.View>
  );
};

const RisingBubble = ({
  bubble,
  maxHeight,
}: {
  bubble: AmbientBubble;
  maxHeight: number;
}) => {
  const translateY = useSharedValue(maxHeight + 20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const loop = () => {
      translateY.value = maxHeight + 20;
      opacity.value = 0;

      setTimeout(() => {
        opacity.value = withTiming(0.65, { duration: 400 });
        translateY.value = withTiming(
          -20,
          { duration: bubble.duration, easing: Easing.linear },
          (finished) => {
            if (finished) {
              runOnJS(loop)();
            }
          }
        );
      }, bubble.delay);
    };

    loop();
  }, [maxHeight, bubble]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.ambientBubble,
        animStyle,
        {
          left: bubble.x,
          width: bubble.size,
          height: bubble.size,
          borderRadius: bubble.size / 2,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  tankContainer: {
    width: "100%",
    borderRadius: 36,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#0369a1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  fishActor: {
    position: "absolute",
    width: 140,
    height: 105,
    alignItems: "center",
    justifyContent: "center",
  },
  topHudContainer: {
    position: "absolute",
    top: 14,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  badgeFishName: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },
  badgeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    marginHorizontal: 6,
  },
  badgeLevel: {
    color: "#FEF08A",
    fontWeight: "700",
    fontSize: 12,
  },
  badgeStage: {
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "700",
    fontSize: 10,
    marginLeft: 6,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  moodPill: {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  moodText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
  bottomToolbar: {
    position: "absolute",
    bottom: 12,
    right: 16,
    flexDirection: "row",
    gap: 8,
  },
  toolBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  toolBtnIcon: {
    fontSize: 16,
  },
  toolBtnLabel: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 2,
  },
  tapHintContainer: {
    position: "absolute",
    bottom: 12,
    left: 16,
  },
  tapHintText: {
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 10,
    fontWeight: "600",
  },
  rippleCircle: {
    position: "absolute",
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.7)",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  pellet: {
    position: "absolute",
    width: 12,
    height: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  pelletCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F59E0B",
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  pelletGlow: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(251, 191, 36, 0.35)",
  },
  ambientBubble: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.45)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.75)",
  },
  expBonusToast: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: "rgba(16, 185, 129, 0.95)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#059669",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 50,
  },
  expBonusText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },
});

export default FishTank;
