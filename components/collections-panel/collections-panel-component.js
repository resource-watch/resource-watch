import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

import CollectionPanelItem from './collections-panel-item/collections-panel-item-component';

// constants
import { FAVOURITES_COLLECTION } from './collections-panel-constants';

// Utils
import { logEvent } from 'utils/analytics';

class CollectionsPanel extends PureComponent {
  static propTypes = {
    collections: PropTypes.array,
    favourites: PropTypes.array,
    resource: PropTypes.object,
    collectionsLoadingQueue: PropTypes.array,
    favouritesLoading: PropTypes.bool,
    addCollection: PropTypes.func,
    toggleCollection: PropTypes.func,
    toggleFavourite: PropTypes.func,
    resourceType: PropTypes.oneOf(['dataset', 'layer', 'widget']).isRequired,
    onClick: PropTypes.func,
    onKeyPress: PropTypes.func,
    context: PropTypes.string
  };

  static defaultProps = {
    collections: [],
    favourites: [],
    resource: {},
    collectionsLoadingQueue: [],
    favouritesLoading: false,
    addCollection: () => {},
    toggleCollection: () => {},
    toggleFavourite: () => {},
    onClick: null,
    onKeyPress: null,
    context: ''
  };

  state = { newCollectionName: null };

  onAddCollection = () => {
    const { addCollection } = this.props;
    const { newCollectionName } = this.state;

    if (newCollectionName) {
      if (newCollectionName.toLowerCase() === 'favourites') {
        toastr.error('Duplicated Favourites list', 'You cannot duplicate this list.');
      } else {
        addCollection({ collectionName: newCollectionName });
      }
    } else {
      toastr.error('Please enter a collection name');
    }
  };

  onToggleFavourite = () => {
    const { toggleFavourite, favourites, resource, resourceType, context } = this.props;
    const favourite = favourites.find(fav => fav.resourceId === resource.id) || {};
    toggleFavourite({
      favourite,
      resource: {
        resourceId: resource.id,
        resourceType
      }
    });
    if (context && resourceType === 'dataset') {
      const datasetName = resource && resource.metadata && resource.metadata[0] &&
        resource.metadata[0].info && resource.metadata[0].info.name;      
      if (Object.keys(favourite).length > 0) {
        logEvent(context, 'Remove dataset from favorites', datasetName);
      } else {
        logEvent(context, 'Add dataset to favorites', datasetName);
      }
    }
  };

  onToggleCollection = (isAdded, collection) => {
    const { toggleCollection, resource, resourceType, context } = this.props;    
    toggleCollection({
      isAdded,
      collectionId: collection.id,
      resource: { id: resource.id, type: resourceType }
    });
    if (context && resourceType === 'dataset') {
      const datasetName = resource && resource.metadata && resource.metadata[0] &&
        resource.metadata[0].info && resource.metadata[0].info.name;      
      if (!isAdded) {
        logEvent(context, 'Remove dataset from a collection', datasetName);
      } else {
        logEvent(context, 'Add dataset to a collection', datasetName);
      }
    }
  };

  hanldeKeyPress = (evt) => {
    if (evt.key !== 'Enter') return;

    this.onAddCollection();
  };

  handleInputChange = (evt) => {
    this.setState({ newCollectionName: evt.currentTarget.value });
  };

  renderCollections() {
    const {
      collections,
      resource,
      resourceType,
      favourites,
      collectionsLoadingQueue,
      favouritesLoading
    } = this.props;

    const favouriteCollection = (
      <CollectionPanelItem
        key={FAVOURITES_COLLECTION.id}
        collection={FAVOURITES_COLLECTION}
        loading={favouritesLoading}
        resource={resource}
        resourceType={resourceType}
        isChecked={favourites.some(favourite => favourite.resourceId === resource.id)}
        onToggleCollection={this.onToggleFavourite}
      />
    );

    const collectionItems = collections.map(collection => (
      <CollectionPanelItem
        key={collection.id}
        collection={collection}
        loading={
          (collectionsLoadingQueue.find(loader => loader.id === collection.id) || {}).loading
        }
        resource={resource}
        resourceType={resourceType}
        isChecked={collection.resources.some(
          collectionResource => collectionResource.id === resource.id
        )}
        onToggleCollection={this.onToggleCollection}
      />
    ));

    collectionItems.unshift(favouriteCollection);

    return <ul className="collection-list">{collectionItems}</ul>;
  }

  render() {
    return (
      <div
        className="c-collections-panel"
        onClick={(e) => {
          if (this.props.onClick) {
            this.props.onClick(e);
          }
        }}
        onKeyPress={(e) => {
          if (this.props.onKeyPress) {
            this.props.onKeyPress(e);
          }
        }}
      >
        <div className="new-collection-container">
          <input
            type="text"
            name="new-collection"
            className="new-collection-input"
            placeholder="New collection"
            onChange={this.handleInputChange}
            onKeyPress={this.hanldeKeyPress}
          />
          <button className="c-button add-button" onClick={this.onAddCollection}>
            Add
          </button>
        </div>
        <div className="collection-list-container">{this.renderCollections()}</div>
      </div>
    );
  }
}

export default CollectionsPanel;
