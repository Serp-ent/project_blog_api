import { useFetch } from "../../utils/utils";
import BlogPost from "../blogPost/BlogPost";
import styles from "./BlogPostsList.module.css";
import { useState } from 'react';

export default function BlogPostsList() {
  // TODO: add pagination and infinite scroll
  const { data, loading, error } = useFetch('http://localhost:3000/api/posts');

  if (loading) {
    return <p>Loading</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }


  return (
    <div>
      <h1>Blog Posts</h1>
      <ul className={styles.blogList}>
        {data.map(item => <li key={item.id}><BlogPost post={item} /></li>)}
      </ul>
    </div>
  );
}