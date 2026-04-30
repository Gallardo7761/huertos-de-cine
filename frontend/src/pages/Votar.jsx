import LoadingIcon from "@/components/LoadingIcon";
import MovieCard from "@/components/Movies/MovieCard";

import { DataProvider } from "@/context/DataContext";

import { useDataContext } from "@/hooks/useDataContext";
import { useConfig } from "@/hooks/useConfig";
import { Alert } from "react-bootstrap";

import { useState } from "react";
import { useError } from "@/context/ErrorContext";
import "@/css/Votar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const identity = JSON.parse(localStorage.getItem('identity') || '{}');
const userId = identity.user?.userId || identity.userId;

const Votar = () => {
  const { config, configLoading } = useConfig();
  const { showError } = useError();

  if (configLoading) return (
    <section className="text-center py-5" role="status" aria-live="polite" aria-label="Cargando películas">
      <div className="spinner-border primary" role="status"></div>
      <p className="mt-2">Cargando...</p>
    </section>
  );

  const reqConfig = {
    baseUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.movies.all}`,
    params: {}
  };

  return (
    <DataProvider config={reqConfig} onError={showError}>
      <VotarContent />
    </DataProvider>
  );
}

const VotarContent = () => {
  const { data, dataLoading, dataError, postData, putData, deleteData } = useDataContext();
  const { config } = useConfig();
  const movies = Array.isArray(data) ? data : [];

  const handleVote = async (movieId, type) => {
    if (!config) return;

    const action = type === 1 ? 'upvote' : 'downvote';
    const url = `${config.apiConfig.baseUrl}/movies/${movieId}/${action}`;

    try {
      await postData(url, {}, true, {});
    } catch (err) {
      console.error(`Error al votar:`, err);
    }
  };

  const handleEdit = async (movieId, formData) => {
    if (!config) return;
    const url = `${config.apiConfig.baseUrl}/movies/${movieId}`;
    try {
      await putData(url, formData, true);
    } catch (err) {
      console.error("Error al editar película:", err);
    }
  };

  const handleDelete = async (movieId) => {
    if (!config) return;
    const url = `${config.apiConfig.baseUrl}/movies/${movieId}`;
    try {
      await deleteData(url, true);
    } catch (err) {
      console.error("Error al borrar película:", err);
    }
  };

  if (dataLoading && !movies.length) {
    return (
      <section className="text-center py-5" role="status" aria-live="polite" aria-label="Cargando cartelera">
        <LoadingIcon />
      </section>
    );
  }

  if (dataError) {
    return (
      <main className="container py-4" role="main">
        <Alert variant="danger" role="alert">
          Error: {dataError.message}
        </Alert>
      </main>
    );
  }

  return (
    <main className="container py-4" aria-labelledby="votar-title">
      <section className="mt-4 pt-2" aria-label="Listado de películas para votar">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4 g-md-5 justify-content-center" role="list">
          {movies.length === 0 ? (
            <p className="votar-empty-state text-center" role="status">No hay películas disponibles para votar.</p>
          ) : (
            movies.map((movie) => (
              <div key={movie.movieId} className="col d-flex justify-content-center">
                <MovieCard
                  movieId={movie.movieId}
                  title={movie.title}
                  description={movie.description}
                  cover={movie.cover}
                  upvotes={movie.upvotes}
                  downvotes={movie.downvotes}
                  userVote={movie.userVote}
                  onVote={handleVote}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}


export default Votar;