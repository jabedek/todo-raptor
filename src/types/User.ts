export type User = {
  id: string | null | undefined;
  displayName: string | null | undefined;
  email: string | null | undefined;
  userData: { projectsIds: string[]; tasksIds: string[]; joinedAt: string } | undefined;
  verification:
    | {
        verifEmailsAmount: number;
        lastVerifEmailAt: string | undefined;
      }
    | undefined;
};

export type AuthUser = Omit<User, "projectsIds" | "tasksIds" | "joinedAt">;
