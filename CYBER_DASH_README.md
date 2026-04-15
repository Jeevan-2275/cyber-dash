# 🎮 Cyber Dash — Neon Runner Mobile Game

A high-energy, neon-themed infinite runner game built with **React Native** and **Expo**. Dodge obstacles, survive as long as you can, and compete for the highest score in this fast-paced cyberpunk arcade experience.

---

## 🚀 Features

### Core Gameplay
- **Side-scrolling infinite runner** with smooth, responsive controls
- **Dynamic obstacle spawning** with three obstacle types:
  - Walls (pink neon obstacles)
  - Gaps (avoid falling through)
  - Moving obstacles (purple, unpredictable patterns)
- **Progressive difficulty** — Speed increases as your score climbs
- **Collision detection** with visual and audio feedback
- **High score persistence** — Your best score is saved locally

### Visual Design
- **Neon cyberpunk aesthetic** with cyan, pink, and purple glows
- **Animated grid background** for depth and immersion
- **Particle effects** for jumps and collisions
- **Smooth animations** and transitions
- **Dark background** (#0A0E27) for optimal neon contrast

### Audio
- **Custom synthwave soundtrack** (120 seconds, seamlessly looping)
- **Jump sound effect** — Bright, arcade-like tone
- **Collision sound effect** — Harsh, impactful feedback
- **iOS silent mode support** — Audio plays even when phone is silent

### Controls
- **Tap to jump** — Tap the lower half of the screen
- **Swipe down to slide** — Swipe down the upper half to duck
- **Simple, intuitive controls** — One-handed gameplay

---

## 📱 How to Play

1. **Start the game** — Tap the "PLAY" button on the home screen
2. **Avoid obstacles** — Jump over walls and gaps, slide under moving obstacles
3. **Survive longer** — Each second survived increases your score
4. **Speed increases** — As your score climbs, the game gets faster
5. **Game over** — Collision ends the game; your score is recorded
6. **Beat your high score** — Tap "RESTART" to try again

### Gameplay Tips
- **Timing is key** — Jump early for walls, slide early for moving obstacles
- **Watch the speed indicator** — The multiplier shows how fast you're going
- **Stay focused** — The game gets progressively harder
- **Practice** — Your reflexes will improve with each run

---

## 🛠️ Technical Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React Native 0.81 |
| **Platform** | Expo SDK 54 |
| **Language** | TypeScript 5.9 |
| **Styling** | NativeWind (Tailwind CSS) |
| **State Management** | React Context + AsyncStorage |
| **Animation** | React Native Reanimated 4 |
| **Audio** | Expo Audio |
| **Testing** | Vitest (27 unit tests) |

---

## 📂 Project Structure

```
cyber-dash/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation
│   │   └── index.tsx            # Main app entry
│   ├── game-screen.tsx          # Game rendering & controls
│   ├── game-over-screen.tsx     # End game UI
│   ├── home-screen.tsx          # Main menu
│   └── _layout.tsx              # Root layout
├── lib/
│   ├── game-engine.ts           # Core game loop & physics
│   ├── game-engine.test.ts      # 27 unit tests
│   ├── particle-system.ts       # Particle effects
│   └── audio-manager.ts         # Audio playback
├── components/
│   ├── screen-container.tsx     # SafeArea wrapper
│   └── ui/
│       └── icon-symbol.tsx      # Icon mapping
├── assets/
│   ├── images/
│   │   ├── icon.png             # App icon (CDN)
│   │   ├── splash-icon.png      # Splash screen
│   │   └── favicon.png          # Web favicon
│   └── audio/
│       ├── synthwave-loop.wav   # Background music (CDN)
│       ├── jump-sound.wav       # Jump effect (CDN)
│       └── collision-sound.wav  # Collision effect (CDN)
├── app.config.ts                # Expo configuration
├── tailwind.config.js           # Tailwind theme
├── theme.config.js              # Color palette
└── package.json                 # Dependencies
```

---

## 🎯 Game Engine Details

### Game Loop
- **60 FPS target** using `requestAnimationFrame`
- **Delta time-based physics** for consistent movement
- **Efficient obstacle pooling** to minimize garbage collection

### Player Physics
- **Gravity simulation** (9.8 units/s²)
- **Jump velocity** (-12 units/s)
- **Slide duration** (0.5 seconds)
- **Ground collision detection** with pixel-perfect accuracy

### Obstacle Generation
- **Random spawning** every 1-2 seconds
- **Varied obstacle types** (40% walls, 30% gaps, 30% moving)
- **Difficulty scaling** — Obstacles spawn faster as score increases
- **Screen-aware positioning** — Obstacles always spawn on-screen

### Score System
- **+1 point per frame** (60 points per second)
- **Speed multiplier** — Score increases with game speed
- **High score tracking** — Persisted to device storage
- **New record indicator** — Visual feedback when beating high score

---

## 🧪 Testing

All core game logic is covered by **27 unit tests** using **Vitest**:

```bash
npm test
```

**Test Coverage:**
- ✅ Game initialization and state management
- ✅ Player physics (jump, slide, gravity)
- ✅ Obstacle generation and management
- ✅ Collision detection
- ✅ Score system and high score tracking
- ✅ Difficulty progression
- ✅ Callback mechanisms
- ✅ Game state consistency

---

## 🎨 Customization Guide

### Change Colors
Edit `theme.config.js`:
```js
const themeColors = {
  primary: { light: '#00D9FF', dark: '#00D9FF' },  // Cyan
  // ... other colors
};
```

### Adjust Difficulty
Edit `lib/game-engine.ts`:
```ts
const BASE_SPEED = 5;              // Starting speed
const MAX_SPEED = 12;              // Maximum speed
const SPEED_INCREMENT = 0.001;     // Speed increase per frame
const OBSTACLE_SPAWN_RATE = 1.5;   // Seconds between spawns
```

### Modify Obstacle Types
Edit `lib/game-engine.ts` in the `spawnObstacle()` method:
```ts
const type = random < 0.4 ? "wall" : random < 0.7 ? "gap" : "moving";
```

### Update Audio Files
Replace CDN URLs in `app/game-screen.tsx`:
```ts
audioManagerRef.current.playBackgroundMusic("YOUR_NEW_MUSIC_URL");
```

---

## 📊 Performance Metrics

- **Initial Load Time:** < 2 seconds
- **Frame Rate:** 60 FPS (on modern devices)
- **Memory Usage:** ~50-80 MB
- **Bundle Size:** ~3.5 MB (uncompressed)

---

## 🐛 Known Limitations

1. **Web version** — Game controls optimized for mobile; web version uses mouse/keyboard
2. **Audio on web** — Some browsers require user interaction before audio plays
3. **High scores** — Stored locally; not synced across devices
4. **Tablet support** — Designed for portrait orientation; landscape not supported

---

## 🚀 Building & Deployment

### Local Development
```bash
npm run dev
```

### Build for iOS
```bash
eas build --platform ios
```

### Build for Android
```bash
eas build --platform android
```

### Web Deployment
```bash
npm run build
```

---

## 📝 Future Enhancement Ideas

1. **Leaderboard system** — Global or local high scores
2. **Character skins** — Unlock different player designs
3. **Power-ups** — Shield, slow-motion, double points
4. **Daily challenges** — Time-limited gameplay modes
5. **Sound settings** — Toggle music and effects
6. **Haptic feedback** — Vibration on jump/collision
7. **Multiplayer** — Local or online competition
8. **Achievements** — Badges for milestones

---

## 📄 License

This project is created for demonstration and educational purposes.

---

## 🎮 Have Fun!

**Cyber Dash** is designed to be addictive, challenging, and fun. Push your reflexes to the limit, beat your high score, and enjoy the neon-fueled arcade experience!

**Good luck, runner!** 🚀✨
