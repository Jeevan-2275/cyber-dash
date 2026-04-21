import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, GestureResponderEvent, Dimensions, useWindowDimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GameEngine, GameEngineState } from "@/lib/game-engine";
import { useColors } from "@/hooks/use-colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GameScreenProps {
  onGameOver: (finalScore: number, highScore: number) => void;
}

/**
 * Main Game Screen Component
 * Renders the Cyber Dash game with minimal re-renders
 */
export function GameScreen({ onGameOver }: GameScreenProps) {
  const colors = useColors();
  const [gameState, setGameState] = useState<GameEngineState | null>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const updateCounterRef = useRef(0);

  const windowDimensions = useWindowDimensions();
  const screenWidth = windowDimensions.width;
  const screenHeight = windowDimensions.height;
  const scale = Math.sqrt((screenWidth * screenHeight) / (375 * 812));
  const responsiveFontSize = (baseSize: number) => Math.round(baseSize * Math.sqrt(scale));

  // Initialize game
  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Load high score
        const highScoreStr = await AsyncStorage.getItem("highScore");
        const highScore = highScoreStr ? parseInt(highScoreStr, 10) : 0;

        // Create game engine
        const engine = new GameEngine(highScore);
        engine.setScreenDimensions(screenWidth, screenHeight);
        gameEngineRef.current = engine;

        // Register state change callback
        engine.onStateChanged((state) => {
          // Update UI every 2 frames (30 FPS UI updates instead of 60)
          updateCounterRef.current++;
          if (updateCounterRef.current % 2 === 0) {
            setGameState(state);

            // Handle game over
            if (state.state === "gameOver") {
              AsyncStorage.setItem("highScore", state.highScore.toString());
              onGameOver(state.score, state.highScore);
            }
          }
        });

        // Start the game
        engine.start();
        setGameState(engine.getState());
      } catch (error) {
        console.error("Failed to initialize game:", error);
      }
    };

    initializeGame();

    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.end();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [screenWidth, screenHeight]);

  // Handle screen tap for jump/slide
  const handleScreenPress = (event: GestureResponderEvent) => {
    if (!gameEngineRef.current || !gameState || gameState.state !== "playing") {
      return;
    }

    const { locationY } = event.nativeEvent;
    const screenMiddle = screenHeight / 2;

    // Upper half: slide
    if (locationY < screenMiddle) {
      gameEngineRef.current.slide();
    } else {
      // Lower half: jump
      gameEngineRef.current.jump();
    }
  };

  if (!gameState) {
    return (
      <ScreenContainer className="flex-1 items-center justify-center bg-black">
        <Text style={{ color: colors.foreground }}>Loading...</Text>
      </ScreenContainer>
    );
  }

  const player = gameEngineRef.current?.getPlayer();
  const obstacles = gameEngineRef.current?.getObstacles() || [];
  const coins = gameEngineRef.current?.getCoins() || [];
  const powerUps = gameEngineRef.current?.getPowerUps() || [];
  const activePowerUps = gameEngineRef.current?.getActivePowerUps() || [];

  return (
    <Pressable
      onPress={handleScreenPress}
      style={{ flex: 1 }}
    >
      <ScreenContainer
        className="flex-1 bg-black"
        containerClassName="bg-black"
        edges={["top", "left", "right", "bottom"]}
      >
        {/* HUD */}
        <View
          className="px-4 py-3 flex-row items-center justify-between"
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          {/* Score */}
          <View>
            <Text style={{ fontSize: responsiveFontSize(12), color: colors.muted }}>SCORE</Text>
            <Text
              style={{
                fontSize: responsiveFontSize(24),
                fontWeight: "bold",
                color: colors.primary,
                marginTop: 4,
                textShadowColor: colors.primary,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 4,
              }}
            >
              {gameState.score}
            </Text>
          </View>

          {/* Coins */}
          <View className="items-center">
            <Text style={{ fontSize: responsiveFontSize(12), color: "#FFFF00" }}>COINS</Text>
            <Text
              style={{
                fontSize: responsiveFontSize(20),
                fontWeight: "bold",
                color: "#FFFF00",
                marginTop: 4,
                textShadowColor: "#FFFF00",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 4,
              }}
            >
              {gameState.coinsCollected}
            </Text>
          </View>

          {/* Combo */}
          {gameState.combo > 0 && (
            <View className="items-center">
              <Text style={{ fontSize: responsiveFontSize(12), color: "#FF006E" }}>COMBO</Text>
              <Text
                style={{
                  fontSize: responsiveFontSize(20),
                  fontWeight: "bold",
                  color: "#FF006E",
                  marginTop: 4,
                  textShadowColor: "#FF006E",
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 4,
                }}
              >
                x{gameState.combo}
              </Text>
            </View>
          )}

          {/* Speed Multiplier */}
          <View className="items-center">
            <Text style={{ fontSize: responsiveFontSize(12), color: colors.muted }}>SPEED</Text>
            <Text
              style={{
                fontSize: responsiveFontSize(20),
                fontWeight: "bold",
                color: colors.primary,
                marginTop: 4,
              }}
            >
              {gameState.speedMultiplier.toFixed(2)}x
            </Text>
          </View>

          {/* High Score */}
          <View className="items-end">
            <Text style={{ fontSize: responsiveFontSize(12), color: colors.muted }}>HIGH SCORE</Text>
            <Text
              style={{
                fontSize: responsiveFontSize(24),
                fontWeight: "bold",
                color: "#8B00FF",
                marginTop: 4,
                textShadowColor: "#8B00FF",
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 4,
              }}
            >
              {gameState.highScore}
            </Text>
          </View>
        </View>

        {/* Game Area */}
        <View
          className="flex-1 bg-black relative overflow-hidden"
          style={{
            transform: [
              {
                translateX: gameEngineRef.current?.getAnimationEffects().getScreenShakeOffset().x || 0,
              },
              {
                translateY: gameEngineRef.current?.getAnimationEffects().getScreenShakeOffset().y || 0,
              },
            ],
          }}
        >
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
                  fontSize: responsiveFontSize(80),
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
              if (gameEngineRef.current && !gameState.isPaused) {
                gameEngineRef.current.pause();
              }
            }}
            style={{
              position: "absolute",
              top: Math.round(16 * scale),
              right: Math.round(16 * scale),
              zIndex: 50,
              padding: Math.round(12 * scale),
              backgroundColor: "rgba(0, 217, 255, 0.2)",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#00D9FF",
            }}
          >
            <Text style={{ color: "#00D9FF", fontWeight: "bold", fontSize: responsiveFontSize(12) }}>
              {gameState.isPaused ? "RESUME" : "PAUSE"}
            </Text>
          </Pressable>

          {/* Pause Menu */}
          {gameState.isPaused && (
            <View
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 100,
              }}
            >
              <View style={{ gap: Math.round(16 * scale) }}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(40),
                    fontWeight: "bold",
                    color: "#00D9FF",
                    textAlign: "center",
                    textShadowColor: "#00D9FF",
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 10,
                  }}
                >
                  PAUSED
                </Text>
                <Pressable
                  onPress={() => {
                    if (gameEngineRef.current) {
                      gameEngineRef.current.resumeGame();
                    }
                  }}
                  style={{
                    paddingVertical: Math.round(12 * scale),
                    paddingHorizontal: Math.round(32 * scale),
                    backgroundColor: "#00D9FF",
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#000", fontWeight: "bold", fontSize: responsiveFontSize(16) }}>
                    RESUME
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Coins */}
          {coins.map((coin) => (
            <View
              key={coin.id}
              style={{
                position: "absolute",
                left: coin.x,
                top: coin.y,
                width: coin.width,
                height: coin.height,
                backgroundColor: "#FFFF00",
                borderRadius: coin.width / 2,
                shadowColor: "#FFFF00",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 6,
                elevation: 6,
              }}
            />
          ))}

          {/* Power-Ups */}
          {powerUps.map((powerUp) => (
            <View
              key={powerUp.id}
              style={{
                position: "absolute",
                left: powerUp.x,
                top: powerUp.y,
                width: powerUp.width,
                height: powerUp.height,
                backgroundColor:
                  powerUp.type === "shield"
                    ? "#00FF00"
                    : powerUp.type === "coinMagnet"
                      ? "#FFFF00"
                      : "#FF00FF",
                borderRadius: 4,
                shadowColor:
                  powerUp.type === "shield"
                    ? "#00FF00"
                    : powerUp.type === "coinMagnet"
                      ? "#FFFF00"
                      : "#FF00FF",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 8,
                elevation: 8,
              }}
            />
          ))}

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
                  obstacle.type === "wall"
                    ? "#FF006E"
                    : obstacle.type === "moving"
                      ? "#8B00FF"
                      : "transparent",
                borderRadius: 2,
                borderWidth: obstacle.type === "gap" ? 2 : 0,
                borderColor: obstacle.type === "gap" ? "#00D9FF" : "transparent",
                shadowColor:
                  obstacle.type === "wall"
                    ? "#FF006E"
                    : obstacle.type === "moving"
                      ? "#8B00FF"
                      : "transparent",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 4,
              }}
            />
          ))}
        </View>

        {/* Controls Info */}
        <View
          className="px-4 py-3"
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: colors.muted,
              textAlign: "center",
            }}
          >
            TAP LOWER HALF TO JUMP • TAP UPPER HALF TO SLIDE
          </Text>
        </View>
      </ScreenContainer>
    </Pressable>
  );
}
