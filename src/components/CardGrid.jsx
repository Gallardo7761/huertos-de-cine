import LoadingIcon from './LoadingIcon';

const CardGrid = ({
  items = [],
  renderCard,
  loaderRef,
  loading = false
}) => {
  return (
    <div className="cards-grid">
      {items.map((item, i) => renderCard(item, i))}

      <div ref={loaderRef} className="loading-trigger d-flex justify-content-center align-items-center">
        {loading && <LoadingIcon />}
      </div>
    </div>
  );
};

export default CardGrid;
