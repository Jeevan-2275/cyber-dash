import React, { useState } from "react";
import { HomeScreen } from "../home-screen";
import { GameScreen } from "../game-screen";
import { GameOverScreen } from "../game-over-screen";
import { ChallengeScreen } from "../challenge-screen";
import { ChallengeGameScreen } from "../challenge-game-screen";
import { Challenge } from "@/lib/challenge-system";

type AppScreen = "home" | "game" | "gameOver" | "challenges" | "challengeGame";

export default function CyberDashApp() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("home");
  const [gameOverData, setGameOverData] = useState({ finalScore: 0, highScore: 0 });
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const handlePlay = () => {
    setCurrentScreen("game");
  };

  const handleGameOver = (finalScore: number, highScore: number) => {
    setGameOverData({ finalScore, highScore });
    setCurrentScreen("gameOver");
  };

  const handleRestart = () => {
    setCurrentScreen("game");
  };

  const handleHome = () => {
    setCurrentScreen("home");
  };

  const handleChallenges = () => {
    setCurrentScreen("challenges");
  };

  const handleStartChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setCurrentScreen("challengeGame");
  };

  const handleChallengeGameOver = (_score: number, _isCompleted: boolean) => {
    // Challenge game over - could show results or go back to challenges
    setCurrentScreen("challenges");
  };

  return (
    <>
      {currentScreen === "home" && (
        <HomeScreen onPlay={handlePlay} onChallenges={handleChallenges} />
      )}
      {currentScreen === "game" && <GameScreen onGameOver={handleGameOver} />}
      {currentScreen === "gameOver" && (
        <GameOverScreen
          finalScore={gameOverData.finalScore}
          highScore={gameOverData.highScore}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}
      {currentScreen === "challenges" && (
        <ChallengeScreen
          onStartChallenge={handleStartChallenge}
          onBack={handleHome}
        />
      )}
      {currentScreen === "challengeGame" && selectedChallenge && (
        <ChallengeGameScreen
          challenge={selectedChallenge}
          onGameOver={handleChallengeGameOver}
          onBack={() => setCurrentScreen("challenges")}
        />
      )}
    </>
  );
}
