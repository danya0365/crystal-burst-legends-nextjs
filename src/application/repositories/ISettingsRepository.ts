/**
 * ISettingsRepository
 * Repository interface for Settings data access
 */

export type SettingSection = "general" | "graphics" | "audio" | "account";

export interface SettingItem {
  id: string;
  section: SettingSection;
  label: string;
  description: string;
  type: "toggle" | "select" | "slider" | "action";
  value: boolean | string | number;
  options?: string[];
  min?: number;
  max?: number;
}

export interface Settings {
  items: SettingItem[];
  lastUpdated: string;
}

export interface ISettingsRepository {
  getAll(): Promise<Settings>;
  getBySection(section: SettingSection): Promise<SettingItem[]>;
  updateSetting(id: string, value: boolean | string | number): Promise<SettingItem>;
  resetToDefaults(): Promise<Settings>;
}
