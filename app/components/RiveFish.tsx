import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Fish, FishProps } from "./Fish";

// Attempt to load Rive runtime (available in Development Builds and Production Builds)
let RiveViewComponent: any = null;
let useRiveFileHook: any = null;
let FitEnum: any = null;

try {
  const RivePackage = require("@rive-app/react-native");
  RiveViewComponent = RivePackage.RiveView;
  useRiveFileHook = RivePackage.useRiveFile;
  FitEnum = RivePackage.Fit;
} catch (e) {
  // Graceful fallback when running in environments without native Nitro modules (e.g. standard Expo Go)
  RiveViewComponent = null;
  useRiveFileHook = null;
}

export interface RiveFishProps extends FishProps {
  useRive?: boolean;
}

interface RiveRendererProps {
  size: number;
  mood?: string;
  stage?: string;
}

const RiveRenderer: React.FC<RiveRendererProps> = ({ size, mood = "idle" }) => {
  const { riveFile } = useRiveFileHook(require("../../assets/rive/fish.riv"));

  if (!riveFile) {
    return null;
  }

  // Map mood prop to Rive linear animation name:
  // Available in FocusFish: "idle", "happy", "eating", "sleeping", "focus"
  const validAnimations = ["idle", "happy", "eating", "sleeping", "focus"];
  const animName = validAnimations.includes(mood) ? mood : "idle";

  return (
    <RiveViewComponent
      file={riveFile}
      artboardName="FocusFish"
      animationName={animName}
      autoPlay={true}
      fit={FitEnum ? FitEnum.Contain : undefined}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export const RiveFish: React.FC<RiveFishProps> = (props) => {
  // Always use the smooth SVG Fish to eliminate low-poly faceted edges ("เหลี่ยมๆ") and bone rig gizmos
  return <Fish {...props} />;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RiveFish;
