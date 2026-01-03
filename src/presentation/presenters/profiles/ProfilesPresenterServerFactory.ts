/**
 * ProfilesPresenterServerFactory
 * Factory for creating ProfilesPresenter on server side
 */

import { ProfilesPresenter } from "./ProfilesPresenter";

export class ProfilesPresenterServerFactory {
  static create(): ProfilesPresenter {
    return new ProfilesPresenter();
  }
}

export function createServerProfilesPresenter(): ProfilesPresenter {
  return ProfilesPresenterServerFactory.create();
}
