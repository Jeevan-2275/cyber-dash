import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, GestureResponderEvent, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GameEngine, GameEngineState, PlayerState, Obstacle } from "@/lib/game-engine";
import { ParticleSystem, Particle } from "@/lib/particle-system";
import { AudioManager } from "@/lib/audio-manager";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useColors } from "@/hooks/use-colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GameScreenProps {
  onGameOver: (finalScore: number, highScore: number) => void;
}

export function GameScreen({ onGameOver }: GameScreenProps) {
  const colors = useColors();
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameEngineState | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [screenDimensions, setScreenDimensions] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  const gameContainerRef = useRef<View>(null);
  const collisionFlashOpacity = useSharedValue(0);
  const particleSystemRef = useRef<ParticleSystem>(new ParticleSystem());
  const audioManagerRef = useRef<AudioManager>(new AudioManager());

  // Initialize game engine
  useEffect(() => {
    const initGame = async () => {
      try {
        const highScore = await AsyncStorage.getItem("highScore");
        const parsedHighScore = highScore ? parseInt(highScore, 10) : 0;

        const engine = new GameEngine(parsedHighScore);
        engine.setScreenDimensions(screenDimensions.width, screenDimensions.height);

        // Register callbacks
        engine.onStateChanged((state) => {
          setGameState(state);
          
          // Update particles
          particleSystemRef.current.update(0.016);
          setParticles(particleSystemRef.current.getParticles());

          // If game is over, save high score
          if (state.state === "gameOver") {
            AsyncStorage.setItem("highScore", state.highScore.toString());
            onGameOver(state.score, state.highScore);
          }
        });

        engine.onCollisionDetected(() => {
          // Flash screen on collision
          collisionFlashOpacity.value = withTiming(1, { duration: 100 }, () => {
            collisionFlashOpacity.value = withTiming(0, { duration: 200 });
          });
          
          // Create collision particles
          const player = engine.getPlayer();
          particleSystemRef.current.createCollisionParticles(
            player.x + player.width / 2,
            player.y + player.height / 2
          );
          
          // Play collision sound
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
      } catch (error) {
        console.error("Failed to initialize game:", error);
      }
    };

    initGame();

    return () => {
      if (gameEngine) {
        gameEngine.pause();
      }
      audioManagerRef.current.cleanup();
    };
  }, [screenDimensions]);

  // Handle screen tap (jump)
  const handleScreenTap = (event: GestureResponderEvent) => {
    if (!gameEngine) return;

    const { locationY } = event.nativeEvent;
    const screenHeight = screenDimensions.height;

    // If tap is in lower half, jump; if in upper half, slide
    if (locationY > screenHeight * 0.6) {
      gameEngine.jump();
      
      // Create jump particles
      const player = gameEngine.getPlayer();
      particleSystemRef.current.createJumpParticles(
        player.x + player.width / 2,
        player.y + player.height / 2
      );
      
      // Play jump sound
      audioManagerRef.current.playJumpSound(
        "https://d2xsxph8kpxj0f.cloudfront.net/310519663551561515/H7fXkLw3MzMfyoVYqCCQcX/jump-sound_f7fd5c87.wav"
      );
    } else {
      gameEngine.slide();
    }
  };

  // Collision flash animation
  const collisionFlashStyle = useAnimatedStyle(() => ({
    opacity: collisionFlashOpacity.value,
  }));

  if (!gameState) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground text-lg">Loading game...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0 bg-black" edges={["top", "left", "right"]}>
      {/* Game Canvas */}
      <Pressable
        ref={gameContainerRef}
        onPress={handleScreenTap}
        style={{
          flex: 1,
          backgroundColor: "#0A0E27",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* HUD - Score and Speed */}
        <View
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            zIndex: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#00D9FF",
              textShadowColor: "#00D9FF",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 10,
            }}
          >
            {gameState.score}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#A0A0A0",
              textShadowColor: "#FF006E",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 5,
            }}
          >
            {gameState.speedMultiplier.toFixed(1)}x
          </Text>
        </View>

        {/* Game Grid Background */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
          }}
        >
          {/* Animated grid lines */}
          {Array.from({ length: 20 }).map((_, i) => (
            <View
              key={`grid-h-${i}`}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: "#00D9FF",
                top: `${i * 5}%`,
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
            height: gameState.player.isSliding ? gameState.player.height * 0.5 : gameState.player.height,
            backgroundColor: "#00D9FF",
            borderRadius: 4,
            shadowColor: "#00D9FF",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 5,
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
                obstacle.type === "wall"
                  ? "#FF006E"
                  : obstacle.type === "moving"
                    ? "#8B00FF"
                    : "transparent",
              borderTopWidth: obstacle.type === "gap" ? 2 : 0,
              borderTopColor: "#FF006E",
              borderRadius: 4,
              shadowColor:
                obstacle.type === "wall"
                  ? "#FF006E"
                  : obstacle.type === "moving"
                    ? "#8B00FF"
                    : "transparent",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 8,
              elevation: 3,
            }}
          />
        ))}

        {/* Particles */}
        {particles.map((particle) => (
          <View
            key={particle.id}
            style={{
              position: "absolute",
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              borderRadius: particle.size / 2,
              backgroundColor: particle.color,
              opacity: particle.life,
              shadowColor: particle.color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 4,
            }}
          />
        ))}

        {/* Collision Flash */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "#FF006E",
              zIndex: 20,
            },
            collisionFlashStyle,
          ]}
        />
      </Pressable>
    </ScreenContainer>
  );
}
