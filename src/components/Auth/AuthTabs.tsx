import { Link } from "react-router-dom";
import styles from "../../styles/Auth/AuthTabs.module.css";

interface AuthTabsProps {
  activeTab: "login" | "register";
}

const AuthTabs = ({ activeTab }: AuthTabsProps) => {
  return (
    <div className={styles.authTabs}>
      <Link 
        className={`${styles.authTab} ${activeTab === "login" ? styles.authTabActive : ""}`} 
        to="/login"
      >
        Đăng nhập
      </Link>
      <Link 
        className={`${styles.authTab} ${activeTab === "register" ? styles.authTabActive : ""}`} 
        to="/register"
      >
        Đăng ký
      </Link>
    </div>
  );
};

export default AuthTabs;