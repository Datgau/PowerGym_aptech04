export default function TermsOfService() {
  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>Terms of Service – HeartBeat</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <p>
        By using HeartBeat, you agree to the following terms. Please read carefully
        before continuing to use the service.
      </p>

      <h2>1. Acceptance of terms</h2>
      <p>
        By registering or accessing HeartBeat, you agree to comply with all these terms.
        If you do not agree, please stop using the service.
      </p>

      <h2>2. User accounts</h2>
      <ul>
        <li>You are responsible for securing your account and password</li>
        <li>Do not impersonate or create fake accounts for fraud</li>
        <li>Do not use HeartBeat for illegal purposes</li>
      </ul>

      <h2>3. User content</h2>
      <p>You are responsible for the content you post, including:</p>
      <ul>
        <li>Images, videos, posts</li>
        <li>Comments and interactions</li>
      </ul>
      <p>Do not post content containing:</p>
      <ul>
        <li>Violence, pornography, hate speech</li>
        <li>Misinformation affecting the community</li>
        <li>Copyright violations</li>
      </ul>

      <h2>4. Service may change</h2>
      <p>
        We reserve the right to update, change, or suspend the service without
        prior notice to ensure the system operates optimally.
      </p>

      <h2>5. OAuth regulations (Google, Facebook)</h2>
      <p>
        When logging in with Google or Facebook, you agree that HeartBeat may
        access basic data such as: email, display name, profile picture, according to
        each provider's policy.
      </p>

      <h2>6. Account and data deletion</h2>
      <p>
        You have the right to request account and personal data deletion at any time.
        Please see{" "}
        <a href="/data-deletion" style={{ color: "#4285F4", textDecoration: "underline" }}>
          User Data Deletion Guide
        </a>{" "}
        for details.
      </p>

      <h2>7. Contact</h2>
      <p>
        For any questions, please contact:  
        <strong> HeartBeat.support@example.com</strong>
      </p>

      <p>Thank you for using HeartBeat.</p>
    </div>
  );
}
