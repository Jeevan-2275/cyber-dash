/**
 * Level Game Screen
 * Gameplay screen for level mode with level-specific HUD and mechanics
 */

import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { LevelGameEngine } from "@/lib/level-game-engine";
import { getThemeColors } from "@/lib/level-system";

interface LevelGameScreenProps {
  levelId: number;
  onGameOver: (levelId: number, score: number, stars: number) => void;
  onBack: () => void;
}

export function LevelGameScreen({
  levelId,
  onGameOver,
  onBack,
}: LevelGameScreenProps) {
  const [gameEngine] = useState(() => new LevelGameEngine(levelId));
  const [gameState, setGameState] = useState(gameEngine.getState());
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef<number | null>(null);
  const level = gameEngine.getLevel();
  const themeColors = getThemeColors(level.theme);

  useEffect(() => {
    gameEngine.start();

    // Game loop
    const updateGame = () => {
      if (!isPaused) {
        const state = gameEngine.getState();
        setGameState(state);

        // Check if level is complete
        if (gameEngine.isLevelComplete() && state.state === "playing") {
          const rewards = gameEngine.calculateRewards();
          endLevel(state.score, rewards.stars);
          return;
        }

        // Check if game over
        if (state.state === "gameOver") {
          const rewards = gameEngine.calculateRewards();
          endLevel(state.score, rewards.stars);
          return;
        }
      }

      gameLoopRef.current = requestAnimationFrame(updateGame);
    };

    gameLoopRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      gameEngine.cleanup();
    };
  }, [gameEngine, isPaused]);

  const endLevel = (score: number, stars: number) => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }
    gameEngine.cleanup();
    onGameOver(levelId, score, stars);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      gameEngine.pause();
    } else {
      gameEngine.resume();
    }
  };

  const handleJump = () => {
    if (!isPaused) {
      gameEngine.jump();
    }
  };

  const handleSlide = () => {
    if (!isPaused) {
      gameEngine.slide();
    }
  };

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const gameAreaHeight = screenHeight * 0.7;

  return (
    <ScreenContainer className="bg-black">
      {/* HUD */}
      <View
        className="flex-row items-center justify-between px-4 py-2"
        style={{ backgroundColor: themeColors.background }}
      >
        <View>
          <Text style={{ color: themeColors.primary, fontSize: 12 }}>
            Level {level.id}
          </Text>
          <Text
            style={{
              color: themeColors.primary,
              fontSize: 16,
              fontWeight: "bold",
              textShadowColor: themeColors.primary,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 5,
            }}
          >
            {level.name}
          </Text>
        </View>

        <View className="items-center">
          <Text style={{ color: themeColors.secondary, fontSize: 12 }}>
            Score
          </Text>
          <Text
            style={{
              color: themeColors.secondary,
              fontSize: 20,
              fontWeight: "bold",
              textShadowColor: themeColors.secondary,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 5,
            }}
          >
            {gameState.score}
          </Text>
        </View>

        <View className="items-center">
          <Text style={{ color: "#FFFF00", fontSize: 12 }}>Time</Text>
          <Text
            style={{
              color: "#FFFF00",
              fontSize: 16,
              fontWeight: "bold",
              textShadowColor: "#FFFF00",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 5,
            }}
          >
            {Math.ceil(gameState.levelTimeRemaining / 1000)}s
          </Text>
        </View>

        <TouchableOpacity
          onPress={handlePause}
          style={{
            backgroundColor: "rgba(255, 0, 255, 0.2)",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: themeColors.secondary,
          }}
        >
          <Text
            style={{
              color: themeColors.secondary,
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {isPaused ? "▶" : "⏸"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View
        style={{
          height: 4,
          backgroundColor: "rgba(100, 100, 100, 0.5)",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${gameState.levelProgress}%`,
            backgroundColor: themeColors.primary,
            shadowColor: themeColors.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 5,
          }}
        />
      </View>

      {/* Game Area */}
      <View
        style={{
          flex: 1,
          backgroundColor: themeColors.background,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Grid Background */}
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0.1,
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <View
              key={`h-${i}`}
              style={{
                position: "absolute",
                width: "100%",
                height: 1,
                backgroundColor: themeColors.primary,
                top: `${i * 10}%`,
              }}
            />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <View
              key={`v-${i}`}
              style={{
                position: "absolute",
                width: 1,
                height: "100%",
                backgroundColor: themeColors.primary,
                left: `${i * 20}%`,
              }}
            />
          ))}
        </View>

        {/* Player */}
        <View
          style={{
            position: "absolute",
            left: gameState.player.x,
            top: gameState.player.y,
            width: gameState.player.width,
            height: gameState.player.height,
            backgroundColor: themeColors.primary,
            borderRadius: 4,
            shadowColor: themeColors.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
          }}
        />

        {/* Obstacles */}
        {gameState.obstacles.map((obstacle) => (
          <View
            key={obstacle.id}
            style={{
              position: "absolute",
              left: obstacle.x,
              top: obstacle.y,
              width: obstacle.width,
              height: obstacle.height,
              backgroundColor:
                obstacle.type === "moving" ? themeColors.secondary : "#FF0000",
              borderRadius: 2,
              opacity: 0.8,
            }}
          />
        ))}

        {/* Pause Overlay */}
        {isPaused && (
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                padding: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: themeColors.secondary,
              }}
            >
              <Text
                style={{
                  color: themeColors.secondary,
                  fontSize: 24,
                  fontWeight: "bold",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                PAUSED
              </Text>
              <TouchableOpacity
                onPress={handlePause}
                style={{
                  backgroundColor: themeColors.secondary,
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 8,
                  marginBottom: 8,
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
                  RESUME
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onBack}
                style={{
                  backgroundColor: "rgba(255, 0, 0, 0.3)",
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#FF0000",
                }}
              >
                <Text
                  style={{
                    color: "#FF0000",
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  QUIT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Controls */}
      <View
        className="flex-row items-center justify-center gap-4 px-4 py-4"
        style={{ backgroundColor: themeColors.background }}
      >
        <TouchableOpacity
          onPress={handleSlide}
          disabled={isPaused}
          style={{
            flex: 1,
            backgroundColor: "rgba(255, 0, 255, 0.2)",
            paddingVertical: 12,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: themeColors.secondary,
            opacity: isPaused ? 0.5 : 1,
          }}
        >
          <Text
            style={{
              color: themeColors.secondary,
              fontSize: 14,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            SLIDE ↓
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleJump}
          disabled={isPaused}
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 255, 255, 0.2)",
            paddingVertical: 12,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: themeColors.primary,
            opacity: isPaused ? 0.5 : 1,
          }}
        >
          <Text
            style={{
              color: themeColors.primary,
              fontSize: 14,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            JUMP ↑
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
