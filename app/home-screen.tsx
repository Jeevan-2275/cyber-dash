import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HomeScreenProps {
  onPlay: () => void;
  onLevelMode: () => void;
}

export function HomeScreen({ onPlay, onLevelMode }: HomeScreenProps) {
  const colors = useColors();
  const [highScore, setHighScore] = useState(0);

  // Glow animation
  const glowOpacity = useSharedValue(0.5);

  useEffect(() => {
    // Load high score
    const loadHighScore = async () => {
      try {
        const score = await AsyncStorage.getItem("highScore");
        if (score) {
          setHighScore(parseInt(score, 10));
        }
      } catch (error) {
        console.error("Failed to load high score:", error);
      }
    };

    loadHighScore();

    // Start glow animation
    glowOpacity.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPlay();
  };

  const handleLevelMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLevelMode();
  };

  return (
    <ScreenContainer className="bg-black items-center justify-center p-6" edges={["top", "left", "right", "bottom"]}>
      <View className="items-center gap-12 w-full">
        {/* Logo/Title */}
        <View className="items-center gap-4">
          <Text
            style={{
              fontSize: 56,
              fontWeight: "bold",
              color: "#00D9FF",
              textShadowColor: "#00D9FF",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 20,
              letterSpacing: 2,
            }}
          >
            CYBER
          </Text>
          <Text
            style={{
              fontSize: 56,
              fontWeight: "bold",
              color: "#FF006E",
              textShadowColor: "#FF006E",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 20,
              letterSpacing: 2,
            }}
          >
            DASH
          </Text>

          {/* Divider */}
          <View
            style={{
              width: 120,
              height: 2,
              backgroundColor: "#8B00FF",
              marginTop: 8,
              shadowColor: "#8B00FF",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 10,
            }}
          />
        </View>

        {/* High Score */}
        <View className="items-center gap-2">
          <Text
            style={{
              fontSize: 14,
              color: "#A0A0A0",
              letterSpacing: 1,
            }}
          >
            HIGH SCORE
          </Text>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#8B00FF",
              textShadowColor: "#8B00FF",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            }}
          >
            {highScore}
          </Text>
        </View>

        {/* Spacer */}
        <View className="flex-1" />

        {/* Mode Selection Buttons */}
        <View className="gap-4 w-full items-center">
          {/* Infinite Mode Button */}
          <Animated.View style={glowStyle}>
            <Pressable
              onPress={handlePlay}
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
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#0A0E27",
                  letterSpacing: 2,
                }}
              >
                ∞ INFINITE MODE
              </Text>
            </Pressable>
          </Animated.View>

          {/* Level Mode Button */}
          <Pressable
            onPress={handleLevelMode}
            style={({ pressed }) => ({
              paddingVertical: 16,
              paddingHorizontal: 50,
              backgroundColor: "#FF006E",
              borderRadius: 14,
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
              transform: pressed ? [{ scale: 0.95 }] : [{ scale: 1 }],
              shadowColor: "#FF006E",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 20,
              elevation: 8,
            })}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#FFFFFF",
                letterSpacing: 2,
              }}
            >
              ◆ LEVEL MODE
            </Text>
          </Pressable>
        </View>

        {/* Footer Text */}
        <View className="items-center gap-2 mt-6">
          <Text
            style={{
              fontSize: 12,
              color: "#A0A0A0",
              letterSpacing: 1,
            }}
          >
            TAP TO JUMP • TAP TO SLIDE
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: "#687076",
              letterSpacing: 0.5,
            }}
          >
            Avoid obstacles and survive as long as you can
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
