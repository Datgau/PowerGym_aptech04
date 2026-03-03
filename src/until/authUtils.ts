import {getAccessToken} from "../services/authStorage.ts";

export const authUtils = (navigate: (path: string) => void): boolean => {
    const token = getAccessToken();

    if (!token) {
        const shouldLogin = window.confirm(
            'Bạn cần đăng nhập để thực hiện chức năng này. Chuyển tới trang đăng nhập?'
        );

        if (shouldLogin) {
            navigate('/login');
        }

        return false;
    }

    return true;
};