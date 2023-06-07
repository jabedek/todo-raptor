import * as texts from "src/assets/texts/texts.json";
const TEXTS = texts.root;

type Props = {
  translateKey: string; // ex. 'projects.forms.delete-project.subtitle'
};

export function translate(translateKey: string): string | undefined {
  const translation = translateKey.split(".").reduce((acc, current) => acc[current], TEXTS) as unknown as string | undefined;
  return translation;
}

export const Translate: React.FC<Props> = ({ translateKey }) => <>{translate(translateKey)}</>;
