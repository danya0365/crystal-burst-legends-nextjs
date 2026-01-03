/**
 * LegalPresenter
 * Handles business logic for Legal pages (Terms, Privacy, Contact)
 */

import {
    ContactInfo,
    ILegalRepository,
    PrivacyContent,
    TermsContent,
} from "@/src/application/repositories/ILegalRepository";
import { Metadata } from "next";

export interface TermsViewModel {
  content: TermsContent;
}

export interface PrivacyViewModel {
  content: PrivacyContent;
}

export interface ContactViewModel {
  contactInfo: ContactInfo;
}

export class LegalPresenter {
  constructor(private readonly repository: ILegalRepository) {}

  async getTermsViewModel(): Promise<TermsViewModel> {
    const content = await this.repository.getTermsContent();
    return { content };
  }

  async getPrivacyViewModel(): Promise<PrivacyViewModel> {
    const content = await this.repository.getPrivacyContent();
    return { content };
  }

  async getContactViewModel(): Promise<ContactViewModel> {
    const contactInfo = await this.repository.getContactInfo();
    return { contactInfo };
  }

  generateTermsMetadata(): Metadata {
    return {
      title: "Terms of Service | Crystal Burst Legends",
      description: "Terms of Service for Crystal Burst Legends",
    };
  }

  generatePrivacyMetadata(): Metadata {
    return {
      title: "Privacy Policy | Crystal Burst Legends",
      description: "Privacy Policy for Crystal Burst Legends",
    };
  }

  generateContactMetadata(): Metadata {
    return {
      title: "Contact Us | Crystal Burst Legends",
      description: "Contact the Crystal Burst Legends team",
    };
  }
}
