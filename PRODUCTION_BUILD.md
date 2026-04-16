# Cyber Dash — Production Build Guide

This guide covers building, optimizing, and deploying Cyber Dash for production.

## Pre-Build Checklist

- [ ] All features tested and working
- [ ] No console errors or warnings
- [ ] All debug logs removed
- [ ] Performance optimized (60 FPS target)
- [ ] Responsive design verified on multiple screen sizes
- [ ] High score persistence tested
- [ ] Coins and progression system tested
- [ ] Ads integrated and tested
- [ ] Analytics tracking verified

## Build Configuration

### 1. Configure app.config.ts

Update the following in `app.config.ts`:

```typescript
const env = {
  appName: "Cyber Dash",
  appSlug: "cyber-dash",
  logoUrl: "https://your-s3-url/icon.png", // Update with actual S3 URL
  scheme: "manus20240115103045", // Keep as is
  iosBundleId: "space.manus.cyber.dash.t20240115103045",
  androidPackage: "space.manus.cyber.dash.t20240115103045",
};
```

### 2. Set Environment Variables

Create `.env.production`:

```
EXPO_PUBLIC_ENABLE_ADS=true
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID=ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy
EXPO_PUBLIC_ADMOB_INTERSTITIAL_AD_UNIT_ID=ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy
```

### 3. Configure EAS Build

Install EAS CLI:

```bash
npm install -g eas-cli
```

Login to Expo:

```bash
eas login
```

Initialize EAS:

```bash
eas build:configure
```

### 4. Build APK for Android

```bash
eas build --platform android --type apk
```

This generates an APK file suitable for Play Store testing.

### 5. Build AAB for Android (Play Store Release)

```bash
eas build --platform android --type app-bundle
```

This generates an Android App Bundle (AAB) for Play Store submission.

### 6. Build IPA for iOS

```bash
eas build --platform ios --type ipa
```

This generates an IPA file for TestFlight or App Store submission.

## Optimization Tips

### Bundle Size

Check bundle size:

```bash
npm run build
```

Optimize by:
- Removing unused dependencies
- Using dynamic imports for large modules
- Minifying and compressing assets

### Performance

- Target 60 FPS on mobile devices
- Use `React.memo` for expensive components
- Optimize re-renders with `useCallback` and `useMemo`
- Profile with React DevTools

### Loading Time

- Preload critical assets
- Lazy load non-critical screens
- Use code splitting for large features

## Testing Before Release

### Local Testing

```bash
# Test in development
npm run dev:metro

# Test in release mode (requires building)
npm run build
```

### Device Testing

1. **Android Testing:**
   - Install APK on Android device
   - Test all features
   - Verify ads display correctly
   - Check analytics tracking
   - Test offline functionality

2. **iOS Testing:**
   - Use TestFlight for beta testing
   - Test on multiple iOS versions
   - Verify performance on older devices

### Crash Testing

- Play multiple games in succession
- Test pause/resume repeatedly
- Force close and reopen app
- Test with low memory conditions

## Play Store Submission

### Android

1. **Create Google Play Developer Account** ($25 one-time fee)
2. **Create app listing:**
   - App name: Cyber Dash
   - Short description: "Fast-paced neon runner game"
   - Full description: (see STORE_ASSETS.md)
   - Screenshots: (see STORE_ASSETS.md)
   - Category: Games > Arcade
   - Content rating: PEGI 3 (or equivalent)

3. **Upload AAB:**
   - Go to Release > Production
   - Upload AAB file
   - Review and publish

### iOS

1. **Create Apple Developer Account** ($99/year)
2. **Create app listing in App Store Connect**
3. **Upload IPA via Xcode or Transporter**
4. **Submit for review**

## Post-Launch Monitoring

### Analytics Dashboard

Monitor:
- Daily Active Users (DAU)
- Session duration
- Retention rate (Day 1, Day 7, Day 30)
- Game over events
- Ad impressions and clicks

### Crash Reporting

Set up crash reporting to catch issues:
- Firebase Crashlytics
- Sentry
- Expo Updates

### User Feedback

- Monitor app store reviews
- Respond to user feedback
- Track feature requests
- Fix reported bugs quickly

## Rollback Plan

If critical issues are found after release:

1. **Identify the issue** via crash reports and user feedback
2. **Fix the bug** in the codebase
3. **Build a new version** with incremented version number
4. **Submit to app stores** for review
5. **Monitor for improvements** in metrics

## Version Management

Increment version in `app.config.ts`:

```typescript
version: "1.0.1", // Patch version for bug fixes
version: "1.1.0", // Minor version for new features
version: "2.0.0", // Major version for breaking changes
```

## Support & Resources

- **Expo Docs:** https://docs.expo.dev
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **Play Store Console:** https://play.google.com/console
- **App Store Connect:** https://appstoreconnect.apple.com
