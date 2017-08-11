import React from 'react';
import { Router } from 'routes';
import { StickyContainer, Sticky } from 'react-sticky';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Utils
import { substitution } from 'utils/utils';

// Services
import DatasetsService from 'services/DatasetsService';

// Components
import Aside from 'components/ui/Aside';
import DatasetsForm from 'components/datasets/form/DatasetsForm';
import MetadataForm from 'components/admin/metadata/form/MetadataForm';
import WidgetList from 'components/widgets/WidgetList';

// Constants
const DATASET_SUBTABS = [{
  label: 'Edit dataset',
  value: 'edit',
  route: 'myrw_detail',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'edit' }
}, {
  label: 'Metadata',
  value: 'metadata',
  route: 'myrw_detail',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'metadata' }
}, {
  label: 'Widgets',
  value: 'widgets',
  route: 'myrw_detail',
  params: { tab: 'datasets', id: '{{id}}', subtab: 'widgets' }
}];

class DatasetsShow extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: {}
    };

    this.service = new DatasetsService();
  }

  componentDidMount() {
    const { id, user } = this.props;

    if (this.service) {
      // Fetch the dataset / layer / widget depending on the tab
      this.service.fetchData({ id, includes: 'widget,layer,metadata', filters: { userId: user.id } })
        .then((data) => {
          this.setState({ data });
        })
        .catch((err) => {
          console.error(err);
        });
    }
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
    const { id, user } = this.props;
    const { data } = this.state;
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
                  minimized
                  application={[process.env.APPLICATIONS]}
                  authorization={user.token}
                  dataset={id}
                  onSubmit={() => Router.pushRoute('myrw', { tab: 'datasets' })}
                />
              }

              {subtab === 'metadata' &&
                <MetadataForm
                  application={process.env.APPLICATIONS}
                  authorization={user.token}
                  dataset={id}
                  onSubmit={() => Router.pushRoute('myrw', { tab: 'datasets', id })}
                />
              }

              {subtab === 'widgets' &&
                <WidgetList
                  widgets={data.widget || []}
                  mode="grid"
                  // onWidgetRemove={this.handleWidgetRemoved}
                  showActions
                  showRemove
                />
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

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(DatasetsShow);
