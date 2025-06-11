import SearchToolbar from "@/components/SearchToolbar";
import { useState, useEffect } from "react";
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
        usersUrl: `${config.apiConfig.coreRawUrl}${config.apiConfig.endpoints.users.getAll}`,
        metadataUrl: `${config?.apiConfig.baseRawUrl}${config?.apiConfig.endpoints.viewers.metadata}`,
        params: {},
    };

    return (
        <DataProvider config={reqConfig}>
            <UsuariosContent reqConfig={reqConfig} />
        </DataProvider>
    );
}

const UsuariosContent = ({ reqConfig }) => {
    const { data, dataLoading, dataError, getData, postData } = useDataContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getData(reqConfig.usersUrl);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [getData, reqConfig.usersUrl]);

    if (dataLoading) return <p><LoadingIcon /></p>;
    if (dataError) return <p>Error: {dataError.message}</p>;

    const filteredUsers = users.filter((user) =>
        user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const viewerIds = data
        .filter(user => user.status === 1)
        .map(user => user.user_id);

    const handleAdd = async (user) => {
        try {
            await postData(reqConfig.metadataUrl, {
                user_id: user.user_id,
                role: 0,
                status: 1,
            });
        } catch (error) {
            console.error('Error adding user:', error);
        }
    }

    const handleDelete = async (user) => {
        try {
            await postData(reqConfig.metadataUrl, {
                user_id: user.user_id,
                role: 0,
                status: 0,
            });
        } catch (error) {
            console.error('Error adding user:', error);
        }
    }

    return (
        <main className="container my-5">
            <SearchToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
            />
            <div className="mb-5 p-0 search-results">
                {searchTerm && (
                    <>
                        {filteredUsers.length > 0 ? (
                            <div className="row g-3">
                                {filteredUsers
                                    .filter(user => !viewerIds.includes(user.user_id))
                                    .map(user => (
                                        <UserCard key={user.user_id} user={user} renderMode="add" onAdd={() => handleAdd(user)} />
                                    ))}
                            </div>
                        ) : (
                            <p className="text-white">No se encontraron resultados para "{searchTerm}"</p>
                        )}
                    </>
                )}
            </div>
            <>
                <h2>Usuarios añadidos</h2>
                <div className="rounded-4 p-3 user-container">
                    <div className="row g-3 m-0">
                        {data.filter(user => user.status === 1).map((user) => (
                            <UserCard renderMode="delete" key={user.user_id} user={user} onDelete={() => handleDelete(user)} />
                        ))}
                    </div>
                </div>
            </>
        </main>
    );
}

export default Usuarios;