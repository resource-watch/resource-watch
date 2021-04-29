import React from 'react';
import { Router } from 'routes';
import { StickyContainer, Sticky } from 'react-sticky';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

// Utils
import { substitution } from 'utils/utils';

// Services
import { fetchDataset } from 'services/dataset';

// Components
import Aside from 'components/ui/Aside';
import DatasetsForm from 'components/datasets/form/DatasetsForm';
import DatasetMetadataForm from 'components/datasets/metadata/form';
import DatasetWidgets from 'components/app/myrw/datasets/DatasetWidgets';

// Constants
const DATASET_SUBTABS = [{
  label: 'Edit dataset',
  value: 'edit',
  route: '/myrw-detail/datasets/{{id}}/edit',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'edit' },
}, {
  label: 'Metadata',
  value: 'metadata',
  route: '/myrw-detail/datasets/{{id}}/metadata',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'metadata' },
}, {
  label: 'Widgets',
  value: 'widgets',
  route: '/myrw-detail/datasets/{{id}}/widgets',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'widgets' },
}];

class DatasetsShow extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    subtab: PropTypes.string,
    // Store
    user: PropTypes.object.isRequired,
  };

  static defaultProps = { subtab: 'edit' };

  state = { data: {} };

  UNSAFE_componentWillMount() {
    const { id, user } = this.props;

    fetchDataset(id, { includes: 'widget,layer,metadata', userId: user.id })
      .then((data) => {
        this.setState({ data });
      })
      .catch((err) => {
        toastr.error('Error', err);
      });
  }

  /**
   * HELPERS
   * - parseTabs
  */
  parseTabs(obj) {
    const { id } = this.props;
    return JSON.parse(substitution(JSON.stringify(obj), [{ key: 'id', value: id }]));
  }

  render() {
    const { id, user, subtab } = this.props;
    const { data } = this.state;

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
              {subtab === 'edit'
                && (
                <DatasetsForm
                  basic
                  application={[process.env.NEXT_PUBLIC_APPLICATIONS]}
                  authorization={user.token}
                  dataset={id}
                  onSubmit={() => Router.pushRoute('myrw', { tab: 'datasets' })}
                />
                )}

              {subtab === 'metadata' && (
                <DatasetMetadataForm
                  dataset={id}
                  onSubmit={() => Router.pushRoute('myrw', { tab: 'datasets', id })}
                />
              )}

              {subtab === 'widgets' && data.id
                && (
                <DatasetWidgets
                  dataset={data.id}
                />
                )}
            </div>

          </div>
        </StickyContainer>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps, null)(DatasetsShow);
