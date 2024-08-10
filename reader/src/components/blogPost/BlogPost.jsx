import styles from "./BlogPost.module.css";

export default function BlogPost({ post }) {
  return (
    <div className={styles.blogPost}>
      <h4>{post.title}</h4>
      <p>{post.content}</p>
    </div>
  );
}