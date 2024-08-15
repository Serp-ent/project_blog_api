import styles from "./CommentSection.module.css";
import { useEffect, useState } from "react";
import Comment from "../comment/Comment";
import CommentInput from "../commentInput/CommentInput";
import { useAuth } from "../../utils/Auth";

export default function CommentSection({ postId }) {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);

  const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments]);
  };

  useEffect(() => {
    fetch(`http://localhost:3000/api/posts/${postId}/comments`)
      .then(response => response.json())
      .then(data => setComments(data.comments))
      .catch(err => console.error('Error fetching data', err));
  }, [postId]);

  // TODO: add handle comment submit
  // TODO: add pagination
  const commentList = comments.map(c => <Comment key={c.id} comment={c} />);
  return (
    <>
      {/* // TODO: input comment */}
      <div className={styles.commentSection}>

        {isAuthenticated && <CommentInput
          postId={postId}
          onCommentAdded={handleCommentAdded} />}

        {commentList.length > 0 ?
          commentList
          : <div>No comments. Be first!</div>}
      </div>
    </>
  );

  // TODO: maybe add button to load other comments
}