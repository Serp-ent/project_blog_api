import { useFetch } from "../utils/utils";
import PostItemOverview from "./PostItem";

export default function PostsList({ handleEdit, handleDelete }) {
  const { data, loading, error } = useFetch('http://localhost:3000/api/posts');

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>{error.message}</div>
  }

  const handleDeletePost = (id) => {
    handleDelete(id);
    // remove locally from data.posts
    // setPosts(posts.filter(post => post.id !== postId));
  }
  const postsList = data.posts.map(post => {
    return (
      <PostItemOverview
        key={post.id}
        post={post}
        handleEdit={handleEdit}
        handleDelete={() => handleDeletePost(post.id)}
      />
    );
  });

  return (
    <div>
      <div>{postsList}</div>
    </div>
  );
}