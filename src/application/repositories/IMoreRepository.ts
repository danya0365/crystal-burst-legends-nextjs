/**
 * IMoreRepository
 * Repository interface for More page menu items
 */

export interface MenuItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

export interface GameInfo {
  name: string;
  version: string;
}

export interface MoreContent {
  menuItems: MenuItem[];
  gameInfo: GameInfo;
}

export interface IMoreRepository {
  getMoreContent(): Promise<MoreContent>;
}
