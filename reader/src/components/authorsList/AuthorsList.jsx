import { useFetch } from '../../utils/utils';
import styles from './AuthorsList.module.css';

export default function AuthorsList() {
  const { data, loading, error } = useFetch('http://localhost:3000/api/users?role=author');

  if (error) {
    return <div> {error.message} </div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (data.status !== 'success') {
    return <div> {data.status} </div>
  }
  const authors = data.users;

  // TODO: css 
  const authorList = authors.map(a => {
    return (
      <div key={a.id}
        className={styles.authorItem}
      >
        <h3>{a.firstName} {a.lastName}</h3>
        <p> email: {a.email} </p>
        <p> username: {a.username} </p>
        {/* TODO: pretty print date simmilar is in comment section */}
        <p> registered at: {a.registeredAt} </p>
      </div>)
  });
  return (
    <div>
      {authorList}
    </div>
  );
}