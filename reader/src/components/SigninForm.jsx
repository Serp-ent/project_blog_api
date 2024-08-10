import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../utils/AuthProvider";


export default function SigninForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { isAuthenticated, login, logout } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      const { token } = result;
      if (!token) {
        throw new Error('Token not received');
      }

      login(token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={username}
          onChange={e => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)} />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}