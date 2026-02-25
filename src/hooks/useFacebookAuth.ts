// hooks/useFacebookAuth.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/authService.ts";
import { useAuth } from "../routes/AuthContext.tsx";

interface UseFacebookAuthProps {
    setFeedback: (feedback: { type: "success" | "error"; message: string } | null) => void;
}

export const useFacebookAuth = ({ setFeedback }: UseFacebookAuthProps) => {
    const navigate = useNavigate();
    const { login: persistSession } = useAuth();

    useEffect(() => {
        const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;
        if (!facebookAppId) {
            console.warn("Facebook App ID not configured");
            return;
        }

        const fbScript = document.createElement("script");
        fbScript.src = "https://connect.facebook.net/en_US/sdk.js";
        fbScript.async = true;
        fbScript.onload = () => {
            window.FB.init({
                appId: facebookAppId,
                cookie: true,
                xfbml: true,
                version: "v16.0",
            });
        };
        document.body.appendChild(fbScript);

        return () => {
            if (document.body.contains(fbScript)) {
                document.body.removeChild(fbScript);
            }
        };
    }, []);

    const handleFacebookLogin = () => {
        if (!import.meta.env.VITE_FACEBOOK_APP_ID) {
            setFeedback({
                type: "error",
                message: "Facebook login chưa được cấu hình. Vui lòng liên hệ quản trị viên.",
            });
            return;
        }

        if (!window.FB) {
            setFeedback({
                type: "error",
                message: "Facebook SDK chưa được tải. Vui lòng refresh trang.",
            });
            return;
        }

        console.log("Initiating Facebook login...");

        window.FB.login(
            (response: any) => {
                console.log("Facebook response:", response);
                if (response.authResponse) {
                    console.log("Facebook access token received");
                    AuthService.oauthLogin({
                        provider: "facebook",
                        accessToken: response.authResponse.accessToken,
                    }).then((result) => {
                        if (result.success && result.data) {
                            persistSession(
                                {
                                    id: result.data.id,
                                    email: result.data.email,
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
                                message: "Đăng nhập Facebook thành công!",
                            });
                            setTimeout(() => {
                                navigate("/powergym/home");
                            }, 1000);
                        } else {
                            setFeedback({
                                type: "error",
                                message: result.message || "Đăng nhập Facebook thất bại",
                            });
                        }
                    }).catch((error) => {
                        console.error("Facebook login error:", error);
                        setFeedback({
                            type: "error",
                            message: "Đăng nhập Facebook thất bại, vui lòng thử lại",
                        });
                    });
                } else {
                    setFeedback({
                        type: "error",
                        message: "Đăng nhập Facebook bị hủy",
                    });
                }
            },
            { scope: "public_profile" }
        );
    };

    return { handleFacebookLogin };
};