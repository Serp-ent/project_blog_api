import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { id } = useParams();

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

        setTitle(data.post.title);
        setContent(data.post.content);
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

  // TODO: get info about post from database
  // set state
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    try {
      const result = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content, title,
        }),
      });


      if (!result.ok) {
        const errorData = await result.json();
        console.log('Error', errorData.message);
        return;
      }

      navigate('/posts');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          name="title"
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="content">Content:</label>
        <textarea
          name="content"
          id="content"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div>
          <button type='submit'> Update </button>
          <button type="button" onClick={() => navigate(-1)} >
            Cancel
          </button>
        </div>
      </form>

    </div>

  );
}