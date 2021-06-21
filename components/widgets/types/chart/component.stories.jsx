import {
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { AdapterModifier } from '@widget-editor/widget-editor';
import RWAdapter from '@widget-editor/rw-adapter';

// components
import ChartType from './component';
import WidgetShareModal from '../../share-modal';

export default {
  title: 'Widget/Chart',
  component: ChartType,
  argTypes: {},
};

function Template(args) {
  const [isWidgetShareModalVisible, setVisibilityWidgetShareModal] = useState(false);

  return (
    <>
      <div
        style={{
          width: 500,
          height: 450,
          margin: '0 auto',
        }}
      >
        <ChartType
          {...args}
          onToggleShare={() => setVisibilityWidgetShareModal(true)}
        />
      </div>
      <WidgetShareModal
        onClose={() => { setVisibilityWidgetShareModal(false); }}
        isVisible={isWidgetShareModalVisible}
        widget={args.widget}
      />
    </>
  );
}

Template.propTypes = {
  args: PropTypes.shape({}).isRequired,
};

export const Default = Template.bind({});

const widget = {
  id: 'cd0a50e0-c58e-418b-9604-5a452d07b308',
  name: '10 countries contain approximately 70% of the world’s remaining forests',
  dataset: '32324f22-e7f6-4e0d-bc38-d82c6484f1be',
  slug: 'Countries-with-Greatest-Tree-Cover-2000',
  userId: '58fa22c54eecd907310778cd',
  description: 'Top 10 countries with most tree cover in 2000. “Tree cover” was defined as all vegetation taller than 5 meters in height. “Tree cover” is the biophysical presence of trees and may take the form of natural forests or plantations existing over a range of canopy densities.',
  source: '',
  authors: '',
  application: [
    'rw',
  ],
  verified: false,
  default: false,
  protected: false,
  defaultEditableWidget: false,
  published: true,
  thumbnailUrl: '',
  freeze: false,
  env: 'production',
  queryUrl: '',
  widgetConfig: {
    autosize: {
      contains: 'padding',
      resize: true,
      type: 'pad',
    },
    interaction_config: [
      {
        config: {
          fields: [
            {
              format: '.3s',
              type: 'number',
              property: 'Tree Cover (Ha)',
              column: 'x',
            },
            {
              type: 'string',
              property: 'Country',
              column: 'y',
            },
          ],
        },
        name: 'tooltip',
      },
    ],
    axes: [
      {
        scale: 'x',
        orient: 'bottom',
        format: 's',
        tickCount: 5,
        labelOverlap: 'parity',
        title: 'Tree Cover (Ha)',
        grid: 'true',
      },
      {
        scale: 'y',
        orient: 'left',
        encode: {
          labels: {
            update: {
              limit: {
                value: 90,
              },
              text: {
                signal: 'truncate(datum.value, 12)',
              },
              align: {
                value: 'right',
              },
            },
          },
        },
      },
    ],
    scales: [
      {
        nice: true,
        range: 'width',
        domain: {
          field: 'x',
          data: 'table',
        },
        type: 'linear',
        name: 'x',
      },
      {
        padding: 0.05,
        range: 'height',
        domain: {
          field: 'y',
          data: 'table',
        },
        type: 'band',
        name: 'y',
      },
    ],
    marks: [
      {
        encode: {
          hover: {
            opacity: {
              value: 0.8,
            },
          },
          update: {
            height: {
              band: 1,
              scale: 'y',
            },
            y: {
              field: 'y',
              scale: 'y',
            },
            x2: {
              field: 'x',
              scale: 'x',
            },
            x: {
              value: 0,
              scale: 'x',
            },
            opacity: {
              value: 1,
            },
          },
        },
        from: {
          data: 'table',
        },
        type: 'rect',
      },
    ],
    data: [
      {
        format: {
          property: 'rows',
          type: 'json',
        },
        url: 'https://wri-01.cartodb.com/api/v2/sql?q=SELECT DISTINCT(country) as y, extent_2000 as x FROM   umd_nat_staging   WHERE  thresh = 30 ORDER  BY extent_2000 DESC limit 10&rw=&env=production&language=en&page[size]=999&rw=&env=production&language=en&page[size]=999&application=rw&env=production',
        name: 'table',
      },
    ],
    we_meta: {
      core: '2.6.2',
      editor: '2.6.2',
      renderer: '2.6.2',
      adapter: 'rw-adapter',
      advanced: true,
    },
  },
  template: false,
  createdAt: '2018-03-15T17:03:15.732Z',
  updatedAt: '2021-05-19T04:14:31.709Z',
  metadata: [
    {
      id: '5ac4f32cf748cd00105e6aea',
      type: 'metadata',
      attributes: {
        dataset: '32324f22-e7f6-4e0d-bc38-d82c6484f1be',
        application: 'rw',
        resource: {
          id: 'cd0a50e0-c58e-418b-9604-5a452d07b308',
          type: 'widget',
        },
        language: 'en',
        info: {
          caption: 'Top 10 Countries with Most Tree Cover in 2000, Hansen et al. 2013',
          widgetLinks: [
            {
              link: 'https://resourcewatch.org/data/explore/0087944f-871c-44bc-b4d9-cd5acfc27023',
              name: 'View on Resource Watch',
            },
            {
              link: 'http://science.sciencemag.org/content/342/6160/850',
              name: 'Hansen et al. 2013',
            },
          ],
        },
        createdAt: '2018-04-04T15:45:48.095Z',
        updatedAt: '2021-05-19T04:14:33.079Z',
        status: 'published',
      },
    },
  ],
};

Default.args = {
  widget,
  isInACollection: false,
  // eslint-disable-next-line no-console
  onToggleInfo: (evt) => { console.info(evt); },
  adapter: AdapterModifier(RWAdapter, {
    endpoint: `${process.env.NEXT_PUBLIC_WRI_API_URL}/v1`,
    env: process.env.NEXT_PUBLIC_API_ENV,
    applications: process.env.NEXT_PUBLIC_APPLICATIONS.split(','),
    locale: 'en',
  }),
};
