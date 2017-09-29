import { configure } from '@storybook/react';

function loadStories() {
  require('../components/widget-editor/widget/VegaChart/vega-chart.story.js');
  require('../components/widget-editor/widget/Map/map.story.js');
  require('../components/ui/ui.story.js');
}

configure(loadStories, module);
