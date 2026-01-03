/**
 * MockLegalRepository
 * Mock implementation for Legal pages
 */

import {
    ContactInfo,
    ILegalRepository,
    PrivacyContent,
    TermsContent,
} from "@/src/application/repositories/ILegalRepository";

const MOCK_TERMS: TermsContent = {
  title: "Terms of Service",
  sections: [
    {
      id: "t1",
      title: "1. Acceptance of Terms",
      content: "By accessing and using Crystal Burst Legends, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
    },
    {
      id: "t2",
      title: "2. User Account",
      content: "You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. Your profile data is stored locally on your device.",
    },
    {
      id: "t3",
      title: "3. Game Rules",
      content: "Players must not use cheats, exploits, automation software, bots, hacks, or any third-party software designed to modify the game experience.",
    },
    {
      id: "t4",
      title: "4. Virtual Currency",
      content: "All virtual currency and items purchased are non-refundable and have no real-world value. Crystals and coins earned in-game are for entertainment purposes only.",
    },
    {
      id: "t5",
      title: "5. Intellectual Property",
      content: "All game content, including characters, artwork, and music, is owned by Crystal Burst Legends and is protected by copyright laws.",
    },
    {
      id: "t6",
      title: "6. Modifications",
      content: "We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.",
    },
  ],
};

const MOCK_PRIVACY: PrivacyContent = {
  title: "Privacy Policy",
  sections: [
    {
      id: "p1",
      title: "Information We Collect",
      content: "We collect information you provide directly, such as profile names and game preferences. We also collect gameplay data to improve your experience.",
    },
    {
      id: "p2",
      title: "How We Use Your Information",
      content: "Your information is used to provide and improve the game, personalize your experience, and communicate with you about updates and events.",
    },
    {
      id: "p3",
      title: "Data Storage",
      content: "Your profile data is stored locally on your device using browser storage (localStorage). We do not transmit personal data to external servers.",
    },
    {
      id: "p4",
      title: "Cookies",
      content: "We use cookies and similar technologies to remember your preferences (like theme settings) and provide a seamless gaming experience.",
    },
    {
      id: "p5",
      title: "Your Rights",
      content: "You can delete your profile data at any time through the profile management screen. This will permanently remove all associated data from your device.",
    },
    {
      id: "p6",
      title: "Contact Us",
      content: "If you have questions about this Privacy Policy, please contact us through our contact page.",
    },
  ],
};

const MOCK_CONTACT: ContactInfo = {
  email: "support@crystalburst.com",
  discord: "discord.gg/crystalburst",
  twitter: "@crystalburst",
};

export class MockLegalRepository implements ILegalRepository {
  async getTermsContent(): Promise<TermsContent> {
    await this.delay(50);
    return { ...MOCK_TERMS };
  }

  async getPrivacyContent(): Promise<PrivacyContent> {
    await this.delay(50);
    return { ...MOCK_PRIVACY };
  }

  async getContactInfo(): Promise<ContactInfo> {
    await this.delay(50);
    return { ...MOCK_CONTACT };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockLegalRepository = new MockLegalRepository();
