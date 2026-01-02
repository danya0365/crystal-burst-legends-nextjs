import {
    FAQ,
    FAQCategory,
    ISupportRepository,
    Ticket,
} from "@/src/application/repositories/ISupportRepository";

const MOCK_FAQS: FAQ[] = [
  { id: "f1", category: "account", question: "How do I link my account?", answer: "Go to Settings > Account > Link Account and follow the instructions to connect your Google or Apple account." },
  { id: "f2", category: "account", question: "Can I transfer my account to another device?", answer: "Yes! Go to Settings > Account > Transfer Account to generate a transfer code. Use this code on your new device." },
  { id: "f3", category: "gameplay", question: "How do I get more crystals?", answer: "You can earn crystals by completing missions, achievements, story stages, and daily login. You can also purchase them in the shop." },
  { id: "f4", category: "gameplay", question: "What is the pity system?", answer: "After 90 summons without a legendary character, you are guaranteed to receive one on your next summon." },
  { id: "f5", category: "gameplay", question: "How do I level up characters?", answer: "Go to Characters, select a character, and tap Level Up. You need coins and EXP materials to level up." },
  { id: "f6", category: "payment", question: "What payment methods are supported?", answer: "We support credit cards, PayPal, and mobile payments through Google Play or App Store." },
  { id: "f7", category: "payment", question: "I was charged but didn't receive my purchase", answer: "Please contact support with your receipt. We will investigate and resolve the issue within 24-48 hours." },
  { id: "f8", category: "technical", question: "The game is running slow", answer: "Try lowering graphics quality in Settings > Graphics. Also ensure you have enough storage space on your device." },
  { id: "f9", category: "technical", question: "How do I report a bug?", answer: "Use the Contact Support form below to describe the issue. Please include screenshots if possible." },
];

const MOCK_TICKETS: Ticket[] = [
  { id: "t1", subject: "Missing crystals", message: "I purchased 500 crystals but didn't receive them", status: "resolved", createdAt: "2026-01-01T10:00:00Z", updatedAt: "2026-01-02T14:00:00Z" },
  { id: "t2", subject: "Game crashes on startup", message: "The game crashes after the loading screen", status: "pending", createdAt: "2026-01-02T15:00:00Z", updatedAt: "2026-01-02T16:00:00Z" },
];

export class MockSupportRepository implements ISupportRepository {
  private tickets = [...MOCK_TICKETS];

  async getFAQs(): Promise<FAQ[]> {
    await this.delay(100);
    return [...MOCK_FAQS];
  }

  async getFAQsByCategory(category: FAQCategory): Promise<FAQ[]> {
    await this.delay(100);
    return MOCK_FAQS.filter((f) => f.category === category);
  }

  async getTickets(): Promise<Ticket[]> {
    await this.delay(100);
    return [...this.tickets];
  }

  async createTicket(subject: string, message: string): Promise<Ticket> {
    await this.delay(200);
    const ticket: Ticket = {
      id: `t${Date.now()}`,
      subject,
      message,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tickets.push(ticket);
    return ticket;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
