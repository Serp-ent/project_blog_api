import { useFetch } from "../../utils/utils";
import styles from "./BlogPostsList.module.css";
import { useState } from 'react';

export default function BlogPostsList() {
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
        {data.map(item => {
          return <li
            key={item.id}
            style={{ border: "1px solid red; margin: 8px" }}
          >{item.id} {item.title}</li>
        })}
      </ul>
    </div>
  );
}