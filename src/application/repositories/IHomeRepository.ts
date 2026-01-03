/**
 * IHomeRepository
 * Repository interface for Home page content
 */

export interface HomeHeroContent {
  title: string;
  subtitle: string;
  featuredCharacter: {
    name: string;
    description: string;
    emoji: string;
  };
}

export interface HomeQuickAction {
  id: string;
  label: string;
  href: string;
  icon: string;
  variant: "primary" | "secondary" | "ghost";
}

export interface HomeNewsItem {
  id: string;
  title: string;
  content: string;
  isNew: boolean;
  createdAt: Date;
}

export interface HomeContent {
  hero: HomeHeroContent;
  quickActions: HomeQuickAction[];
  news: HomeNewsItem[];
}

export interface IHomeRepository {
  getHomeContent(): Promise<HomeContent>;
}
