# Cyber Dash - Setup & Run Guide

## Overview

**Cyber Dash** is a neon-themed infinite runner mobile game built with React Native and Expo. The game features smooth gameplay, dynamic obstacles, and a score-tracking system.

## Prerequisites

Before running the app, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** (pnpm is recommended)
- **Expo Go** app installed on your mobile device (iOS or Android)
- **Git** (optional, for cloning)

## Project Structure

```
cyber-dash/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation setup
│   │   └── index.tsx            # Main app container
│   ├── home-screen.tsx          # Home/menu screen
│   ├── game-screen.tsx          # Main game screen
│   └── game-over-screen.tsx     # Game over screen
├── lib/
│   ├── game-engine.ts           # Core game loop & physics
│   ├── audio-manager.ts         # Audio handling
│   └── particle-system.ts       # Particle effects
├── components/
│   ├── screen-container.tsx     # Safe area wrapper
│   └── ui/
│       └── icon-symbol.tsx      # Icon mapping
├── hooks/
│   ├── use-colors.ts            # Theme colors hook
│   ├── use-color-scheme.ts      # Dark/light mode
│   └── use-auth.ts              # Auth state
├── app.config.ts                # Expo configuration
├── tailwind.config.js           # Tailwind CSS config
├── theme.config.js              # Color theme config
└── package.json                 # Dependencies

```

## Installation

### 1. Clone or Navigate to Project

```bash
cd /home/ubuntu/cyber-dash
```

### 2. Install Dependencies

Using pnpm (recommended):

```bash
pnpm install
```

Or using npm:

```bash
npm install
```

### 3. Verify Installation

Check that all dependencies are installed:

```bash
npm list expo expo-router react-native
```

## Running the App

### Option 1: Run on Web (for quick testing)

```bash
npm run dev:metro
```

This starts the Metro bundler on `http://localhost:8081`. Open in your browser to see the web preview.

### Option 2: Run on Expo Go (Recommended for Mobile Testing)

#### Step 1: Start the Dev Server

```bash
npm run dev:metro
```

#### Step 2: Open Expo Go on Your Device

- **iOS**: Open the App Store, search for "Expo Go", and install
- **Android**: Open Google Play Store, search for "Expo Go", and install

#### Step 3: Scan QR Code

1. The terminal will display a QR code
2. Open Expo Go on your device
3. Tap the "Scan QR Code" button
4. Point your camera at the terminal QR code
5. The app will load on your device

**Alternative**: If QR code doesn't work, use the connection URL shown in the terminal.

### Option 3: Run on iOS Simulator (macOS only)

```bash
npm run ios
```

### Option 4: Run on Android Emulator

```bash
npm run android
```

## Game Controls

### On Mobile (Expo Go)

- **Tap Lower Half of Screen**: Jump
- **Tap Upper Half of Screen**: Slide
- **Avoid Red Obstacles**: Walls you must jump over
- **Avoid Purple Obstacles**: Moving obstacles
- **Avoid Blue Gaps**: Holes you must jump over

### On Web

- **Click Lower Half**: Jump
- **Click Upper Half**: Slide

## Gameplay

1. **Start**: Tap "PLAY" on the home screen
2. **Survive**: Avoid obstacles for as long as possible
3. **Score**: Earn points for each obstacle successfully avoided
4. **Speed**: Game speed increases as your score increases
5. **Game Over**: Collision with any obstacle ends the game
6. **High Score**: Your best score is saved automatically

## Features

✅ **Smooth Game Loop** - 60 FPS gameplay with optimized rendering
✅ **Dynamic Obstacles** - Three types: walls, gaps, moving obstacles
✅ **Progressive Difficulty** - Speed increases with score
✅ **High Score Persistence** - Saved using AsyncStorage
✅ **Neon Aesthetics** - Cyan, pink, and purple color scheme
✅ **Responsive UI** - Works on all mobile screen sizes
✅ **Haptic Feedback** - Button presses trigger vibrations
✅ **Clean Architecture** - Modular, well-organized code

## Testing

### Run Unit Tests

```bash
npm test
```

This runs all tests in `lib/game-engine.test.ts`. All 27 tests should pass.

### Expected Output

```
✓ lib/game-engine.test.ts (27 tests) 15ms

Test Files  1 passed (1)
     Tests  27 passed (27)
```

## Troubleshooting

### Issue: "Cannot find module 'expo-router'"

**Solution**: Run `pnpm install` or `npm install` again to ensure all dependencies are installed.

### Issue: QR Code Not Scanning

**Solution**: 
1. Make sure your phone and computer are on the same WiFi network
2. Try entering the connection URL manually in Expo Go
3. Restart the dev server: `npm run dev:metro`

### Issue: App Crashes on Startup

**Solution**:
1. Check the terminal for error messages
2. Run `npm run check` to verify TypeScript
3. Clear Metro cache: `npm run dev:metro -- --reset-cache`

### Issue: Game Doesn't Respond to Taps

**Solution**:
1. Make sure you're tapping the game area (not the HUD)
2. Try restarting the app in Expo Go
3. Check that your device's touch input is working

### Issue: Performance Issues / Lag

**Solution**:
1. Close other apps on your device
2. Restart Expo Go
3. Try running on a different device
4. Check device storage - low storage can cause lag

## Building for Production

### Build APK (Android)

```bash
eas build --platform android
```

### Build IPA (iOS)

```bash
eas build --platform ios
```

Note: Requires EAS account setup. See [Expo EAS Documentation](https://docs.expo.dev/build/introduction/).

## Project Configuration

### Theme Colors

Edit `theme.config.js` to customize colors:

```javascript
const themeColors = {
  primary: { light: '#0a7ea4', dark: '#0a7ea4' },
  background: { light: '#ffffff', dark: '#151718' },
  // ... other colors
};
```

### App Name & Icon

Edit `app.config.ts`:

```typescript
const env = {
  appName: "Cyber Dash",
  appSlug: "cyber-dash",
  logoUrl: "", // S3 URL to custom logo
};
```

## Performance Optimization

The game is optimized for smooth performance:

- **UI Updates**: Throttled to 30 FPS (every 2 frames)
- **Game Loop**: 60 FPS internal updates
- **Rendering**: Minimal re-renders using React optimization
- **Memory**: Efficient obstacle pooling and cleanup

## Code Quality

- **TypeScript**: Full type safety
- **Linting**: ESLint configured
- **Testing**: 27 unit tests for game engine
- **Formatting**: Prettier configured

## Next Steps

After the MVP is stable, consider adding:

1. **Daily Challenges** - Time-limited game modes
2. **Power-ups** - Shield, speed boost, score multiplier
3. **Leaderboard** - Global high scores
4. **Achievements** - Unlock badges
5. **Settings** - Volume, difficulty, themes
6. **Multiplayer** - Compete with friends

## Support & Debugging

### View Logs

In Expo Go, shake your device to open the developer menu:

- **View Logs**: See console output
- **Reload**: Restart the app
- **Dev Settings**: Access debugging options

### Enable Debug Mode

```bash
npm run dev:metro -- --dev
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [NativeWind (Tailwind for RN)](https://www.nativewind.dev/)
- [Expo Router](https://docs.expo.dev/routing/introduction/)

## License

This project is created for educational purposes.

---

**Happy Gaming!** 🎮✨
