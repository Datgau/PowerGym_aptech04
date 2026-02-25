import type { AuthTokens, AuthUser } from "../@type/login";

const STORAGE_KEY = "pulse.auth.session";

interface StoredSession {
  user: AuthUser;
  remember: boolean;

}

const parseSession = (value: string | null): StoredSession | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as StoredSession;
  } catch {
    return null;
  }
};

const readSession = (): StoredSession | null => {
  return parseSession(localStorage.getItem(STORAGE_KEY)) ??
      parseSession(sessionStorage.getItem(STORAGE_KEY));
};

const writeSession = (session: StoredSession) => {
  const targetStorage = session.remember ? localStorage : sessionStorage;
  const fallbackStorage = session.remember ? sessionStorage : localStorage;

  targetStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  fallbackStorage.removeItem(STORAGE_KEY);
};

export const persistAuthSession = (user: AuthUser, remember: boolean) => {
  writeSession({ user, remember });
};

export const loadAuthSession = (): StoredSession | null => readSession();

export const clearAuthSession = () => {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
};

export const getAccessToken = (): string | null => {
  const session = readSession();
  return session?.user.tokens.accessToken ?? null;
};


export const updateStoredTokens = (tokens: Partial<AuthTokens>) => {
  const session = readSession();
  if (!session) return;
  writeSession({
    ...session,
    user: {
      ...session.user,
      tokens: {
        ...session.user.tokens,
        ...tokens,
      },
    },
  });
};
