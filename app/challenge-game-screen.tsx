import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  GestureResponderEvent,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { ChallengeGameEngine } from "@/lib/challenge-game-engine";
import { ParticleSystem } from "@/lib/particle-system";
import { AudioManager } from "@/lib/audio-manager";
import { Challenge } from "@/lib/challenge-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ChallengeGameScreenProps {
  challenge: Challenge;
  onGameOver: (score: number, isCompleted: boolean) => void;
  onBack: () => void;
}

export function ChallengeGameScreen({
  challenge,
  onGameOver,
  onBack,
}: ChallengeGameScreenProps) {
  const colors = useColors();
  const [gameEngine, setGameEngine] = useState<ChallengeGameEngine | null>(
    null
  );
  const [score, setScore] = useState(0);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [challengeLabel, setChallengeLabel] = useState("");
  const [challengeValue, setChallengeValue] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const canvasRef = useRef<any>(null);
  const audioManagerRef = useRef(new AudioManager());
  const particleSystemRef = useRef(new ParticleSystem());
  const animationFrameRef = useRef<number | null>(null);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    initializeGame();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audioManagerRef.current.stopBackgroundMusic();
    };
  }, []);

  const initializeGame = async () => {
    try {
      const highScore = parseInt(
        (await AsyncStorage.getItem("highScore")) || "0"
      );
      const engine = new ChallengeGameEngine(highScore, challenge);
      engine.setScreenDimensions(screenWidth, screenHeight);

      // Register callbacks
      engine.onStateChanged((state) => {
        setScore(state.score);
        setChallengeProgress(engine.getChallengeProgressPercentage());
        setChallengeLabel(engine.getChallengeHUDLabel());
        setChallengeValue(engine.getChallengeHUDText());

        if (state.state === "gameOver") {
          handleGameOver(engine);
        }
      });

      engine.onCollisionDetected(() => {
        const player = engine.getPlayer();
        particleSystemRef.current.createCollisionParticles(
          player.x + player.width / 2,
          player.y + player.height / 2
        );

        audioManagerRef.current.playCollisionSound(
          "https://d2xsxph8kpxj0f.cloudfront.net/310519663551561515/H7fXkLw3MzMfyoVYqCCQcX/collision-sound_dd653f1f.wav"
        );
      });

      setGameEngine(engine);
      engine.start();

      // Start background music
      audioManagerRef.current.playBackgroundMusic(
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663551561515/H7fXkLw3MzMfyoVYqCCQcX/synthwave-loop_6823ab60.wav"
      );

      startGameLoop(engine);
    } catch (error) {
      console.error("Failed to initialize challenge game:", error);
    }
  };

  const startGameLoop = (engine: ChallengeGameEngine) => {
    let lastTime = Date.now();
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000; // Convert to seconds
      lastTime = now;

      engine.updateChallenge();
      particleSystemRef.current.update(deltaTime);

      // Render game
      if (canvasRef.current) {
        renderGame(engine);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  const renderGame = (_engine: ChallengeGameEngine) => {
    // Game rendering logic would go here
    // For now, this is handled by the React Native rendering
  };

  const handleGameOver = (engine: ChallengeGameEngine | null) => {
    if (!engine) return;
    setIsGameOver(true);
    const completed = engine.isChallengeCompleted();
    setIsCompleted(completed);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleScreenPress = (event: GestureResponderEvent) => {
    if (!gameEngine || isGameOver) return;

    const { locationY } = event.nativeEvent;
    const screenMiddle = screenHeight / 2;

    if (locationY < screenMiddle) {
      // Upper half: slide
      gameEngine.slide();
    } else {
      // Lower half: jump
      gameEngine.jump();
      const player = gameEngine.getPlayer();
      particleSystemRef.current.createJumpParticles(
        player.x + player.width / 2,
        player.y
      );

      audioManagerRef.current.playJumpSound(
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663551561515/H7fXkLw3MzMfyoVYqCCQcX/jump-sound_f7fd5c87.wav"
      );
    }
  };

  const handleRestart = async () => {
    setIsGameOver(false);
    setIsCompleted(false);
    setScore(0);
    setChallengeProgress(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    await initializeGame();
  };

  if (isGameOver) {
    return (
      <ScreenContainer
        className="flex-1 items-center justify-center"
        containerClassName="bg-black"
      >
        <View className="gap-6 items-center">
          {/* Challenge Status */}
          <View className="items-center gap-2">
            <Text
              className="text-4xl font-bold"
              style={{
                color: isCompleted ? "#22C55E" : colors.error,
                textShadowColor: isCompleted ? "#22C55E" : colors.error,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              }}
            >
              {isCompleted ? "CHALLENGE COMPLETE!" : "CHALLENGE FAILED"}
            </Text>
            <Text
              className="text-sm"
              style={{ color: colors.muted }}
            >
              {challenge.name}
            </Text>
          </View>

          {/* Score */}
          <View
            className="rounded-lg p-6 w-64"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 2,
              borderColor: colors.primary,
            }}
          >
            <View className="items-center gap-4">
              <View className="items-center">
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.muted }}
                >
                  FINAL {challengeLabel}
                </Text>
                <Text
                  className="text-3xl font-bold mt-2"
                  style={{
                    color: colors.primary,
                    textShadowColor: colors.primary,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 4,
                  }}
                >
                  {challengeValue}
                </Text>
              </View>

              <View
                className="w-full h-1 rounded-full"
                style={{ backgroundColor: colors.border }}
              >
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${challengeProgress}%`,
                    backgroundColor: isCompleted
                      ? "#22C55E"
                      : colors.primary,
                  }}
                />
              </View>

              <View className="items-center">
                <Text
                  className="text-sm font-semibold"
                  style={{ color: colors.muted }}
                >
                  SCORE
                </Text>
                <Text
                  className="text-2xl font-bold mt-1"
                  style={{
                    color: isCompleted ? "#FFD700" : colors.primary,
                    textShadowColor: isCompleted ? "#FFD700" : colors.primary,
                    textShadowOffset: { width: 0, height: 0 },
                    textShadowRadius: 4,
                  }}
                >
                  +{isCompleted ? challenge.reward : Math.floor(score)}
                </Text>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View className="gap-3 w-64">
            <Pressable
              onPress={handleRestart}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <View
                className="py-3 rounded-lg items-center"
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
                  className="text-base font-bold"
                  style={{ color: colors.background }}
                >
                  RETRY
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={onBack}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View
                className="py-3 rounded-lg items-center border"
                style={{
                  borderColor: colors.primary,
                  borderWidth: 1,
                }}
              >
                <Text
                  className="text-base font-bold"
                  style={{ color: colors.primary }}
                >
                  BACK TO CHALLENGES
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <Pressable
      onPress={handleScreenPress}
      style={{ flex: 1 }}
    >
      <ScreenContainer
        className="flex-1 bg-black"
        containerClassName="bg-black"
        safeAreaClassName="bg-black"
      >
        {/* HUD */}
        <View className="px-4 py-3 flex-row items-center justify-between border-b" style={{ borderColor: colors.border, borderBottomWidth: 1 }}>
          {/* Challenge Name */}
          <View>
            <Text
              className="text-xs font-semibold"
              style={{ color: colors.muted }}
            >
              {challenge.name.toUpperCase()}
            </Text>
            <Text
              className="text-lg font-bold mt-1"
              style={{
                color: colors.primary,
                textShadowColor: colors.primary,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 4,
              }}
            >
              {challengeValue}
            </Text>
          </View>

          {/* Challenge Label */}
          <Text
            className="text-xs font-semibold"
            style={{ color: colors.muted }}
          >
            {challengeLabel}
          </Text>

          {/* Score */}
          <View className="items-end">
            <Text
              className="text-xs font-semibold"
              style={{ color: colors.muted }}
            >
              SCORE
            </Text>
            <Text
              className="text-lg font-bold mt-1"
              style={{
                color: colors.primary,
                textShadowColor: colors.primary,
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 4,
              }}
            >
              {score}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="px-4 py-2">
          <View
            className="w-full h-2 rounded-full"
            style={{ backgroundColor: colors.border }}
          >
            <View
              className="h-full rounded-full"
              style={{
                width: `${challengeProgress}%`,
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 4,
              }}
            />
          </View>
        </View>

        {/* Game Area */}
        <View className="flex-1 bg-black">
          {/* Placeholder for game canvas */}
          <View className="flex-1 items-center justify-center">
            <Text
              className="text-sm"
              style={{ color: colors.muted }}
            >
              Game rendering...
            </Text>
          </View>
        </View>

        {/* Controls Info */}
        <View className="px-4 py-3 border-t" style={{ borderColor: colors.border, borderTopWidth: 1 }}>
          <Text
            className="text-xs text-center"
            style={{ color: colors.muted }}
          >
            TAP LOWER HALF TO JUMP • SWIPE DOWN TO SLIDE
          </Text>
        </View>
      </ScreenContainer>
    </Pressable>
  );
}
