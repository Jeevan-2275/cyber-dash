# Cyber Dash — QA Testing Guide

Comprehensive testing checklist to ensure production-ready quality.

## Pre-Release Testing Checklist

### Core Gameplay
- [ ] Game starts without crashes
- [ ] Countdown displays correctly (3, 2, 1)
- [ ] Player character renders and moves smoothly
- [ ] Obstacles spawn and move correctly
- [ ] Collision detection works accurately
- [ ] Score updates in real-time
- [ ] Speed multiplier increases smoothly
- [ ] Game ends on collision
- [ ] High score is saved and persists

### Controls & Input
- [ ] Tap lower half to jump works
- [ ] Tap upper half to slide works
- [ ] Jump animation is smooth
- [ ] Slide animation is smooth
- [ ] Controls are responsive (no lag)
- [ ] Multiple taps are handled correctly
- [ ] Swipe gestures work on all screen sizes

### UI & Navigation
- [ ] Home screen displays correctly
- [ ] Play button is clickable
- [ ] Game screen HUD shows score, speed, high score
- [ ] Combo counter displays when combo > 0
- [ ] Pause button is visible and clickable
- [ ] Pause menu displays correctly
- [ ] Resume button works
- [ ] Game Over screen displays correctly
- [ ] Retry button works
- [ ] Home button works

### Pause/Resume
- [ ] Pause stops game immediately
- [ ] Resume continues game smoothly
- [ ] Score doesn't change while paused
- [ ] Pause menu is dismissible
- [ ] Multiple pause/resume cycles work

### Audio
- [ ] Background music plays on game start
- [ ] Music loops seamlessly
- [ ] Jump sound plays on jump
- [ ] Collision sound plays on collision
- [ ] Audio doesn't cause crashes
- [ ] Audio works in silent mode (iOS)
- [ ] Audio volume is appropriate

### Data Persistence
- [ ] High score is saved
- [ ] High score persists after app close
- [ ] High score loads on app restart
- [ ] Coins are saved
- [ ] Coins persist after app close
- [ ] Coins load on app restart
- [ ] Progression data is saved correctly

### Performance
- [ ] Game runs at 60 FPS during gameplay
- [ ] No frame drops or stuttering
- [ ] No memory leaks (check after 10+ games)
- [ ] App doesn't crash after extended play
- [ ] Loading time is < 3 seconds
- [ ] Smooth transitions between screens

### Monetization
- [ ] Ads initialize without crashing
- [ ] Rewarded ad button appears
- [ ] Rewarded ad displays correctly
- [ ] Reward is granted after ad
- [ ] Interstitial ad displays after game over
- [ ] Ad doesn't interrupt gameplay
- [ ] Ad can be closed/skipped

### Analytics
- [ ] Game start event is tracked
- [ ] Game over event is tracked
- [ ] Score is recorded correctly
- [ ] Session duration is tracked
- [ ] No analytics errors in console

### Responsive Design
- [ ] UI scales correctly on small screens (4.5")
- [ ] UI scales correctly on medium screens (5.5")
- [ ] UI scales correctly on large screens (6.5"+)
- [ ] Text is readable on all screen sizes
- [ ] Buttons are tappable on all screen sizes
- [ ] Game area fills screen appropriately
- [ ] No elements are cut off or hidden

### Edge Cases
- [ ] App handles network disconnection
- [ ] App handles low memory gracefully
- [ ] App handles rapid taps correctly
- [ ] App handles screen rotation (if enabled)
- [ ] App handles app backgrounding/foregrounding
- [ ] App handles permission requests
- [ ] App handles device lock/unlock

### Error Handling
- [ ] No console errors or warnings
- [ ] No red screen errors
- [ ] Crashes are logged and reported
- [ ] App recovers from errors gracefully
- [ ] User is informed of errors

## Device Testing

### Android Devices

Test on at least these configurations:

| Device | OS | Screen Size | Status |
|--------|----|----|--------|
| Samsung Galaxy S21 | Android 12 | 6.2" | [ ] |
| Samsung Galaxy A12 | Android 11 | 6.5" | [ ] |
| Google Pixel 6 | Android 12 | 6.1" | [ ] |
| OnePlus 9 | Android 11 | 6.55" | [ ] |
| Xiaomi Redmi Note 10 | Android 11 | 6.43" | [ ] |
| Older device (Android 8-9) | Android 8-9 | 5.5" | [ ] |

### iOS Devices

Test on at least these configurations:

| Device | OS | Screen Size | Status |
|--------|----|----|--------|
| iPhone 13 | iOS 15+ | 6.1" | [ ] |
| iPhone 12 | iOS 15+ | 6.1" | [ ] |
| iPhone SE | iOS 15+ | 4.7" | [ ] |
| iPhone 11 | iOS 15+ | 6.1" | [ ] |
| iPad (7th gen) | iPadOS 15+ | 10.2" | [ ] |

## User Flow Testing

### Complete User Journey

1. **First Launch**
   - [ ] App installs without errors
   - [ ] Splash screen displays
   - [ ] Home screen loads
   - [ ] No permission errors
   - [ ] High score shows 0

2. **First Game**
   - [ ] Tap Play button
   - [ ] Countdown displays (3, 2, 1)
   - [ ] Game starts
   - [ ] Player can jump and slide
   - [ ] Obstacles appear
   - [ ] Collision ends game
   - [ ] Score is recorded
   - [ ] High score updates

3. **Replay**
   - [ ] Tap Retry button
   - [ ] New game starts
   - [ ] Previous high score is shown
   - [ ] Game works smoothly

4. **Home**
   - [ ] Tap Home button
   - [ ] Return to home screen
   - [ ] High score is displayed
   - [ ] Play button is ready

5. **Extended Play**
   - [ ] Play 5+ games in succession
   - [ ] No crashes or errors
   - [ ] Performance remains smooth
   - [ ] Memory usage is stable

## Crash Testing

### Stress Testing

- [ ] Play 20 consecutive games
- [ ] Rapidly tap pause/resume
- [ ] Force close app during game
- [ ] Restart app after force close
- [ ] Toggle airplane mode during game
- [ ] Rotate device during game
- [ ] Minimize/maximize app repeatedly

### Memory Testing

- [ ] Monitor memory usage with DevTools
- [ ] No memory leaks after 10+ games
- [ ] Memory is released on game over
- [ ] No crashes on low memory devices

## Performance Metrics

### Target Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| FPS during gameplay | 60 | [ ] |
| Load time | < 3s | [ ] |
| Memory usage | < 100MB | [ ] |
| Battery drain (1 hour) | < 10% | [ ] |
| Crash rate | < 0.1% | [ ] |

## Bug Tracking

### Found Issues

| ID | Description | Severity | Status | Notes |
|----|-------------|----------|--------|-------|
| BUG-001 | [Issue] | [ ] Critical [ ] High [ ] Medium [ ] Low | [ ] Open [ ] Fixed [ ] Closed | |
| BUG-002 | | | | |

### Severity Levels

- **Critical:** Game crash, data loss, unplayable
- **High:** Major feature broken, severe performance issue
- **Medium:** Minor feature broken, occasional crash
- **Low:** Visual glitch, minor performance issue

## Sign-Off

- [ ] All critical bugs fixed
- [ ] All high priority bugs fixed
- [ ] Performance targets met
- [ ] All devices tested
- [ ] User flow tested
- [ ] Ready for production

**Tested by:** ________________
**Date:** ________________
**Approved by:** ________________
