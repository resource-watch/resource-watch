import { useState } from 'react';
import PropTypes from 'prop-types';

import WidgetHeader from './component';
import WidgetShareModal from '../share-modal';

export default {
  title: 'Widget/Header',
  component: WidgetHeader,
  argTypes: {},
};

const Template = (args) => {
  const [isWidgetShareModalVisible, setVisibilityWidgetShareModal] = useState(false);

  return (
    <>
      <WidgetHeader
        {...args}
        onToggleShare={() => {
          setVisibilityWidgetShareModal(true);
        }}
      />
      <WidgetShareModal
        onClose={() => {
          setVisibilityWidgetShareModal(false);
        }}
        isVisible={isWidgetShareModalVisible}
        widget={args.widget}
      />
    </>
  );
};

Template.propTypes = {
  args: PropTypes.shape({}).isRequired,
};

export const Default = Template.bind({});

const widget = {
  id: '3051c12d-7914-4658-86b3-02ca783841f8',
  name: '% crop growing in high water risk areas by year 2040',
  dataset: '5edefab9-c707-447e-96f9-6115149e3a87',
  slug: 'crop-growing-in-high-water-risk-areas-by-year-2040',
  userId: '58333dcfd9f39b189ca44c75',
  description: '',
  source: '',
  authors: '',
  application: ['rw'],
  verified: false,
  default: true,
  protected: false,
  defaultEditableWidget: false,
  published: true,
  freeze: false,
  env: 'production',
  queryUrl: 'query/5edefab9-c707-447e-96f9-6115149e3a87?sql=SELECT * FROM crops',
  widgetConfig: {},
  template: false,
  createdAt: '2017-07-13T15:14:58.912Z',
  updatedAt: '2017-07-13T15:14:58.912Z',
};

Default.args = {
  widget,
  isInACollection: false,
  // eslint-disable-next-line no-console
  onToggleInfo: (evt) => {
    console.info(evt);
  },
};
