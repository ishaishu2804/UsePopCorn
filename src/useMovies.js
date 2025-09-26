import { useEffect, useState } from "react";

const KEY = "5ce9c1b3";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

 useEffect(() => {
  const controller = new AbortController();

  async function fetchMovies() {
    try {
      setIsLoading(true);
      setError("");
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${KEY}&s=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error("Something went wrong :(");

      const data = await res.json();
      if (data.Response === "False") throw new Error("Movie not found :(");
      setMovies(data.Search);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!query.length) {
    setMovies([]);
    setError("");
    return;
  }

  fetchMovies();

  return () => controller.abort();
}, [query]);
