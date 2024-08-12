import { useNavigate, useParams } from "react-router-dom";
import styles from "./Profile.module.css";
import { useAuth } from "../../utils/AuthProvider";
import { useEffect } from "react";
import { useFetch } from "../../utils/utils";

export default function Profile() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id === Number(id)) {
      navigate('/profile');
    }
  }, [user, id, navigate]);

  // TODO: show comment of user in his profile
  const { data, loading, error } = useFetch(`http://localhost:3000/api/users/${id}`);
  if (error) {
    return <div>{error.message}</div>
  }
  if (loading) {
    return <div>Loading...</div>
  }
  if (data.status !== 'success') {
    return <div>{data.status}</div>
  }

  const userInfo = data.user;
  return (
    <div>
      <h1>{userInfo.firstName} {userInfo.lastName}</h1>
      <p>email: {userInfo.email}</p>
      <p>registered at {userInfo.registeredAt}</p>
    </div>
  );
}