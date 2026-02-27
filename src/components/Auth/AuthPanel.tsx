import styles from "../../styles/Auth/AuthPanel.module.css";

const AuthPanel = () => {
    return (
        <section className={styles.authPanelAccent}>
            <span className={styles.authLogo}>PowerGym</span>
            <h1>Power Starts Here</h1>
            <p>
                PowerGym - where you discover your unlimited potential. With modern equipment,
                professional trainers and a dynamic community, we accompany you
                on your journey to conquer all fitness goals.
            </p>
            <ul className={styles.authHighlights}>
                <li>Most modern gym equipment in Vietnam</li>
                <li>Professional personal trainers 24/7</li>
                <li>Diverse group classes with energetic music</li>
            </ul>
            <div className={styles.authCommunity}>
                <div className={styles.avatarStack} aria-hidden="true">
                    <span>AN</span>
                    <span>MT</span>
                    <span>LD</span>
                    <span>+8</span>
                </div>
                <div>


                    <strong>50,000+</strong>
                    <span> members training every day</span>
                </div>
            </div>
        </section>
    );
};

export default AuthPanel;