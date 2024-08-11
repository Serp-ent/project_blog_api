import { Navigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthProvider";
import { useFetch } from "../../utils/utils";

export default function MyProfile() {
  const { isAuthenticated, user } = useAuth()
  const { data, loading, error } = useFetch(`http://localhost:3000/api/users/${user.id}`);
  if (error) {
    return <div>{error}</div>
  }
  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to={'/'}></Navigate>
  }

  const userInfo = data;
  return (
    <div>
      <h1>My Profile</h1>
      <h2>{userInfo.firstName} {userInfo.lastName}</h2>
      <p>Email: {userInfo.email}</p>
      <p>registered at: {userInfo.registeredAt}</p>
      <p>Role: {userInfo.role}</p>
    </div>
  );
}