import { useState, useEffect } from "react";

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('authToken');
  const defaultOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  };

  const response = await fetch(url, defaultOptions)
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
}

// TODO: useEffect with options dependency
export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const result = await response.json();
        if (isMounted) {
          setData(result.posts);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
}
