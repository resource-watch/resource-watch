import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import Wysiwyg from 'vizz-wysiwyg';
import WidgetBlock from 'components/wysiwyg/widget-block/widget-block';
import WidgetBlockEdition from 'components/wysiwyg/widget-block-edition/widget-block-edition';

class DashboardDetail extends PureComponent {
  static propTypes = { dashboard: PropTypes.object.isRequired }

  render() {
    const { dashboard: { content } } = this.props;
    let items = [];

    // TO-DO: review this error handling
    try {
      items = JSON.parse(content);
    } catch (e) { console.error(e); }

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
}

export default DashboardDetail;
