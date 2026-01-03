/**
 * ILandingRepository
 * Repository interface for Landing page content
 */

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Screenshot {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
}

export interface LandingContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  features: Feature[];
  screenshots: Screenshot[];
  stats: Stat[];
  ctaTitle: string;
  ctaDescription: string;
}

export interface ILandingRepository {
  getContent(): Promise<LandingContent>;
}
