import React, { useState, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext";
import {type  User } from "../shared/types";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login: AuthContextType["login"] = (user) => {
    setUser(user);
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  const logout: AuthContextType["logout"] = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
