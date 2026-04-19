/**
 * Level Complete Screen
 * Shows level completion results, rewards, and progression
 */

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { getLevelById, getThemeColors } from "@/lib/level-system";

interface LevelCompleteScreenProps {
  levelId: number;
  score: number;
  stars: number;
  onNextLevel: () => void;
  onRetry: () => void;
  onBack: () => void;
}

export function LevelCompleteScreen({
  levelId,
  score,
  stars,
  onNextLevel,
  onRetry,
  onBack,
}: LevelCompleteScreenProps) {
  const level = getLevelById(levelId);
  if (!level) return null;

  const themeColors = getThemeColors(level.theme);
  const [animatedStars, setAnimatedStars] = useState(0);

  useEffect(() => {
    // Animate stars
    const timer = setTimeout(() => setAnimatedStars(stars), 300);
    return () => clearTimeout(timer);
  }, [stars]);

  const baseCoins = level.baseCoins;
  const noCrashBonus = score >= baseCoins ? level.noCrashBonus : 0;
  const highScoreBonus = score >= baseCoins * 1.5 ? level.highScoreBonus : 0;
  const totalCoins = baseCoins + noCrashBonus + highScoreBonus;

  return (
    <ScreenContainer className="bg-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 items-center justify-center gap-6 px-6 py-8">
          {/* Level Complete Header */}
          <View className="items-center gap-2">
            <Text
              style={{
                color: themeColors.primary,
                fontSize: 32,
                fontWeight: "bold",
                textShadowColor: themeColors.primary,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 10,
              }}
            >
              LEVEL COMPLETE!
            </Text>
            <Text
              style={{
                color: themeColors.secondary,
                fontSize: 18,
              }}
            >
              {level.name}
            </Text>
          </View>

          {/* Stars Display */}
          <View className="items-center gap-2">
            <View className="flex-row gap-2">
              {[1, 2, 3].map((i) => (
                <Text
                  key={i}
                  style={{
                    fontSize: 40,
                    opacity: i <= animatedStars ? 1 : 0.2,
                  }}
                >
                  ⭐
                </Text>
              ))}
            </View>
            <Text
              style={{
                color: "#FFFF00",
                fontSize: 14,
                fontWeight: "bold",
              }}
            >
              {animatedStars} / 3 Stars
            </Text>
          </View>

          {/* Score Display */}
          <View
            style={{
              width: "100%",
              backgroundColor: "rgba(0, 255, 255, 0.1)",
              borderWidth: 2,
              borderColor: themeColors.primary,
              borderRadius: 12,
              padding: 16,
            }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text style={{ color: themeColors.primary, fontSize: 14 }}>
                Score
              </Text>
              <Text
                style={{
                  color: themeColors.primary,
                  fontSize: 24,
                  fontWeight: "bold",
                  textShadowColor: themeColors.primary,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 5,
                }}
              >
                {score}
              </Text>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: "rgba(0, 255, 255, 0.3)",
                marginVertical: 8,
              }}
            />
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text style={{ color: "#CCCCCC", fontSize: 12 }}>
                  Base Coins
                </Text>
                <Text style={{ color: "#FFFF00", fontSize: 12 }}>
                  +{baseCoins}
                </Text>
              </View>
              {noCrashBonus > 0 && (
                <View className="flex-row items-center justify-between">
                  <Text style={{ color: "#CCCCCC", fontSize: 12 }}>
                    No Crash Bonus
                  </Text>
                  <Text style={{ color: "#00FF88", fontSize: 12 }}>
                    +{noCrashBonus}
                  </Text>
                </View>
              )}
              {highScoreBonus > 0 && (
                <View className="flex-row items-center justify-between">
                  <Text style={{ color: "#CCCCCC", fontSize: 12 }}>
                    High Score Bonus
                  </Text>
                  <Text style={{ color: "#FF8800", fontSize: 12 }}>
                    +{highScoreBonus}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Total Coins */}
          <View
            style={{
              width: "100%",
              backgroundColor: "rgba(255, 255, 0, 0.1)",
              borderWidth: 2,
              borderColor: "#FFFF00",
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#CCCCCC", fontSize: 12, marginBottom: 4 }}>
              Total Coins Earned
            </Text>
            <Text
              style={{
                color: "#FFFF00",
                fontSize: 32,
                fontWeight: "bold",
                textShadowColor: "#FFFF00",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              }}
            >
              💰 {totalCoins}
            </Text>
          </View>

          {/* Buttons */}
          <View className="w-full gap-3 mt-4">
            {levelId < 10 && (
              <TouchableOpacity
                onPress={onNextLevel}
                style={{
                  backgroundColor: themeColors.primary,
                  paddingVertical: 14,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: "#000000",
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  NEXT LEVEL →
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onRetry}
              style={{
                backgroundColor: "rgba(255, 0, 255, 0.2)",
                paddingVertical: 14,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: themeColors.secondary,
              }}
            >
              <Text
                style={{
                  color: themeColors.secondary,
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                RETRY LEVEL
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onBack}
              style={{
                backgroundColor: "rgba(100, 100, 100, 0.2)",
                paddingVertical: 14,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#666666",
              }}
            >
              <Text
                style={{
                  color: "#999999",
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                BACK TO LEVELS
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
