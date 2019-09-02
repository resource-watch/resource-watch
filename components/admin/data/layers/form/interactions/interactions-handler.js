import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';

// components
import Icon from 'components/ui/icon';

const InteractionsHandler = () => (
  <span className="handler -dragger">
    <Icon name="icon-drag-dots" className="-small" />
  </span>
);

export default SortableHandle(InteractionsHandler);
