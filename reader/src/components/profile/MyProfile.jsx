import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvider";
import { fetchWithAuth, useFetch } from "../../utils/utils";
import { useState } from "react";

// TODO: user should be able to change info in its own profile
export default function MyProfile() {
  const { isAuthenticated, user } = useAuth()
  const { data, loading, error } = useFetch(user ? `http://localhost:3000/api/users/${user.id}` : null);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();



  const [formData, setFormData] = useState({
    firstName: '', lastName: ''
  });

  if (error) {
    return <div>{error}</div>
  }
  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to={'/'}></Navigate>
  }

  const handleEditClick = () => {
    setEditMode(!editMode);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchWithAuth(`http://localhost:3000/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(formData)
      });

      if (response.status !== 'success') {
        throw new Error('Failed to update user information');
      }

      setEditMode(false);
      setFormData({ firstName: '', lastName: '' });
      navigate('/profile')
    } catch (err) {
      return <div>{err.message}</div>
    }
  }

  const userInfo = data.user;
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
          <h2>{userInfo.firstName} {userInfo.lastName}</h2>
          <p>Email: {userInfo.email}</p>
          <p>registered at: {userInfo.registeredAt}</p>
          <p>Role: {userInfo.role}</p>

          <button onClick={handleEditClick}>Edit</button>
        </>
      )
      }
    </div >
  );
}