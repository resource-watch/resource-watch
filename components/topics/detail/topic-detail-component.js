import React from 'react';
import PropTypes from 'prop-types';

// Wysiwyg
import Wysiwyg from 'vizz-wysiwyg';
import WidgetBlock from 'components/wysiwyg/widget-block/widget-block';
import WidgetBlockEdition from 'components/wysiwyg/widget-block-edition/widget-block-edition';

export default function TopicDetail({ topicDetail }) {
  let items = [];

  try {
    items = JSON.parse(topicDetail.topic.content);
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
          renderer: 'modal'
        }
      }}
    />
  );
}

TopicDetail.propTypes = {
  topicDetail: PropTypes.object
};

TopicDetail.defaultProps = {
  topicDetail: {}
};
