import { useNavigate, useParams } from "react-router-dom";
import styles from "./Profile.module.css";
import { useAuth } from "../../utils/AuthProvider";
import { useEffect } from "react";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id === Number(id)) {
      navigate('/profile');
    }
  }, [user, id, navigate]);

  return (
    <h1>Profile {id}</h1>
  );
}