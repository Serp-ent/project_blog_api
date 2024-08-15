import { useState } from 'react';
import { fetchWithAuth } from '../../utils/utils';
import styles from './CommentInput.module.css';

export default function CommentInput({ postId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = JSON.stringify({ content });
      const result = await fetchWithAuth(
        `http://localhost:3000/api/posts/${postId}/comments`,
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body,
        }
      );

      if (result.status !== 'success') {
        throw new Error(result.error);
      }

      if (onCommentAdded) {
        onCommentAdded(result.comment);
      }

      setContent('');
    } catch (err) {
      setError('Failed to submit comment, Please try again')
      console.error('Error submitting comment', err);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        name="content"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder='Write your comment here...'
      ></textarea>
      {error && <p className={styles.error}>{error}</p>}
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