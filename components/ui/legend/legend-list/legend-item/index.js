import React from 'react';
import { SortableElement } from 'react-sortable-hoc';

import LegendItemComponent from './legend-item-component';

export default SortableElement(({ value, ...props }) =>
  <LegendItemComponent key={props.dataset} {...value} {...props} />);
