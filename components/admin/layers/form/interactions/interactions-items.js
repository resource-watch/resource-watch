import React from 'react';
import PropTypes from 'prop-types';

// Drag and drop
import { SortableContainer } from 'react-sortable-hoc';

// Components
import InteractionsItem from './interactions-item';

const InteractionsItems = (props) => {
  const {
    interactions,
    renderInteractionFields,
    renderFormatField,
    removeInteraction
  } = props;

  return (
    <ul className="c-field preview-container">
      {interactions.added && interactions.added.map((interaction, key) =>
        (
          <InteractionsItem
            key={key}
            index={key}
            renderInteractionFields={data => renderInteractionFields(data)}
            renderFormatField={data => renderFormatField(data)}
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
  renderInteractionFields: PropTypes.func.isRequired,
  renderFormatField: PropTypes.func.isRequired
};

export default SortableContainer(InteractionsItems);
