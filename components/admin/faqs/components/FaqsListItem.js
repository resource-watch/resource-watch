import React from 'react';
import PropTypes from 'prop-types';

// Drag and drop
import { SortableElement } from 'react-sortable-hoc';

// Components
import FaqListItemHandle from './FaqListItemHandle';
import EditAction from './actions/EditAction';
import DeleteAction from './actions/DeleteAction';

const FaqsListItem = (props) => {
  const { data, editAction, removeAction } = props;

  return (
    <li
      className="c-sortable-row"
    >
      <FaqListItemHandle />
      <div className="row-content">
        <div className="row-item">
          <strong>{data.question}</strong>
        </div>
        <div className="row-item">
          <p>{data.answer}</p>
        </div>
      </div>
      <ul className="row-actions">
        <li>
          <EditAction action={editAction} data={data} />
        </li>
        <li>
          <DeleteAction
            action={removeAction}
            data={data}
            onFaqDelete={props.getFaqs}
            authorization={props.authorization}
          />
        </li>
      </ul>
    </li>
  );
};

FaqsListItem.propTypes = {
  data: PropTypes.object,
  editAction: PropTypes.object,
  removeAction: PropTypes.object,
  authorization: PropTypes.string,
  getFaqs: PropTypes.func
};

export default SortableElement(FaqsListItem);
