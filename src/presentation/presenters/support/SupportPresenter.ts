import { FAQ, ISupportRepository, Ticket } from "@/src/application/repositories/ISupportRepository";
import { Metadata } from "next";

export interface SupportViewModel {
  faqs: FAQ[];
  tickets: Ticket[];
}

export class SupportPresenter {
  constructor(private readonly repository: ISupportRepository) {}

  async getViewModel(): Promise<SupportViewModel> {
    const [faqs, tickets] = await Promise.all([
      this.repository.getFAQs(),
      this.repository.getTickets(),
    ]);
    return { faqs, tickets };
  }

  generateMetadata(): Metadata {
    return {
      title: "Support | Crystal Burst Legends",
      description: "Help & FAQ",
    };
  }

  async createTicket(subject: string, message: string) {
    return this.repository.createTicket(subject, message);
  }
}
