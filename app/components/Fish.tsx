import React, { useEffect, useState, useRef } from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from "react-native-reanimated";
import Svg, {
  Path,
  Circle,
  Ellipse,
  G,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from "react-native-svg";

export type FishStage = "egg" | "fry" | "juvenile" | "adult";
export type FishMood = "idle" | "happy" | "focus" | "eating" | "sleeping";
export type FishColorTheme = "orange" | "cyan" | "golden" | "sakura";

export interface FishProps {
  stage?: FishStage;
  mood?: FishMood;
  colorTheme?: FishColorTheme;
  size?: number; // base size width
  interactive?: boolean;
  isSwimming?: boolean;
  onPress?: () => void;
  showSpeech?: boolean;
  customMessage?: string;
}

const THEMES = {
  orange: {
    primaryLight: "#FFA352",
    primaryDark: "#FF4500",
    secondary: "#FFB03A",
    belly: "#FFF5EB",
    stripe: "#FFFFFF",
    stripeShadow: "rgba(0, 0, 0, 0.15)",
    finGradientStart: "#FFA96B",
    finGradientEnd: "#FF3800",
    accentGlow: "#FFE082",
    blush: "#FF6584",
  },
  cyan: {
    primaryLight: "#38E1FF",
    primaryDark: "#0066FF",
    secondary: "#00E5FF",
    belly: "#E6FAFF",
    stripe: "#FFFFFF",
    stripeShadow: "rgba(0, 50, 100, 0.2)",
    finGradientStart: "#6BE5FF",
    finGradientEnd: "#0052CC",
    accentGlow: "#80F0FF",
    blush: "#FF8CA3",
  },
  golden: {
    primaryLight: "#FFE259",
    primaryDark: "#FFA751",
    secondary: "#FFD700",
    belly: "#FFFFF0",
    stripe: "#FFFFFF",
    stripeShadow: "rgba(100, 60, 0, 0.2)",
    finGradientStart: "#FFED4A",
    finGradientEnd: "#F37055",
    accentGlow: "#FFF8DC",
    blush: "#FF8A65",
  },
  sakura: {
    primaryLight: "#FFB8D2",
    primaryDark: "#FF4B8B",
    secondary: "#FF80AB",
    belly: "#FFF0F5",
    stripe: "#FFFFFF",
    stripeShadow: "rgba(100, 0, 50, 0.15)",
    finGradientStart: "#FFC2D8",
    finGradientEnd: "#E91E63",
    accentGlow: "#FFE4E1",
    blush: "#FF4081",
  },
};

const CUTE_MESSAGES = [
  "Blub blub! 🫧",
  "I love focusing with you! ❤️",
  "Keep up the great work! ✨",
  "Feeling energized! 🌊",
  "You're doing amazing! 🌟",
  "Swimming along! 🐠",
];

export const Fish: React.FC<FishProps> = ({
  stage = "juvenile",
  mood = "idle",
  colorTheme = "orange",
  size = 140,
  interactive = true,
  isSwimming = true,
  onPress,
  showSpeech = false,
  customMessage,
}) => {
  const theme = THEMES[colorTheme] || THEMES.orange;
  const aspectRatio = 0.75;
  const height = size * aspectRatio;

  // Interaction feedback state
  const [speechText, setSpeechText] = useState<string | null>(null);
  const [showHearts, setShowHearts] = useState(false);
  const speechTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reanimated Shared Values
  const tailAngle = useSharedValue(0);
  const finAngle = useSharedValue(0);
  const dorsalWave = useSharedValue(0);
  const bobY = useSharedValue(0);
  const eyeBlink = useSharedValue(1);
  const fishScale = useSharedValue(1);
  const fishRotation = useSharedValue(0);
  const mouthOpen = useSharedValue(0);
  const eggPulse = useSharedValue(1);
  const heartScale = useSharedValue(0);

  // Swimming speed modifiers depending on state
  const isSleeping = mood === "sleeping";
  const isEating = mood === "eating";
  const isHappy = mood === "happy";
  const isFocus = mood === "focus";

  // Locomotion & Idle swimming animations
  useEffect(() => {
    if (stage === "egg") {
      eggPulse.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.97, { duration: 1100, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      bobY.value = withRepeat(
        withSequence(
          withTiming(-4, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
          withTiming(4, { duration: 1600, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
      return;
    }

    // Swimming Tail oscillation
    let tailDuration = 360;
    let tailAmp = 15;
    let bobDuration = 1200;
    let bobAmp = 5;

    if (isSleeping) {
      tailDuration = 800;
      tailAmp = 6;
      bobDuration = 2200;
      bobAmp = 3;
    } else if (isEating || isHappy) {
      tailDuration = 200;
      tailAmp = 22;
      bobDuration = 700;
      bobAmp = 8;
    } else if (stage === "fry") {
      tailDuration = 220;
      tailAmp = 18;
    } else if (stage === "adult") {
      tailDuration = 480;
      tailAmp = 14;
    }

    if (isSwimming) {
      tailAngle.value = withRepeat(
        withSequence(
          withTiming(-tailAmp, { duration: tailDuration, easing: Easing.inOut(Easing.sin) }),
          withTiming(tailAmp, { duration: tailDuration, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );

      finAngle.value = withRepeat(
        withSequence(
          withTiming(-12, { duration: tailDuration * 0.8, easing: Easing.inOut(Easing.ease) }),
          withTiming(18, { duration: tailDuration * 0.8, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      dorsalWave.value = withRepeat(
        withSequence(
          withTiming(6, { duration: tailDuration * 1.2, easing: Easing.inOut(Easing.sin) }),
          withTiming(-6, { duration: tailDuration * 1.2, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );

      bobY.value = withRepeat(
        withSequence(
          withTiming(-bobAmp, { duration: bobDuration, easing: Easing.inOut(Easing.sin) }),
          withTiming(bobAmp, { duration: bobDuration, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    }
  }, [stage, mood, isSwimming, isSleeping, isEating, isHappy]);

  // Eye blinking cycle
  useEffect(() => {
    if (stage === "egg" || isSleeping) return;

    const interval = setInterval(() => {
      eyeBlink.value = withSequence(
        withTiming(0.1, { duration: 90, easing: Easing.linear }),
        withTiming(1, { duration: 110, easing: Easing.linear })
      );
    }, 3800 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [stage, isSleeping]);

  // Eating chomp reaction
  useEffect(() => {
    if (isEating) {
      mouthOpen.value = withSequence(
        withTiming(1, { duration: 120 }),
        withTiming(0, { duration: 120 }),
        withTiming(1, { duration: 120 }),
        withTiming(0, { duration: 120 })
      );
    }
  }, [isEating]);

  // Interactive Tap Reaction
  const handlePress = () => {
    if (!interactive) {
      onPress?.();
      return;
    }

    // Playful bounce & rotation
    fishScale.value = withSequence(
      withSpring(1.22, { damping: 6, stiffness: 220 }),
      withSpring(1, { damping: 8, stiffness: 180 })
    );

    fishRotation.value = withSequence(
      withTiming(stage === "egg" ? 12 : -15, { duration: 100 }),
      withTiming(stage === "egg" ? -12 : 12, { duration: 120 }),
      withTiming(0, { duration: 120 })
    );

    // Show heart bursts
    setShowHearts(true);
    heartScale.value = withSequence(
      withSpring(1, { damping: 5, stiffness: 150 }),
      withDelay(1200, withTiming(0, { duration: 300 }))
    );

    // Trigger random cute message or custom
    const msg = customMessage || CUTE_MESSAGES[Math.floor(Math.random() * CUTE_MESSAGES.length)];
    setSpeechText(msg);

    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    speechTimeoutRef.current = setTimeout(() => {
      setSpeechText(null);
      setShowHearts(false);
    }, 2400);

    onPress?.();
  };

  // Animated Styles
  const containerAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: bobY.value },
        { scale: fishScale.value * (stage === "egg" ? eggPulse.value : 1) },
        { rotate: `${fishRotation.value}deg` },
      ],
    };
  });

  const tailAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${tailAngle.value}deg` },
      ],
    };
  });

  const finAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${finAngle.value}deg` },
      ],
    };
  });

  const dorsalAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { skewX: `${dorsalWave.value}deg` },
      ],
    };
  });

  const eyeAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleY: isSleeping ? 0.15 : eyeBlink.value }],
    };
  });

  const mouthAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleY: 1 + mouthOpen.value * 1.5 }],
    };
  });

  const heartAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: heartScale.value,
      transform: [
        { scale: heartScale.value },
        { translateY: (1 - heartScale.value) * -30 },
      ],
    };
  });

  return (
    <View style={[styles.wrapper, { width: size, height }]}>
      {/* Interactive Speech / Reaction Bubble */}
      {(showSpeech || speechText) && (
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>{speechText || customMessage || "Blub blub! 🫧"}</Text>
          <View style={styles.speechArrow} />
        </View>
      )}

      {/* Floating Hearts Particle on Pet */}
      {showHearts && (
        <Animated.View style={[styles.heartsContainer, heartAnimStyle]}>
          <Text style={styles.heartIcon}>💖</Text>
          <Text style={[styles.heartIcon, styles.heartSmall]}>✨</Text>
        </Animated.View>
      )}

      {/* Sleeping "Zzz" effect */}
      {isSleeping && (
        <View style={styles.zzzContainer}>
          <Text style={styles.zzzText1}>z</Text>
          <Text style={styles.zzzText2}>Z</Text>
          <Text style={styles.zzzText3}>Z</Text>
        </View>
      )}

      {/* Focus Serene Aura */}
      {isFocus && (
        <View style={[styles.focusAura, { width: size * 1.15, height: height * 1.15 }]} />
      )}

      {/* Main Fish Model */}
      <Pressable
        onPress={handlePress}
        style={[styles.touchTarget, { width: size, height }]}
        disabled={!interactive && !onPress}
      >
        <Animated.View style={[styles.fishBodyContainer, containerAnimStyle, { width: size, height }]}>
          {stage === "egg" ? (
            <RenderEgg stage={stage} theme={theme} size={size} height={height} />
          ) : stage === "fry" ? (
            <RenderFry
              theme={theme}
              size={size}
              height={height}
              tailAnimStyle={tailAnimStyle}
              finAnimStyle={finAnimStyle}
              eyeAnimStyle={eyeAnimStyle}
              isSleeping={isSleeping}
              isHappy={isHappy}
            />
          ) : stage === "adult" ? (
            <RenderAdult
              theme={theme}
              size={size}
              height={height}
              tailAnimStyle={tailAnimStyle}
              finAnimStyle={finAnimStyle}
              dorsalAnimStyle={dorsalAnimStyle}
              eyeAnimStyle={eyeAnimStyle}
              mouthAnimStyle={mouthAnimStyle}
              isSleeping={isSleeping}
              isHappy={isHappy}
            />
          ) : (
            // Default: Juvenile
            <RenderJuvenile
              theme={theme}
              size={size}
              height={height}
              tailAnimStyle={tailAnimStyle}
              finAnimStyle={finAnimStyle}
              dorsalAnimStyle={dorsalAnimStyle}
              eyeAnimStyle={eyeAnimStyle}
              mouthAnimStyle={mouthAnimStyle}
              isSleeping={isSleeping}
              isHappy={isHappy}
            />
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
};

// ==========================================
// 1. EGG MODEL
// ==========================================
const RenderEgg = ({
  theme,
  size,
  height,
}: {
  stage: FishStage;
  theme: typeof THEMES.orange;
  size: number;
  height: number;
}) => {
  return (
    <Svg width={size} height={height} viewBox="0 0 100 80">
      <Defs>
        <RadialGradient id="eggGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={theme.accentGlow} stopOpacity="0.8" />
          <Stop offset="70%" stopColor={theme.primaryLight} stopOpacity="0.4" />
          <Stop offset="100%" stopColor={theme.primaryDark} stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="eggBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={theme.primaryLight} />
          <Stop offset="65%" stopColor={theme.primaryDark} />
          <Stop offset="100%" stopColor={theme.primaryDark} />
        </LinearGradient>
        <RadialGradient id="yolkCore" cx="45%" cy="40%" r="45%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <Stop offset="40%" stopColor={theme.accentGlow} stopOpacity="0.8" />
          <Stop offset="100%" stopColor={theme.secondary} stopOpacity="0.6" />
        </RadialGradient>
      </Defs>

      {/* Outer ambient glow */}
      <Circle cx="50" cy="42" r="32" fill="url(#eggGlow)" />

      {/* Floating speckles/bubbles around egg */}
      <Circle cx="32" cy="22" r="2" fill="#FFFFFF" opacity="0.6" />
      <Circle cx="68" cy="25" r="1.5" fill="#FFFFFF" opacity="0.5" />
      <Circle cx="72" cy="54" r="2.5" fill="#FFFFFF" opacity="0.4" />

      {/* Egg Shell */}
      <Ellipse
        cx="50"
        cy="42"
        rx="22"
        ry="27"
        fill="url(#eggBody)"
        stroke={theme.accentGlow}
        strokeWidth="1.5"
      />

      {/* Embryo Yolk Core pulsing inside */}
      <Ellipse cx="48" cy="43" rx="13" ry="16" fill="url(#yolkCore)" />

      {/* Tiny internal fish silhouette outline inside egg */}
      <Path
        d="M 44 41 Q 48 37 53 41 Q 50 44 44 41 Z"
        fill={theme.primaryDark}
        opacity="0.35"
      />
      <Circle cx="51" cy="40" r="1.2" fill="#FFFFFF" opacity="0.7" />

      {/* Shell Highlight (curved glossy reflection) */}
      <Path
        d="M 37 28 C 42 22 55 22 61 28"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <Circle cx="40" cy="34" r="1.5" fill="#FFFFFF" opacity="0.8" />
    </Svg>
  );
};

// ==========================================
// 2. FRY (BABY FISH) MODEL
// ==========================================
const RenderFry = ({
  theme,
  size,
  height,
  tailAnimStyle,
  finAnimStyle,
  eyeAnimStyle,
  isSleeping,
  isHappy,
}: {
  theme: typeof THEMES.orange;
  size: number;
  height: number;
  tailAnimStyle: any;
  finAnimStyle: any;
  eyeAnimStyle: any;
  isSleeping: boolean;
  isHappy: boolean;
}) => {
  return (
    <View style={{ width: size, height }}>
      <Svg width={size} height={height} viewBox="0 0 100 70">
        <Defs>
          <LinearGradient id="fryGrad" x1="0%" y1="0%" x2="100%" y2="80%">
            <Stop offset="0%" stopColor={theme.primaryLight} />
            <Stop offset="100%" stopColor={theme.primaryDark} />
          </LinearGradient>
          <LinearGradient id="fryBelly" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <Stop offset="100%" stopColor={theme.belly} />
          </LinearGradient>
        </Defs>

        {/* Tail Fin Layer with Reanimated Anchor */}
        <Animated.View
          style={[
            styles.partContainer,
            tailAnimStyle,
            { left: "12%", top: "40%", width: "25%", height: "30%" },
          ]}
        >
          <Svg width="100%" height="100%" viewBox="0 0 25 25">
            <Path
              d="M 24 12 C 16 5 2 4 1 12 C 2 20 16 19 24 12 Z"
              fill={theme.finGradientStart}
              opacity="0.9"
            />
          </Svg>
        </Animated.View>

        {/* Fry Body */}
        <G>
          {/* Main chubby body */}
          <Ellipse cx="58" cy="35" rx="22" ry="16" fill="url(#fryGrad)" />
          {/* Soft belly */}
          <Path
            d="M 45 42 Q 58 50 72 41 Q 62 48 45 42 Z"
            fill="url(#fryBelly)"
          />
          {/* Cute Rosy Cheek */}
          <Circle cx="68" cy="40" r="4.5" fill={theme.blush} opacity="0.65" />
        </G>
      </Svg>

      {/* Pectoral Fin */}
      <Animated.View
        style={[
          styles.partContainer,
          finAnimStyle,
          { left: "54%", top: "45%", width: "16%", height: "20%" },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 20 20">
          <Path
            d="M 3 3 Q 16 8 14 18 Q 4 15 3 3 Z"
            fill={theme.finGradientEnd}
            opacity="0.85"
          />
        </Svg>
      </Animated.View>

      {/* Big Kawaii Sparkly Eye */}
      <Animated.View
        style={[
          styles.partContainer,
          eyeAnimStyle,
          { left: "64%", top: "25%", width: "20%", height: "25%" },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 20 20">
          {isHappy ? (
            // Smiling Happy Arc Eye
            <Path
              d="M 3 13 Q 10 3 17 13"
              stroke="#1A2A3A"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          ) : isSleeping ? (
            // Sleeping closed eye
            <Path
              d="M 3 10 Q 10 16 17 10"
              stroke="#1A2A3A"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            // Normal Big Anime Eye
            <G>
              <Circle cx="10" cy="10" r="7.5" fill="#1A2A3A" />
              {/* Dual White Highlights */}
              <Circle cx="7.5" cy="7.5" r="3" fill="#FFFFFF" />
              <Circle cx="13" cy="12.5" r="1.5" fill="#FFFFFF" />
            </G>
          )}
        </Svg>
      </Animated.View>

      {/* Tiny Mouth */}
      <View style={[styles.partContainer, { left: "80%", top: "44%", width: 8, height: 6 }]}>
        <Svg width="8" height="6" viewBox="0 0 8 6">
          <Path d="M 1 2 Q 5 5 7 2" stroke="#1A2A3A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </Svg>
      </View>
    </View>
  );
};

// ==========================================
// 3. JUVENILE (CLASSIC FOCUS FISH) MODEL
// ==========================================
const RenderJuvenile = ({
  theme,
  size,
  height,
  tailAnimStyle,
  finAnimStyle,
  dorsalAnimStyle,
  eyeAnimStyle,
  mouthAnimStyle,
  isSleeping,
  isHappy,
}: {
  theme: typeof THEMES.orange;
  size: number;
  height: number;
  tailAnimStyle: any;
  finAnimStyle: any;
  dorsalAnimStyle: any;
  eyeAnimStyle: any;
  mouthAnimStyle: any;
  isSleeping: boolean;
  isHappy: boolean;
}) => {
  return (
    <View style={{ width: size, height }}>
      {/* Dorsal Fin Layer */}
      <Animated.View
        style={[
          styles.partContainer,
          dorsalAnimStyle,
          { left: "32%", top: "4%", width: "36%", height: "30%" },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 50 30">
          <Defs>
            <LinearGradient id="juvDorsal" x1="0%" y1="100%" x2="0%" y2="0%">
              <Stop offset="0%" stopColor={theme.finGradientStart} />
              <Stop offset="100%" stopColor={theme.finGradientEnd} />
            </LinearGradient>
          </Defs>
          <Path
            d="M 5 28 C 14 6 36 2 48 20 C 35 22 20 26 5 28 Z"
            fill="url(#juvDorsal)"
            stroke={theme.stripe}
            strokeWidth="1.2"
          />
        </Svg>
      </Animated.View>

      {/* Caudal (Tail) Fin Layer */}
      <Animated.View
        style={[
          styles.partContainer,
          tailAnimStyle,
          { left: "5%", top: "25%", width: "32%", height: "50%" },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 45 45">
          <Defs>
            <LinearGradient id="juvTail" x1="100%" y1="50%" x2="0%" y2="50%">
              <Stop offset="0%" stopColor={theme.finGradientStart} />
              <Stop offset="100%" stopColor={theme.finGradientEnd} />
            </LinearGradient>
          </Defs>
          <Path
            d="M 40 22 C 32 8 8 2 2 12 C 10 21 10 24 2 33 C 8 43 32 37 40 22 Z"
            fill="url(#juvTail)"
            stroke={theme.stripe}
            strokeWidth="1"
            opacity="0.95"
          />
          {/* Tail fin ray lines */}
          <Path d="M 38 22 Q 20 18 6 14" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          <Path d="M 38 22 Q 22 23 8 23" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          <Path d="M 38 22 Q 20 27 6 31" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
        </Svg>
      </Animated.View>

      {/* Main Fish Torso & Body */}
      <Svg width={size} height={height} viewBox="0 0 140 95">
        <Defs>
          <LinearGradient id="juvBody" x1="20%" y1="0%" x2="80%" y2="100%">
            <Stop offset="0%" stopColor={theme.primaryLight} />
            <Stop offset="60%" stopColor={theme.primaryDark} />
            <Stop offset="100%" stopColor={theme.primaryDark} />
          </LinearGradient>
          <LinearGradient id="juvBelly" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <Stop offset="100%" stopColor={theme.belly} />
          </LinearGradient>
        </Defs>

        {/* Ventral Pelvic Fin */}
        <Path
          d="M 68 68 Q 62 82 52 84 Q 58 74 62 67 Z"
          fill={theme.finGradientEnd}
          opacity="0.9"
        />

        {/* Hydrodynamic Streamlined Body Path */}
        <Path
          d="M 34 46 C 42 22 84 18 116 38 C 126 44 126 52 116 58 C 84 76 42 72 34 46 Z"
          fill="url(#juvBody)"
        />

        {/* Soft Pearlescent Belly Curve */}
        <Path
          d="M 44 54 C 62 70 94 66 112 55 C 95 62 60 64 44 54 Z"
          fill="url(#juvBelly)"
        />

        {/* Iconic Clownfish / Tropical White Band 1 (Mid-body) */}
        <Path
          d="M 66 22 C 71 36 71 58 66 70 C 72 68 76 65 76 25 C 72 23 68 22 66 22 Z"
          fill={theme.stripe}
          opacity="0.95"
        />
        {/* Band 2 (Near Tail) */}
        <Path
          d="M 44 32 C 47 40 47 52 44 60 C 48 58 50 56 50 36 C 48 34 45 33 44 32 Z"
          fill={theme.stripe}
          opacity="0.9"
        />

        {/* Rosy Cheek */}
        <Circle cx="98" cy="52" r="5.5" fill={theme.blush} opacity="0.6" />

        {/* Dorsal Gleam Highlight */}
        <Path
          d="M 55 27 C 72 23 94 28 108 36"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>

      {/* Pectoral Fin Layer (Front fluttering fin) */}
      <Animated.View
        style={[
          styles.partContainer,
          finAnimStyle,
          { left: "55%", top: "45%", width: "20%", height: "28%" },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 30 30">
          <Defs>
            <LinearGradient id="juvPec" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={theme.finGradientStart} />
              <Stop offset="100%" stopColor={theme.finGradientEnd} />
            </LinearGradient>
          </Defs>
          <Path
            d="M 4 5 C 18 10 28 20 22 28 C 12 28 6 18 4 5 Z"
            fill="url(#juvPec)"
            stroke={theme.stripe}
            strokeWidth="0.8"
            opacity="0.9"
          />
          <Path d="M 6 8 Q 16 16 18 24" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none" />
        </Svg>
      </Animated.View>

      {/* Lively Eye */}
      <Animated.View
        style={[
          styles.partContainer,
          eyeAnimStyle,
          { left: "68%", top: "28%", width: "16%", height: "24%" },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 24 24">
          {isHappy ? (
            <Path
              d="M 4 16 Q 12 4 20 16"
              stroke="#132332"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          ) : isSleeping ? (
            <Path
              d="M 4 12 Q 12 18 20 12"
              stroke="#132332"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <G>
              <Circle cx="12" cy="12" r="9" fill="#132332" />
              {/* Highlight 1 */}
              <Circle cx="9" cy="9" r="3.6" fill="#FFFFFF" />
              {/* Highlight 2 */}
              <Circle cx="15.5" cy="15" r="1.8" fill="#FFFFFF" />
            </G>
          )}
        </Svg>
      </Animated.View>

      {/* Expressive Mouth */}
      <Animated.View
        style={[
          styles.partContainer,
          mouthAnimStyle,
          { left: "84%", top: "48%", width: "8%", height: "10%" },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 12 12">
          <Path
            d="M 2 4 Q 8 8 10 4"
            stroke="#132332"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

// ==========================================
// 4. ADULT (MAJESTIC KOI / BETTA) MODEL
// ==========================================
const RenderAdult = ({
  theme,
  size,
  height,
  tailAnimStyle,
  finAnimStyle,
  dorsalAnimStyle,
  eyeAnimStyle,
  mouthAnimStyle,
  isSleeping,
  isHappy,
}: {
  theme: typeof THEMES.orange;
  size: number;
  height: number;
  tailAnimStyle: any;
  finAnimStyle: any;
  dorsalAnimStyle: any;
  eyeAnimStyle: any;
  mouthAnimStyle: any;
  isSleeping: boolean;
  isHappy: boolean;
}) => {
  return (
    <View style={{ width: size, height }}>
      {/* Majestic Flowing Dorsal Veil */}
      <Animated.View
        style={[
          styles.partContainer,
          dorsalAnimStyle,
          { left: "26%", top: "1%", width: "45%", height: "34%" },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 65 35">
          <Defs>
            <LinearGradient id="adultDorsal" x1="0%" y1="100%" x2="0%" y2="0%">
              <Stop offset="0%" stopColor={theme.finGradientStart} />
              <Stop offset="70%" stopColor={theme.finGradientEnd} />
              <Stop offset="100%" stopColor={theme.accentGlow} />
            </LinearGradient>
          </Defs>
          <Path
            d="M 4 32 C 15 4 48 2 62 24 C 45 28 25 32 4 32 Z"
            fill="url(#adultDorsal)"
            opacity="0.9"
          />
          {/* Fin ray ribbing */}
          <Path d="M 12 32 Q 25 10 32 5" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          <Path d="M 26 32 Q 38 12 48 9" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          <Path d="M 40 32 Q 48 18 58 16" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
        </Svg>
      </Animated.View>

      {/* Large Flowing Caudal (Tail) Fin Veil */}
      <Animated.View
        style={[
          styles.partContainer,
          tailAnimStyle,
          { left: "0%", top: "10%", width: "42%", height: "80%" },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 60 70">
          <Defs>
            <LinearGradient id="adultTail" x1="100%" y1="50%" x2="0%" y2="50%">
              <Stop offset="0%" stopColor={theme.finGradientStart} />
              <Stop offset="60%" stopColor={theme.finGradientEnd} />
              <Stop offset="100%" stopColor={theme.accentGlow} />
            </LinearGradient>
          </Defs>
          <Path
            d="M 56 35 C 44 14 18 2 4 12 C 14 26 14 44 4 58 C 18 68 44 56 56 35 Z"
            fill="url(#adultTail)"
            opacity="0.92"
          />
          {/* Trailing lace frills on tail edge */}
          <Path
            d="M 4 12 Q 10 22 6 35 Q 12 48 4 58"
            stroke={theme.stripe}
            strokeWidth="1.2"
            fill="none"
          />
          {/* Flowing rays */}
          <Path d="M 52 35 Q 32 20 10 16" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          <Path d="M 52 35 Q 30 35 10 35" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          <Path d="M 52 35 Q 32 50 10 54" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
        </Svg>
      </Animated.View>

      {/* Adult Body Canvas */}
      <Svg width={size} height={height} viewBox="0 0 150 100">
        <Defs>
          <LinearGradient id="adultBody" x1="20%" y1="0%" x2="80%" y2="100%">
            <Stop offset="0%" stopColor={theme.primaryLight} />
            <Stop offset="50%" stopColor={theme.primaryDark} />
            <Stop offset="100%" stopColor={theme.primaryDark} />
          </LinearGradient>
          <RadialGradient id="goldCrown" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={theme.accentGlow} />
            <Stop offset="100%" stopColor={theme.secondary} />
          </RadialGradient>
        </Defs>

        {/* Ventral Flowing Ribbons */}
        <Path
          d="M 75 72 C 68 92 50 96 42 94 C 54 84 62 76 70 70 Z"
          fill={theme.finGradientEnd}
          opacity="0.85"
        />

        {/* Sleek Majestic Body */}
        <Path
          d="M 38 48 C 48 20 95 18 128 38 C 138 44 138 54 128 60 C 95 80 48 76 38 48 Z"
          fill="url(#adultBody)"
        />

        {/* Koi Golden Spot Pattern */}
        <Path
          d="M 72 26 Q 84 22 92 30 Q 86 42 74 38 Z"
          fill="url(#goldCrown)"
          opacity="0.9"
        />
        <Circle cx="108" cy="38" r="4.5" fill="url(#goldCrown)" opacity="0.85" />

        {/* Shimmering Scale Textures */}
        <Path d="M 64 42 Q 68 38 72 42" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" fill="none" />
        <Path d="M 74 46 Q 78 42 82 46" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" fill="none" />
        <Path d="M 84 42 Q 88 38 92 42" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" fill="none" />

        {/* Pearlescent Belly */}
        <Path
          d="M 52 56 C 72 74 106 70 124 58 C 105 66 70 66 52 56 Z"
          fill="#FFFFFF"
          opacity="0.3"
        />

        {/* Royal Whisker / Barbel */}
        <Path
          d="M 132 54 Q 138 60 144 58"
          stroke={theme.accentGlow}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>

      {/* Flowing Pectoral Fin */}
      <Animated.View
        style={[
          styles.partContainer,
          finAnimStyle,
          { left: "56%", top: "48%", width: "24%", height: "32%" },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 35 35">
          <Defs>
            <LinearGradient id="adultPec" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={theme.finGradientStart} />
              <Stop offset="100%" stopColor={theme.finGradientEnd} />
            </LinearGradient>
          </Defs>
          <Path
            d="M 4 4 C 20 8 32 22 26 32 C 14 32 6 20 4 4 Z"
            fill="url(#adultPec)"
            opacity="0.9"
          />
          <Path d="M 6 8 Q 18 18 20 28" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" />
        </Svg>
      </Animated.View>

      {/* Royal Eye */}
      <Animated.View
        style={[
          styles.partContainer,
          eyeAnimStyle,
          { left: "70%", top: "30%", width: "16%", height: "24%" },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 24 24">
          {isHappy ? (
            <Path
              d="M 4 16 Q 12 4 20 16"
              stroke="#0C1B2A"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          ) : isSleeping ? (
            <Path
              d="M 4 12 Q 12 18 20 12"
              stroke="#0C1B2A"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <G>
              <Circle cx="12" cy="12" r="9" fill="#0C1B2A" />
              {/* Golden Iris Ring */}
              <Circle cx="12" cy="12" r="7" stroke={theme.accentGlow} strokeWidth="1" fill="none" />
              {/* Highlights */}
              <Circle cx="9" cy="9" r="3.4" fill="#FFFFFF" />
              <Circle cx="15.5" cy="14.5" r="1.6" fill="#FFFFFF" />
            </G>
          )}
        </Svg>
      </Animated.View>

      {/* Mouth */}
      <Animated.View
        style={[
          styles.partContainer,
          mouthAnimStyle,
          { left: "86%", top: "49%", width: "8%", height: "10%" },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 12 12">
          <Path
            d="M 2 4 Q 8 8 11 4"
            stroke="#0C1B2A"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  touchTarget: {
    alignItems: "center",
    justifyContent: "center",
  },
  fishBodyContainer: {
    position: "relative",
  },
  partContainer: {
    position: "absolute",
  },
  focusAura: {
    position: "absolute",
    borderRadius: 9999,
    backgroundColor: "rgba(56, 189, 248, 0.18)",
    borderWidth: 2,
    borderColor: "rgba(186, 230, 253, 0.4)",
    shadowColor: "#38bdf8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
  },
  speechBubble: {
    position: "absolute",
    top: -44,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(224, 242, 254, 0.9)",
    shadowColor: "#0284c7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 30,
  },
  speechText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0369a1",
  },
  speechArrow: {
    position: "absolute",
    bottom: -6,
    alignSelf: "center",
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgba(255, 255, 255, 0.95)",
  },
  heartsContainer: {
    position: "absolute",
    top: -24,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 30,
  },
  heartIcon: {
    fontSize: 22,
  },
  heartSmall: {
    fontSize: 16,
    marginLeft: -4,
    marginTop: -8,
  },
  zzzContainer: {
    position: "absolute",
    top: -24,
    right: 4,
    flexDirection: "row",
    alignItems: "flex-end",
    zIndex: 30,
  },
  zzzText1: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#38bdf8",
    opacity: 0.7,
  },
  zzzText2: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0284c7",
    marginLeft: 2,
    marginBottom: 6,
    opacity: 0.85,
  },
  zzzText3: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0369a1",
    marginLeft: 3,
    marginBottom: 12,
  },
});

export default Fish;
