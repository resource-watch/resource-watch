import React from 'react';
import PropTypes from 'prop-types';

// VizzWysiwyg
import VizzWysiwyg from 'vizz-wysiwyg';
import WidgetBlock from 'components/wysiwyg/widget-block/widget-block';
import WidgetBlockEdition from 'components/wysiwyg/widget-block-edition/widget-block-edition';

export default function TopicDetailComponent({ topic }) {
  let items = [];

  try {
    items = JSON.parse(topic.content);
  } catch (e) {
    console.error(e);
  }

  return (
    <VizzWysiwyg
      id={topic.id}
      readOnly
      items={items}
      blocks={{
        widget: {
          Component: WidgetBlock,
          EditionComponent: WidgetBlockEdition,
          renderer: 'modal'
        }
      }}
    />
  );
}

TopicDetailComponent.propTypes = {
  topic: PropTypes.object
};

TopicDetailComponent.defaultProps = {
  topic: {}
};
