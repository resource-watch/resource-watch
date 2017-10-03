import React from 'react';
import { storiesOf } from '@storybook/react';
import MapThumbnail from './MapThumbnail';
import cartoLayerSpec from './sample/carto-spec.json';
import mapServiceLayerSpec from './sample/map-service-spec.json';

storiesOf('Widget Map', module)
  .add('Carto Thumbnail', () => (
    <MapThumbnail width={300} height={250} layerSpec={cartoLayerSpec} />
  ))
  .add('MapService Thumbnail', () => (
    <MapThumbnail width={300} height={250} layerSpec={mapServiceLayerSpec} />
  ));
