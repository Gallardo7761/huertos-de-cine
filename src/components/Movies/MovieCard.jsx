import '@/css/MovieCard.css';
import { useState, useEffect } from 'react';
import CustomModal from '../CustomModal';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useData } from '@/hooks/useData';
import { useConfig } from '@/hooks/useConfig';

const MovieCard = ({ movie_id, title, description, cover }) => {
  const [modal, setModal] = useState(false);
  const [votes, setVotes] = useState(0);
  const [userVote, setUserVote] = useState(null); // 'up', 'down' o null
  const { getData, postData, deleteDataWithBody } = useData();
  const { config } = useConfig();
  const userId = JSON.parse(localStorage.getItem('user') || '{}')?.user_id;

  useEffect(() => {
    if (!config) return;

    const fetchVotes = async () => {
      try {
        const url = `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.movies.getVotes}`.replace(':movie_id', movie_id);
        const response = await getData(url);

        const votesTotal = response.data.reduce((acc, v) => acc + v.vote, 0);
        setVotes(votesTotal);

        const myVote = response.data.find(v => v.user_id === userId)?.vote;
        setUserVote(myVote === 1 ? 'up' : myVote === -1 ? 'down' : null);
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    };

    fetchVotes();
  }, [movie_id, getData, config, userId]);

  const sendVote = async (type) => {
    if (!config) return;

    const voteValue = type === 'up' ? 1 : -1;
    const url = `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.movies.getVotes}`.replace(':movie_id', movie_id);

    try {
      await postData(url, { user_id: userId, vote: voteValue });

      let delta = voteValue;
      if (userVote === 'up' && type === 'down') delta = -2;
      else if (userVote === 'down' && type === 'up') delta = 2;

      setVotes(v => v + delta);
      setUserVote(type);
    } catch (err) {
      console.error('Error al votar:', err);
    }
  };

  const handleUnvote = async () => {
    if (!config) return;

    const url = `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.movies.getVotes}`.replace(':movie_id', movie_id);
    try {
      await deleteDataWithBody(url, { user_id: userId });
      setVotes(v => v + (userVote === 'up' ? -1 : 1));
      setUserVote(null);
    } catch (err) {
      console.error('Error al quitar voto:', err);
    }
  };

  const handleVoteClick = (type) => (userVote === type ? handleUnvote() : sendVote(type));

  return (
    <>
      <div className="movie-card rounded-4 card m-0 p-0 col-md-4 col-xl-2 shadow-sm">
        <img
          src={cover}
          alt={`Cartel de ${title}`}
          onClick={() => setModal(true)}
          className="rounded-top-4"
        />
        <div className="card-footer movie-vote rounded-bottom-4">
          <div className="px-3">
            <div className="d-flex align-items-center justify-content-between">
              <span
                onClick={e => { e.stopPropagation(); handleVoteClick('up'); }}
                className={`vote-button ${userVote === 'up' ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={faThumbsUp} />
              </span>
              <span className="vote-count">{votes || 0}</span>
              <span
                onClick={e => { e.stopPropagation(); handleVoteClick('down'); }}
                className={`vote-button ${userVote === 'down' ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={faThumbsDown} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <CustomModal show={modal} onClose={() => setModal(false)} title={title}>
        <div className="p-3 movie-description">
          <p>{description}</p>
        </div>
      </CustomModal>
    </>
  );
};

export default MovieCard;
