import SearchToolbar from "@/components/SearchToolbar";
import { useState } from "react";
import UserCard from "@/components/Users/UserCard";
import LoadingIcon from "@/components/LoadingIcon";
import { DataProvider } from "@/context/DataContext";
import { useConfig } from "@/hooks/useConfig";
import { useDataContext } from "@/hooks/useDataContext";
import '@/css/Usuarios.css';

const Usuarios = () => {
    const { config, configLoading } = useConfig();

    if (configLoading) return <p><LoadingIcon /></p>;

    const reqConfig = {
        baseUrl: `${config.apiConfig.baseRawUrl}${config.apiConfig.endpoints.viewers.getAll}`,
        params: {},
    };

    return (
        <DataProvider config={reqConfig}>
            <UsuariosContent />
        </DataProvider>
    );
}

const UsuariosContent = () => {
    const { data, dataLoading, dataError } = useDataContext();
    const [searchTerm, setSearchTerm] = useState('');

    if (dataLoading) return <p><LoadingIcon /></p>;
    if (dataError) return <p>Error: {dataError.message}</p>;

    const filteredUsers = data.filter((user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="container my-5">
            <SearchToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />
            <div className="mb-5 p-3 search-results">
                {searchTerm && (
                    <>
                        <h3>Resultados de búsqueda</h3>
                        {filteredUsers.length > 0 ? (
                            <div className="d-flex flex-wrap justify-content-start gap-3 rounded-4 p-3">
                                {filteredUsers.map((user) => (
                                    <UserCard
                                        key={user.user_id}
                                        user={user}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p>No se encontraron resultados para "{searchTerm}".</p>
                        )}
                    </>
                )}
            </div>
            <div className="m-0 p-0">
                <h2>Usuarios añadidos</h2>
                <div className="d-flex flex-wrap justify-content-start gap-3 rounded-4 p-3 user-container">
                    {data.map((user) => (
                        <UserCard
                            key={user.user_id}
                            user={user}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}

export default Usuarios;