import { useNavigate } from 'react-router-dom';
import styles from './PostItem.module.css'

export default function PostItem({
  post,
  handleEdit,
  handleDelete,
  setIsPublish,
}) {
  const MAX_POST_LENGTH = 50;
  const shortContent = post.content.length > MAX_POST_LENGTH ?
    post.content.substring(0, MAX_POST_LENGTH - 3) + '...' :
    post.content;

  const author = post.author;
  const navigate = useNavigate();

  const handlePublishChange = () => {
    // TODO: fetch to server
    setIsPublish(!post.published);
  }

  const visibilityButton = <button
    onClick={handlePublishChange}
  >
    {post.published ? "Published" : "Hidden"}
  </button>;

  return (
    <div className={styles.postItem}>
      <h3>{post.title}</h3>
      <h4>{author.firstName} {author.lastName} ({author.username})</h4>
      <p>{shortContent}</p>

      <div className={styles.actions}>
        {visibilityButton}
        <button onClick={() => navigate(`/posts/${post.id}`)}>Details</button>
        <button onClick={() => handleEdit(post.id)}>Edit</button>
        <button onClick={() => handleDelete(post.id)}>Delete</button>
      </div>
    </div>
  );

}