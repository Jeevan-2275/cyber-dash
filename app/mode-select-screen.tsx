/**
 * Mode Selection Screen
 * Allows player to choose between Infinite Mode and Level Mode
 */

import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

interface ModeSelectScreenProps {
  onSelectMode: (mode: "infinite" | "levels") => void;
}

export function ModeSelectScreen({ onSelectMode }: ModeSelectScreenProps) {
  const colors = useColors();

  return (
    <ScreenContainer className="bg-black">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 items-center justify-center gap-8 px-6 py-8">
          {/* Title */}
          <View className="items-center gap-2">
            <Text
              className="text-5xl font-bold text-center"
              style={{
                color: "#00FFFF",
                textShadowColor: "#00FFFF",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 10,
              }}
            >
              CYBER DASH
            </Text>
            <Text
              className="text-lg text-center"
              style={{
                color: "#FF00FF",
                textShadowColor: "#FF00FF",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 5,
              }}
            >
              Choose Your Mode
            </Text>
          </View>

          {/* Infinite Mode Card */}
          <TouchableOpacity
            onPress={() => onSelectMode("infinite")}
            activeOpacity={0.8}
            style={{
              borderColor: "#00FFFF",
              borderWidth: 2,
              borderRadius: 16,
              padding: 24,
              width: "100%",
              backgroundColor: "rgba(0, 255, 255, 0.05)",
            }}
          >
            <Text
              className="text-2xl font-bold mb-2"
              style={{
                color: "#00FFFF",
                textShadowColor: "#00FFFF",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              }}
            >
              ∞ INFINITE MODE
            </Text>
            <Text className="text-sm text-gray-300 mb-4">
              Survive as long as possible. No limits, just endless action.
            </Text>
            <View className="gap-1">
              <Text className="text-xs text-gray-400">✓ Progressive difficulty</Text>
              <Text className="text-xs text-gray-400">✓ Combo system</Text>
              <Text className="text-xs text-gray-400">✓ Leaderboards</Text>
            </View>
          </TouchableOpacity>

          {/* Level Mode Card */}
          <TouchableOpacity
            onPress={() => onSelectMode("levels")}
            activeOpacity={0.8}
            style={{
              borderColor: "#FF00FF",
              borderWidth: 2,
              borderRadius: 16,
              padding: 24,
              width: "100%",
              backgroundColor: "rgba(255, 0, 255, 0.05)",
            }}
          >
            <Text
              className="text-2xl font-bold mb-2"
              style={{
                color: "#FF00FF",
                textShadowColor: "#FF00FF",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              }}
            >
              ◆ LEVEL MODE
            </Text>
            <Text className="text-sm text-gray-300 mb-4">
              Complete structured levels with unique challenges and rewards.
            </Text>
            <View className="gap-1">
              <Text className="text-xs text-gray-400">✓ 10+ Levels</Text>
              <Text className="text-xs text-gray-400">✓ Power-ups</Text>
              <Text className="text-xs text-gray-400">✓ Star Ratings</Text>
            </View>
          </TouchableOpacity>

          {/* Footer */}
          <View className="mt-4 items-center">
            <Text className="text-xs text-gray-500">
              Tap a mode to begin
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
