// src/routes/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "../routes/AuthContext.tsx";
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};