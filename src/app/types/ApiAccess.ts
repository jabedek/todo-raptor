/**
 * * `canAccessAPI` - only true if both `mustProvideCode` and `mustVerifyEmail` are true
 * * `mustProvideCode` - checks if logged user has provided valid code (with exceptions - `no code emails`)
 * * `mustVerifyEmail` - checks if logged user has verified his email after registration (with exceptions - `no code emails`)
 * */
export type ApiAccessContextType = {
  canAccessAPI: boolean | undefined;
  shouldPingUser: boolean;
  hasProvided: LackingValidations;
  checkProvidedCode: CheckProvidedCodeFn;
};

export type CheckProvidedCodeFn = (email: string, code: string) => Promise<LackingValidations>;

export type LackingValidations = {
  validAppCode: boolean | undefined;
  verifiedEmail: boolean | undefined;
};
