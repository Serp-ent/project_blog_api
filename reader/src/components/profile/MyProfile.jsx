import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvider";
import { fetchWithAuth, useFetch } from "../../utils/utils";
import { useEffect, useState } from "react";

// TODO: user should be able to change info in its own profile
export default function MyProfile() {
  const { isAuthenticated, user } = useAuth();
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
    return <div>{error}</div>;
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

      // const result = await response.json();

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
      <h1>My Profile</h1>
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </label>
          <br />
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </label>
          <br />
          <button type="submit">Save</button>
          <button type="button" onClick={handleEditClick}>Cancel</button>
        </form>
      ) : (
        <>
          <h2>{userData.firstName} {userData.lastName}</h2>
          <p>Email: {userData.email}</p>
          <p>Registered at: {userData.registeredAt}</p>
          <p>Role: {userData.role}</p>

          <button onClick={handleEditClick}>Edit</button>
        </>
      )}
    </div>
  );
}