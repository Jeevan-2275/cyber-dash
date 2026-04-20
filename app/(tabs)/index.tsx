import React, { useState } from "react";
import { HomeScreen } from "../home-screen";
import { GameScreen } from "../game-screen";
import { GameOverScreen } from "../game-over-screen";
import { SimpleLevelSelect } from "../simple-level-select";
import { SimpleLevelGame } from "../simple-level-game";
import { SimpleLevelGameOver } from "../simple-level-gameover";
import { SimpleLevel, SIMPLE_LEVELS } from "@/lib/simple-levels";
import { SimpleLevelProgress } from "@/lib/simple-level-progress";

type AppScreen = "home" | "game" | "gameOver" | "levelSelect" | "levelGame" | "levelGameOver";

interface LevelGameOverData {
  level: SimpleLevel;
  score: number;
  completed: boolean;
}

export default function CyberDashApp() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("home");
  const [gameOverData, setGameOverData] = useState({ finalScore: 0, highScore: 0 });
  const [selectedLevel, setSelectedLevel] = useState<SimpleLevel>(SIMPLE_LEVELS[0]);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [levelGameOverData, setLevelGameOverData] = useState<LevelGameOverData>({
    level: SIMPLE_LEVELS[0],
    score: 0,
    completed: false,
  });

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

  const handleLevelSelect = (levelId: number) => {
    const level = SIMPLE_LEVELS[levelId];
    setSelectedLevel(level);
    setCurrentScreen("levelGame");
  };

  const handleLevelComplete = (levelId: number, score: number) => {
    const level = SIMPLE_LEVELS[levelId];
    const newCompletedLevels = [...completedLevels];
    if (!newCompletedLevels.includes(levelId)) {
      newCompletedLevels.push(levelId);
      setCompletedLevels(newCompletedLevels);
    }
    setLevelGameOverData({ level, score, completed: true });
    setCurrentScreen("levelGameOver");
  };

  const handleLevelFailed = () => {
    setLevelGameOverData({ level: selectedLevel, score: 0, completed: false });
    setCurrentScreen("levelGameOver");
  };

  const handleLevelRetry = () => {
    setCurrentScreen("levelGame");
  };

  const handleLevelNext = () => {
    const nextLevelId = selectedLevel.id + 1;
    if (nextLevelId < SIMPLE_LEVELS.length) {
      const nextLevel = SIMPLE_LEVELS[nextLevelId];
      setSelectedLevel(nextLevel);
      setCurrentScreen("levelGame");
    } else {
      setCurrentScreen("levelSelect");
    }
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
        <SimpleLevelSelect
          completedLevels={completedLevels}
          onSelectLevel={handleLevelSelect}
          onBack={handleHome}
        />
      )}
      {currentScreen === "levelGame" && (
        <SimpleLevelGame
          level={selectedLevel}
          onLevelComplete={handleLevelComplete}
          onLevelFailed={handleLevelFailed}
        />
      )}
      {currentScreen === "levelGameOver" && (
        <SimpleLevelGameOver
          level={levelGameOverData.level}
          score={levelGameOverData.score}
          completed={levelGameOverData.completed}
          onRetry={handleLevelRetry}
          onNextLevel={handleLevelNext}
          onBack={handleHome}
        />
      )}
    </>
  );
}
