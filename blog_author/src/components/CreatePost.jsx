export default function CreatePost() {
  return (
    <div>
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
    </div>
  );
}