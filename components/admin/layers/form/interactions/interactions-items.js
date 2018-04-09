import React from 'react';
import PropTypes from 'prop-types';

// Drag and drop
import { SortableContainer } from 'react-sortable-hoc';

// Components
import InteractionsItem from './interactions-item';

const InteractionsItems = (props) => {
  const {
    interactions,
    editInteraction,
    removeInteraction
  } = props;

  return (
    <ul className="c-field preview-container c-interactions">
      {interactions.added && interactions.added.map((interaction, key) =>
        (
          <InteractionsItem
            key={interaction.column + key}
            index={key}
            custom={!interaction.type}
            editInteraction={data => editInteraction(data)}
            removeInteraction={data => removeInteraction(data)}
            interaction={interaction}
          />
        ))}
    </ul>
  );
};

InteractionsItems.propTypes = {
  interactions: PropTypes.object.isRequired,
  removeInteraction: PropTypes.func.isRequired,
  editInteraction: PropTypes.func.isRequired
};

export default SortableContainer(InteractionsItems);
