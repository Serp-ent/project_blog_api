import { useNavigate } from 'react-router-dom';
import styles from './PostItem.module.css'

export default function PostItem({ post, handleEdit, handleDelete }) {
  const MAX_POST_LENGTH = 50;
  const shortContent = post.content.length > MAX_POST_LENGTH ?
    post.content.substring(0, MAX_POST_LENGTH - 3) + '...' :
    post.content;

  const author = post.author;
  const navigate = useNavigate();

  return (
    <div className={styles.postItem}>
      <h3>{post.title}</h3>
      <h4>{author.firstName} {author.lastName} ({author.username})</h4>
      <p>{shortContent}</p>

      <div className={styles.actions}>
        <button onClick={() => navigate(`/posts/${post.id}`)}>Details</button>
        <button onClick={() => handleEdit(post.id)}>Edit</button>
        <button onClick={() => handleDelete(post.id)}>Delete</button>
      </div>
    </div>
  );

}