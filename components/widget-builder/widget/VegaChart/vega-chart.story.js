import React from 'react';
import { storiesOf } from '@storybook/react';
import VegaChart from './VegaChart';
import VegaChartThumbnail from './VegaChartThumbnail';
import chartSpec from './sample/spec.json';

storiesOf('Widget Vega Chart', module)
  .add('Thumbnail', () => (
    <VegaChartThumbnail width={300} height={250} spec={chartSpec} />
  ))
  .add('Widget', () => (
    <VegaChart width={300} height={250} spec={chartSpec} />
  ));
