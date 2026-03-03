import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../@type/login";
import { loadAuthSession, persistAuthSession, clearAuthSession } from "../services/authStorage";
import {useNavigate} from "react-router-dom";
import LoginRequiredModal from "../components/Auth/LoginRequiredModal.tsx";

interface AuthContextType {
    isLoggedIn: boolean;
    user: AuthUser | null;
    currentUser: AuthUser | null;
    login: (user: AuthUser, remember?: boolean) => void;
    logout: () => Promise<void>;
    loading: boolean;
    checkAuthStatus: () => Promise<void>;
    requireAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export { AuthContext };


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const navigate = useNavigate();
    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const storedSession = loadAuthSession();
            if (storedSession?.user) {
                setUser(storedSession.user);
                setIsLoggedIn(true);
            } else {
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

    const requireAuth = () => {
        if (!isLoggedIn) {
            setLoginModalOpen(true);
            return false;
        }
        return true;
    };
    const handleConfirmLogin = () => {
        setLoginModalOpen(false);
        navigate("/login");
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
                requireAuth
            }}
        >
            {children}
            <LoginRequiredModal
                open={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onConfirm={handleConfirmLogin}
            />

        </AuthContext.Provider>
    );
};
