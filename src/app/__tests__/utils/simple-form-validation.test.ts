import { validateInput } from "@@components/common";

describe("validateEmailPassword", () => {
  test("email: password: 'Dupa123!' are correct", () => {
    expect(validateInput("password", "Dupa123!")).toBe(true);
  });
  test("email: password: 'dupa123' are not correct", () => {
    expect(validateInput("password", "dupa123")).toBe(false);
  });
});
