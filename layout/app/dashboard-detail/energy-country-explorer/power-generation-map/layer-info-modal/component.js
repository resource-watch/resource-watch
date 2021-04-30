import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

// styles
import './styles.scss';

function LayerInfoModal(props) {
  const { layer } = props;
  const router = useRouter();

  return (
    <div className="c-layer-info-modal">
      <h2>{layer.name}</h2>
      <p>
        {layer.description}
      </p>
      <div className="actions">
        <button
          className="c-button -primary"
          onClick={() => {
            router.push(`/data/explore/${layer.dataset}`);
          }}
        >
          More info
        </button>
      </div>
    </div>
  );
}

LayerInfoModal.propTypes = {
  layer: PropTypes.object.isRequired,
};

export default LayerInfoModal;
