import PropTypes from 'prop-types';
import classnames from 'classnames';

// styles
import './styles.scss';

export default function StoryStep({ data }) {
  return (
    <div
      className={classnames('c-storytelling-step', {
        'pointer-events-none bg-none': data.isPlaceholder,
      })}
      id={data.id}
      style={{
        ...data.isPlaceholder && {
          background: 'none',
          pointerEvents: 'none',
        },
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: data.isPlaceholder ? 'none' : '#2C75B0',
        }}
      >
        {!data.isPlaceholder && `story step content ${data.id}`}
      </div>
    </div>
  );
}

StoryStep.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isPlaceholder: PropTypes.bool,
  }).isRequired,
};
