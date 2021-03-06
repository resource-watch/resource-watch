import PropTypes from 'prop-types';
import Link from 'next/link';

const LayerCardItem = ({
  layer, onDragStart, onDragEnd, onDragOver, index,
}) => {
  const {
    name, id, dataset, published,
  } = layer;

  return (
    <li
      draggable
      className="sorting-layer-manager-item"
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={() => onDragOver(index)}
    >
      <div className="card-name">
        <Link href={`/admin/data/layers/${id}/edit?dataset=${dataset}`}>
          <a>{name}</a>
        </Link>
        {!published && (<span className="unpublished">&nbsp;(Unpublished)</span>)}
      </div>
      <div className="draggable-symbol">
        <span className="square-container" />
        <span className="square-container" />
        <span className="square-container" />
      </div>
    </li>
  );
};

LayerCardItem.propTypes = {
  layer: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onDragStart: PropTypes.func.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onDragOver: PropTypes.func.isRequired,
};

export default LayerCardItem;
