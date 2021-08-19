import PropTypes from 'prop-types';

// styles
import './styles.scss';

export default function StepBackground({
  src,
  alt,
  style,
}) {
  return (
    <img
      className="c-storytelling-background"
      src={src}
      alt={alt}
      style={style}
    />
  );
}

StepBackground.defaultProps = {
  style: {},
};

StepBackground.propTypes = {
  style: PropTypes.shape({}),
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};
