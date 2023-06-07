// import { Unsubscribe } from "firebase/auth";
// type DataName = string;
// type HandlerAction = "sub" | "unsub";

// export class ListenersHandler {
//   constructor(public handlingFor: string, public devLogs = false) {
//     this.handlingFor = handlingFor;
//   }

//   private listeners = new Map<DataName, Unsubscribe | undefined>();

//   sub(name: DataName, unsubFn: Unsubscribe): void {
//     const fullName = `${this.handlingFor}.${name}`;
//     if (this.devLogs) {
//       this.log("sub", fullName);
//     }
//     this.listeners.set(fullName, unsubFn);
//   }

//   unsub(name: DataName): void {
//     const fullName = `${this.handlingFor}.${name}`;
//     if (this.devLogs) {
//       this.log("unsub", fullName);
//     }
//     const unsubFn = this.listeners.get(fullName);
//     if (unsubFn) {
//       unsubFn();
//     }
//     this.listeners.delete(fullName);
//   }

//   unsubAll(): void {
//     if (this.devLogs) {
//       this.log("unsubAll", this.handlingFor);
//     }
//     this.listeners.forEach((unsubFn, key) => {
//       if (key.includes(this.handlingFor) && unsubFn) {
//         unsubFn();
//         unsubFn = undefined;
//       }
//     });
//   }

//   private log(action: HandlerAction | "unsubAll", fullName: string): void {
//     const fullAction = action === "sub" ? action.padEnd(5, " ") : action;
//     console.log(fullAction, " => ", fullName);
//   }
// }
