/**
 * ILegalRepository
 * Repository interface for Legal pages content (Terms, Privacy, Contact)
 */

export interface LegalSection {
  id: string;
  title: string;
  content: string;
}

export interface TermsContent {
  title: string;
  sections: LegalSection[];
}

export interface PrivacyContent {
  title: string;
  sections: LegalSection[];
}

export interface ContactInfo {
  email: string;
  discord: string;
  twitter: string;
}

export interface ILegalRepository {
  getTermsContent(): Promise<TermsContent>;
  getPrivacyContent(): Promise<PrivacyContent>;
  getContactInfo(): Promise<ContactInfo>;
}
