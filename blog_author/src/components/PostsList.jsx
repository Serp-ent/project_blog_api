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

  const setIsPublish = async (id, state) => {
    const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
    try {
      const result = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          publishState: state,
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

      const newPosts = posts.map(p => p.id === id ?
        { ...p, published: state }
        : p);
      setPosts(newPosts);
    }
    catch (err) {
      console.log(err);
    }
  }

  const postsList = posts.map(post => {
    return (
      <PostItemOverview
        key={post.id}
        post={post}
        handleEdit={handleEdit}
        handleDelete={() => handleDeletePost(post.id)}
        setIsPublish={(state) => setIsPublish(post.id, state)}
      />
    );
  });

  return (
    <div>
      <div>{postsList}</div>
    </div>
  );
}