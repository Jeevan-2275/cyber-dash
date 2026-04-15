/**
 * Audio Manager for Cyber Dash
 * Simplified for Expo Go compatibility
 * Note: Audio playback is limited in Expo Go
 */

export class AudioManager {
  private backgroundMusicUrl: string = "";
  private isMusicPlaying = false;

  constructor() {
    // Audio initialization simplified for Expo Go
  }

  /**
   * Queue background music (playback handled by component)
   */
  public async playBackgroundMusic(musicUri: string): Promise<void> {
    try {
      this.backgroundMusicUrl = musicUri;
      this.isMusicPlaying = true;
      console.log("Background music queued:", musicUri);
    } catch (error) {
      console.error("Failed to play background music:", error);
    }
  }

  /**
   * Stop background music
   */
  public async stopBackgroundMusic(): Promise<void> {
    try {
      this.isMusicPlaying = false;
      this.backgroundMusicUrl = "";
      console.log("Background music stopped");
    } catch (error) {
      console.error("Failed to stop background music:", error);
    }
  }

  /**
   * Pause background music
   */
  public async pauseBackgroundMusic(): Promise<void> {
    try {
      this.isMusicPlaying = false;
      console.log("Background music paused");
    } catch (error) {
      console.error("Failed to pause background music:", error);
    }
  }

  /**
   * Resume background music
   */
  public async resumeBackgroundMusic(): Promise<void> {
    try {
      this.isMusicPlaying = true;
      console.log("Background music resumed");
    } catch (error) {
      console.error("Failed to resume background music:", error);
    }
  }

  /**
   * Play jump sound effect
   */
  public async playJumpSound(_soundUri: string): Promise<void> {
    try {
      console.log("Jump sound triggered");
      // Audio playback is limited in Expo Go
    } catch (error) {
      console.error("Failed to play jump sound:", error);
    }
  }

  /**
   * Play collision sound effect
   */
  public async playCollisionSound(_soundUri: string): Promise<void> {
    try {
      console.log("Collision sound triggered");
      // Audio playback is limited in Expo Go
    } catch (error) {
      console.error("Failed to play collision sound:", error);
    }
  }

  /**
   * Set background music volume
   */
  public async setMusicVolume(_volume: number): Promise<void> {
    try {
      console.log("Music volume set");
    } catch (error) {
      console.error("Failed to set music volume:", error);
    }
  }

  /**
   * Clean up all audio resources
   */
  public async cleanup(): Promise<void> {
    try {
      this.isMusicPlaying = false;
      this.backgroundMusicUrl = "";
      console.log("Audio cleanup complete");
    } catch (error) {
      console.error("Failed to cleanup audio:", error);
    }
  }

  /**
   * Get background music URL
   */
  getBackgroundMusicUrl(): string {
    return this.backgroundMusicUrl;
  }

  /**
   * Check if music is playing
   */
  isPlaying(): boolean {
    return this.isMusicPlaying;
  }
}
