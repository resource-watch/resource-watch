import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import PublishedLayerCard from 'components/datasets/metadata/form/published-layer/card/PublishedLayerCard';

// styles
import './styles.scss';

class PublishedLayersList extends PureComponent {


  handleOnDragStart(e, index) {
    console.log('handleDragStart', e, index);

  }

  handleOnDragEnd() {
    console.log('handleOnDragEnd');

  }

  render() {
    const { layers } = this.props;
    return (
      <div className="c-published-layer-list">
        {layers.map((layer, index) => (
          <PublishedLayerCard
            key={layer.id}
            index={index}
            layer={layer}
            onDragStart={this.handleOnDragStart}
            onDragEnd={this.handleOnDragEnd}
          />
        ))}
      </div>
    );
  }
}

PublishedLayersList.propTypes = { layers: PropTypes.array.isRequired };

export default PublishedLayersList;
