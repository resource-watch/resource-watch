import React from 'react';
import PropTypes from 'prop-types';

// Wysiwyg
import Wysiwyg from 'vizz-wysiwyg';
import WidgetBlock from 'components/wysiwyg/widget-block/widget-block';
import WidgetBlockEdition from 'components/wysiwyg/widget-block-edition/widget-block-edition';

export default function DashboardDetail({ dashboardDetail = {} }) {
  let items = [];

  try {
    items = JSON.parse(dashboardDetail.dashboard.content);
  } catch (e) {
    console.error(e);
  }

  return (
    <Wysiwyg
      readOnly
      items={items}
      blocks={{
        widget: {
          Component: WidgetBlock,
          EditionComponent: WidgetBlockEdition,
          icon: 'icon-widget',
          label: 'Visualization',
          renderer: 'modal'
        }
      }}
    />
  );
}

DashboardDetail.propTypes = { dashboardDetail: PropTypes.object.isRequired };
