/**
 * Simplified Level Select Screen
 * Shows 5 levels with lock/unlock status
 */

import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { SIMPLE_LEVELS, isLevelUnlocked } from "@/lib/simple-levels";

interface SimpleLevelSelectProps {
  completedLevels: number[];
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

export function SimpleLevelSelect({
  completedLevels,
  onSelectLevel,
  onBack,
}: SimpleLevelSelectProps) {
  const colors = useColors();

  return (
    <ScreenContainer className="bg-black">
      {/* Header */}
      <View className="px-4 py-6 border-b" style={{ borderBottomColor: colors.border }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: colors.primary,
            textShadowColor: colors.primary,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 8,
          }}
        >
          LEVEL SELECT
        </Text>
      </View>

      {/* Levels Grid */}
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ gap: 12 }}>
        {SIMPLE_LEVELS.map((level) => {
          const isUnlocked = isLevelUnlocked(level.id, completedLevels);
          const isCompleted = completedLevels.includes(level.id);

          return (
            <Pressable
              key={level.id}
              onPress={() => {
                if (isUnlocked) {
                  onSelectLevel(level.id);
                }
              }}
              disabled={!isUnlocked}
              style={({ pressed }) => [
                {
                  backgroundColor: isUnlocked
                    ? pressed
                      ? "rgba(0, 217, 255, 0.3)"
                      : "rgba(0, 217, 255, 0.1)"
                    : "rgba(100, 100, 100, 0.2)",
                  borderWidth: 2,
                  borderColor: isUnlocked ? colors.primary : colors.muted,
                  borderRadius: 12,
                  padding: 16,
                  opacity: isUnlocked ? 1 : 0.5,
                },
              ]}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: isUnlocked ? colors.foreground : colors.muted,
                    }}
                  >
                    {level.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.muted,
                      marginTop: 4,
                    }}
                  >
                    {Math.round(level.duration / 1000)}s • {level.coinReward} coins
                  </Text>
                </View>

                {/* Status */}
                <View className="items-center">
                  {isCompleted ? (
                    <Text
                      style={{
                        fontSize: 24,
                        color: "#00FF00",
                        fontWeight: "bold",
                      }}
                    >
                      ✓
                    </Text>
                  ) : isUnlocked ? (
                    <Text
                      style={{
                        fontSize: 20,
                        color: colors.primary,
                      }}
                    >
                      ▶
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 20,
                        color: colors.muted,
                      }}
                    >
                      🔒
                    </Text>
                  )}
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Back Button */}
      <View className="px-4 py-4 border-t" style={{ borderTopColor: colors.border }}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgba(255, 0, 110, 0.3)" : "rgba(255, 0, 110, 0.1)",
              borderWidth: 2,
              borderColor: "#FF006E",
              borderRadius: 8,
              padding: 12,
              alignItems: "center",
            },
          ]}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#FF006E",
            }}
          >
            BACK
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
