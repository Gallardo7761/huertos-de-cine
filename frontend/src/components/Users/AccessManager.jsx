import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";
import UserCard from "@/components/Users/UserCard";
import CustomModal from "@/components/CustomModal";
import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { usePostMutation, usePutMutation, useDeleteMutation } from "@/hooks/queries/useApiMutations";
import { invalidateKeys } from "@/util/apiUtils";

const KEYS = ['access', 'dashboard', 'viewers'];
const EMPTY_EXTERNAL = { username: '', displayName: '', email: '' };

const AccessManager = ({ accessUrl, onError }) => {
    const queryClient = useQueryClient();
    const { data: users = [] } = useApiQuery(['access', 'users'], accessUrl);
    const { data: candidates = [] } = useApiQuery(['access', 'candidates'], `${accessUrl}/candidates`);
    const put = usePutMutation(onError);
    const del = useDeleteMutation(onError);
    const post = usePostMutation(onError);

    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState('');
    const [external, setExternal] = useState(EMPTY_EXTERNAL);
    const [notice, setNotice] = useState(null);

    const refresh = () => invalidateKeys(queryClient, KEYS);

    const grant = async () => {
        if (!selected) return;
        await put.mutateAsync({ url: `${accessUrl}/${encodeURIComponent(selected)}`, data: {} });
        setSelected('');
        setShowModal(false);
        await refresh();
    };

    const revoke = async (username) => {
        await del.mutateAsync({ url: `${accessUrl}/${encodeURIComponent(username)}` });
        await refresh();
    };

    const createExternal = async (e) => {
        e.preventDefault();
        const result = await post.mutateAsync({ url: `${accessUrl}/external`, data: external });
        setExternal(EMPTY_EXTERNAL);
        setShowModal(false);
        setNotice(result?.resetEmailSent
            ? `Usuario ${result.user.username} creado. Le hemos enviado un correo para elegir contraseña.`
            : `Usuario ${result?.user?.username} creado, pero no se pudo enviar el correo de contraseña.`);
        await refresh();
    };

    return (
        <section className="admin-section mb-4">
            <div className="d-flex justify-content-between align-items-center gap-3 mb-2 flex-wrap">
                <h2 className="m-0 text-white">Usuarios con acceso</h2>
                <div className="d-flex align-items-center gap-3">
                    <small className="text-muted">{users.length} usuarios</small>
                    <Button size="sm" onClick={() => setShowModal(true)}>Añadir usuario</Button>
                </div>
            </div>
            {notice && <Alert variant="success" dismissible onClose={() => setNotice(null)}>{notice}</Alert>}
            <div className="rounded-4 p-3 user-container">
                <div className="row g-3 m-0">
                    {users.length === 0 ? <p className="admin-empty-state m-0">Sin usuarios.</p> :
                        users.map(u => (
                            <UserCard
                                key={u.username}
                                name={u.displayName || u.username}
                                renderMode="delete"
                                onDelete={() => revoke(u.username)}
                            />
                        ))
                    }
                </div>
            </div>

            <CustomModal show={showModal} onClose={() => setShowModal(false)} title="Añadir usuario">
                <div className="p-3">
                    <h5>Socio de los huertos</h5>
                    <div className="d-flex gap-2 mb-4">
                        <Form.Select value={selected} onChange={e => setSelected(e.target.value)}>
                            <option value="">Elige un socio…</option>
                            {candidates.map(c => (
                                <option key={c.username} value={c.username}>{c.displayName || c.username} ({c.username})</option>
                            ))}
                        </Form.Select>
                        <Button onClick={grant} disabled={!selected || put.isPending}>Dar acceso</Button>
                    </div>

                    <h5>Usuario externo</h5>
                    <Form onSubmit={createExternal}>
                        <Form.Control className="mb-2" placeholder="Usuario" required value={external.username}
                            onChange={e => setExternal({ ...external, username: e.target.value })} />
                        <Form.Control className="mb-2" placeholder="Nombre" required value={external.displayName}
                            onChange={e => setExternal({ ...external, displayName: e.target.value })} />
                        <Form.Control className="mb-3" type="email" placeholder="Email" required value={external.email}
                            onChange={e => setExternal({ ...external, email: e.target.value })} />
                        <Button type="submit" disabled={post.isPending}>Crear usuario</Button>
                    </Form>
                </div>
            </CustomModal>
        </section>
    );
};

export default AccessManager;
