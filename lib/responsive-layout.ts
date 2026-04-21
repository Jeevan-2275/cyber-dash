/**
 * Responsive Layout Utility System
 * Provides dynamic scaling and sizing based on screen dimensions
 * Ensures consistent gameplay and UI across all device sizes
 */

import { Dimensions } from "react-native";

export interface ScreenMetrics {
  width: number;
  height: number;
  aspectRatio: number;
  isPortrait: boolean;
  isTablet: boolean;
  scale: number; // scale factor relative to standard phone (375x812)
}

const STANDARD_PHONE_WIDTH = 375;
const STANDARD_PHONE_HEIGHT = 812;
const TABLET_THRESHOLD = 600; // width >= 600 is considered tablet

/**
 * Get current screen metrics with responsive calculations
 */
export function getScreenMetrics(): ScreenMetrics {
  const { width, height } = Dimensions.get("window");
  const aspectRatio = width / height;
  const isPortrait = height > width;
  const isTablet = width >= TABLET_THRESHOLD;

  // Calculate scale factor based on standard phone dimensions
  const standardDiagonal = Math.sqrt(STANDARD_PHONE_WIDTH ** 2 + STANDARD_PHONE_HEIGHT ** 2);
  const currentDiagonal = Math.sqrt(width ** 2 + height ** 2);
  const scale = currentDiagonal / standardDiagonal;

  return {
    width,
    height,
    aspectRatio,
    isPortrait,
    isTablet,
    scale,
  };
}

/**
 * Scale a value based on screen size
 * @param baseValue - value for standard phone (375x812)
 * @param metrics - screen metrics
 * @returns scaled value
 */
export function scaleValue(baseValue: number, metrics: ScreenMetrics): number {
  return baseValue * metrics.scale;
}

/**
 * Calculate responsive font size
 * @param baseFontSize - font size for standard phone
 * @param metrics - screen metrics
 * @returns responsive font size
 */
export function responsiveFontSize(baseFontSize: number, metrics: ScreenMetrics): number {
  // Font scales slightly less aggressively than other elements
  return Math.round(baseFontSize * Math.sqrt(metrics.scale));
}

/**
 * Calculate responsive padding/margin
 * @param baseValue - value for standard phone
 * @param metrics - screen metrics
 * @returns responsive padding/margin
 */
export function responsiveSpacing(baseValue: number, metrics: ScreenMetrics): number {
  return Math.round(baseValue * metrics.scale);
}

/**
 * Calculate player size based on screen
 * @param metrics - screen metrics
 * @returns { width, height }
 */
export function getPlayerSize(metrics: ScreenMetrics): { width: number; height: number } {
  // Base player size for standard phone
  const baseWidth = 30;
  const baseHeight = 40;

  // Scale based on screen size, but ensure minimum size
  const width = Math.max(Math.round(baseWidth * metrics.scale), 20);
  const height = Math.max(Math.round(baseHeight * metrics.scale), 25);

  return { width, height };
}

/**
 * Calculate obstacle size based on screen
 * @param metrics - screen metrics
 * @param type - obstacle type
 * @returns { width, height }
 */
export function getObstacleSize(
  metrics: ScreenMetrics,
  type: "wall" | "gap" | "moving" = "wall"
): { width: number; height: number } {
  // Base obstacle sizes for standard phone
  let baseWidth = 60;
  let baseHeight = 100;

  if (type === "gap") {
    baseWidth = 80;
    baseHeight = 120;
  } else if (type === "moving") {
    baseWidth = 50;
    baseHeight = 80;
  }

  // Scale based on screen size
  const width = Math.max(Math.round(baseWidth * metrics.scale), 40);
  const height = Math.max(Math.round(baseHeight * metrics.scale), 60);

  return { width, height };
}

/**
 * Calculate HUD element sizes
 * @param metrics - screen metrics
 * @returns { labelFontSize, valueFontSize, spacing }
 */
export function getHUDSizes(metrics: ScreenMetrics): {
  labelFontSize: number;
  valueFontSize: number;
  spacing: number;
} {
  return {
    labelFontSize: responsiveFontSize(12, metrics),
    valueFontSize: responsiveFontSize(20, metrics),
    spacing: responsiveSpacing(4, metrics),
  };
}

/**
 * Calculate button sizes
 * @param metrics - screen metrics
 * @returns { height, fontSize, paddingHorizontal, paddingVertical }
 */
export function getButtonSizes(metrics: ScreenMetrics): {
  height: number;
  fontSize: number;
  paddingHorizontal: number;
  paddingVertical: number;
} {
  return {
    height: Math.max(Math.round(56 * metrics.scale), 44),
    fontSize: responsiveFontSize(16, metrics),
    paddingHorizontal: responsiveSpacing(16, metrics),
    paddingVertical: responsiveSpacing(12, metrics),
  };
}

/**
 * Calculate safe area insets for notch/status bar
 * @param metrics - screen metrics
 * @returns { top, bottom, left, right }
 */
export function getSafeAreaInsets(metrics: ScreenMetrics): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  // Estimate based on screen size and aspect ratio
  // These are approximations; actual values depend on device
  const top = metrics.scale > 1.2 ? 44 : 20; // larger screens likely have notch
  const bottom = metrics.isTablet ? 0 : 34; // tablets usually don't have home indicator
  const left = 0;
  const right = 0;

  return { top, bottom, left, right };
}

/**
 * Get game area dimensions (excluding HUD)
 * @param screenMetrics - screen metrics
 * @param hudHeight - height of HUD area
 * @returns { width, height, usableHeight }
 */
export function getGameAreaDimensions(
  screenMetrics: ScreenMetrics,
  hudHeight: number = 80
): { width: number; height: number; usableHeight: number } {
  return {
    width: screenMetrics.width,
    height: screenMetrics.height - hudHeight,
    usableHeight: screenMetrics.height - hudHeight,
  };
}

/**
 * Get countdown text size
 * @param metrics - screen metrics
 * @returns font size
 */
export function getCountdownFontSize(metrics: ScreenMetrics): number {
  // Countdown should be very large
  return Math.round(80 * Math.sqrt(metrics.scale));
}

/**
 * Get pause button position and size
 * @param metrics - screen metrics
 * @returns { top, right, padding, fontSize }
 */
export function getPauseButtonLayout(metrics: ScreenMetrics): {
  top: number;
  right: number;
  padding: number;
  fontSize: number;
} {
  return {
    top: responsiveSpacing(16, metrics),
    right: responsiveSpacing(16, metrics),
    padding: responsiveSpacing(12, metrics),
    fontSize: responsiveFontSize(12, metrics),
  };
}
