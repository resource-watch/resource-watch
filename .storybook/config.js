import { configure } from '@storybook/react';

function loadStories() {
  require('../components/widget-builder/widget/VegaChart/vega-chart.story.js');
  require('../components/widget-builder/widget/Map/map.story.js');
  require('../components/ui/ui.story.js');
}

configure(loadStories, module);
