import { useState } from 'react';
import { AuthService } from '../../services/authService';

const OTPDebug = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testResendOtp = async () => {
    if (!email) {
      alert('Please enter email');
      return;
    }

    setLoading(true);
    try {
      console.log('Testing resend OTP for:', email);
      const response = await AuthService.resendOtp({ email });
      console.log('Resend response:', response);
      setResult(response);
    } catch (error) {
      console.error('Resend error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testOtpStatus = async () => {
    if (!email) {
      alert('Please enter email');
      return;
    }

    setLoading(true);
    try {
      console.log('Testing OTP status for:', email);
      const response = await AuthService.getOtpStatus({ email });
      console.log('Status response:', response);
      setResult(response);
    } catch (error) {
      console.error('Status error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>OTP Debug Tool</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={testOtpStatus} 
          disabled={loading}
          style={{ padding: '8px 16px', marginRight: '10px' }}
        >
          {loading ? 'Loading...' : 'Test OTP Status'}
        </button>
        
        <button 
          onClick={testResendOtp} 
          disabled={loading}
          style={{ padding: '8px 16px' }}
        >
          {loading ? 'Loading...' : 'Test Resend OTP'}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h4>Result:</h4>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default OTPDebug;