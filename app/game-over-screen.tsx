import React from "react";
import { View, Text, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

interface GameOverScreenProps {
  finalScore: number;
  highScore: number;
  onRestart: () => void;
  onHome: () => void;
}

export function GameOverScreen({ finalScore, highScore, onRestart, onHome }: GameOverScreenProps) {
  const colors = useColors();

  const handleRestart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRestart();
  };

  const handleHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onHome();
  };

  return (
    <ScreenContainer className="bg-black items-center justify-center p-6" edges={["top", "left", "right", "bottom"]}>
      <View className="items-center gap-8 w-full">
        {/* Game Over Title */}
        <View className="items-center gap-2">
          <Text
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: "#FF006E",
              textShadowColor: "#FF006E",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 15,
              marginBottom: 8,
            }}
          >
            GAME OVER
          </Text>
          <View
            style={{
              width: 100,
              height: 2,
              backgroundColor: "#00D9FF",
              shadowColor: "#00D9FF",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 10,
            }}
          />
        </View>

        {/* Score Display */}
        <View className="items-center gap-6 w-full">
          {/* Final Score */}
          <View className="items-center gap-2">
            <Text
              style={{
                fontSize: 16,
                color: "#A0A0A0",
                letterSpacing: 1,
              }}
            >
              FINAL SCORE
            </Text>
            <Text
              style={{
                fontSize: 56,
                fontWeight: "bold",
                color: "#00D9FF",
                textShadowColor: "#00D9FF",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 10,
              }}
            >
              {finalScore}
            </Text>
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
                textShadowRadius: 8,
              }}
            >
              {highScore}
            </Text>
          </View>

          {/* New Record Indicator */}
          {finalScore === highScore && finalScore > 0 && (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: "#FF006E",
                borderRadius: 8,
                shadowColor: "#FF006E",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "bold",
                  color: "#FFFFFF",
                  letterSpacing: 1,
                }}
              >
                🎉 NEW RECORD! 🎉
              </Text>
            </View>
          )}
        </View>

        {/* Buttons */}
        <View className="gap-4 w-full mt-8">
          {/* Restart Button */}
          <Pressable
            onPress={handleRestart}
            style={({ pressed }) => ({
              paddingVertical: 16,
              paddingHorizontal: 32,
              backgroundColor: "#00D9FF",
              borderRadius: 12,
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
              transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
              shadowColor: "#00D9FF",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 12,
              elevation: 5,
            })}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#0A0E27",
                letterSpacing: 1,
              }}
            >
              RESTART
            </Text>
          </Pressable>

          {/* Home Button */}
          <Pressable
            onPress={handleHome}
            style={({ pressed }) => ({
              paddingVertical: 14,
              paddingHorizontal: 32,
              backgroundColor: "transparent",
              borderWidth: 2,
              borderColor: "#A0A0A0",
              borderRadius: 12,
              alignItems: "center",
              opacity: pressed ? 0.7 : 1,
              transform: pressed ? [{ scale: 0.97 }] : [{ scale: 1 }],
            })}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#A0A0A0",
                letterSpacing: 1,
              }}
            >
              HOME
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
