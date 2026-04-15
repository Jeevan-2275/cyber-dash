# Cyber Dash - Architecture & Design

## Overview

Cyber Dash is built with a clean, modular architecture optimized for mobile performance and maintainability.

## Core Components

### 1. Game Engine (`lib/game-engine.ts`)

The heart of the game. Handles all game logic independently from the UI.

**Responsibilities:**
- Game loop (60 FPS)
- Player physics (jump, slide, gravity)
- Obstacle generation and movement
- Collision detection
- Score calculation
- Difficulty progression

**Key Methods:**
- `start()` - Begin the game
- `pause()` - Pause gameplay
- `resume()` - Resume from pause
- `end()` - End the game
- `jump()` - Make player jump
- `slide()` - Make player slide
- `getState()` - Get current game state
- `onStateChanged(callback)` - Register state change listener

**Physics Constants:**
```typescript
GRAVITY = 0.6              // Downward acceleration
JUMP_STRENGTH = -12        // Initial upward velocity
SLIDE_DURATION = 300 ms    // How long slide lasts
BASE_SPEED = 5             // Starting obstacle speed
MAX_SPEED = 12             // Maximum obstacle speed
SPEED_INCREMENT = 0.02     // Speed increase per frame
```

### 2. Game Screen (`app/game-screen.tsx`)

Renders the game UI and handles user input.

**Responsibilities:**
- Render player, obstacles, HUD
- Handle tap input (jump/slide)
- Display score and speed multiplier
- Manage game state updates
- Handle game over

**Optimization:**
- Updates UI every 2 frames (30 FPS) instead of 60
- Minimal re-renders using React optimization
- Direct style manipulation for game objects

### 3. Audio Manager (`lib/audio-manager.ts`)

Simplified for Expo Go compatibility.

**Responsibilities:**
- Queue background music
- Trigger sound effects
- Manage audio state

**Note:** Full audio playback is limited in Expo Go. In production, integrate with a proper audio library.

### 4. Particle System (`lib/particle-system.ts`)

Creates visual effects for collisions and events.

**Responsibilities:**
- Create particles at positions
- Update particle physics
- Render particles
- Clean up expired particles

**Currently Disabled:** Removed from main game loop for performance. Can be re-enabled in GameScreen if needed.

### 5. Navigation (`app/(tabs)/index.tsx`)

App-level state machine managing screen transitions.

**Screens:**
- `home` - Menu screen
- `game` - Active gameplay
- `gameOver` - Game over results

**State Transitions:**
```
home → game → gameOver → home
       ↑________________↓
```

## Data Flow

```
User Input (Tap)
    ↓
GameScreen.handleScreenPress()
    ↓
GameEngine.jump() / GameEngine.slide()
    ↓
GameEngine.update() (internal game loop)
    ↓
GameEngine.emitStateChange()
    ↓
GameScreen.setGameState() (UI update)
    ↓
Render updated game state
```

## Performance Optimizations

### 1. Throttled UI Updates

The game engine runs at 60 FPS, but UI updates only happen every 2 frames (30 FPS):

```typescript
updateCounterRef.current++;
if (updateCounterRef.current % 2 === 0) {
  setGameState(state);  // Only update UI every 2 frames
}
```

### 2. Minimal Re-renders

- Game objects use direct style manipulation, not React components
- No particle system in main render loop
- Obstacles rendered as simple View elements

### 3. Efficient Collision Detection

- Simple AABB (Axis-Aligned Bounding Box) collision
- O(n) complexity where n = number of obstacles
- Obstacles removed when off-screen

### 4. Memory Management

- Obstacles cleaned up when off-screen
- No memory leaks from event listeners
- Proper cleanup in useEffect return

## State Management

### Game State Structure

```typescript
interface GameEngineState {
  state: "idle" | "playing" | "gameOver"
  score: number
  highScore: number
  speed: number                    // Current obstacle speed
  speedMultiplier: number          // Visual multiplier (1.0 - 3.0x)
  player: PlayerState
  obstacles: Obstacle[]
  gameTime: number                 // ms elapsed
  frameCount: number               // Total frames
}
```

### Component State

- **App Level**: Current screen (home/game/gameOver)
- **GameScreen**: Game state, dimensions
- **HomeScreen**: High score display
- **GameOverScreen**: Final score, high score

### Persistent State

- **High Score**: Saved to AsyncStorage
- **Game Settings**: Can be extended with AsyncStorage

## Game Loop

```
1. requestAnimationFrame(loop)
2. Calculate deltaTime
3. Update game state (physics, obstacles, collisions)
4. Emit state change callback
5. UI updates (throttled)
6. Render
7. Repeat
```

## Obstacle System

### Obstacle Types

1. **Wall** - Solid obstacle, must jump over
2. **Gap** - Empty space, must jump across
3. **Moving** - Moves horizontally, must avoid

### Spawning Algorithm

```
1. Calculate spawn interval based on speed
2. Random selection of obstacle type
3. Random vertical position (top, middle, bottom)
4. Add to obstacles array
5. Remove when off-screen
```

### Difficulty Progression

```
Score → Speed Multiplier
0-100   → 1.0x
100-300 → 1.5x
300+    → 2.0x+
```

## Input Handling

### Tap Detection

```
Screen divided into two halves:
- Upper half (y < screenHeight/2) → Slide
- Lower half (y >= screenHeight/2) → Jump
```

### Constraints

- Can't jump while already jumping
- Can't slide while already sliding
- Can't jump while sliding (and vice versa)

## Collision Detection

### Algorithm

```
For each obstacle:
  if (playerX + playerWidth > obstacleX &&
      playerX < obstacleX + obstacleWidth &&
      playerY + playerHeight > obstacleY &&
      playerY < obstacleY + obstacleHeight) {
    // Collision detected
    gameOver()
  }
```

### Special Cases

- **Gaps**: Collision only if player falls through gap
- **Moving Obstacles**: Collision calculated every frame

## Styling Approach

### Theme System

- **Colors**: Defined in `theme.config.js`
- **Tailwind CSS**: Used for layout (NativeWind)
- **Inline Styles**: Used for game objects (performance)

### Neon Aesthetic

- **Primary Color**: Cyan (#00D9FF)
- **Secondary Color**: Pink (#FF006E)
- **Accent Color**: Purple (#8B00FF)
- **Background**: Black (#000000)
- **Glow Effects**: Text shadows and shadows

## Testing Strategy

### Unit Tests

- Game engine logic (27 tests)
- Physics calculations
- Collision detection
- Obstacle spawning
- Score calculation

### Manual Testing

- Tap input responsiveness
- Smooth gameplay on device
- High score persistence
- Screen transitions

### Performance Testing

- FPS monitoring
- Memory usage
- CPU usage
- Battery drain

## Future Improvements

### Phase 2: Features

1. **Daily Challenges** - Time-limited game modes
2. **Power-ups** - Shield, speed boost, score multiplier
3. **Leaderboard** - Global high scores
4. **Achievements** - Unlock badges

### Phase 3: Polish

1. **Animations** - Smooth transitions
2. **Sound Design** - Full audio integration
3. **Particle Effects** - Enhanced visuals
4. **Settings** - Volume, difficulty, themes

### Phase 4: Monetization

1. **Ad Integration** - Banner and interstitial ads
2. **In-App Purchases** - Premium skins, power-ups
3. **Analytics** - User engagement tracking

## Deployment

### Development

```bash
npm run dev:metro
# Scan QR code in Expo Go
```

### Production

```bash
eas build --platform ios
eas build --platform android
```

## Dependencies

### Core

- **React Native** - Mobile framework
- **Expo** - React Native distribution
- **React** - UI library
- **TypeScript** - Type safety

### UI

- **NativeWind** - Tailwind CSS for React Native
- **react-native-reanimated** - Animations
- **expo-haptics** - Vibration feedback

### Storage

- **@react-native-async-storage/async-storage** - Local data persistence

### Development

- **TypeScript** - Type checking
- **Vitest** - Unit testing
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Code Quality Standards

- **TypeScript**: No `any` types
- **Testing**: >80% coverage for game engine
- **Linting**: ESLint passes
- **Formatting**: Prettier formatted
- **Comments**: Key functions documented

## Security Considerations

- No sensitive data stored locally
- No external API calls (offline-first)
- No user tracking or analytics
- No ads or third-party SDKs (MVP)

---

**Last Updated**: April 2026
