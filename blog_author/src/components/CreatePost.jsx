import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    try {
      const result = await fetch('http://localhost:3000/api/posts', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          title,
        })
      });

      if (!result.ok) {
        // If the status code is not in the 200 range, handle the error
        const errorData = await result.json(); // Parse the response body as JSON
        console.error('Error:', errorData.message); // Log the error message from the response
        return;
      }

      navigate('/posts'); // Navigate to another page or display success message
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
          <button type="button" onClick={() => navigate(-1)} >
            Cancel
          </button>
          <button type='submit'> Create </button>
        </div>
      </form>

    </div>

  );
}