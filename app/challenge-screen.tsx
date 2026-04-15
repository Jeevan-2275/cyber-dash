import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  FlatList,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  Challenge,
  ChallengeLeaderboardEntry,
  challengeSystem,
} from "@/lib/challenge-system";

interface ChallengeScreenProps {
  onStartChallenge: (challenge: Challenge) => void;
  onBack: () => void;
}

export function ChallengeScreen({
  onStartChallenge,
  onBack,
}: ChallengeScreenProps) {
  const colors = useColors();
  const [todayChallenge, setTodayChallenge] = useState<Challenge | null>(null);
  const [leaderboard, setLeaderboard] = useState<ChallengeLeaderboardEntry[]>(
    []
  );
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<"today" | "leaderboard">(
    "today"
  );

  useEffect(() => {
    loadChallenge();
    loadLeaderboard();

    // Update time remaining every second
    const interval = setInterval(() => {
      setTimeRemaining(challengeSystem.getFormattedTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadChallenge = async () => {
    const challenge = await challengeSystem.getTodayChallenge();
    setTodayChallenge(challenge);
    setTimeRemaining(challengeSystem.getFormattedTimeRemaining());
  };

  const loadLeaderboard = async () => {
    try {
      const entries = await challengeSystem.getLeaderboard(10);
      setLeaderboard(entries);
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
    }
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "easy":
        return "#22C55E"; // Green
      case "normal":
        return "#00D9FF"; // Cyan
      case "hard":
        return "#FF1493"; // Hot pink
      default:
        return colors.muted;
    }
  };

  const getChallengeIcon = (type: string): string => {
    switch (type) {
      case "survival":
        return "⏱️";
      case "speedrun":
        return "⚡";
      case "collector":
        return "🎁";
      case "endurance":
        return "💪";
      default:
        return "🎮";
    }
  };

  return (
    <ScreenContainer
      className="flex-1"
      containerClassName="bg-black"
      safeAreaClassName="bg-black"
    >
      {/* Header */}
      <View className="px-4 py-4 border-b" style={{ borderColor: colors.border }}>
        <View className="flex-row items-center justify-between">
          <Text
            className="text-3xl font-bold"
            style={{
              color: colors.foreground,
              textShadowColor: "#00D9FF",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 8,
            }}
          >
            DAILY CHALLENGES
          </Text>
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.6 : 1,
                paddingHorizontal: 12,
                paddingVertical: 8,
              },
            ]}
          >
            <Text style={{ color: colors.primary, fontSize: 24 }}>✕</Text>
          </Pressable>
        </View>
      </View>

      {/* Tab Navigation */}
      <View
        className="flex-row border-b"
        style={{ borderColor: colors.border }}
      >
        <Pressable
          onPress={() => setSelectedTab("today")}
          className="flex-1 py-3"
          style={[
            {
              borderBottomWidth: selectedTab === "today" ? 3 : 0,
              borderBottomColor:
                selectedTab === "today" ? colors.primary : "transparent",
            },
          ]}
        >
          <Text
            className="text-center font-semibold"
            style={{
              color:
                selectedTab === "today" ? colors.primary : colors.muted,
            }}
          >
            TODAY'S CHALLENGE
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setSelectedTab("leaderboard")}
          className="flex-1 py-3"
          style={[
            {
              borderBottomWidth: selectedTab === "leaderboard" ? 3 : 0,
              borderBottomColor:
                selectedTab === "leaderboard" ? colors.primary : "transparent",
            },
          ]}
        >
          <Text
            className="text-center font-semibold"
            style={{
              color:
                selectedTab === "leaderboard" ? colors.primary : colors.muted,
            }}
          >
            LEADERBOARD
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        {selectedTab === "today" && todayChallenge ? (
          <View className="p-4 gap-4">
            {/* Time Remaining */}
            <View
              className="rounded-lg p-4"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.primary,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: colors.muted }}
              >
                TIME REMAINING
              </Text>
              <Text
                className="text-2xl font-bold mt-1"
                style={{
                  color: colors.primary,
                  textShadowColor: colors.primary,
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 4,
                }}
              >
                {timeRemaining}
              </Text>
            </View>

            {/* Challenge Card */}
            <View
              className="rounded-lg p-6"
              style={{
                backgroundColor: colors.surface,
                borderWidth: 2,
                borderColor: colors.primary,
              }}
            >
              {/* Challenge Header */}
              <View className="flex-row items-center gap-3 mb-4">
                <Text className="text-4xl">
                  {getChallengeIcon(todayChallenge.type)}
                </Text>
                <View className="flex-1">
                  <Text
                    className="text-2xl font-bold"
                    style={{ color: colors.foreground }}
                  >
                    {todayChallenge.name}
                  </Text>
                  <Text
                    className="text-xs font-semibold mt-1 px-2 py-1 rounded"
                    style={{
                      color: "#000",
                      backgroundColor: getDifficultyColor(
                        todayChallenge.difficulty
                      ),
                      alignSelf: "flex-start",
                    }}
                  >
                    {todayChallenge.difficulty.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Challenge Description */}
              <Text
                className="text-sm mb-4"
                style={{ color: colors.muted, lineHeight: 20 }}
              >
                {todayChallenge.description}
              </Text>

              {/* Objective */}
              <View className="mb-4 p-3 rounded" style={{ backgroundColor: colors.background }}>
                <Text
                  className="text-xs font-semibold mb-1"
                  style={{ color: colors.primary }}
                >
                  OBJECTIVE
                </Text>
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.foreground }}
                >
                  {todayChallenge.objective}
                </Text>
              </View>

              {/* Rules */}
              <View className="mb-4">
                <Text
                  className="text-xs font-semibold mb-2"
                  style={{ color: colors.primary }}
                >
                  RULES
                </Text>
                {todayChallenge.rules.map((rule, index) => (
                  <View key={index} className="flex-row gap-2 mb-2">
                    <Text style={{ color: colors.primary }}>•</Text>
                    <Text
                      className="flex-1 text-sm"
                      style={{ color: colors.muted }}
                    >
                      {rule}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Reward */}
              <View
                className="p-3 rounded flex-row items-center justify-between"
                style={{ backgroundColor: colors.background }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.muted }}
                >
                  REWARD
                </Text>
                <Text
                  className="text-xl font-bold"
                  style={{
                    color: "#FFD700",
                    textShadowColor: "#FFD700",
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 4,
                  }}
                >
                  +{todayChallenge.reward}
                </Text>
              </View>
            </View>

            {/* Start Challenge Button */}
            <Pressable
              onPress={() => onStartChallenge(todayChallenge)}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <View
                className="py-4 rounded-lg items-center"
                style={{
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.8,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Text
                  className="text-lg font-bold"
                  style={{ color: colors.background }}
                >
                  START CHALLENGE
                </Text>
              </View>
            </Pressable>
          </View>
        ) : selectedTab === "leaderboard" ? (
          <View className="p-4">
            {leaderboard.length > 0 ? (
              <FlatList
                scrollEnabled={false}
                data={leaderboard}
                keyExtractor={(item, index) => `${item.challengeId}-${index}`}
                renderItem={({ item, index }) => (
                  <View
                    className="flex-row items-center gap-3 p-3 mb-2 rounded"
                    style={{
                      backgroundColor: colors.surface,
                      borderLeftWidth: 3,
                      borderLeftColor:
                        index === 0
                          ? "#FFD700"
                          : index === 1
                            ? "#C0C0C0"
                            : index === 2
                              ? "#CD7F32"
                              : colors.border,
                    }}
                  >
                    {/* Rank */}
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{
                        backgroundColor:
                          index === 0
                            ? "#FFD700"
                            : index === 1
                              ? "#C0C0C0"
                              : index === 2
                                ? "#CD7F32"
                                : colors.primary,
                      }}
                    >
                      <Text
                        className="font-bold"
                        style={{
                          color:
                            index < 3
                              ? "#000"
                              : colors.background,
                        }}
                      >
                        {index + 1}
                      </Text>
                    </View>

                    {/* Player Info */}
                    <View className="flex-1">
                      <Text
                        className="font-semibold"
                        style={{ color: colors.foreground }}
                      >
                        {item.playerName}
                      </Text>
                      <Text
                        className="text-xs"
                        style={{ color: colors.muted }}
                      >
                        {new Date(item.completedAt).toLocaleDateString()}
                      </Text>
                    </View>

                    {/* Score */}
                    <Text
                      className="text-lg font-bold"
                      style={{
                        color: colors.primary,
                        textShadowColor: colors.primary,
                        textShadowOffset: { width: 0, height: 0 },
                        textShadowRadius: 4,
                      }}
                    >
                      {item.score}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <View className="flex-1 items-center justify-center py-12">
                <Text
                  className="text-lg font-semibold mb-2"
                  style={{ color: colors.muted }}
                >
                  No scores yet
                </Text>
                <Text
                  className="text-sm"
                  style={{ color: colors.muted }}
                >
                  Be the first to complete today's challenge!
                </Text>
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}
