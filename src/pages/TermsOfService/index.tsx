export default function TermsOfService() {
    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
            <h1>Terms of Service – PowerGym</h1>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <p>
                By using PowerGym, you agree to the following terms. Please read carefully
                before continuing to use the service.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
                By registering or accessing PowerGym, you agree to comply with all these terms.
                If you do not agree, please stop using the service.
            </p>

            <h2>2. User Accounts</h2>
            <ul>
                <li>You are responsible for securing your account and password</li>
                <li>Do not impersonate others or create fake accounts for fraudulent purposes</li>
                <li>Do not use PowerGym for any illegal purposes</li>
            </ul>

            <h2>3. User Content</h2>
            <p>You are responsible for the content you post, including:</p>
            <ul>
                <li>Images, videos, and posts</li>
                <li>Comments and interactions</li>
            </ul>
            <p>Do not post content containing:</p>
            <ul>
                <li>Violence, pornography, or hate speech</li>
                <li>Misinformation that may harm the community</li>
                <li>Copyright violations</li>
            </ul>

            <h2>4. Service Changes</h2>
            <p>
                We reserve the right to update, modify, or suspend the service without
                prior notice in order to ensure optimal system performance.
            </p>

            <h2>5. OAuth Regulations (Google, Facebook)</h2>
            <p>
                When logging in with Google or Facebook, you agree that PowerGym may
                access basic profile data such as your email, display name, and profile picture,
                in accordance with each provider's policy.
            </p>

            <h2>6. Account and Data Deletion</h2>
            <p>
                You have the right to request deletion of your account and personal data at any time.
                Please refer to the{" "}
                <a href="/data-deletion" style={{ color: "#4285F4", textDecoration: "underline" }}>
                    User Data Deletion Guide
                </a>{" "}
                for details.
            </p>

            <h2>7. Contact</h2>
            <p>
                For any questions, please contact:{" "}
                <strong>PowerGym.support@example.com</strong>
            </p>

            <p>Thank you for using PowerGym.</p>
        </div>
    );
}