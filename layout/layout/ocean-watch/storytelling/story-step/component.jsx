import PropTypes from 'prop-types';
import classnames from 'classnames';

// styles
import './styles.scss';

export default function StoryStep({ data }) {
  return (
    <div
      className={classnames('c-storytelling-step', {
        '-is-placeholder': data.isPlaceholder,
      })}
      id={data.id}
    >
      <div
        className="content"
      >
        {!data.isPlaceholder && (
          <>
            {data.data.title && (
              <h3 className="story-title">
                {data.data.title}
              </h3>
            )}
          </>
        )}
      </div>
    </div>
  );
}

StoryStep.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isPlaceholder: PropTypes.bool,
    data: PropTypes.shape({
      title: PropTypes.string,
    }),
  }).isRequired,
};
