import { useEffect, useState } from "react";
import { useFetch } from "../utils/utils";
import PostItemOverview from "./PostItem";

export default function PostsList({ handleEdit, handleDelete }) {
  const { data, loading, error } = useFetch('http://localhost:3000/api/posts');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (data && data.posts) {
      setPosts(data.posts);
    }
  }, [data])

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>{error.message}</div>
  }

  const handleDeletePost = async (id) => {
    await handleDelete(id);
    setPosts(posts.filter(post => post.id !== id));
  }

  const postsList = posts.map(post => {
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