import React from "react";
import Svg, {
  Path,
  Circle,
  Ellipse,
  Rect,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
} from "react-native-svg";

// ==========================================
// 1. CLAM SHELL FOOD BOWL (แทนที่อีโมจิ 🍲)
// ==========================================
export const DetailedClamBowl = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Defs>
      <LinearGradient id="clamShellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FFF1F2" />
        <Stop offset="50%" stopColor="#FECDD3" />
        <Stop offset="100%" stopColor="#F43F5E" />
      </LinearGradient>
      <LinearGradient id="clamInnerGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <Stop offset="0%" stopColor="#FFE4E6" />
        <Stop offset="100%" stopColor="#FFFFFF" />
      </LinearGradient>
      <RadialGradient id="pearlShine" cx="35%" cy="35%" r="65%">
        <Stop offset="0%" stopColor="#FFFFFF" />
        <Stop offset="40%" stopColor="#FEF08A" />
        <Stop offset="100%" stopColor="#F59E0B" />
      </RadialGradient>
    </Defs>
    {/* Clam Shell Bottom */}
    <Path
      d="M 6 28 C 6 36 34 36 34 28 C 34 20 6 20 6 28 Z"
      fill="url(#clamShellGrad)"
    />
    {/* Clam Shell Top Fan */}
    <Path
      d="M 20 4 C 10 4 4 14 5 24 C 11 26 29 26 35 24 C 36 14 30 4 20 4 Z"
      fill="url(#clamInnerGrad)"
      stroke="#FDA4AF"
      strokeWidth="1.2"
    />
    {/* Fluted Shell Ribs */}
    <Path d="M 20 5 L 20 25" stroke="#FECDD3" strokeWidth="1" strokeLinecap="round" />
    <Path d="M 15 7 Q 16 16 13 25" stroke="#FECDD3" strokeWidth="0.9" />
    <Path d="M 25 7 Q 24 16 27 25" stroke="#FECDD3" strokeWidth="0.9" />
    <Path d="M 10 11 Q 12 18 8 24" stroke="#FECDD3" strokeWidth="0.8" />
    <Path d="M 30 11 Q 28 18 32 24" stroke="#FECDD3" strokeWidth="0.8" />
    {/* Golden Nutrient Food Pearls */}
    <Circle cx="16" cy="22" r="4.2" fill="url(#pearlShine)" />
    <Circle cx="24" cy="22" r="4.2" fill="url(#pearlShine)" />
    <Circle cx="20" cy="18" r="4.5" fill="url(#pearlShine)" />
    {/* Specular sparkle */}
    <Circle cx="18.5" cy="16.5" r="1.2" fill="#FFFFFF" />
  </Svg>
);

// ==========================================
// 2. DETAILED ACTION ICONS (แทนที่ 🍤, 💫, 💖)
// ==========================================

// FEED ICON (Golden Royal Sea Shrimp Nutrient)
export const DetailedFeedIcon = ({ size = 22 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Defs>
      <LinearGradient id="shrimpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FFA07A" />
        <Stop offset="50%" stopColor="#FF6347" />
        <Stop offset="100%" stopColor="#DC2626" />
      </LinearGradient>
      <RadialGradient id="planktonGlow" cx="40%" cy="40%" r="60%">
        <Stop offset="0%" stopColor="#FEF08A" />
        <Stop offset="60%" stopColor="#F59E0B" />
        <Stop offset="100%" stopColor="#B45309" />
      </RadialGradient>
    </Defs>
    {/* Curving Plump Shrimp Body */}
    <Path
      d="M 22 8 C 28 12 26 22 18 25 C 12 27 6 22 6 17 C 6 12 11 8 16 7 C 19 6 24 6 26 4 C 27 6 25 8 22 8 Z"
      fill="url(#shrimpGrad)"
    />
    {/* Shell Segments */}
    <Path d="M 15 7 Q 16 14 11 17" stroke="#FFE4E6" strokeWidth="1" strokeLinecap="round" />
    <Path d="M 18 9 Q 20 16 15 21" stroke="#FFE4E6" strokeWidth="1" strokeLinecap="round" />
    <Path d="M 21 12 Q 22 18 18 24" stroke="#FFE4E6" strokeWidth="1" strokeLinecap="round" />
    {/* Fan Tail */}
    <Path
      d="M 6 17 C 2 16 2 21 5 22 C 3 24 7 25 8 23 Z"
      fill="#F87171"
    />
    {/* Eye */}
    <Circle cx="23" cy="7" r="1.5" fill="#1E293B" />
    <Circle cx="22.5" cy="6.5" r="0.6" fill="#FFFFFF" />
    {/* Antennae */}
    <Path
      d="M 25 5 Q 30 2 31 1"
      stroke="#FECDD3"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M 26 7 Q 31 7 32 9"
      stroke="#FECDD3"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />
  </Svg>
);

// TRICK ICON (Cosmic Aquatic Whirlpool & Stardust)
export const DetailedTrickIcon = ({ size = 22 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Defs>
      <LinearGradient id="trickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#38BDF8" />
        <Stop offset="50%" stopColor="#818CF8" />
        <Stop offset="100%" stopColor="#C084FC" />
      </LinearGradient>
      <LinearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FEF08A" />
        <Stop offset="100%" stopColor="#F59E0B" />
      </LinearGradient>
    </Defs>
    {/* Orbiting Orbital Ring 1 */}
    <Ellipse
      cx="16"
      cy="16"
      rx="12"
      ry="5.5"
      transform="rotate(-28 16 16)"
      fill="none"
      stroke="url(#trickGrad)"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    {/* Orbiting Orbital Ring 2 */}
    <Ellipse
      cx="16"
      cy="16"
      rx="12"
      ry="5.5"
      transform="rotate(45 16 16)"
      fill="none"
      stroke="url(#trickGrad)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeDasharray="4 2"
    />
    {/* Center 4-Point Starlight */}
    <Path
      d="M 16 7 Q 16 16 7 16 Q 16 16 16 25 Q 16 16 25 16 Q 16 16 16 7 Z"
      fill="url(#starGrad)"
    />
    <Circle cx="16" cy="16" r="2.2" fill="#FFFFFF" />
    {/* Ambient Micro-Stars */}
    <Circle cx="7" cy="8" r="1.5" fill="#FEF08A" />
    <Circle cx="26" cy="23" r="1.2" fill="#FEF08A" />
    <Circle cx="25" cy="8" r="1.8" fill="#FFFFFF" />
  </Svg>
);

// PET ICON (Radiant Mother-of-Pearl Heart)
export const DetailedPetIcon = ({ size = 22 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32">
    <Defs>
      <LinearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FB7185" />
        <Stop offset="50%" stopColor="#F43F5E" />
        <Stop offset="100%" stopColor="#BE123C" />
      </LinearGradient>
      <RadialGradient id="heartGlow" cx="30%" cy="30%" r="70%">
        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <Stop offset="50%" stopColor="#FDA4AF" stopOpacity="0.2" />
        <Stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
      </RadialGradient>
    </Defs>
    {/* Outer Glow Halo */}
    <Path
      d="M 16 28 C 16 28 4 20 4 11 C 4 6 8 3 12.5 3 C 14.5 3 15.5 4 16 5.2 C 16.5 4 17.5 3 19.5 3 C 24 3 28 6 28 11 C 28 20 16 28 16 28 Z"
      fill="url(#heartGrad)"
    />
    {/* Specular Inner Glaze */}
    <Path
      d="M 16 26 C 16 26 6 19 6 11.5 C 6 7.5 9 5 12.5 5 C 14.2 5 15.2 6 16 7 C 16.8 6 17.8 5 19.5 5 C 23 5 26 7.5 26 11.5 C 26 19 16 26 16 26 Z"
      fill="url(#heartGlow)"
    />
    {/* Cute Heart Highlight Arc */}
    <Path
      d="M 8 10 C 8 7 11 6 13 6"
      stroke="#FFFFFF"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Little Sparkle */}
    <Circle cx="22" cy="9" r="1.5" fill="#FFFFFF" />
  </Svg>
);

// ==========================================
// 3. STAT & HUD DETAILED ASSETS
// ==========================================

// NAUTICAL EXPLORER COMPASS (แทนที่ 🎯)
export const DetailedCompassIcon = ({ size = 26 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 36 36">
    <Defs>
      <LinearGradient id="brassOuter" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FDE047" />
        <Stop offset="50%" stopColor="#D97706" />
        <Stop offset="100%" stopColor="#78350F" />
      </LinearGradient>
      <LinearGradient id="dialInner" x1="0%" y1="0%" x2="0%" y2="100%">
        <Stop offset="0%" stopColor="#0F172A" />
        <Stop offset="100%" stopColor="#1E293B" />
      </LinearGradient>
    </Defs>
    {/* Brass Outer Casing */}
    <Circle cx="18" cy="18" r="16" fill="url(#brassOuter)" />
    <Circle cx="18" cy="18" r="13.5" fill="url(#dialInner)" stroke="#FDE047" strokeWidth="1" />
    {/* Degree Ticks */}
    <Path d="M 18 6 L 18 9" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M 18 27 L 18 30" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M 6 18 L 9 18" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
    <Path d="M 27 18 L 30 18" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
    {/* Compass Needle - North (Red) */}
    <Path d="M 18 8 L 21 18 L 18 16 L 15 18 Z" fill="#EF4444" />
    {/* Compass Needle - South (Silver) */}
    <Path d="M 18 28 L 21 18 L 18 20 L 15 18 Z" fill="#E2E8F0" />
    {/* Center Pivot Pivot */}
    <Circle cx="18" cy="18" r="2.5" fill="#FBBF24" />
    <Circle cx="18" cy="18" r="1" fill="#FFFFFF" />
  </Svg>
);

// AQUATIC FOCUS FLAME (แทนที่ 🔥)
export const DetailedAquaFlame = ({ size = 26 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 36 36">
    <Defs>
      <LinearGradient id="flameOuter" x1="0%" y1="100%" x2="0%" y2="0%">
        <Stop offset="0%" stopColor="#EA580C" />
        <Stop offset="50%" stopColor="#F97316" />
        <Stop offset="100%" stopColor="#FBBF24" />
      </LinearGradient>
      <LinearGradient id="flameInner" x1="0%" y1="100%" x2="0%" y2="0%">
        <Stop offset="0%" stopColor="#38BDF8" />
        <Stop offset="60%" stopColor="#E0F2FE" />
        <Stop offset="100%" stopColor="#FFFFFF" />
      </LinearGradient>
    </Defs>
    {/* Outer Fiery Wave */}
    <Path
      d="M 18 3 C 21 8 28 12 28 20 C 28 26 23.5 31 18 31 C 12.5 31 8 26 8 20 C 8 13 14 9 16 5 C 16 8 18 8 18 3 Z"
      fill="url(#flameOuter)"
    />
    {/* Inner Aquatic Core Soul */}
    <Path
      d="M 18 15 C 20 18 23 21 23 25 C 23 28.5 20.8 30 18 30 C 15.2 30 13 28.5 13 25 C 13 22 16 19 17 17 C 17 18 18 18 18 15 Z"
      fill="url(#flameInner)"
    />
    {/* Ember Spark */}
    <Circle cx="18" cy="2" r="1.2" fill="#FEF08A" />
  </Svg>
);

// DEEP SEA TIMER PEARL (แทนที่ ⏱️)
export const DetailedTimerPearl = ({ size = 26 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 36 36">
    <Defs>
      <LinearGradient id="chronometerRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#38BDF8" />
        <Stop offset="50%" stopColor="#0284C7" />
        <Stop offset="100%" stopColor="#0C4A6E" />
      </LinearGradient>
      <RadialGradient id="pearlDial" cx="40%" cy="35%" r="65%">
        <Stop offset="0%" stopColor="#FFFFFF" />
        <Stop offset="70%" stopColor="#E0F2FE" />
        <Stop offset="100%" stopColor="#BAE6FD" />
      </RadialGradient>
    </Defs>
    {/* Top Chrono Button */}
    <Rect x="15" y="2" width="6" height="4" rx="2" fill="#0284C7" />
    {/* Outer Shell */}
    <Circle cx="18" cy="20" r="14" fill="url(#chronometerRim)" />
    <Circle cx="18" cy="20" r="11.5" fill="url(#pearlDial)" />
    {/* Clock Ticks */}
    <Circle cx="18" cy="11" r="1" fill="#0284C7" />
    <Circle cx="27" cy="20" r="1" fill="#0284C7" />
    <Circle cx="18" cy="29" r="1" fill="#0284C7" />
    <Circle cx="9" cy="20" r="1" fill="#0284C7" />
    {/* Clock Hands */}
    <Path d="M 18 20 L 18 13" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
    <Path d="M 18 20 L 23 20" stroke="#FF7A59" strokeWidth="1.8" strokeLinecap="round" />
    <Circle cx="18" cy="20" r="2" fill="#0F172A" />
    <Circle cx="18" cy="20" r="0.8" fill="#FFFFFF" />
  </Svg>
);

// NAUTICAL EXPLORER JOURNAL (แทนที่ 📖 / 📜)
export const DetailedJournalDex = ({ size = 26 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 36 36">
    <Defs>
      <LinearGradient id="leatherCover" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#1E3E62" />
        <Stop offset="60%" stopColor="#0B192C" />
        <Stop offset="100%" stopColor="#040D1A" />
      </LinearGradient>
      <LinearGradient id="parchmentPages" x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor="#FEF3C7" />
        <Stop offset="100%" stopColor="#FDE68A" />
      </LinearGradient>
    </Defs>
    {/* Leather Book Back */}
    <Path
      d="M 7 5 C 7 5 10 3 18 3 C 26 3 29 5 29 5 L 29 29 C 29 29 26 27 18 27 C 10 27 7 29 7 29 Z"
      fill="url(#leatherCover)"
      stroke="#38BDF8"
      strokeWidth="1.2"
    />
    {/* Parchment Left Page */}
    <Path
      d="M 8 6 C 11 5 15 5 17.5 7 L 17.5 27 C 15 25 11 25 8 26 Z"
      fill="url(#parchmentPages)"
    />
    {/* Parchment Right Page */}
    <Path
      d="M 28 6 C 25 5 21 5 18.5 7 L 18.5 27 C 21 25 25 25 28 26 Z"
      fill="url(#parchmentPages)"
    />
    {/* Gold Fish Crest on Book */}
    <Path
      d="M 12 14 C 15 12 15 16 12 18 C 15 16 16 14 12 14 Z"
      fill="#F59E0B"
    />
    {/* Bookmark Ribbon */}
    <Path
      d="M 17.5 3 L 17.5 32 L 20 29 L 22.5 32 L 22.5 7"
      fill="#EF4444"
    />
  </Svg>
);

// VINTAGE DIVER HELMET (แทนที่ 🧑‍🚀 / ⚙️)
export const DetailedDiverHelmet = ({ size = 30 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 40 40">
    <Defs>
      <LinearGradient id="brassDome" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FDE047" />
        <Stop offset="40%" stopColor="#D97706" />
        <Stop offset="100%" stopColor="#78350F" />
      </LinearGradient>
      <RadialGradient id="viewGlass" cx="35%" cy="35%" r="65%">
        <Stop offset="0%" stopColor="#E0F2FE" />
        <Stop offset="50%" stopColor="#38BDF8" />
        <Stop offset="100%" stopColor="#0369A1" />
      </RadialGradient>
    </Defs>
    {/* Helmet Dome */}
    <Path
      d="M 9 24 C 7 13 13 4 20 4 C 27 4 33 13 31 24 C 33 26 33 30 31 32 C 28 35 12 35 9 32 C 7 30 7 26 9 24 Z"
      fill="url(#brassDome)"
    />
    {/* Collar Neck Ring */}
    <Path
      d="M 7 32 C 10 30 30 30 33 32 C 34 35 32 38 20 38 C 8 38 6 35 7 32 Z"
      fill="#B45309"
      stroke="#FDE047"
      strokeWidth="1"
    />
    {/* Central Round Viewport */}
    <Circle cx="20" cy="18" r="8.5" fill="#78350F" stroke="#FDE047" strokeWidth="1.5" />
    <Circle cx="20" cy="18" r="6.5" fill="url(#viewGlass)" />
    {/* Window Glare */}
    <Path
      d="M 16 14 Q 21 13 23 16"
      stroke="#FFFFFF"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    {/* Side Grated Windows */}
    <Rect x="8" y="15" width="2.5" height="6" rx="1.2" fill="#78350F" stroke="#FDE047" strokeWidth="0.8" />
    <Rect x="29.5" y="15" width="2.5" height="6" rx="1.2" fill="#78350F" stroke="#FDE047" strokeWidth="0.8" />
  </Svg>
);

// ==========================================
// 4. DETAILED AQUARIUM ENVIRONMENT (CORAL & FLORA)
// ==========================================

export const DetailedCoralCluster = ({ width = 120, height = 90 }: { width?: number; height?: number }) => (
  <Svg width={width} height={height} viewBox="0 0 120 90">
    <Defs>
      <LinearGradient id="purpleCoral" x1="0%" y1="100%" x2="0%" y2="0%">
        <Stop offset="0%" stopColor="#4C1D95" />
        <Stop offset="60%" stopColor="#7C3AED" />
        <Stop offset="100%" stopColor="#C4B5FD" />
      </LinearGradient>
      <LinearGradient id="orangeCoral" x1="0%" y1="100%" x2="0%" y2="0%">
        <Stop offset="0%" stopColor="#9A3412" />
        <Stop offset="60%" stopColor="#EA580C" />
        <Stop offset="100%" stopColor="#FDBA74" />
      </LinearGradient>
      <LinearGradient id="seaAnemone" x1="0%" y1="100%" x2="0%" y2="0%">
        <Stop offset="0%" stopColor="#047857" />
        <Stop offset="60%" stopColor="#10B981" />
        <Stop offset="100%" stopColor="#6EE7B7" />
      </LinearGradient>
    </Defs>
    {/* Left Antler Coral Branch */}
    <Path
      d="M 20 90 L 22 55 Q 16 45 12 40 Q 14 36 18 42 Q 22 30 26 25 Q 30 26 28 35 Q 34 32 38 28 Q 40 32 34 38 Q 30 52 26 90 Z"
      fill="url(#purpleCoral)"
    />
    {/* Center Brain Coral Dome */}
    <Path
      d="M 35 90 C 30 70 45 55 60 55 C 75 55 90 70 85 90 Z"
      fill="url(#orangeCoral)"
    />
    <Path
      d="M 45 78 Q 50 65 60 70 Q 70 75 75 68"
      stroke="#FFEDD5"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M 42 85 Q 55 80 65 84 Q 72 82 78 86"
      stroke="#FFEDD5"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="none"
    />
    {/* Right Sea Anemone Fronds */}
    <Path
      d="M 80 90 Q 75 60 88 45 Q 92 48 88 65 Q 95 50 102 38 Q 106 42 98 62 Q 108 55 114 48 Q 116 52 106 68 Q 98 80 92 90 Z"
      fill="url(#seaAnemone)"
    />
    {/* Tiny Bioluminescent Coral Nodes */}
    <Circle cx="12" cy="40" r="2" fill="#E9D5FF" />
    <Circle cx="26" cy="25" r="2" fill="#E9D5FF" />
    <Circle cx="38" cy="28" r="2" fill="#E9D5FF" />
    <Circle cx="88" cy="45" r="2.2" fill="#A7F3D0" />
    <Circle cx="102" cy="38" r="2.2" fill="#A7F3D0" />
    <Circle cx="114" cy="48" r="2.2" fill="#A7F3D0" />
  </Svg>
);

// ==========================================
// 5. TIMER CONTROLS VECTOR ICONS (แทนที่อีโมจิ ⏸️, 🔄, 💤)
// ==========================================

export const DetailedPauseIcon = ({
  size = 20,
  color = "#FFFFFF",
}: {
  size?: number;
  color?: string;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="6.5" y="4.5" width="3.6" height="15" rx="1.8" fill={color} />
    <Rect x="13.9" y="4.5" width="3.6" height="15" rx="1.8" fill={color} />
  </Svg>
);

export const DetailedPlayIcon = ({
  size = 20,
  color = "#0284C7",
}: {
  size?: number;
  color?: string;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M 8 5.2 C 6.8 4.5 5.5 5.3 5.5 6.7 L 5.5 17.3 C 5.5 18.7 6.8 19.5 8 18.8 L 17.8 13.5 C 18.9 12.9 18.9 11.1 17.8 10.5 Z"
      fill={color}
    />
  </Svg>
);

export const DetailedResetIcon = ({
  size = 22,
  color = "#FFFFFF",
}: {
  size?: number;
  color?: string;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Circular Refresh Track */}
    <Path
      d="M 12 4.5 C 7.8 4.5 4.5 7.8 4.5 12 C 4.5 16.2 7.8 19.5 12 19.5 C 15.6 19.5 18.6 17 19.3 13.5"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    {/* Arrow Tip */}
    <Path
      d="M 12 1.8 L 12 7.2 L 17 4.5 Z"
      fill={color}
    />
  </Svg>
);

export const DetailedSleepBreakIcon = ({
  size = 22,
  color = "#FFFFFF",
}: {
  size?: number;
  color?: string;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Sleek Crescent Moon */}
    <Path
      d="M 15 3 C 10 4.2 6.5 8.6 6.5 13.5 C 6.5 19 11 23.5 16.5 23.5 C 18.8 23.5 21 22.7 22.5 21.2 C 16.8 20.8 12.5 16.5 12.5 10.8 C 12.5 7.5 14 4.5 16.2 2.6 C 15.8 2.8 15.4 2.9 15 3 Z"
      fill={color}
    />
    {/* Tiny Dream Starlight */}
    <Circle cx="19" cy="6" r="1.4" fill={color} opacity="0.9" />
    <Circle cx="21" cy="11.5" r="1" fill={color} opacity="0.75" />
  </Svg>
);
