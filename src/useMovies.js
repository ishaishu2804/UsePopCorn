import { useEffect, useState } from "react";

const KEY = "5ce9c1b3";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch list of movies based on query
  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        setSelectedMovie(null); // Clear previous detail on new search
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
          setMovies([]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (!query.length) {
      setMovies([]);
      setSelectedMovie(null);
      setError("");
      return;
    }

    fetchMovies();

    return () => controller.abort();
  }, [query]);

  // Fetch detailed info for selected movie by imdbID
  async function fetchMovieDetails(imdbID) {
    try {
      setIsLoading(true);
      setError("");
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${KEY}&i=${imdbID}`
      );
      if (!res.ok) throw new Error("Failed to fetch movie details");

      const data = await res.json();
      if (data.Response === "False") throw new Error(data.Error);

      setSelectedMovie(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return { movies, selectedMovie, isLoading, error, fetchMovieDetails };
}

