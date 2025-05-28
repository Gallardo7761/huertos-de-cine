import PropTypes from 'prop-types';

const ContentWrapper = ({ children }) => {
    return (
        <div className="container-xl">
            {children}
        </div>
    );
}

ContentWrapper.propTypes = {
    children: PropTypes.node.isRequired,
}

export default ContentWrapper;