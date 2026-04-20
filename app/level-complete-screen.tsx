/**
 * Level Complete Screen
 * Shows level completion results, rewards, and progression
 */

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { getLevelById, getThemeColors } from "@/lib/level-system";
import { LevelProgressionManager } from "@/lib/level-progression";

interface LevelCompleteScreenProps {
  levelId: number;
  score: number;
  stars: number;
  onNextLevel: (levelId: number) => void;
  onRetry: (levelId: number) => void;
  onBack: () => void;
  progressionManager?: LevelProgressionManager;
}

export function LevelCompleteScreen({
  levelId,
  score,
  stars,
  onNextLevel,
  onRetry,
  onBack,
  progressionManager,
}: LevelCompleteScreenProps) {
  const level = getLevelById(levelId);
  if (!level) return null;

  const themeColors = getThemeColors(level.theme);
  const [animatedStars, setAnimatedStars] = useState(0);
  const [manager] = useState(() => progressionManager || new LevelProgressionManager());

  useEffect(() => {
    // Save level progress
    const saveProgress = async () => {
      await manager.initialize();
      const baseCoins = level.baseCoins;
      const noCrashBonus = score >= baseCoins ? level.noCrashBonus : 0;
      const highScoreBonus = score >= baseCoins * 1.5 ? level.highScoreBonus : 0;
      const totalCoins = baseCoins + noCrashBonus + highScoreBonus;
      
      await manager.completeLevel(levelId, score, stars, totalCoins, score >= baseCoins);
    };

    saveProgress();

    // Animate stars
    const timer = setTimeout(() => setAnimatedStars(stars), 300);
    return () => clearTimeout(timer);
  }, [levelId, score, stars, level, manager]);

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
                    fontSize: 48,
                    opacity: i <= animatedStars ? 1 : 0.3,
                  }}
                >
                  ⭐
                </Text>
              ))}
            </View>
            <Text
              style={{
                color: "#FFFF00",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {animatedStars} / 3 STARS
            </Text>
          </View>

          {/* Score Card */}
          <View
            style={{
              backgroundColor: "rgba(0, 255, 255, 0.1)",
              borderWidth: 2,
              borderColor: themeColors.primary,
              borderRadius: 12,
              padding: 16,
              width: "100%",
            }}
          >
            <View className="flex-row justify-between items-center mb-3">
              <Text style={{ color: "#CCCCCC", fontSize: 14 }}>SCORE</Text>
              <Text
                style={{
                  color: themeColors.primary,
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                {score}
              </Text>
            </View>
          </View>

          {/* Rewards Breakdown */}
          <View
            style={{
              backgroundColor: "rgba(255, 255, 0, 0.1)",
              borderWidth: 2,
              borderColor: "#FFFF00",
              borderRadius: 12,
              padding: 16,
              width: "100%",
            }}
          >
            <Text
              style={{
                color: "#FFFF00",
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 12,
              }}
            >
              COINS EARNED
            </Text>

            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text style={{ color: "#CCCCCC" }}>Base Coins</Text>
                <Text style={{ color: "#FFFF00", fontWeight: "bold" }}>
                  +{baseCoins}
                </Text>
              </View>

              {noCrashBonus > 0 && (
                <View className="flex-row justify-between">
                  <Text style={{ color: "#CCCCCC" }}>No Crash Bonus</Text>
                  <Text style={{ color: "#00FF88", fontWeight: "bold" }}>
                    +{noCrashBonus}
                  </Text>
                </View>
              )}

              {highScoreBonus > 0 && (
                <View className="flex-row justify-between">
                  <Text style={{ color: "#CCCCCC" }}>High Score Bonus</Text>
                  <Text style={{ color: "#FF006E", fontWeight: "bold" }}>
                    +{highScoreBonus}
                  </Text>
                </View>
              )}

              <View
                style={{
                  height: 1,
                  backgroundColor: "#FFFF00",
                  marginVertical: 8,
                }}
              />

              <View className="flex-row justify-between">
                <Text style={{ color: "#FFFF00", fontWeight: "bold" }}>
                  TOTAL
                </Text>
                <Text
                  style={{
                    color: "#FFFF00",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {totalCoins}
                </Text>
              </View>
            </View>
          </View>

          {/* Spacer */}
          <View className="flex-1" />

          {/* Buttons */}
          <View className="w-full gap-3 mt-4">
            {levelId < 10 && (
              <TouchableOpacity
                onPress={() => onNextLevel(levelId)}
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
              onPress={() => onRetry(levelId)}
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
                  color: "#CCCCCC",
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
