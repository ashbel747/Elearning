import { createContext } from "react";
import type { User } from "../shared/types";

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// no need for explicit type annotation, TS infers it
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
