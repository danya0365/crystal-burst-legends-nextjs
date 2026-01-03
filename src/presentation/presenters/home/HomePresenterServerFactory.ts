/**
 * HomePresenterServerFactory
 * Server-side factory for creating HomePresenter with dependencies
 */

import { MockHomeRepository } from "@/src/infrastructure/repositories/mock/MockHomeRepository";
import { HomePresenter } from "./HomePresenter";

export function createServerHomePresenter(): HomePresenter {
  // In production, use real repository
  // const repository = new SupabaseHomeRepository(supabaseClient);
  const repository = new MockHomeRepository();
  return new HomePresenter(repository);
}
