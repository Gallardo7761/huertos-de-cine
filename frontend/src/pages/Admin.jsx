import { useState } from "react";
import UserCard from "@/components/Users/UserCard";
import MovieCard from "@/components/Movies/MovieCard";
import LoadingIcon from "@/components/LoadingIcon";
import { useConfig } from "@/hooks/useConfig";
import { useError } from "@/context/ErrorContext";
import { Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CustomModal from '@/components/CustomModal';
import '@/css/Admin.css';
import '@/css/MovieCard.css';
import MovieForm from "@/components/Movies/MovieForm";
import MovieSearch from "@/components/Movies/MovieSearch";
import { useDashboard } from "@/hooks/queries/useDashboard";
import { useMovies } from "@/hooks/queries/useMovies";
import { useViewers } from "@/hooks/queries/useViewers";

const Admin = () => {
    const { config, configLoading } = useConfig();

    if (configLoading) return (
        <section className="text-center py-5" role="status">
            <div className="spinner-border primary" role="status"></div>
            <p className="mt-2">Cargando administración...</p>
        </section>
    );

    const reqConfig = {
        baseUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.admin.dashboard}`,
        acceptRequestUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.requests.accept}`,
        rejectRequestUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.requests.reject}`,
        moviesUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.movies.all}`,
        viewersUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.viewers.all}`,
        params: {},
    };

    return <AdminContent reqConfig={reqConfig} />;
}

const AdminContent = ({ reqConfig }) => {
    const { showError } = useError();

    const { data, dataLoading, dataError, postData: handleRequest } = useDashboard(reqConfig.baseUrl, {}, showError);
    
    const { postData: addMovie, putData: editMovie, deleteData: deleteMovie } = useMovies(reqConfig.moviesUrl, {}, showError, ['dashboard', 'movies']);

    const { postData: deleteViewer } = useViewers(reqConfig.viewersUrl, {}, showError, ['dashboard', 'viewers']);

    const [showAddModal, setShowAddModal] = useState(false);
    const [tmdbSelection, setTmdbSelection] = useState(null);

    const requests = data?.requests || [];
    const viewers = data?.viewers || [];
    const movies = data?.movies || [];

    const pendingRequests = requests.filter(req => req.status === 0);
    const activeViewers = viewers.filter(viewer => viewer.account?.status === 1);

    const handleAcceptRequest = async (requestId) => {
        const url = reqConfig.acceptRequestUrl.replace(':requestId', requestId);
        await handleRequest(url, {});
    };

    const handleRejectRequest = async (requestId) => {
        const url = reqConfig.rejectRequestUrl.replace(':requestId', requestId);
        await handleRequest(url, {});
    };

    const handleAddMovie = async (formData) => {
        const url = reqConfig.moviesUrl;
        await addMovie(url, formData);
        setTmdbSelection(null);
        setShowAddModal(false);
    };

    const handleEditMovie = async (movieId, formData) => {
        const url = reqConfig.moviesUrl + `/${movieId}`;
        await editMovie(url, formData);
    };

    const handleDeleteMovie = async (movieId) => {
        const url = reqConfig.moviesUrl + `/${movieId}`;
        await deleteMovie(url);
    };

    const handleDeleteViewer = async (identity) => {
        const url = reqConfig.viewersUrl + `/${identity.user.userId}/status`;
        await deleteViewer(url, {
            status: 0
        });
    };

    const isFirstLoad = dataLoading && !data;

    if (isFirstLoad) return <section className="text-center py-5"><LoadingIcon /></section>;
    if (dataError) return <div className="container py-4"><Alert variant="danger">{dataError.message}</Alert></div>;

    return (
        <main className="container py-4 admin-page py-lg-5" aria-labelledby="admin-title">

            <section className="admin-section mb-4">
                <div className="d-flex justify-content-between align-items-center gap-3 mb-2 flex-wrap">
                    <h2 className="m-0 text-white">Solicitudes</h2>
                    <small className="text-muted">{pendingRequests.length} solicitudes</small>
                </div>
                <div className="rounded-4 p-3 user-container">
                    <div className="row g-3 m-0">
                        {pendingRequests.length === 0 ? <p className="admin-empty-state m-0">Sin solicitudes.</p> :
                            pendingRequests.map(req => <UserCard key={req.requestId} identity={{ user: req, account: { status: 0 } }} renderMode="add" onAdd={() => handleAcceptRequest(req.requestId)} onReject={() => handleRejectRequest(req.requestId)} />)}
                    </div>
                </div>
            </section>

            <section className="admin-section mb-4">
                <div className="d-flex justify-content-between align-items-center gap-3 mb-2 flex-wrap">
                    <h2 className="m-0 text-white">Usuarios añadidos</h2>
                    <small className="text-muted">{activeViewers.length} usuarios</small>
                </div>
                <div className="rounded-4 p-3 user-container">
                    <div className="row g-3 m-0">
                        {activeViewers.length === 0 ? <p className="admin-empty-state m-0">Sin usuarios.</p> :
                            activeViewers.map(v => <UserCard key={v.user.userId} identity={v} renderMode="delete" onDelete={() => handleDeleteViewer(v)} />)}
                    </div>
                </div>
            </section>

            <section className="admin-section">
                <div className="d-flex justify-content-between align-items-center gap-3 mb-2 flex-wrap">
                    <h2 className="m-0 text-white">Películas</h2>
                    <small className="text-muted">{movies.length} {movies.length === 1 ? 'película' : 'películas'}</small>
                </div>
                <div className="rounded-4 p-3 user-container">
                    <div className="row g-3 m-0">
                        {movies.map((movie) => (
                            <div key={movie.movieId} className="col-12 col-sm-6 col-md-4 col-lg-3 p-3 m-0">
                                <MovieCard
                                    {...movie}
                                    onVote={() => { }}
                                    onEdit={handleEditMovie}
                                    onDelete={handleDeleteMovie}
                                    isAdmin
                                />
                            </div>
                        ))}

                        <div className="col-12 col-sm-6 col-md-4 col-lg-3 p-3 m-0">
                            <div
                                className="movie-card add-movie-card rounded-4 d-flex flex-column align-items-center justify-content-center h-100"
                                onClick={() => setShowAddModal(true)}
                                style={{
                                    cursor: 'pointer',
                                    aspectRatio: '2/3',
                                    border: '2px dashed #444',
                                    background: 'rgba(255,255,255,0.03)',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            >
                                <FontAwesomeIcon icon={faPlus} size="3x" className="mb-2 text-secondary" />
                                <span className="text-secondary fw-bold">Añadir Película</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <CustomModal show={showAddModal} onClose={() => setShowAddModal(false)} title="Nueva Película">
                <div className="px-3 pt-3">
                    <MovieSearch onSelect={m => setTmdbSelection(m)} />
                </div>

                <MovieForm
                    key={tmdbSelection ? 'api-data' : 'empty'}
                    initialData={tmdbSelection || { title: '', description: '', cover: '' }}
                    onSubmit={handleAddMovie}
                    onCancel={() => {setShowAddModal(false); setTmdbSelection(null)}}
                />
            </CustomModal>
        </main>
    );
}

export default Admin;