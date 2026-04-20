/**
 * Level Selection Screen
 * Shows all available levels with progress, stars, and unlock status
 */

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getAllLevels, LevelDefinition } from "@/lib/level-system";
import { LevelProgressionManager } from "@/lib/level-progression";

interface LevelSelectScreenProps {
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
  progressionManager?: LevelProgressionManager;
}

export function LevelSelectScreen({
  onSelectLevel,
  onBack,
  progressionManager,
}: LevelSelectScreenProps) {
  const colors = useColors();
  const [levels, setLevels] = useState<LevelDefinition[]>([]);
  const [progress, setProgress] = useState<any>({});
  const [manager] = useState(() => progressionManager || new LevelProgressionManager());

  useEffect(() => {
    const loadData = async () => {
      await manager.initialize();
      setLevels(getAllLevels());
      const allProgress = manager.getAllProgress();
      const progressMap: any = {};
      allProgress.forEach((p) => {
        progressMap[p.levelId] = p;
      });
      setProgress(progressMap);
    };
    loadData();
  }, [manager]);

  const renderLevelCard = ({ item: level }: { item: LevelDefinition }) => {
    const levelProgress = progress[level.id];
    const isLocked = !manager.isLevelUnlocked(level.id);
    const isCompleted = levelProgress?.completed || false;
    const stars = levelProgress?.stars || 0;

    const difficultyColor =
      level.difficulty <= 2
        ? "#00FF88"
        : level.difficulty <= 3
          ? "#FFFF00"
          : level.difficulty <= 4
            ? "#FF8800"
            : "#FF0000";

    return (
      <TouchableOpacity
        onPress={() => !isLocked && onSelectLevel(level.id)}
        disabled={isLocked}
        activeOpacity={isLocked ? 1 : 0.8}
        style={{
          marginBottom: 12,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: isLocked ? "#333333" : isCompleted ? "#00FF88" : "#00FFFF",
          backgroundColor: isLocked
            ? "rgba(50, 50, 50, 0.5)"
            : isCompleted
              ? "rgba(0, 255, 136, 0.05)"
              : "rgba(0, 255, 255, 0.05)",
          padding: 16,
          opacity: isLocked ? 0.5 : 1,
        }}
      >
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-1">
            <Text
              className="text-lg font-bold"
              style={{
                color: isLocked ? "#666666" : isCompleted ? "#00FF88" : "#00FFFF",
              }}
            >
              Level {level.id}
            </Text>
            <Text
              className="text-sm"
              style={{
                color: isLocked ? "#555555" : "#CCCCCC",
              }}
            >
              {level.name}
            </Text>
          </View>

          {/* Difficulty Badge */}
          <View
            style={{
              backgroundColor: difficultyColor,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
              marginRight: 8,
            }}
          >
            <Text
              className="text-xs font-bold"
              style={{
                color: "#000000",
              }}
            >
              {level.difficulty}/5
            </Text>
          </View>

          {/* Status Icon */}
          {isLocked ? (
            <Text className="text-xl">🔒</Text>
          ) : isCompleted ? (
            <Text className="text-xl">✅</Text>
          ) : (
            <Text className="text-xl">▶</Text>
          )}
        </View>

        {/* Description */}
        <Text
          className="text-xs mb-3"
          style={{
            color: isLocked ? "#555555" : "#999999",
          }}
        >
          {level.description}
        </Text>

        {/* Stats Row */}
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2">
            {/* Coins */}
            <View
              style={{
                backgroundColor: "rgba(255, 255, 0, 0.1)",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
              }}
            >
              <Text className="text-xs" style={{ color: "#FFFF00" }}>
                💰 {level.baseCoins}
              </Text>
            </View>

            {/* Duration */}
            <View
              style={{
                backgroundColor: "rgba(0, 255, 255, 0.1)",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
              }}
            >
              <Text className="text-xs" style={{ color: "#00FFFF" }}>
                ⏱️ {level.duration ? `${level.duration / 1000}s` : "∞"}
              </Text>
            </View>
          </View>

          {/* Stars */}
          <View className="flex-row gap-1">
            <Text className="text-sm">{stars >= 1 ? "⭐" : "☆"}</Text>
            <Text className="text-sm">{stars >= 2 ? "⭐" : "☆"}</Text>
            <Text className="text-sm">{stars >= 3 ? "⭐" : "☆"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer className="bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6 px-6 pt-4">
        <View className="flex-1">
          <Text
            className="text-3xl font-bold"
            style={{
              color: "#FF00FF",
              textShadowColor: "#FF00FF",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 8,
            }}
          >
            LEVELS
          </Text>
        </View>
        <TouchableOpacity
          onPress={onBack}
          style={{
            backgroundColor: "rgba(255, 0, 255, 0.2)",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#FF00FF",
          }}
        >
          <Text style={{ color: "#FF00FF", fontSize: 12, fontWeight: "bold" }}>
            BACK
          </Text>
        </TouchableOpacity>
      </View>

      {/* Level List */}
      <FlatList
        data={levels}
        renderItem={renderLevelCard}
        keyExtractor={(item) => `level-${item.id}`}
        scrollEnabled={true}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 20,
        }}
        ListEmptyComponent={
          <View className="items-center justify-center py-8">
            <Text style={{ color: "#999999" }}>Loading levels...</Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}
