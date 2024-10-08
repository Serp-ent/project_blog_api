import { useFetch } from "../../utils/utils";
import BlogPostItem from "../blogPostItem/BlogPostItem";
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

  const posts = data.posts;

  return (
    <div>
      {posts.map(item => <BlogPostItem key={item.id} post={item} />)}
    </div>
  );
}