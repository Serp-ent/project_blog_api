import styles from "./Comment.module.css";

export default function Comment({ comment: c }) {
  return (
    <div className={styles.comment}>
      <h6>{c.author.username} at {c.createdAt}</h6>
      <p>{c.content}</p>
    </div>
  );

}