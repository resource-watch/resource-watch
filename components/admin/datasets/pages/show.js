import React from 'react';
import { Router } from 'routes';
import { StickyContainer, Sticky } from 'react-sticky';
import PropTypes from 'prop-types';

// Utils
import { substitution } from 'utils/utils';

// Components
import Aside from 'components/ui/Aside';
import DatasetsForm from 'components/datasets/form/DatasetsForm';
import MetadataForm from 'components/admin/metadata/form/MetadataForm';
import TagsForm from 'components/admin/tags/TagsForm';
import VocabulariesAssociationForm from 'components/admin/vocabularies/association/VocabulariesAssociationForm';
import WidgetIndex from 'components/admin/widget/pages/index';
import LayersIndex from 'components/admin/layers/pages/index';

// Constants
const DATASET_SUBTABS = [{
  label: 'Edit dataset',
  value: 'edit',
  route: 'admin_data_detail',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'edit' }
}, {
  label: 'Metadata',
  value: 'metadata',
  route: 'admin_data_detail',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'metadata' }
}, {
  label: 'Vocabularies',
  value: 'vocabularies',
  route: 'admin_data_detail',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'vocabularies' }
}, {
  label: 'Widgets',
  value: 'widgets',
  route: 'admin_data_detail',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'widgets' }
}, {
  label: 'Layers',
  value: 'layers',
  route: 'admin_data_detail',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'layers' }
}];

class DatasetsShow extends React.Component {
  /**
   * HELPERS
   * - parseTabs
  */
  parseTabs(obj) {
    const { id } = this.props;
    return JSON.parse(substitution(JSON.stringify(obj), [{ key: 'id', value: id }]));
  }

  render() {
    const { id, user } = this.props;
    const subtab = this.props.subtab || 'edit';

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
                        items={this.parseTabs(DATASET_SUBTABS)}
                        selected={subtab}
                      />
                    </div>
                  )
                }
              </Sticky>
            </div>

            <div className="columns small-12 medium-9">
              {subtab === 'edit' &&
                <DatasetsForm
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
                <div>
                  <VocabulariesAssociationForm
                    application={process.env.APPLICATIONS}
                    authorization={user.token}
                    dataset={id}
                    language="en"
                  />
                  <TagsForm />
                </div>
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
  }
}

DatasetsShow.propTypes = {
  id: PropTypes.string,
  subtab: PropTypes.string,

  // Store
  user: PropTypes.object.isRequired
};

export default DatasetsShow;
