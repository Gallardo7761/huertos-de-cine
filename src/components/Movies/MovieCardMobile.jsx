import PropTypes from 'prop-types';
import '@/css/MovieCard.css';
import VoteButtons from '@/components/Movies/VoteButtons.jsx';
import { useEffect, useState } from 'react';

const MovieCardMobile = ({ title, description, cover }) => {
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if (description.length > 400 && !expanded) {
            setExpanded(false);
        }
    }, [description, expanded]);

    return (
        <div className="movie-card movie-card-mobile shadow-sm mb-3">
            <div className="row w-100">
                <img
                    src={cover}
                    alt={`Cartel de ${title}`}
                    className="img-fluid w-100 movie-card-img rounded-0"
                />
            </div>

            <div className="row g-0 p-2">
                <div className="col-1 d-flex flex-column align-items-center">
                    <VoteButtons />
                </div>

                <div className="col-11 ps-2">
                    <h2 className="movie-title fs-5 mb-2">{title}</h2>
                    <p className="movie-description mb-2">
                        {
                            expanded
                                ? description
                                : (description.length > 400 ? `${description.slice(0, 400)}...` : description)
                        }
                    </p>
                    {
                        description.length > 400 && (
                            <button
                                className="btn btn-outline-info btn-sm"
                                onClick={() => setExpanded(!expanded)}
                            >
                                {expanded ? 'Ver menos' : 'Ver más'}
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

MovieCardMobile.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
};

export default MovieCardMobile;