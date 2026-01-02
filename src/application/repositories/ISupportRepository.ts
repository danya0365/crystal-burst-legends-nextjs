/**
 * ISupportRepository
 * Repository interface for Support/Help data access
 */

export type FAQCategory = "account" | "gameplay" | "payment" | "technical";

export interface FAQ {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
}

export interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: "open" | "pending" | "resolved";
  createdAt: string;
  updatedAt: string;
}

export interface ISupportRepository {
  getFAQs(): Promise<FAQ[]>;
  getFAQsByCategory(category: FAQCategory): Promise<FAQ[]>;
  getTickets(): Promise<Ticket[]>;
  createTicket(subject: string, message: string): Promise<Ticket>;
}
