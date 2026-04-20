/**
 * Level Game Over Screen
 * Shows when player collides (fails) a level
 * Allows retry or back to level select
 */

import React from "react";
import { View, Text, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import * as Haptics from "expo-haptics";

interface LevelGameOverScreenProps {
  levelId: number;
  score: number;
  onRetry: (levelId: number) => void;
  onBack: () => void;
}

export function LevelGameOverScreen({
  levelId,
  score,
  onRetry,
  onBack,
}: LevelGameOverScreenProps) {
  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRetry(levelId);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack();
  };

  return (
    <ScreenContainer className="bg-black items-center justify-center p-6" edges={["top", "left", "right", "bottom"]}>
      <View className="items-center gap-8 w-full">
        {/* Game Over Header */}
        <View className="items-center gap-4">
          <Text
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: "#FF006E",
              textShadowColor: "#FF006E",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 20,
              letterSpacing: 2,
            }}
          >
            GAME OVER
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#A0A0A0",
              letterSpacing: 1,
            }}
          >
            Level {levelId}
          </Text>
        </View>

        {/* Score Display */}
        <View className="items-center gap-2">
          <Text
            style={{
              fontSize: 14,
              color: "#A0A0A0",
              letterSpacing: 1,
            }}
          >
            SCORE
          </Text>
          <Text
            style={{
              fontSize: 40,
              fontWeight: "bold",
              color: "#00D9FF",
              textShadowColor: "#00D9FF",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            }}
          >
            {score}
          </Text>
        </View>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Action Buttons */}
        <View className="gap-4 w-full items-center">
          {/* Retry Button */}
          <Pressable
            onPress={handleRetry}
            style={({ pressed }) => ({
              paddingVertical: 16,
              paddingHorizontal: 50,
              backgroundColor: "#00D9FF",
              borderRadius: 14,
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
              transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
              shadowColor: "#00D9FF",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 20,
              elevation: 8,
            })}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#0A0E27",
                letterSpacing: 2,
              }}
            >
              RETRY
            </Text>
          </Pressable>

          {/* Back Button */}
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => ({
              paddingVertical: 16,
              paddingHorizontal: 50,
              backgroundColor: "transparent",
              borderRadius: 14,
              borderWidth: 2,
              borderColor: "#FF006E",
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
              transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
            })}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#FF006E",
                letterSpacing: 2,
              }}
            >
              BACK
              </Text>
            </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
