/**
 * Simplified Level Game Screen
 * Clean, minimal UI for level gameplay
 */

import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, GestureResponderEvent, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { SimpleLevelEngine } from "@/lib/simple-level-engine";
import { SimpleLevel } from "@/lib/simple-levels";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SimpleLevelGameProps {
  level: SimpleLevel;
  onLevelComplete: (levelId: number, score: number) => void;
  onLevelFailed: () => void;
}

export function SimpleLevelGame({
  level,
  onLevelComplete,
  onLevelFailed,
}: SimpleLevelGameProps) {
  const colors = useColors();
  const [gameState, setGameState] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState(level.duration);
  const [levelStatus, setLevelStatus] = useState<"playing" | "completed" | "failed">("playing");

  const engineRef = useRef<SimpleLevelEngine | null>(null);
  const updateCounterRef = useRef(0);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Initialize level
  useEffect(() => {
    const initializeLevel = async () => {
      try {
        const highScoreStr = await AsyncStorage.getItem("highScore");
        const highScore = highScoreStr ? parseInt(highScoreStr, 10) : 0;

        const engine = new SimpleLevelEngine(level, highScore);
        engine.initialize(screenWidth, screenHeight);
        engineRef.current = engine;

        engine.onStateChanged((state) => {
          updateCounterRef.current++;
          if (updateCounterRef.current % 2 === 0) {
            setGameState(state);

            // Handle game over
            if (state.state === "gameOver") {
              if (engine.isLevelCompleted()) {
                setLevelStatus("completed");
                onLevelComplete(level.id, state.score);
              } else {
                setLevelStatus("failed");
                onLevelFailed();
              }
            }
          }
        });

        engine.start();
        setGameState(engine.getState());
      } catch (error) {
        console.error("Failed to initialize level:", error);
      }
    };

    initializeLevel();

    return () => {
      if (engineRef.current) {
        engineRef.current.end();
      }
    };
  }, [level, screenWidth, screenHeight]);

  // Update timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (engineRef.current) {
        const remaining = engineRef.current.getTimeRemaining();
        setTimeRemaining(Math.max(0, remaining));
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Handle screen tap
  const handleScreenPress = (event: GestureResponderEvent) => {
    if (!engineRef.current || !gameState || gameState.state !== "playing") {
      return;
    }

    const { locationY } = event.nativeEvent;
    const screenCenter = screenHeight / 2;

    if (locationY < screenCenter) {
      engineRef.current.slide();
    } else {
      engineRef.current.jump();
    }
  };

  if (!gameState) {
    return (
      <ScreenContainer className="bg-black items-center justify-center">
        <Text style={{ color: colors.primary, fontSize: 18 }}>Loading...</Text>
      </ScreenContainer>
    );
  }

  const player = engineRef.current?.getPlayer();
  const obstacles = engineRef.current?.getObstacles() || [];
  const timeSeconds = Math.ceil(timeRemaining / 1000);

  return (
    <Pressable onPress={handleScreenPress} style={{ flex: 1 }}>
      <ScreenContainer className="flex-1 bg-black" edges={["top", "left", "right", "bottom"]}>
        {/* HUD */}
        <View
          className="px-4 py-3 flex-row items-center justify-between"
          style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
        >
          <View>
            <Text style={{ fontSize: 12, color: colors.muted }}>LEVEL {level.id}</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.primary,
                marginTop: 4,
              }}
            >
              {level.name.split(":")[1]?.trim()}
            </Text>
          </View>

          <View className="items-center">
            <Text style={{ fontSize: 12, color: colors.muted }}>TIME</Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: timeSeconds <= 5 ? "#FF0000" : colors.primary,
                marginTop: 4,
                textShadowColor: timeSeconds <= 5 ? "#FF0000" : colors.primary,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 4,
              }}
            >
              {timeSeconds}s
            </Text>
          </View>

          <View className="items-end">
            <Text style={{ fontSize: 12, color: colors.muted }}>SCORE</Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.primary,
                marginTop: 4,
              }}
            >
              {gameState.score}
            </Text>
          </View>
        </View>

        {/* Game Area */}
        <View className="flex-1 bg-black relative overflow-hidden">
          {/* Grid Background */}
          <View
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                rgba(0, 217, 255, 0.03) 0px,
                rgba(0, 217, 255, 0.03) 1px,
                transparent 1px,
                transparent 40px
              ),
              repeating-linear-gradient(
                90deg,
                rgba(0, 217, 255, 0.03) 0px,
                rgba(0, 217, 255, 0.03) 1px,
                transparent 1px,
                transparent 40px
              )`,
            }}
          />

          {/* Player */}
          {player && (
            <View
              style={{
                position: "absolute",
                left: player.x,
                top: player.y,
                width: player.width,
                height: player.height,
                backgroundColor: "#00D9FF",
                borderRadius: 4,
                shadowColor: "#00D9FF",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 8,
                elevation: 8,
              }}
            />
          )}

          {/* Obstacles */}
          {obstacles.map((obstacle) => (
            <View
              key={obstacle.id}
              style={{
                position: "absolute",
                left: obstacle.x,
                top: obstacle.y,
                width: obstacle.width,
                height: obstacle.height,
                backgroundColor:
                  obstacle.type === "moving" ? "#FF00FF" : obstacle.type === "gap" ? "transparent" : "#FF006E",
                borderRadius: obstacle.type === "moving" ? 4 : 0,
                borderWidth: obstacle.type === "gap" ? 2 : 0,
                borderColor: obstacle.type === "gap" ? "#FF006E" : "transparent",
                shadowColor: obstacle.type === "moving" ? "#FF00FF" : "#FF006E",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 6,
                elevation: 5,
              }}
            />
          ))}

          {/* Countdown Overlay */}
          {gameState.countdownTime > 0 && (
            <View
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 100,
              }}
            >
              <Text
                style={{
                  fontSize: 80,
                  fontWeight: "bold",
                  color: "#00D9FF",
                  textShadowColor: "#00D9FF",
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 20,
                }}
              >
                {Math.ceil(gameState.countdownTime / 1000)}
              </Text>
            </View>
          )}

          {/* Pause Button */}
          <Pressable
            onPress={() => {
              if (engineRef.current && !gameState.isPaused) {
                engineRef.current.pause();
              }
            }}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 50,
              padding: 12,
              backgroundColor: "rgba(0, 217, 255, 0.2)",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#00D9FF",
            }}
          >
            <Text style={{ color: "#00D9FF", fontWeight: "bold", fontSize: 12 }}>⏸</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    </Pressable>
  );
}
