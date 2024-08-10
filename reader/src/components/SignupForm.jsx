import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  // TODO: encapsulate that into one object
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/users/', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      console.log('result: ', result);
      if (result?.result === 'success') {
        console.log('redirecting');
        navigate('/signin');
      } else {
        throw new Error(result.result ? result.result : "Unknown error");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form
      style={{ display: "flex", flexDirection: "column", }}
      onSubmit={handleSubmit}>
      <label>
        First Name:
        <input />
      </label>
      <label>
        Last Name:
        <input />
      </label>
      <label>
        email:
        <input name="email" value={email} onChange={e => setEmail(e.target.value)} />
      </label>

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
      <label>
        Confirm Password:
        <input />
      </label>
      <button type="submit">Signup</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}