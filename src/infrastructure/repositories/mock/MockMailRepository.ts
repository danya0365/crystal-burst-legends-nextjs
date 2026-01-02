import {
    IMailRepository,
    Mail,
    MailAttachment,
} from "@/src/application/repositories/IMailRepository";

const now = new Date();
const MOCK_MAILS: Mail[] = [
  {
    id: "m1",
    type: "reward",
    title: "Daily Login Reward",
    content: "Thank you for logging in today! Here are your rewards.",
    sender: "System",
    read: false,
    claimed: false,
    attachments: [
      { type: "crystal", name: "Crystals", amount: 50, icon: "💎" },
      { type: "coin", name: "Coins", amount: 5000, icon: "🪙" },
    ],
    sentAt: now.toISOString(),
  },
  {
    id: "m2",
    type: "event",
    title: "New Year Event Rewards",
    content: "Congratulations! You've earned these rewards from the New Year event.",
    sender: "Event Team",
    read: false,
    claimed: false,
    attachments: [
      { type: "crystal", name: "Crystals", amount: 200, icon: "💎" },
      { type: "item", name: "EXP Potion", amount: 5, icon: "🧪" },
    ],
    sentAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "m3",
    type: "system",
    title: "Welcome to Crystal Burst Legends!",
    content: "Welcome, adventurer! We hope you enjoy your journey. Here's a gift to get you started.",
    sender: "Crystal Burst Team",
    read: true,
    claimed: true,
    attachments: [
      { type: "crystal", name: "Crystals", amount: 500, icon: "💎" },
    ],
    sentAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "m4",
    type: "social",
    title: "DragonSlayer99 sent you a gift!",
    content: "Your friend DragonSlayer99 sent you a gift. Enjoy!",
    sender: "DragonSlayer99",
    read: false,
    claimed: false,
    attachments: [
      { type: "coin", name: "Coins", amount: 1000, icon: "🪙" },
    ],
    sentAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "m5",
    type: "reward",
    title: "PVP Season Rewards",
    content: "You finished in Gold rank this season. Here are your rewards!",
    sender: "PVP System",
    read: true,
    claimed: false,
    attachments: [
      { type: "crystal", name: "Crystals", amount: 300, icon: "💎" },
      { type: "coin", name: "Coins", amount: 10000, icon: "🪙" },
    ],
    sentAt: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

export class MockMailRepository implements IMailRepository {
  private mails = [...MOCK_MAILS];

  async getAll(): Promise<Mail[]> {
    await this.delay(100);
    return [...this.mails].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  }

  async getUnread(): Promise<Mail[]> {
    await this.delay(100);
    return this.mails.filter((m) => !m.read);
  }

  async markAsRead(id: string): Promise<Mail> {
    await this.delay(50);
    const index = this.mails.findIndex((m) => m.id === id);
    if (index === -1) throw new Error("Mail not found");
    this.mails[index] = { ...this.mails[index], read: true };
    return this.mails[index];
  }

  async claimAttachments(id: string): Promise<MailAttachment[]> {
    await this.delay(150);
    const index = this.mails.findIndex((m) => m.id === id);
    if (index === -1) throw new Error("Mail not found");
    if (this.mails[index].claimed) throw new Error("Already claimed");
    
    const attachments = this.mails[index].attachments;
    this.mails[index] = { ...this.mails[index], claimed: true, read: true };
    return attachments;
  }

  async claimAll(): Promise<MailAttachment[]> {
    await this.delay(200);
    const allAttachments: MailAttachment[] = [];
    
    for (let i = 0; i < this.mails.length; i++) {
      if (!this.mails[i].claimed && this.mails[i].attachments.length > 0) {
        allAttachments.push(...this.mails[i].attachments);
        this.mails[i] = { ...this.mails[i], claimed: true, read: true };
      }
    }
    
    return allAttachments;
  }

  async deleteRead(): Promise<void> {
    await this.delay(100);
    this.mails = this.mails.filter((m) => !m.read || !m.claimed);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
