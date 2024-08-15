import { Navigate, useNavigate } from "react-router-dom";
import { fetchWithAuth, useFetch } from "../../utils/utils";
import { useEffect, useState } from "react";
import formStyles from '../form.module.css';
import styles from './Profile.module.css';
import { useAuth } from "../../utils/Auth";

// TODO: user should be able to change info in its own profile
export default function MyProfile() {
  const { isAuthenticated, user } = useAuth();
  // Only make the request if the user is available
  const { data, loading, error } = useFetch(user ? `http://localhost:3000/api/users/${user.id}` : null);

  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    if (data && data.user) {
      setUserData(data.user);
      setFormData({
        firstName: data.user.firstName || '',
        lastName: data.user.lastName || '',
      });
    }
  }, [data]);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.log(error);
    return <div>{error.message}</div>;
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetchWithAuth(`http://localhost:3000/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (result.status !== 'success') {
        throw new Error('Failed to update user information');
      }

      setEditMode(false);
      setUserData(result.user);
      navigate('/profile');
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <h1 className={formStyles.headerTitle}>My Profile</h1>
      {editMode ? (
        <form
          onSubmit={handleSubmit}
          className={formStyles.form}
        >
          <div className={formStyles.formField}>
            <label htmlFor="firstName">
              First Name:
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className={formStyles.formField}>
            <label htmlFor="lastName">
              Last Name:
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className={formStyles.actions}>
            <button type="submit">Save</button>
            <button type="button" onClick={handleEditClick}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className={styles.profileInfo}>
          <h2>{userData.firstName} {userData.lastName}</h2>
          <p>Email: {userData.email}</p>
          <p>Registered at: {userData.registeredAt}</p>
          <p>Role: {userData.role}</p>

          <div className={styles.editWrapper}>
            <button onClick={handleEditClick}>Edit</button>
          </div>
        </div>
      )}
    </div>
  );
}

