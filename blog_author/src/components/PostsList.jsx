import { useFetch } from "../utils/utils";
import PostItemOverview from "./PostItem";

export default function PostsList() {
  const { data, loading, error } = useFetch('http://localhost:3000/api/posts');

  if (loading) {
    return <div>Loading...</div>
  }
  if (error) {
    return <div>{error.message}</div>
  }

  const postsList = data.posts.map(post => {
    return (
      <PostItemOverview key={post.id} post={post} />
    );
  });

  return (
    <div>
      <div>{postsList}</div>
    </div>
  );
}