# Cyber Dash — Level Mode Guide

## Overview

Level Mode adds a structured, progression-based gameplay experience to Cyber Dash. Players complete 10 increasingly difficult levels, each with unique objectives, themes, and rewards.

## Features

### 1. **10 Unique Levels**

Each level has:
- **Unique Theme**: Neon City, Dark Tunnel, or Cyber Grid
- **Progressive Difficulty**: 1-5 star difficulty rating
- **Specific Objectives**: Survive X seconds, reach X speed, collect X coins
- **Themed Obstacles**: Different obstacle types and patterns per level
- **Power-up Availability**: Shield, Slow Motion, Coin Magnet

### 2. **Level Progression**

- **Level 1 (Neon Dawn)**: Survive 30 seconds - Easy introduction
- **Level 2 (Speed Rush)**: Reach 2.0x speed multiplier - Speed challenge
- **Level 3 (Dark Tunnel)**: Survive 45 seconds - Dark theme
- **Level 4 (Cyber Grid)**: Survive 60 seconds - Cyber theme
- **Level 5 (Obstacle Course)**: Survive 45 seconds - Complex patterns
- **Level 6 (Speed Demon)**: Extreme speed, survive 30 seconds
- **Level 7 (Tunnel Chaos)**: Dark tunnel madness, survive 60 seconds
- **Level 8 (Grid Master)**: Master cyber grid, survive 75 seconds
- **Level 9 (Neon Inferno)**: Ultimate neon challenge, survive 90 seconds
- **Level 10 (Apex Predator)**: The ultimate test, survive 120 seconds

### 3. **Power-ups System**

#### Shield
- Blocks one collision
- Cyan glow effect
- Activates on first hit

#### Slow Motion
- Reduces game speed to 50%
- Magenta glow effect
- Lasts 3-8 seconds

#### Coin Magnet
- Auto-collects nearby coins
- Yellow glow effect
- Lasts 8 seconds

### 4. **Themed Environments**

#### Neon City
- **Primary Color**: Cyan (#00FFFF)
- **Secondary Color**: Magenta (#FF00FF)
- **Background**: Dark neon cityscape
- **Obstacles**: Pink walls, purple moving obstacles

#### Dark Tunnel
- **Primary Color**: Green (#00FF88)
- **Secondary Color**: Red (#FF0088)
- **Background**: Dark tunnel with grid
- **Obstacles**: Red walls, dark moving obstacles

#### Cyber Grid
- **Primary Color**: Yellow (#FFFF00)
- **Secondary Color**: Cyan (#00FFFF)
- **Background**: Cyber grid pattern
- **Obstacles**: Yellow walls, cyan moving obstacles

### 5. **Rewards System**

#### Base Coins
- Awarded for completing level
- Varies by level difficulty
- Level 1: 100 coins, Level 10: 400 coins

#### No Crash Bonus
- Awarded if player completes level without collision
- 50-200 coins depending on level

#### High Score Bonus
- Awarded if score exceeds base threshold
- 25-175 coins depending on level

#### Star Rating
- **1 Star**: Score ≥ base coins
- **2 Stars**: Score ≥ base coins × 1.5
- **3 Stars**: Score ≥ base coins × 2

### 6. **Level Completion Screen**

Shows:
- Level name and completion status
- Star rating (1-3 stars)
- Final score
- Coins earned breakdown
- Total coins for level
- Buttons: Next Level, Retry, Back to Levels

### 7. **Level Progression Tracking**

Persistent storage of:
- Completed levels
- Best score per level
- Stars achieved
- Total coins earned
- Attempts per level
- No-crash achievements

## How to Play

### Starting Level Mode

1. From home screen, tap **◆ LEVEL MODE**
2. View all available levels in level selection screen
3. Tap a level to start (only unlocked levels are playable)
4. First level is always unlocked; subsequent levels unlock after completion

### During Gameplay

- **Upper half of screen**: Swipe down to slide
- **Lower half of screen**: Tap to jump
- **Top-right button**: Pause/Resume
- **Progress bar**: Shows level completion percentage
- **HUD**: Displays score, time remaining, and active power-ups

### After Level Completion

- View results screen with stars and coins earned
- Choose: Next Level, Retry, or Back to Levels
- Level 10 completion returns to level selection

## Level Design Philosophy

### Difficulty Progression

- **Levels 1-3**: Introduction to mechanics (Difficulty 1-2)
- **Levels 4-6**: Intermediate challenges (Difficulty 2-4)
- **Levels 7-10**: Expert challenges (Difficulty 4-5)

### Obstacle Patterns

- **Early Levels**: Simple walls and gaps
- **Mid Levels**: Moving obstacles introduced
- **Late Levels**: Complex patterns with all obstacle types

### Speed Scaling

- **Base Speed**: 4-7 pixels/frame depending on level
- **Speed Multiplier**: 1.05-1.12 per second
- **Max Speed**: Capped at 12 pixels/frame

### Power-up Frequency

- **Easy Levels**: Higher spawn chance (15-20%)
- **Medium Levels**: Moderate spawn chance (12-15%)
- **Hard Levels**: Lower spawn chance (10-20%)

## Technical Implementation

### File Structure

```
lib/
  level-system.ts           # Level definitions and data
  level-game-engine.ts      # Level-specific game logic
  level-progression.ts      # Progress tracking and storage
  power-ups.ts              # Power-up implementations

app/
  level-select-screen.tsx   # Level selection UI
  level-game-screen.tsx     # Level gameplay screen
  level-complete-screen.tsx # Level completion results
```

### Data Persistence

- Uses AsyncStorage for local persistence
- Stores level progress, coins, and achievements
- Automatically saves on level completion

### Performance Optimizations

- Single game loop per level
- Throttled UI updates (30 FPS)
- Efficient obstacle pooling
- Minimal re-renders

## Future Enhancements

- Daily challenges with special rules
- Leaderboards for each level
- Achievements and badges
- Character skins and customization
- Level editor for custom levels
- Multiplayer level racing

## Troubleshooting

### Level Won't Start
- Ensure level is unlocked (complete previous level)
- Check device storage for AsyncStorage access
- Restart app and try again

### Power-ups Not Appearing
- Power-ups spawn randomly based on level configuration
- Try replaying level multiple times
- Check power-up spawn chance in level definition

### Progress Not Saving
- Verify AsyncStorage permissions
- Check device storage space
- Ensure app closes properly after level completion

### Performance Issues
- Reduce background processes
- Clear app cache
- Update to latest version
- Test on device with adequate RAM

## Credits

Level Mode was designed and implemented to provide a structured, progression-based alternative to infinite mode, with carefully balanced difficulty curves and engaging rewards systems.
