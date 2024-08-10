import styles from "./CommentSection.module.css";
import { useAuth } from "../../utils/AuthProvider";
import { useEffect, useState } from "react";

export default function CommentSection({ postId }) {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/posts/${postId}/comments`)
      .then(response => response.json())
      .then(data => setComments(data.comments))
      .catch(err => console.error('Error fetching data', err));
  }, [postId]);

  // TODO: add handle comment submit
  // TODO: add pagination
  console.log(comments);
  const commentList = comments.map(c => {
    return (
      <div>
        <h6>{c.author.username} at {c.createdAt}</h6>
        <p>{c.content}</p>
      </div>
    )
  });

  return (
    <>
      {/* // TODO: input comment */}
      <div className={styles.commentSection}>
        <h3>Comments:</h3>
        {commentList}
      </div>
    </>
  );

}