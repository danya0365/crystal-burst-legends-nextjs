import { ISettingsRepository, SettingItem, Settings, SettingSection } from "@/src/application/repositories/ISettingsRepository";
import { Metadata } from "next";

export interface SettingsViewModel {
  settings: Settings;
  selectedSection: SettingSection;
  sectionItems: SettingItem[];
}

export class SettingsPresenter {
  constructor(private readonly repository: ISettingsRepository) {}

  async getViewModel(section: SettingSection = "general"): Promise<SettingsViewModel> {
    const [settings, sectionItems] = await Promise.all([
      this.repository.getAll(),
      this.repository.getBySection(section),
    ]);
    return { settings, selectedSection: section, sectionItems };
  }

  generateMetadata(): Metadata {
    return {
      title: "Settings | Crystal Burst Legends",
      description: "Game settings and options",
    };
  }

  async updateSetting(id: string, value: boolean | string | number): Promise<SettingItem> {
    return this.repository.updateSetting(id, value);
  }

  async getBySection(section: SettingSection): Promise<SettingItem[]> {
    return this.repository.getBySection(section);
  }

  async resetToDefaults(): Promise<Settings> {
    return this.repository.resetToDefaults();
  }
}
