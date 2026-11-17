import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import {
  ShellHomeIcon,
  BubbleTimerIcon,
  ScrollQuestIcon,
  CoralStatsIcon,
  DiverProfileIcon,
  FoodBowlIcon,
  PlayPauseIcon,
} from "./ui/AquaticIcons";

let RiveViewComponent: any = null;
let useRiveFileHook: any = null;
let FitEnum: any = null;

try {
  const RivePackage = require("@rive-app/react-native");
  RiveViewComponent = RivePackage.RiveView;
  useRiveFileHook = RivePackage.useRiveFile;
  FitEnum = RivePackage.Fit;
} catch (e) {
  RiveViewComponent = null;
  useRiveFileHook = null;
}

export type RiveArtboardName =
  | "ShellHome"
  | "BubbleTimer"
  | "ScrollQuest"
  | "CoralStats"
  | "DiverProfile"
  | "FoodBowl"
  | "PlayPause";

interface RiveIconProps {
  artboard: RiveArtboardName;
  size?: number;
  active?: boolean;
  count?: number; // for food bowl
  style?: StyleProp<ViewStyle>;
}

const RiveRenderer: React.FC<{
  artboard: RiveArtboardName;
  size: number;
  active?: boolean;
}> = ({ artboard, size, active }) => {
  const { riveFile } = useRiveFileHook(require("../../assets/rive/ui.riv"));

  if (!riveFile) {
    return null;
  }

  return (
    <RiveViewComponent
      file={riveFile}
      artboardName={artboard}
      animationName="idle"
      autoPlay={true}
      fit={FitEnum ? FitEnum.Contain : undefined}
      style={{ width: size, height: size }}
    />
  );
};

export const RiveIcon: React.FC<RiveIconProps> = ({
  artboard,
  size = 28,
  active = false,
  count = 5,
  style,
}) => {
  // Use high-performance, battery-friendly SVG vector micro-interactions
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {artboard === "ShellHome" && <ShellHomeIcon size={size} active={active} />}
      {artboard === "BubbleTimer" && <BubbleTimerIcon size={size} active={active} />}
      {artboard === "ScrollQuest" && <ScrollQuestIcon size={size} active={active} />}
      {artboard === "CoralStats" && <CoralStatsIcon size={size} active={active} />}
      {artboard === "DiverProfile" && <DiverProfileIcon size={size} active={active} />}
      {artboard === "FoodBowl" && <FoodBowlIcon size={size} count={count} />}
      {artboard === "PlayPause" && <PlayPauseIcon isActive={active} size={size} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
