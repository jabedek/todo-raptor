import { Unsubscribe } from "firebase/auth";
type DataName = string;
type HandlerAction = "sub" | "unsub";

export class ListenersHandler {
  private handlingFor = "";

  constructor(handlingFor: string) {
    this.handlingFor = handlingFor;
  }

  private listeners = new Map<DataName, Unsubscribe | undefined>();

  sub(name: DataName, unsubFn: Unsubscribe): void {
    this.unsub(name);
    const fullName = `${this.handlingFor}.${name}`;
    this.log("sub", fullName);
    this.listeners.set(fullName, unsubFn);
  }

  unsub(name: DataName): void {
    const fullName = `${this.handlingFor}.${name}`;
    this.log("unsub", fullName);

    const unsubFn = this.listeners.get(fullName);
    if (unsubFn) {
      unsubFn();
    }
    this.listeners.delete(fullName);
  }

  unsubAll(): void {
    this.listeners.forEach((unsubFn, key) => {
      if (key.includes(this.handlingFor) && unsubFn) {
        unsubFn();
        unsubFn = undefined;
      }
    });
  }

  private log(action: HandlerAction, fullName: string): void {
    const fullAction = action === "sub" ? action.padEnd(5, " ") : action;
    console.log(fullAction, " => ", fullName);
  }
}
