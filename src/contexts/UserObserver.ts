import { Guid } from "guid-typescript";
import { User } from "../gql/graphql";

export interface IUserWatcher {
  onUpdate: (user: User) => void;
  onAuthFail: () => void | null;
  guid: Guid | null;
}

class UserObserver {
  private observers: Array<IUserWatcher> = [];
  private user: User | undefined;

  public subscribe(watcher: IUserWatcher): Guid {
    const observerId = Guid.create();
    watcher.guid = observerId;
    this.observers.push(watcher);
    return observerId;
  }

  public unsubscribe(guid: Guid) {
    this.observers = this.observers.filter((watcher) =>
      watcher.guid?.equals(guid)
    );
  }

  public update(user: User) {
    this.user = user;
    this.onChange();
  }

  public notifyUnauthorised() {
    this.observers.forEach((o) => {
      if (o.onAuthFail !== null) {
        o.onAuthFail();
      }
    });
  }

  private onChange() {
    if (this.user) {
      this.observers.forEach((o) => o.onUpdate(this.user!));
    }
  }
}

export default UserObserver;
