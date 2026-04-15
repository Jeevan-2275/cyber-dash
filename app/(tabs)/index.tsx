import React, { useState } from "react";
import { HomeScreen } from "../home-screen";
import { GameScreen } from "../game-screen";
import { GameOverScreen } from "../game-over-screen";

type AppScreen = "home" | "game" | "gameOver";

export default function CyberDashApp() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("home");
  const [gameOverData, setGameOverData] = useState({ finalScore: 0, highScore: 0 });

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

  return (
    <>
      {currentScreen === "home" && <HomeScreen onPlay={handlePlay} />}
      {currentScreen === "game" && <GameScreen onGameOver={handleGameOver} />}
      {currentScreen === "gameOver" && (
        <GameOverScreen
          finalScore={gameOverData.finalScore}
          highScore={gameOverData.highScore}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}
    </>
  );
}
