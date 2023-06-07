type ValidationDetails = {
  lengthMin: number;
  lengthMax: number;
  tests: {
    description: string;
    occurences: number;
    regexp: RegExp;
  }[];
};

type ValidationParts = "email" | "password";

type ValidationResults = {
  email: {
    length: boolean;
    content: boolean;
  };
  password: {
    length: boolean;
    content: boolean;
  };
};

type ValidationResultPart<P extends ValidationParts> = {
  [key in P]: ValidationResults[P];
};

const validation: Record<ValidationParts, ValidationDetails> = {
  email: {
    lengthMin: 6,
    lengthMax: 50,
    tests: [{ occurences: 1, regexp: new RegExp(/^\S+@\S+.\S+$/), description: "letters, digits, specials and @ char" }],
  },
  password: {
    lengthMin: 8,
    lengthMax: 24,
    tests: [
      { occurences: 1, regexp: new RegExp(/[A-Z]/g), description: "capitals: [1]" },
      { occurences: 3, regexp: new RegExp(/[a-z]/g), description: "letters: [3]" },
      { occurences: 3, regexp: new RegExp(/[\d]/g), description: "digits: [3]" },
      { occurences: 1, regexp: new RegExp(/[\W]/g), description: "specials: [1]" },
    ],
  },
};

export const getHint = (part: ValidationParts): string => {
  const { lengthMin, lengthMax, tests } = validation[part];
  const occurencesDescription = tests.map(({ description }) => `${description}`).join(", ");
  const length = `(${lengthMin}-${lengthMax})`;
  const hint = `Total length ${length}. \nMust consist of: ${occurencesDescription}.`;
  return hint;
};

export const validate = <P extends ValidationParts>(value: string, part: P): ValidationResultPart<typeof part> => {
  const length = value.length <= validation[part].lengthMax && value.length >= validation[part].lengthMin;
  const content = validation[part].tests.reduce(
    (acc: boolean, { occurences, regexp }) => acc && (value.match(regexp) || []).length >= occurences,
    true
  );

  return { [part]: { content, length } } as ValidationResultPart<typeof part>;
};

export const validateInput = (validation: "password" | "email", value: string): boolean => {
  const validations = validate(value, validation)[validation];
  return validations.content && validations.length;
};

export const validateEmailPassword = (
  formEmail: string,
  formPassword: string,
  formConfirmPassword = formPassword
): { isValid: boolean; message: string } => {
  let isValid = true;
  let message = "";
  const { password } = validate(formPassword, "password");
  const { email } = validate(formEmail, "email");

  if (!email.length) {
    isValid = false;
    message += "Wrong email length.";
    return { isValid, message };
  }

  if (!password.length) {
    isValid = false;
    message += "Wrong password length. ";
    return { isValid, message };
  }

  if (!email.content) {
    isValid = false;
    message += "Wrong email pattern. ";
  }

  if (!password.content) {
    isValid = false;
    message += "Wrong password pattern. ";
  }

  if (!(formPassword && formConfirmPassword)) {
    isValid = false;
    message += "Password not provided. ";
    return { isValid, message };
  } else if (formPassword !== formConfirmPassword) {
    isValid = false;
    message += "Passwords does not match. ";
    return { isValid, message };
  }

  return { isValid, message: isValid ? "Credentials are error-free. Sending..." : message };
};
