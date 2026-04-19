/**
 * Simplified Level Game Over Screen
 * Shows result and navigation options
 */

import React from "react";
import { View, Text, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { SimpleLevel } from "@/lib/simple-levels";

interface SimpleLevelGameOverProps {
  level: SimpleLevel;
  score: number;
  completed: boolean;
  onRetry: () => void;
  onNextLevel: () => void;
  onBack: () => void;
}

export function SimpleLevelGameOver({
  level,
  score,
  completed,
  onRetry,
  onNextLevel,
  onBack,
}: SimpleLevelGameOverProps) {
  const colors = useColors();

  return (
    <ScreenContainer className="flex-1 bg-black items-center justify-center px-4">
      {/* Result */}
      <View className="items-center mb-8">
        <Text
          style={{
            fontSize: 48,
            fontWeight: "bold",
            color: completed ? "#00FF00" : "#FF0000",
            marginBottom: 16,
            textShadowColor: completed ? "#00FF00" : "#FF0000",
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 12,
          }}
        >
          {completed ? "LEVEL COMPLETE!" : "GAME OVER"}
        </Text>

        <Text
          style={{
            fontSize: 18,
            color: colors.muted,
            marginBottom: 24,
          }}
        >
          {level.name}
        </Text>

        {/* Score */}
        <View
          className="w-full p-6 rounded-lg mb-6"
          style={{
            backgroundColor: "rgba(0, 217, 255, 0.1)",
            borderWidth: 2,
            borderColor: colors.primary,
          }}
        >
          <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>FINAL SCORE</Text>
          <Text
            style={{
              fontSize: 40,
              fontWeight: "bold",
              color: colors.primary,
              textAlign: "center",
              marginTop: 8,
              textShadowColor: colors.primary,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 8,
            }}
          >
            {score}
          </Text>
        </View>

        {/* Reward */}
        {completed && (
          <View
            className="w-full p-4 rounded-lg mb-6 items-center"
            style={{
              backgroundColor: "rgba(255, 255, 0, 0.1)",
              borderWidth: 2,
              borderColor: "#FFFF00",
            }}
          >
            <Text style={{ fontSize: 14, color: "#FFFF00" }}>+ {level.coinReward} COINS</Text>
          </View>
        )}
      </View>

      {/* Buttons */}
      <View className="w-full gap-3">
        {completed ? (
          <>
            <Pressable
              onPress={onNextLevel}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "rgba(0, 255, 0, 0.3)" : "rgba(0, 255, 0, 0.1)",
                  borderWidth: 2,
                  borderColor: "#00FF00",
                  borderRadius: 8,
                  padding: 16,
                  alignItems: "center",
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#00FF00",
                }}
              >
                NEXT LEVEL
              </Text>
            </Pressable>

            <Pressable
              onPress={onRetry}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "rgba(0, 217, 255, 0.3)" : "rgba(0, 217, 255, 0.1)",
                  borderWidth: 2,
                  borderColor: colors.primary,
                  borderRadius: 8,
                  padding: 16,
                  alignItems: "center",
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: colors.primary,
                }}
              >
                RETRY LEVEL
              </Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            onPress={onRetry}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "rgba(0, 217, 255, 0.3)" : "rgba(0, 217, 255, 0.1)",
                borderWidth: 2,
                borderColor: colors.primary,
                borderRadius: 8,
                padding: 16,
                alignItems: "center",
              },
            ]}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: colors.primary,
              }}
            >
              TRY AGAIN
            </Text>
          </Pressable>
        )}

        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "rgba(255, 0, 110, 0.3)" : "rgba(255, 0, 110, 0.1)",
              borderWidth: 2,
              borderColor: "#FF006E",
              borderRadius: 8,
              padding: 16,
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
            BACK TO LEVELS
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}
