import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './form.module.css';

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
      className={styles.form}
      onSubmit={handleSubmit}>

      <div className={styles.formField}>
        <label htmlFor="firstName">
          First Name:
        </label>
        <input id="firstName" name="firstName" />
      </div>

      <div className={styles.formField}>
        <label htmlFor="firstName">
          Last Name:
        </label>
        <input id="lastName" name="lastName" />
      </div>

      <div className={styles.formField}>
        <label htmlFor="email"> email: </label>
        <input
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          id="email"
        />
      </div>

      <div className={styles.formField}>
        <label htmlFor="username">
          Username:
        </label>
        <input
          id="username"
          type="text"
          name="username"
          value={username}
          onChange={e => setUsername(e.target.value)} />
      </div >

      <div className={styles.formField}>
        <label htmlFor="password">
          Password:
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)} />
      </div >

      <div className={styles.formField}>
        <label htmlFor="confirmPassword">
          Confirm Password:
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password" />
      </div >

      <button
        className={styles.sendForm}
        type="submit">
        Signup
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form >
  );
}