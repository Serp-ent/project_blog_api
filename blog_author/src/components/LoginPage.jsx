export default function LoginPage() {
  const handleLogin = () => {
    console.log('Handling login');
  }

  return (
  <div>
    <h1>Login</h1>
    <button onClick={handleLogin}>Log in</button>
  </div>
  );
}