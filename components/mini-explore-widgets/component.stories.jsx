import PropTypes from 'prop-types';
import { AdapterModifier } from '@widget-editor/widget-editor';
import RWAdapter from '@widget-editor/rw-adapter';

import MiniExploreWidgets from './component';

export default {
  title: 'Components/Mini-Explore-Widgets',
  component: MiniExploreWidgets,
  argTypes: {},
};

const Template = (args) => (
  <MiniExploreWidgets {...args} />
);

Template.propTypes = {
  args: PropTypes.shape({}).isRequired,
};

export const Default = Template.bind({});
Default.args = {
  config: {
    title: 'Water Quality Pressure',
    layers: [
      '5a067c44-2cdd-4c1a-8212-fcae15a28a0c',
    ],
    widgets: [
      '11e8b292-4a41-4c96-a6fb-99bacf62403c',
      'db885f7c-d183-471b-8d58-2c250a10719d',
    ],
    areaOfInterest: '972c24e1da2c2baacc7572ee9501abdc',
  },
  adapter: AdapterModifier(RWAdapter, {
    endpoint: `${process.env.NEXT_PUBLIC_WRI_API_URL}/v1`,
    env: process.env.NEXT_PUBLIC_API_ENV,
    applications: process.env.NEXT_PUBLIC_APPLICATIONS.split(','),
    locale: 'en',
  }),
};
