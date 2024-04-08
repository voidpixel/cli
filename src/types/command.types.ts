export type Command = {
  name: string;
  description: string;

  alias: string | string[];

  help: () => void;
  run: (args?: any, force?: boolean, perms?: any) => Promise<void>;
};
