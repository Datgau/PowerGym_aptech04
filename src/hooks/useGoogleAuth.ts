// hooks/useGoogleAuth.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService.ts";
import { useAuth } from "../routes/AuthContext.tsx";

interface UseGoogleAuthProps {
    setFeedback: (feedback: { type: "success" | "error"; message: string } | null) => void;
}

export const useGoogleAuth = ({ setFeedback }: UseGoogleAuthProps) => {
    const navigate = useNavigate();
    const { login: persistSession } = useAuth();

    const handleGoogleResponse = async (response: any) => {
        try {
            const result = await AuthService.oauthLogin({
                provider: "google",
                accessToken: response.credential,
            });

            if (result.success && result.data) {
                persistSession(
                    {
                        id: result.data.id,
                        email: result.data.email ?? "",
                        role: result.data.role,
                        fullName: result.data.fullName,
                        avatar: result.data.avatar,
                        tokens: {
                            accessToken: result.data.token.accessToken,
                            refreshToken: result.data.token.refreshToken,
                            expiresIn: result.data.token.expiresIn,
                        },
                    },
                    true
                );
                setFeedback({
                    type: "success",
                    message: "Google login successful!",
                });
                setTimeout(() => {
                    navigate("/home");
                }, 1000);
            } else {
                setFeedback({
                    type: "error",
                    message: result.message || "Google login failed",
                });
            }
        } catch (error) {
            console.error("Google login error:", error);
            setFeedback({
                type: "error",
                message: "Google login failed, please try again",
            });
        }
    };

    useEffect(() => {
        const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!googleClientId) {
            console.warn("Google Client ID not configured");
            return;
        }
        if (document.getElementById("google-client-script")) return;

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.id = "google-client-script";

        script.onload = () => {
            if (window.google?.accounts?.id) {
                window.google.accounts.id.initialize({
                    client_id: googleClientId,
                    callback: handleGoogleResponse,
                    ux_mode: "popup",
                    use_fedcm_for_prompt: false,
                });
            }
        };

        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);



    const handleGoogleLoginClick = () => {
        if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
            setFeedback({
                type: "error",
                message: "Google login not configured. Please contact administrator.",
            });
            return;
        }

        if (!window.google?.accounts?.id) {
            setFeedback({
                type: "error",
                message: "Google SDK not loaded. Please refresh the page.",
            });
            return;
        }

        try {
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'fixed';
            tempDiv.style.top = '-9999px';
            tempDiv.style.left = '-9999px';
            document.body.appendChild(tempDiv);

            window.google.accounts.id.renderButton(tempDiv, {
                type: 'standard',
                size: 'large',
                text: 'signin_with',
                shape: 'rectangular',
            });

            setTimeout(() => {
                const googleBtn = tempDiv.querySelector('div[role="button"]') as HTMLElement;
                if (googleBtn) {
                    googleBtn.click();
                }
                setTimeout(() => {
                    if (document.body.contains(tempDiv)) {
                        document.body.removeChild(tempDiv);
                    }
                }, 2000);
            }, 100);
        } catch (error) {
            console.error("Google login error:", error);
            setFeedback({
                type: "error",
                message: "Cannot open Google login. Please try again.",
            });
        }
    };

    return { handleGoogleLoginClick };
};