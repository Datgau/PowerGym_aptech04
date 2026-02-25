import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../@type/login";
import { loadAuthSession, persistAuthSession, clearAuthSession } from "../services/authStorage";

interface AuthContextType {
    isLoggedIn: boolean;
    user: AuthUser | null;
    currentUser: AuthUser | null;
    login: (user: AuthUser, remember?: boolean) => void;
    logout: () => Promise<void>;
    loading: boolean;
    checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Check authentication status from localStorage/sessionStorage
    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            
            // Check local storage for existing session
            const storedSession = loadAuthSession();
            
            if (storedSession?.user) {
                // Restore user from storage
                setUser(storedSession.user);
                setIsLoggedIn(true);
            } else {
                // No stored session
                setUser(null);
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.log('Auth check error:', error);
            setUser(null);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = (userData: AuthUser, remember: boolean = true) => {
        setUser(userData);
        setIsLoggedIn(true);
        persistAuthSession(userData, remember);
    };

    const logout = async () => {
        try {
            // Call logout API if needed
            // await AuthService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuthSession();
            setUser(null);
            setIsLoggedIn(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                user,
                currentUser: user,
                login,
                logout,
                loading,
                checkAuthStatus,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
