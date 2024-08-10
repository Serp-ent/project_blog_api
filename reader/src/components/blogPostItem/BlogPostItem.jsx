import styles from "./BlogPostItem.module.css";
import { Link } from "react-router-dom";

export default function BlogPostItem({ post }) {
  return (
    <Link to={`/posts/${post.id}`} className={styles.blogPostClickable}>
      <div className={styles.blogPost}>
        <h2>{post.title}</h2>
        <p>{post.content}</p>
      </div>
    </Link>
  );
}