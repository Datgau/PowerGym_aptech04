import styles from "../../styles/Auth/AuthPanel.module.css";

const AuthPanel = () => {
    return (
        <section className={styles.authPanelAccent}>
            <span className={styles.authLogo}>PowerGym</span>
            <h1>Sức mạnh bắt đầu từ đây</h1>
            <p>
                PowerGym - nơi bạn khám phá tiềm năng vô hạn của bản thân. Với trang thiết bị hiện đại,
                huấn luyện viên chuyên nghiệp và cộng đồng năng động, chúng tôi đồng hành cùng bạn
                trên hành trình chinh phục mọi mục tiêu thể chất.
            </p>
            <ul className={styles.authHighlights}>
                <li>Trang thiết bị gym hiện đại nhất Việt Nam</li>
                <li>Huấn luyện viên cá nhân chuyên nghiệp 24/7</li>
                <li>Lớp học nhóm đa dạng với âm nhạc sôi động</li>
            </ul>
            <div className={styles.authCommunity}>
                <div className={styles.avatarStack} aria-hidden="true">
                    <span>AN</span>
                    <span>MT</span>
                    <span>LD</span>
                    <span>+8</span>
                </div>
                <div>


                    <strong>50.000+</strong>
                    <span> thành viên đang tập luyện mỗi ngày</span>
                </div>
            </div>
        </section>
    );
};

export default AuthPanel;