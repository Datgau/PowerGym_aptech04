export default function PrivacyPolicy() {
    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
            <h1>Privacy Policy – PowerGym</h1>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <p>
                We respect your privacy and are committed to protecting your personal data
                when you use PowerGym. This policy describes how we collect, use,
                and protect your information.
            </p>

            <h2>1. Information We Collect</h2>
            <ul>
                <li>Account information (email, name, username)</li>
                <li>Profile picture and content you post</li>
                <li>Device data and cookies</li>
                <li>Information from Google or Facebook when you log in via OAuth</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
                <li>Operate the PowerGym platform</li>
                <li>Provide personalized features</li>
                <li>Prevent fraud and secure the system</li>
                <li>Provide customer support when needed</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We DO NOT sell user data. However, we may share it with:</p>
            <ul>
                <li>Service providers (e.g., storage, analytics)</li>
                <li>Legal authorities when required by law</li>
            </ul>

            <h2>4. Your Rights</h2>
            <ul>
                <li>Request access to or deletion of your account</li>
                <li>Download your personal data</li>
                <li>Revoke OAuth access</li>
            </ul>
            <p>
                To delete your data, please refer to the{" "}
                <a href="/data-deletion" style={{ color: "#4285F4", textDecoration: "underline" }}>
                    User Data Deletion Guide
                </a>.
            </p>

            <h2>5. Contact</h2>
            <p>
                If you have any questions, please contact:{" "}
                <strong>PowerGym.support@example.com</strong>
            </p>

            <p>Thank you for trusting PowerGym.</p>
        </div>
    );
}