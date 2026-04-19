import React, { useState } from "react";
import { HomeScreen } from "../home-screen";
import { GameScreen } from "../game-screen";
import { GameOverScreen } from "../game-over-screen";
import { LevelSelectScreen } from "../level-select-screen";
import { LevelGameScreen } from "../level-game-screen";
import { LevelCompleteScreen } from "../level-complete-screen";

type AppScreen = "home" | "game" | "gameOver" | "levelSelect" | "levelGame" | "levelComplete";

export default function CyberDashApp() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("home");
  const [gameOverData, setGameOverData] = useState({ finalScore: 0, highScore: 0 });
  const [selectedLevelId, setSelectedLevelId] = useState(1);
  const [levelCompleteData, setLevelCompleteData] = useState({ levelId: 1, score: 0, stars: 0 });

  const handlePlay = () => {
    setCurrentScreen("game");
  };

  const handleLevelMode = () => {
    setCurrentScreen("levelSelect");
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

  const handleSelectLevel = (levelId: number) => {
    setSelectedLevelId(levelId);
    setCurrentScreen("levelGame");
  };

  const handleLevelGameOver = (levelId: number, score: number, stars: number) => {
    setLevelCompleteData({ levelId, score, stars });
    setCurrentScreen("levelComplete");
  };

  const handleNextLevel = () => {
    const nextLevelId = selectedLevelId + 1;
    if (nextLevelId <= 10) {
      setSelectedLevelId(nextLevelId);
      setCurrentScreen("levelGame");
    } else {
      setCurrentScreen("levelSelect");
    }
  };

  const handleRetryLevel = () => {
    setCurrentScreen("levelGame");
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
        <LevelSelectScreen onSelectLevel={handleSelectLevel} onBack={handleHome} />
      )}
      {currentScreen === "levelGame" && (
        <LevelGameScreen
          levelId={selectedLevelId}
          onGameOver={handleLevelGameOver}
          onBack={handleHome}
        />
      )}
      {currentScreen === "levelComplete" && (
        <LevelCompleteScreen
          levelId={levelCompleteData.levelId}
          score={levelCompleteData.score}
          stars={levelCompleteData.stars}
          onNextLevel={handleNextLevel}
          onRetry={handleRetryLevel}
          onBack={handleHome}
        />
      )}
    </>
  );
}
