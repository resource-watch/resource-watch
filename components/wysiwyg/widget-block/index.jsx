import React, {
  useCallback,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// hooks
import useBelongsToCollection from 'hooks/collection/belongs-to-collection';

// constants
import {
  getRWAdapter,
} from 'utils/widget-editor';

import * as actions from './actions';
import * as reducers from './reducers';
import initialState from './initial-state';

import WidgetBlockComponent from './component';

// mandatory
export { actions, reducers, initialState };

const WidgetBlock = (props) => {
  const {
    item,
    data,
    user,
    RWAdapter,
    getWidget,
    setWidgetLoading,
    removeWidget,
    setFavourite,
    setLayers,
    setWidgetModal,
  } = props;
  const {
    isInACollection,
  } = useBelongsToCollection(item?.content?.widgetId, user.token);

  const handleToggleModal = useCallback((modal) => {
    setWidgetModal({
      id: `${item.content.widgetId}/${item.id}`,
      value: modal,
    });
  }, [item, setWidgetModal]);

  const handleToggleLoading = useCallback((loading) => {
    setWidgetLoading({
      id: `${item.content.widgetId}/${item.id}`,
      value: loading,
    });
  }, [item, setWidgetLoading]);

  const handleToggleLayerGroupVisibility = useCallback((layerGroup) => {
    const layers = [...data[`${item.content.widgetId}/${item.id}`].layers];

    const layerGroups = layers.map((l) => {
      if (l.dataset !== layerGroup.dataset) return l;
      return ({
        ...l,
        visible: !layerGroup.visible,
      });
    });

    setLayers({
      id: `${item.content.widgetId}/${item.id}`,
      value: layerGroups,
    });
  }, [item, data, setLayers]);

  useEffect(() => {
    getWidget({
      id: item.content.widgetId,
      itemId: item.id,
      includes: 'metadata',
    });

    return () => {
      removeWidget({ id: `${item.content.widgetId}/${item.id}` });
    };
  }, [item, getWidget, removeWidget]);

  useEffect(() => {
    setFavourite({
      id: `${item.content.widgetId}/${item.id}`,
      value: isInACollection || {},
    });
  }, [item, isInACollection, setFavourite]);

  return (
    <WidgetBlockComponent
      RWAdapter={RWAdapter}
      onToggleModal={handleToggleModal}
      onToggleLoading={handleToggleLoading}
      onToggleLayerGroupVisibility={handleToggleLayerGroupVisibility}
      isInACollection={isInACollection}
      {...props}
    />
  );
};

WidgetBlock.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string,
  }).isRequired,
  item: PropTypes.shape({
    id: PropTypes.oneOf([
      PropTypes.number,
      PropTypes.string,
    ]),
    content: PropTypes.shape({
      widgetId: PropTypes.string,
    }),
  }).isRequired,
  data: PropTypes.shape({}).isRequired,
  getWidget: PropTypes.func.isRequired,
  setWidgetLoading: PropTypes.func.isRequired,
  setWidgetModal: PropTypes.func.isRequired,
  removeWidget: PropTypes.func.isRequired,
  setFavourite: PropTypes.func.isRequired,
  setLayers: PropTypes.func.isRequired,
  RWAdapter: PropTypes.func.isRequired,
};

export default connect(
  (state) => ({
    data: state.widgetBlock,
    user: state.user,
    RWAdapter: getRWAdapter(state),
  }),
  actions,
)(WidgetBlock);
