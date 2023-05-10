const EMAIL_LENGTH = { minLength: 6, maxLength: 50 };
const PASSWORD_LENGTH = { minLength: 8, maxLength: 24 };
type Amount = { amountMin: number | undefined; amountMax: number | undefined };
const PASSWORD_COMPONENTS: Record<string, Amount> = {
  capitalsAmount: { amountMin: 1, amountMax: undefined },
  lettersAmount: { amountMin: 3, amountMax: undefined },
  digitsAmount: { amountMin: 3, amountMax: undefined },
  specialsAmount: { amountMin: 1, amountMax: undefined },
};

class AppRegExp extends RegExp {
  name: string;
  constructor(meta: { name: string }, pattern: string | RegExp, flags?: string | undefined) {
    super(pattern, flags);
    this.name = meta?.name;
  }
}

class Validator {
  static passwordHint() {
    const { minLength, maxLength } = PASSWORD_LENGTH;

    return `Total length (${minLength}-${maxLength}). \nMust consist of: 1 capital, 3 letters, 3 digits, 1 special.`;
  }

  private static testMany(value: string, tests: AppRegExp[]): { results: Record<string, boolean>; reduced: boolean } {
    const results: Record<string, boolean> = {};

    const reduced = tests.reduce((accumulator, currentTest) => {
      const outcome = currentTest.test(value);
      results[currentTest.name] = outcome;
      return accumulator && outcome;
    }, true);

    return { results, reduced };
  }

  private static Regex_email() {
    return /^\S+@\S+.\S+$/;
  }
  private static Regex_capitals(amount: Amount) {
    const { amountMin, amountMax } = amount;
    let amountStr = "{";
    amountStr += amountMin !== undefined ? amountMin : "";
    amountStr += ",";
    amountStr += amountMax !== undefined ? amountMax : "";
    amountStr += "}";

    const pattern = `[A-Z]${amountStr}`.replace(/\s*/g, "");
    return new AppRegExp({ name: `capitals-${amountMin}-${amountMax || amountMin}` }, pattern, "g");
  }
  private static Regex_letters(amount: Amount) {
    const { amountMin, amountMax } = amount;
    let amountStr = "{";
    amountStr += amountMin !== undefined ? amountMin : "";
    amountStr += ",";
    amountStr += amountMax !== undefined ? amountMax : "";
    amountStr += "}";

    const pattern = `[a-z]${amountStr}`.replace(/\s*/g, "");
    return new AppRegExp({ name: `letters-${amountMin}-${amountMax || amountMin}` }, pattern, "g");
  }
  private static Regex_digits(amount: Amount) {
    const { amountMin, amountMax } = amount;
    let amountStr = "{";
    amountStr += amountMin !== undefined ? amountMin : "";
    amountStr += ",";
    amountStr += amountMax !== undefined ? amountMax : "";
    amountStr += "}";

    const pattern = `[0-9]${amountStr}`.replace(/\s*/g, "");
    return new AppRegExp({ name: `digits-${amountMin}-${amountMax || amountMin}` }, pattern, "g");
  }
  private static Regex_specials(amount: Amount) {
    const { amountMin, amountMax } = amount;
    let amountStr = "{";
    amountStr += amountMin !== undefined ? amountMin : "";
    amountStr += ",";
    amountStr += amountMax !== undefined ? amountMax : "";
    amountStr += "}";

    const pattern = `[^A-Za-z0-9]${amountStr}`.replace(/\s*/g, "");
    return new AppRegExp({ name: `specials-${amountMin}-${amountMax || amountMin}` }, pattern, "g");
  }

  static email(value: string): {
    validity: boolean;
    partialResults: Record<string, boolean>;
  } {
    const { minLength, maxLength } = EMAIL_LENGTH;
    const isValidLength = value.length >= minLength && value.length <= maxLength;
    const isValidPattern = Validator.Regex_email().test(value);

    const partialResults: Record<string, boolean> = {};
    partialResults["pattern"] = isValidPattern;
    partialResults[`length-${minLength}-${maxLength || minLength}`] = isValidLength;

    return { validity: isValidPattern && isValidLength, partialResults };
  }

  static password(value: string): {
    validity: boolean;
    partialResults: Record<string, boolean>;
  } {
    const { minLength, maxLength } = PASSWORD_LENGTH;
    const isValidLength = value.length >= minLength && value.length <= maxLength;

    const { capitalsAmount, digitsAmount, lettersAmount, specialsAmount } = PASSWORD_COMPONENTS;

    const capitals = Validator.Regex_capitals(capitalsAmount);
    const letters = Validator.Regex_letters(lettersAmount);
    const digits = Validator.Regex_digits(digitsAmount);
    const specials = Validator.Regex_specials(specialsAmount);

    const { reduced: isValidPattern, results: partialResults } = Validator.testMany(value, [capitals, letters, digits, specials]);
    partialResults[`length-${minLength}-${maxLength || minLength}`] = isValidLength;

    return { validity: isValidPattern && isValidLength, partialResults };
  }
}

export { EMAIL_LENGTH, PASSWORD_LENGTH, PASSWORD_COMPONENTS, Validator };
