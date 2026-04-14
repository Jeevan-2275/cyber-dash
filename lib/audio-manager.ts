/**
 * Audio Manager for Cyber Dash
 * Handles background music and sound effects
 */

import { setAudioModeAsync } from "expo-audio";

export class AudioManager {
  private backgroundMusicPlayer: any = null;
  private jumpSoundPlayer: any = null;
  private collisionSoundPlayer: any = null;
  private isMusicPlaying = false;

  constructor() {
    this.initializeAudioMode();
  }

  /**
   * Initialize audio mode for iOS silent mode
   */
  private async initializeAudioMode(): Promise<void> {
    try {
      await setAudioModeAsync({
        playsInSilentMode: true,
      });
    } catch (error) {
      console.error("Failed to set audio mode:", error);
    }
  }

  /**
   * Load and play background music
   */
  public async playBackgroundMusic(musicUri: string): Promise<void> {
    try {
      if (this.backgroundMusicPlayer) {
        await this.backgroundMusicPlayer.release();
      }

      const { sound } = await require("expo-audio").Audio.Sound.createAsync(
        { uri: musicUri },
        { shouldPlay: true, isLooping: true, rate: 1.0, volume: 0.7 }
      );

      this.backgroundMusicPlayer = sound;
      this.isMusicPlaying = true;
    } catch (error) {
      console.error("Failed to play background music:", error);
    }
  }

  /**
   * Stop background music
   */
  public async stopBackgroundMusic(): Promise<void> {
    try {
      if (this.backgroundMusicPlayer) {
        await this.backgroundMusicPlayer.stopAsync();
        await this.backgroundMusicPlayer.release();
        this.backgroundMusicPlayer = null;
        this.isMusicPlaying = false;
      }
    } catch (error) {
      console.error("Failed to stop background music:", error);
    }
  }

  /**
   * Pause background music
   */
  public async pauseBackgroundMusic(): Promise<void> {
    try {
      if (this.backgroundMusicPlayer && this.isMusicPlaying) {
        await this.backgroundMusicPlayer.pauseAsync();
        this.isMusicPlaying = false;
      }
    } catch (error) {
      console.error("Failed to pause background music:", error);
    }
  }

  /**
   * Resume background music
   */
  public async resumeBackgroundMusic(): Promise<void> {
    try {
      if (this.backgroundMusicPlayer && !this.isMusicPlaying) {
        await this.backgroundMusicPlayer.playAsync();
        this.isMusicPlaying = true;
      }
    } catch (error) {
      console.error("Failed to resume background music:", error);
    }
  }

  /**
   * Play jump sound effect
   */
  public async playJumpSound(soundUri: string): Promise<void> {
    try {
      if (this.jumpSoundPlayer) {
        await this.jumpSoundPlayer.release();
      }

      const { sound } = await require("expo-audio").Audio.Sound.createAsync(
        { uri: soundUri },
        { shouldPlay: true, rate: 1.0, volume: 0.6 }
      );

      this.jumpSoundPlayer = sound;
      sound.playAsync().catch((error: any) => console.error("Failed to play jump sound:", error));
    } catch (error) {
      console.error("Failed to load jump sound:", error);
    }
  }

  /**
   * Play collision sound effect
   */
  public async playCollisionSound(soundUri: string): Promise<void> {
    try {
      if (this.collisionSoundPlayer) {
        await this.collisionSoundPlayer.release();
      }

      const { sound } = await require("expo-audio").Audio.Sound.createAsync(
        { uri: soundUri },
        { shouldPlay: true, rate: 1.0, volume: 0.8 }
      );

      this.collisionSoundPlayer = sound;
      sound.playAsync().catch((error: any) => console.error("Failed to play collision sound:", error));
    } catch (error) {
      console.error("Failed to load collision sound:", error);
    }
  }

  /**
   * Set background music volume
   */
  public async setMusicVolume(volume: number): Promise<void> {
    try {
      if (this.backgroundMusicPlayer) {
        await this.backgroundMusicPlayer.setVolumeAsync(Math.max(0, Math.min(1, volume)));
      }
    } catch (error) {
      console.error("Failed to set music volume:", error);
    }
  }

  /**
   * Clean up all audio resources
   */
  public async cleanup(): Promise<void> {
    try {
      if (this.backgroundMusicPlayer) {
        await this.backgroundMusicPlayer.release();
        this.backgroundMusicPlayer = null;
      }
      if (this.jumpSoundPlayer) {
        await this.jumpSoundPlayer.release();
        this.jumpSoundPlayer = null;
      }
      if (this.collisionSoundPlayer) {
        await this.collisionSoundPlayer.release();
        this.collisionSoundPlayer = null;
      }
    } catch (error) {
      console.error("Failed to cleanup audio:", error);
    }
  }
}
