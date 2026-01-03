/**
 * MorePresenterServerFactory
 * Server-side factory for creating MorePresenter with dependencies
 */

import { MockMoreRepository } from "@/src/infrastructure/repositories/mock/MockMoreRepository";
import { MorePresenter } from "./MorePresenter";

export function createServerMorePresenter(): MorePresenter {
  const repository = new MockMoreRepository();
  return new MorePresenter(repository);
}
