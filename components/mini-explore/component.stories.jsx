import PropTypes from 'prop-types';

import MiniExplore from './component';

export default {
  title: 'Components/Mini-Explore',
  component: MiniExplore,
  argTypes: {},
};

const Template = (args) => (
  <MiniExplore {...args} />
);

Template.propTypes = {
  args: PropTypes.shape({}).isRequired,
};

export const Default = Template.bind({});
export const DisabledBoundariesControls = Template.bind({});

Default.args = {
  config: {
    title: 'Lorem ipsum',
    areaOfInterest: '972c24e1da2c2baacc7572ee9501abdc',
    datasetGroups: [
      {
        title: 'Power Infrastructure',
        datasets: [
          'a86d906d-9862-4783-9e30-cdb68cd808b8',
          'b75d8398-34f2-447d-832d-ea570451995a',
          '4919be3a-c543-4964-a224-83ef801370de',
        ],
        default: [
          'a86d906d-9862-4783-9e30-cdb68cd808b8',
        ],
      },
      {
        title: 'Natural hazards',
        datasets: [
          '484f10d3-a30b-4466-8052-c48d47cfb4a1',
          'c5a62289-bdc8-4821-83f0-6f05e3d36bdc',
        ],
        default: [
          '484f10d3-a30b-4466-8052-c48d47cfb4a1',
        ],
      },
    ],
  },
};

DisabledBoundariesControls.args = {
  config: {
    title: 'Lorem ipsum',
    areaOfInterest: '972c24e1da2c2baacc7572ee9501abdc',
    datasetGroups: [
      {
        title: 'Power Infrastructure',
        datasets: [
          'a86d906d-9862-4783-9e30-cdb68cd808b8',
          'b75d8398-34f2-447d-832d-ea570451995a',
          '4919be3a-c543-4964-a224-83ef801370de',
        ],
        default: [
          'a86d906d-9862-4783-9e30-cdb68cd808b8',
        ],
      },
      {
        title: 'Natural hazards',
        datasets: [
          '484f10d3-a30b-4466-8052-c48d47cfb4a1',
          'c5a62289-bdc8-4821-83f0-6f05e3d36bdc',
        ],
        default: [
          '484f10d3-a30b-4466-8052-c48d47cfb4a1',
        ],
      },
    ],
    disabledControls: ['boundaries'],
  },
};
