import React from 'react';
import PropTypes from 'prop-types';

// VizzWysiwyg
import VizzWysiwyg from 'vizz-wysiwyg';
import WidgetBlock from 'components/wysiwyg/widget-block/widget-block';
import WidgetBlockEdition from 'components/wysiwyg/widget-block-edition/widget-block-edition';

export default class TopicsDetailContentComponent extends React.Component {
  static propTypes = {
    topic: PropTypes.object
  };

  static defaultProps = {
    topic: {}
  };

  shouldComponentUpdate(nextProps) {
    const { id: nextTopicId } = nextProps.topic;
    const { id: oldTopicId } = this.props.topic;

    if (nextTopicId !== oldTopicId) {
      return true;
    }

    return false;
  }

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
