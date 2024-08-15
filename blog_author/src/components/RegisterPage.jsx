export default function RegisterPage() {
  return (
    <form>
      <div>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          required
        />
      </div>

      <div>
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          required
        />
      </div>

      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          required
        />
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
        />
      </div>

      <div>
        <label htmlFor="isAuthor">
          <input
            type="checkbox"
            id="isAuthor"
            name="isAuthor"
          />
          I want to register as an author
        </label>
      </div>

      <button type="submit">Register</button>
    </form>
  );
}