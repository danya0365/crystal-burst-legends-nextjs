/**
 * MockSettingsRepository
 * Mock implementation for Settings data
 */

import {
    ISettingsRepository,
    SettingItem,
    Settings,
    SettingSection,
} from "@/src/application/repositories/ISettingsRepository";

const DEFAULT_SETTINGS: SettingItem[] = [
  // General
  { id: "notifications", section: "general", label: "Push Notifications", description: "Receive game notifications", type: "toggle", value: true },
  { id: "language", section: "general", label: "Language", description: "Game language", type: "select", value: "English", options: ["English", "日本語", "한국어", "ไทย"] },
  { id: "auto-play", section: "general", label: "Auto-Play", description: "Auto-play in battle", type: "toggle", value: false },
  
  // Graphics
  { id: "quality", section: "graphics", label: "Graphics Quality", description: "Visual quality setting", type: "select", value: "High", options: ["Low", "Medium", "High", "Ultra"] },
  { id: "fps", section: "graphics", label: "FPS Limit", description: "Frame rate limit", type: "select", value: "60", options: ["30", "60", "120", "Unlimited"] },
  { id: "animations", section: "graphics", label: "Battle Animations", description: "Show skill animations", type: "toggle", value: true },
  { id: "effects", section: "graphics", label: "Particle Effects", description: "Show particle effects", type: "toggle", value: true },
  
  // Audio
  { id: "master-volume", section: "audio", label: "Master Volume", description: "Overall game volume", type: "slider", value: 80, min: 0, max: 100 },
  { id: "music", section: "audio", label: "Background Music", description: "Enable background music", type: "toggle", value: true },
  { id: "sfx", section: "audio", label: "Sound Effects", description: "Enable sound effects", type: "toggle", value: true },
  { id: "voice", section: "audio", label: "Voice", description: "Enable character voices", type: "toggle", value: true },
  
  // Account
  { id: "link-google", section: "account", label: "Link Google", description: "Connect Google account", type: "action", value: false },
  { id: "link-apple", section: "account", label: "Link Apple", description: "Connect Apple account", type: "action", value: false },
  { id: "transfer", section: "account", label: "Transfer Account", description: "Generate transfer code", type: "action", value: "" },
];

export class MockSettingsRepository implements ISettingsRepository {
  private settings: SettingItem[] = [...DEFAULT_SETTINGS];

  async getAll(): Promise<Settings> {
    await this.delay(100);
    return {
      items: [...this.settings],
      lastUpdated: new Date().toISOString(),
    };
  }

  async getBySection(section: SettingSection): Promise<SettingItem[]> {
    await this.delay(100);
    return this.settings.filter((s) => s.section === section);
  }

  async updateSetting(id: string, value: boolean | string | number): Promise<SettingItem> {
    await this.delay(100);
    const index = this.settings.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Setting not found");
    
    this.settings[index] = { ...this.settings[index], value };
    return this.settings[index];
  }

  async resetToDefaults(): Promise<Settings> {
    await this.delay(200);
    this.settings = [...DEFAULT_SETTINGS];
    return this.getAll();
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockSettingsRepository = new MockSettingsRepository();
