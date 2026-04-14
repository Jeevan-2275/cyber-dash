# Cyber Dash — Mobile App Design

## Overview
**Cyber Dash** is a high-energy, side-scrolling infinite runner game with a neon/cyberpunk aesthetic. The app is designed for mobile portrait orientation (9:16) with one-handed gameplay mechanics.

---

## Screen List

1. **Splash/Loading Screen**
   - Displays the Cyber Dash logo with neon glow
   - Brief loading animation
   - Transitions to Home Screen

2. **Home Screen (Main Menu)**
   - App title with neon glow effect
   - High score display
   - "Play" button (prominent, glowing)
   - "Settings" button (optional)
   - Background: Dark with subtle animated neon grid

3. **Game Screen (Gameplay)**
   - Player character (neon runner) on the left side
   - Scrolling obstacles (platforms, barriers, hazards)
   - Score counter (top-center)
   - Current speed/multiplier indicator (top-right)
   - Dark background with neon glow effects
   - Particle effects for jumps and collisions

4. **Game Over Screen**
   - Final score display (large, prominent)
   - High score comparison
   - "Restart" button (glowing)
   - "Home" button
   - Background: Dark with fade-in effect

5. **Settings Screen (Optional)**
   - Sound toggle (on/off)
   - Music volume slider
   - Difficulty selector (Easy/Medium/Hard)
   - Back button

---

## Primary Content and Functionality

### Home Screen
- **Title:** "CYBER DASH" with neon blue glow
- **High Score:** Displayed prominently below title
- **Play Button:** Large, glowing, centered
- **Visual:** Dark background (near black) with subtle animated grid pattern

### Game Screen
- **Player:** Small neon runner character on the left side (stays in place, camera follows)
- **Obstacles:** Dynamically spawned hazards (walls, gaps, moving platforms)
- **HUD Elements:**
  - Score (top-center): Large, glowing text
  - Speed Multiplier (top-right): Shows current game speed level
  - Lives/Health (optional): If applicable
- **Particle Effects:** Neon particles on jump, collision, and score increase
- **Background:** Dark with scrolling neon grid lines for depth

### Game Over Screen
- **Final Score:** Large, glowing text
- **High Score:** Smaller text below final score
- **Restart Button:** Glowing, centered
- **Home Button:** Secondary button below Restart
- **Visual:** Dark background with fade-in overlay

---

## Key User Flows

### Flow 1: Start Game
1. User launches app → Splash Screen appears
2. Splash transitions to Home Screen
3. User taps "Play" button
4. Game Screen loads with player at starting position
5. Game begins (obstacles spawn, speed increases)

### Flow 2: Gameplay Loop
1. Player taps screen to jump (or swipes down to slide)
2. Player avoids obstacles
3. Score increases as player survives
4. Speed gradually increases
5. Obstacles spawn dynamically with increasing difficulty
6. Collision with obstacle → Game Over

### Flow 3: Game Over
1. Player collides with obstacle
2. Game Over Screen appears
3. Final score and high score displayed
4. User taps "Restart" to play again or "Home" to return to menu

---

## Color Choices

### Neon Cyberpunk Palette
- **Primary Neon Blue:** `#00D9FF` (cyan glow)
- **Secondary Neon Pink:** `#FF006E` (magenta accent)
- **Tertiary Neon Purple:** `#8B00FF` (purple accent)
- **Background Dark:** `#0A0E27` (deep navy/black)
- **Surface Dark:** `#1A1F3A` (slightly lighter for cards/UI)
- **Text Primary:** `#FFFFFF` (white for contrast)
- **Text Muted:** `#A0A0A0` (gray for secondary text)
- **Glow Effect:** Layered shadows with cyan/pink for neon feel

### Visual Style
- **Aesthetic:** Dark mode with neon glows
- **Animations:** Smooth, fast-paced
- **Particle Effects:** Cyan and pink particles on interactions
- **Typography:** Bold, modern fonts (e.g., "Orbitron" or similar futuristic font)

---

## Interaction Design

### Tap to Jump
- User taps anywhere on screen to make player jump
- Haptic feedback on tap (light vibration)
- Visual feedback: Player character animates upward

### Swipe Down to Slide
- User swipes down on screen to make player slide
- Haptic feedback on swipe
- Visual feedback: Player character animates downward/flattens

### Score Increase
- Score increases as player survives longer
- Neon particles appear on score milestone (every 100 points)
- Sound effect plays (optional)

### Collision
- Player hits obstacle
- Screen flashes red/pink
- Haptic feedback (stronger vibration)
- Game Over Screen appears

---

## Technical Notes

- **Responsive Design:** Optimized for portrait orientation (9:16)
- **Performance:** Uses Canvas/Skia for smooth animations
- **Audio:** Synthwave background music loops continuously
- **State Management:** Local state for score, speed, obstacles
- **Accessibility:** Large tap targets, clear visual feedback

---

## MVP Scope

The initial MVP includes:
- Home Screen with Play button
- Game Screen with player physics (jump/slide)
- Dynamic obstacle spawning
- Score system
- Game Over Screen with restart
- Neon visuals and particle effects
- Synthwave soundtrack

Future enhancements:
- Leaderboards
- Character skins
- Daily challenges
- Power-ups
- Difficulty levels
