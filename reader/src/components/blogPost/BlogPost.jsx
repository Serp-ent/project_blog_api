import { useParams } from "react-router-dom";
import styles from "./BlogPost.module.css";
import { fetchWithAuth } from "../../utils/utils";
import { useEffect, useState } from "react";
import CommentSection from "../commentSection/CommentSection";

export default function BlogPost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/posts/${postId}`)
      .then(response => response.json())
      .then(data => setPost(data.post))
      .catch(error => console.error('Error fetching post:', error));
    // TODO: fetchWithAuth(``);
  }, [postId]);

  if (!post) {
    return <div>Loading...</div>
  }


  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      <CommentSection postId={postId}/>
    </div>
  );
}