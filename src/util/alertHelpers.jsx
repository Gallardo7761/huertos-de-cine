export const renderErrorAlert = (error, options = {}) => {
    const { className = 'alert alert-danger py-1 px-2 small', role = 'alert' } = options;

    if (!error) return null;

    return (
        <div className={className} role={role}>
            {typeof error === 'string' ? error : 'An unexpected error occurred.'}
        </div>
    );
};

export const resetErrorIfEditEnds = (editMode, setError) => {
    if (!editMode) setError(null);
};
