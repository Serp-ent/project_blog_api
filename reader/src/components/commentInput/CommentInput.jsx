import styles from './CommentInput.module.css';

export default function CommentInput() {
  return (
    <form className={styles.form}>
      <textarea name="content"></textarea>
      <div className={styles.submitWrapper}>
        <button
          className={styles.submit}
          type="submit">
          Add
        </button>
      </div>
    </form>
  );

}