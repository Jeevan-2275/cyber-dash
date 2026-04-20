import React, { useState, useEffect } from "react";
import { HomeScreen } from "../home-screen";
import { GameScreen } from "../game-screen";
import { GameOverScreen } from "../game-over-screen";
import { LevelSelectScreen } from "../level-select-screen";
import { LevelGameScreen } from "../level-game-screen";
import { LevelCompleteScreen } from "../level-complete-screen";
import { LevelGameOverScreen } from "../level-game-over-screen";
import { LevelProgressionManager } from "@/lib/level-progression";

type AppScreen = "home" | "game" | "gameOver" | "levelSelect" | "levelGame" | "levelComplete" | "levelGameOver";

interface LevelGameOverData {
  levelId: number;
  score: number;
  stars: number;
}

export default function CyberDashApp() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("home");
  const [gameOverData, setGameOverData] = useState({ finalScore: 0, highScore: 0 });
  const [levelGameOverData, setLevelGameOverData] = useState<LevelGameOverData>({ levelId: 0, score: 0, stars: 0 });
  const [selectedLevelId, setSelectedLevelId] = useState(1);
  const [progressionManager] = useState(() => new LevelProgressionManager());

  // Initialize progression manager on mount
  useEffect(() => {
    progressionManager.initialize().catch(console.error);
  }, [progressionManager]);

  // Infinite Mode Handlers
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

  // Level Mode Handlers
  const handleLevelMode = () => {
    setCurrentScreen("levelSelect");
  };

  const handleSelectLevel = (levelId: number) => {
    // Validate that level is unlocked (prevent cheating)
    if (!progressionManager.isLevelUnlocked(levelId)) {
      console.warn(`[Security] Attempted to select locked level ${levelId}`);
      return; // Silently ignore attempt to select locked level
    }
    setSelectedLevelId(levelId);
    setCurrentScreen("levelGame");
  };

  const handleLevelGameOver = (levelId: number, score: number, stars: number, isCompleted: boolean) => {
    setLevelGameOverData({ levelId, score, stars });
    if (isCompleted) {
      // Level successfully completed - show rewards and unlock next level
      setCurrentScreen("levelComplete");
    } else {
      // Game over (collision) - show retry screen
      setCurrentScreen("levelGameOver");
    }
  };

  const handleNextLevel = (levelId: number) => {
    if (levelId < 10) {
      setSelectedLevelId(levelId + 1);
      setCurrentScreen("levelGame");
    } else {
      // All levels completed
      setCurrentScreen("levelSelect");
    }
  };

  const handleRetryLevel = (levelId: number) => {
    setSelectedLevelId(levelId);
    setCurrentScreen("levelGame");
  };

  const handleBackToLevelSelect = () => {
    setCurrentScreen("levelSelect");
  };

  const handleLevelGameOverRetry = (levelId: number) => {
    setSelectedLevelId(levelId);
    setCurrentScreen("levelGame");
  };

  const handleLevelGameOverBack = () => {
    setCurrentScreen("levelSelect");
  };

  return (
    <>
      {currentScreen === "home" && <HomeScreen onPlay={handlePlay} onLevelMode={handleLevelMode} />}
      {currentScreen === "game" && <GameScreen onGameOver={handleGameOver} />}
      {currentScreen === "gameOver" && (
        <GameOverScreen
          finalScore={gameOverData.finalScore}
          highScore={gameOverData.highScore}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}
      {currentScreen === "levelSelect" && (
        <LevelSelectScreen
          onSelectLevel={handleSelectLevel}
          onBack={handleHome}
          progressionManager={progressionManager}
        />
      )}
      {currentScreen === "levelGame" && (
        <LevelGameScreen
          levelId={selectedLevelId}
          onGameOver={handleLevelGameOver}
          onBack={handleBackToLevelSelect}
        />
      )}
      {currentScreen === "levelComplete" && (
        <LevelCompleteScreen
          levelId={levelGameOverData.levelId}
          score={levelGameOverData.score}
          stars={levelGameOverData.stars}
          onNextLevel={handleNextLevel}
          onRetry={handleRetryLevel}
          onBack={handleBackToLevelSelect}
          progressionManager={progressionManager}
        />
      )}
      {currentScreen === "levelGameOver" && (
        <LevelGameOverScreen
          levelId={levelGameOverData.levelId}
          score={levelGameOverData.score}
          onRetry={handleLevelGameOverRetry}
          onBack={handleLevelGameOverBack}
        />
      )}
    </>
  );
}
