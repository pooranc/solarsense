import { useState } from 'react';
import API_BASE_URL from '../config';

function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/api/register' : '/api/login';
    const response = await fetch(API_BASE_URL + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setError('Invalid email or password');
      return;
    }

     const data = await response.json();
    localStorage.setItem('token', data.token);
    onLogin(data.user);
  };

   return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-green-700 mb-1">SolarSense</h1>
        <p className="text-sm text-gray-500 mb-6">Irish solar PV payback calculator</p>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {isRegister ? 'Create account' : 'Sign in'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 w-full" required />
          </div>

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <button type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => setIsRegister(!isRegister)}
            className="text-green-600 ml-1 hover:underline">
            {isRegister ? 'Sign in' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;