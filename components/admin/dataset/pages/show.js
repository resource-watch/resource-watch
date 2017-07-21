import React from 'react';
import { Router } from 'routes';
import { StickyContainer, Sticky } from 'react-sticky';
import PropTypes from 'prop-types';

// Utils
import { substitution } from 'utils/utils';

// Components
import Aside from 'components/ui/Aside';
import DatasetForm from 'components/admin/dataset/form/DatasetForm';
import MetadataForm from 'components/admin/metadata/form/MetadataForm';
import VocabulariesAssociationForm from 'components/admin/vocabularies/association/VocabulariesAssociationForm';
import WidgetIndex from 'components/admin/widget/pages/index';
import LayersIndex from 'components/admin/layers/pages/index';

// Constants
const dataset_subtabs = id => [{
  label: 'Edit dataset',
  value: 'edit',
  route: 'admin_data_detail',
  params: { tab: 'datasets', id, subtab: 'edit' }
}, {
  label: 'Metadata',
  value: 'metadata',
  route: 'admin_data_detail',
  params: { tab: 'datasets', id, subtab: 'metadata' }
}, {
  label: 'Vocabularies',
  value: 'vocabularies',
  route: 'admin_data_detail',
  params: { tab: 'datasets', id, subtab: 'vocabularies' }
}, {
  label: 'Widgets',
  value: 'widgets',
  route: 'admin_data_detail',
  params: { tab: 'datasets', id, subtab: 'widgets' }
}, {
  label: 'Layers',
  value: 'layers',
  route: 'admin_data_detail',
  params: { tab: 'datasets', id, subtab: 'layers' }
}];

const DatasetShow = (props) => {
  const { id, user } = props;
  const subtab = props.subtab || 'edit';

  return (
    <div className="c-datasets-show">
      <StickyContainer>
        <div className="row l-row">
          <div className="columns small-12 medium-3">
            <Sticky>
              {
                ({ style }) => (
                  <div style={style}>
                    <Aside
                      items={dataset_subtabs(id)}
                      selected={subtab}
                    />
                  </div>
                )
              }
            </Sticky>
          </div>

          <div className="columns small-12 medium-9">
            {subtab === 'edit' &&
              <DatasetForm
                application={[process.env.APPLICATIONS]}
                authorization={user.token}
                dataset={id}
                onSubmit={() => Router.pushRoute('admin_data', { tab: 'datasets' })}
              />
            }

            {subtab === 'metadata' &&
              <MetadataForm
                application={process.env.APPLICATIONS}
                authorization={user.token}
                dataset={id}
                onSubmit={() => Router.pushRoute('admin_data', { tab: 'datasets', id })}
              />
            }

            {subtab === 'vocabularies' &&
              <VocabulariesAssociationForm
                application={process.env.APPLICATIONS}
                authorization={user.token}
                dataset={id}
                language="en"
              />
            }

            {subtab === 'widgets' &&
              <WidgetIndex user={user} dataset={id} embed />
            }

            {subtab === 'layers' &&
              <LayersIndex user={user} dataset={id} />
            }
          </div>

        </div>
      </StickyContainer>
    </div>
  );
};

DatasetShow.propTypes = {
  id: PropTypes.string,
  subtab: PropTypes.string,

  // Store
  user: PropTypes.object.isRequired
};

export default DatasetShow;
