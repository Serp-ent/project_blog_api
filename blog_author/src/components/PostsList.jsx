import { useState } from "react";
import { useFetch } from "../utils/utils";
import styles from './PostsList.module.css'

export default function PostsList() {
  const { data, loading, error } = useFetch('http://localhost:3000/api/posts');

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>{error.message}</div>
  }

  const postsList = data.posts.map(post => {
    const shortContent = post.content.length > 50 ?
      post.content.substring(0, 17) + '...' :
      post.content;
    const author = post.author;

    return (
      <div key={post.id}
        className={styles.postItem}
      >
        <h3>{post.title}</h3>
        <h4>{author.firstName} {author.lastName} ({author.username})</h4>
        <p>{shortContent}</p>

        <div className={styles.actions}>
          <button>Details</button>
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </div>
    );
  });

  console.log('PostsList:', data.posts);
  return (
    <div>
      <div>{postsList}</div>
    </div>
  );
}