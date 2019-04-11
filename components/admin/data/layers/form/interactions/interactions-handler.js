import React from 'react';

import { SortableHandle } from 'react-sortable-hoc';

// Components
import Icon from 'components/ui/Icon';

const InteractionsHandler = () => (
  <span className="handler -dragger">
    <Icon name="icon-drag-dots" className="-small" />
  </span>
);

export default SortableHandle(InteractionsHandler);
