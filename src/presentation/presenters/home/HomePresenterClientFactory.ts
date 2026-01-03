/**
 * HomePresenterClientFactory
 * Client-side factory for creating HomePresenter with dependencies
 */

import { MockHomeRepository } from "@/src/infrastructure/repositories/mock/MockHomeRepository";
import { HomePresenter } from "./HomePresenter";

export function createClientHomePresenter(): HomePresenter {
  // In production, use real repository with client-side authentication
  // const repository = new SupabaseHomeRepository(supabaseClient);
  const repository = new MockHomeRepository();
  return new HomePresenter(repository);
}
