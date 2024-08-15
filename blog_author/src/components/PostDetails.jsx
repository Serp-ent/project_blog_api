import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CommentSection from "./commentSection/CommentSection";

export default function PostDetail({ handleEdit, handleDelete }) {
  const { id } = useParams(); // Extract the id parameter from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const handleDeletePost = async (id) => {
    await handleDelete(id);
    navigate('/posts');
  }

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

  const handlePublishChange = async () => {
    const newState = !post.published;

    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    try {
      const result = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          publishState: newState,
        })
      });

      if (!result.ok) {
        if (result.status === 401) {
          return;
        }
        // If the status code is not in the 200 range, handle the error
        const errorData = await result.json(); // Parse the response body as JSON
        console.error('Error:', errorData.message); // Log the error message from the response
        return;
      }

      setPost({ ...post, published: newState });
    }
    catch (err) {
      console.log(err);
    }


  }

  const visibilityButton = <button
    onClick={handlePublishChange}
  >
    {post.published ? "Published" : "Hidden"}
  </button>;



  return (
    <div>
      {post ? (
        <>
          <h1>{post.title}</h1>
          <p>{post.content}</p>

          <div className="actions">
            <button onClick={() => navigate(-1)}>Back</button>
            {visibilityButton}
            <button onClick={() => handleEdit(post.id)}>Edit</button>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>

          </div>
          <CommentSection postId={id} />
        </>
      ) : (
        <div>Post not found</div>
      )}
    </div>
  );
}