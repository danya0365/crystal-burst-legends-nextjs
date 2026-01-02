/**
 * IMailRepository
 * Repository interface for Mail/Inbox data access
 */

export type MailType = "system" | "reward" | "event" | "social";

export interface MailAttachment {
  type: "crystal" | "coin" | "item" | "character";
  name: string;
  amount: number;
  icon: string;
}

export interface Mail {
  id: string;
  type: MailType;
  title: string;
  content: string;
  sender: string;
  read: boolean;
  claimed: boolean;
  attachments: MailAttachment[];
  sentAt: string;
  expiresAt?: string;
}

export interface IMailRepository {
  getAll(): Promise<Mail[]>;
  getUnread(): Promise<Mail[]>;
  markAsRead(id: string): Promise<Mail>;
  claimAttachments(id: string): Promise<MailAttachment[]>;
  claimAll(): Promise<MailAttachment[]>;
  deleteRead(): Promise<void>;
}
