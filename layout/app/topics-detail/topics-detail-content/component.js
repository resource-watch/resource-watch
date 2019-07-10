import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import VizzWysiwyg from 'vizz-wysiwyg';

// components
import WidgetBlock from 'components/wysiwyg/widget-block';
import WidgetBlockEdition from 'components/wysiwyg/widget-block-edition';

class TopicsDetailContentComponent extends PureComponent {
  static propTypes = { topic: PropTypes.object.isRequired };

  getItems = () => {
    const { topic } = this.props;

    try {
      return JSON.parse(topic.content);
    } catch (e) {
      return [];
    }
  }

  render() {
    const { topic } = this.props;

    return (
      <VizzWysiwyg
        id={topic.id}
        readOnly
        items={this.getItems()}
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

export default TopicsDetailContentComponent;
