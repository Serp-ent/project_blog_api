import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  return (
    <div>
      <form>
        <label htmlFor="title">Title:</label>
        <input
          name="title"
          id="title"
          type="text"
        />

        <label htmlFor="content">Content:</label>
        <textarea
          name="content"
          id="content"
          type="text"
        />
      </form>

      <button
        onClick={() => navigate(-1)}
      >
        Cancel
      </button>

      <button
        onClick={() => console.log('create')}
      >
        Create
      </button>
    </div>

  );
}