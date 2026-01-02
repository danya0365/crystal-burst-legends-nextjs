import { IMailRepository, Mail } from "@/src/application/repositories/IMailRepository";
import { Metadata } from "next";

export interface MailViewModel {
  mails: Mail[];
  unreadCount: number;
  unclaimedCount: number;
}

export class MailPresenter {
  constructor(private readonly repository: IMailRepository) {}

  async getViewModel(): Promise<MailViewModel> {
    const mails = await this.repository.getAll();
    return {
      mails,
      unreadCount: mails.filter((m) => !m.read).length,
      unclaimedCount: mails.filter((m) => !m.claimed && m.attachments.length > 0).length,
    };
  }

  generateMetadata(): Metadata {
    return {
      title: "Mail | Crystal Burst Legends",
      description: "Your inbox and rewards",
    };
  }

  async markAsRead(id: string) {
    return this.repository.markAsRead(id);
  }

  async claimAttachments(id: string) {
    return this.repository.claimAttachments(id);
  }

  async claimAll() {
    return this.repository.claimAll();
  }
}
