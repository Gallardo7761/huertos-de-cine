import LoadingIcon from "@/components/LoadingIcon";
import MovieCard from "@/components/Movies/MovieCard";

import { DataProvider } from "@/context/DataContext";

import { useDataContext } from "@/hooks/useDataContext";
import { useConfig } from "@/hooks/useConfig";
import { Alert } from "react-bootstrap";

import { useEffect, useState } from "react";

const Votar = () => {
    const { config, configLoading } = useConfig();

    if (configLoading) return <p><LoadingIcon /></p>;

    const reqConfig = {
        baseUrl: `${config.apiConfig.baseRawUrl}${config.apiConfig.endpoints.movies.getAll}`,
        params: {},
    };

    return (
        <DataProvider config={reqConfig}>
            <VotarContent />
        </DataProvider>
    );
}

const VotarContent = () => {
  const { data, loading, error } = useDataContext();
  const [alertShown, setAlertShown] = useState(() => localStorage.getItem('alertShown') === 'true');
  const [showAlert, setShowAlert] = useState(!alertShown);

  useEffect(() => {
    if (alertShown) return;

    const timer = setTimeout(() => {
      localStorage.setItem('alertShown', 'true');
      setAlertShown(true);
      setShowAlert(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [alertShown]);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  if (loading) return <p><LoadingIcon /></p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className="row m-0 p-0 justify-content-center">

      {showAlert && (
        <Alert
          className="col-6 m-0 mt-3 text-center"
          variant="warning"
          role="alert"
          dismissible
          onClose={handleCloseAlert}
        >
          <strong>Tip: haz click en la portada de una película para ver su descripción</strong>
        </Alert>
      )}

      <div className="row gap-3 mt-3 justify-content-center">
        {data?.map((movie) => (
          <MovieCard
            key={movie.movie_id}
            movie_id={movie.movie_id}
            title={movie.title}
            description={movie.description}
            cover={movie.cover}
          />
        ))}
      </div>
    </main>
  );
}


export default Votar;