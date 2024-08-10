import styles from "./CommentSection.module.css";
import { useAuth } from "../../utils/AuthProvider";
import { useEffect, useState } from "react";
import Comment from "../comment/Comment";

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
  const commentList = comments.map(c => <Comment key={c.id} comment={c} />);

  return (
    <>
      {/* // TODO: input comment */}
      <div className={styles.commentSection}>
        {commentList.length > 0 ?
          commentList
          : <div>No comments. Be first!</div>}
      </div>
    </>
  );

  // TODO: maybe add button to load other comments
}