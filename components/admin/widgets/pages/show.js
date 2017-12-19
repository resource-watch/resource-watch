import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import WidgetsForm from 'components/admin/widgets/form/WidgetsForm';
import Aside from 'components/ui/Aside';
import MetadataForm from 'components/admin/widgets/metadata/form/MetadataForm';

// Utils
import { substitution } from 'utils/utils';

// Constants
const WIDGET_SUBTABS = [{
  label: 'Edit widget',
  value: 'edit',
  route: 'admin_data_detail',
  params: { tab: 'widgets', id: '{{id}}', subtab: 'edit' }
}, {
  label: 'Metadata',
  value: 'metadata',
  route: 'admin_data_detail',
  params: { tab: 'widgets', id: '{{id}}', subtab: 'metadata' }
}];

class WidgetsShow extends React.Component {
  /**
   * HELPERS
   * - parseTabs
  */
  parseTabs(obj) {
    const { id } = this.props;
    return JSON.parse(substitution(JSON.stringify(obj), [{ key: 'id', value: id }]));
  }

  render() {
    const { id, dataset, user } = this.props;
    const subtab = this.props.subtab || 'edit';
    return (
      <div className="c-widgets-show">
        <StickyContainer>
          <div className="row l-row">
            <div className="columns small-12 medium-3">
              <Sticky>
                {
                  ({ style }) => (
                    <div style={style}>
                      <Aside
                        items={this.parseTabs(WIDGET_SUBTABS)}
                        selected={subtab}
                      />
                    </div>
                  )
                }
              </Sticky>
            </div>

            <div className="columns small-12 medium-9">
              {subtab === 'edit' &&
              <WidgetsForm
                id={id}
                authorization={user.token}
                onSubmit={() => {
                  if (dataset) {
                    Router.pushRoute('admin_data_detail', { tab: 'datasets', subtab: 'widgets', id: dataset });
                  } else {
                    Router.pushRoute('admin_data', { tab: 'widgets' });
                  }
                }}
              />
              }

              {subtab === 'metadata' &&
                <MetadataForm
                  application={process.env.APPLICATIONS}
                  authorization={user.token}
                  widget={id}
                  onSubmit={() => Router.pushRoute('admin_data', { tab: 'widgets', id })}
                />
              }
            </div>

          </div>
        </StickyContainer>
      </div>
    );
  }
}

WidgetsShow.propTypes = {
  id: PropTypes.string,
  dataset: PropTypes.string,
  subtab: PropTypes.string,
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(WidgetsShow);
