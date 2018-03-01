import React from 'react';
import PropTypes from 'prop-types';

// Drag and drop
import { SortableElement } from 'react-sortable-hoc';

// Components
import InteractionsHandler from './interactions-handler';

const InteractionsItem = (props) => {
  const {
    interaction,
    removeInteraction,
    renderInteractionFields,
    renderFormatField
  } = props;
  return (
    <li
      className="c-field-flex c-sortable-row"
      key={interaction.column}
    >
      <InteractionsHandler />
      {renderInteractionFields(interaction)}
      {renderFormatField(interaction)}
      <button type="button" className="c-btn" onClick={() => removeInteraction(interaction)}>Remove</button>
    </li>);
};

InteractionsItem.propTypes = {
  interaction: PropTypes.object.isRequired,
  removeInteraction: PropTypes.func.isRequired,
  renderInteractionFields: PropTypes.func.isRequired,
  renderFormatField: PropTypes.func.isRequired
};

export default SortableElement(InteractionsItem);
