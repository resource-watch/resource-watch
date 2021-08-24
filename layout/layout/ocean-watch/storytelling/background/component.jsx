import PropTypes from 'prop-types';

// styles
import './styles.scss';

export default function StepBackground({
  src,
  style,
}) {
  return (
    <div
      className="c-storytelling-background"
      style={{
        backgroundImage: `url(${src})`,
        ...style,
      }}
    />
  );
}

StepBackground.defaultProps = {
  style: {},
};

StepBackground.propTypes = {
  style: PropTypes.shape({}),
  src: PropTypes.string.isRequired,
};
