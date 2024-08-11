import styles from "./Comment.module.css";

export default function Comment({ comment: c }) {
  const date = new Date(c.createdAt);
  const prettyDate = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;

  return (
    <div className={styles.comment}>
      <h6>{c.author.username} at {prettyDate}</h6>
      <p>{c.content}</p>
    </div>
  );

}