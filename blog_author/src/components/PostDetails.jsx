import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CommentSection from "./commentSection/CommentSection";

export default function PostDetail() {
  const { id } = useParams(); // Extract the id parameter from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the post data using the id
    async function fetchPost() {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        if (data.status !== 'success') {
          setError(data.message);
          return;
        }

        setPost(data.post);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {post ? (
        <>
          <h1>{post.title}</h1>
          <p>{post.content}</p>

          <CommentSection postId={id} />
        </>
      ) : (
        <div>Post not found</div>
      )}
    </div>
  );
}