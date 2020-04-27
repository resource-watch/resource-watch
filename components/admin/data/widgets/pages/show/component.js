import React, { PureComponent } from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import { Router } from 'routes';
import PropTypes from 'prop-types';

// components
import Aside from 'components/ui/Aside';
import WidgetForm from 'components/admin/data/widgets/form';
import MetadataForm from 'components/widgets/metadata/form/MetadataForm';

class WidgetsShow extends PureComponent {
  static propTypes = {
    tabs: PropTypes.array.isRequired,
    query: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }

  handleSubmit = () => { window.scrollTo(0, 0); }

  render() {
    const {
      query: { id, subtab },
      tabs,
      user: { token }
    } = this.props;
    const currentSubTab = subtab || 'edit';

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
                        items={tabs}
                        selected={currentSubTab}
                      />
                    </div>
                  )
                }
              </Sticky>
            </div>

            <div className="columns small-12 medium-9">
              {(subtab === 'edit') &&
              (<WidgetForm
                id={id}
                authorization={token}
                onSubmit={this.handleSubmit}
              />)}

              {(subtab === 'metadata') &&
                (<MetadataForm
                  application={process.env.APPLICATIONS}
                  authorization={token}
                  widget={id}
                  onSubmit={() => { Router.pushRoute('admin_data_detail', { tab: 'widgets', id, subtab: 'edit' }); }}
                />)}
            </div>

          </div>
        </StickyContainer>
      </div>
    );
  }
}

export default WidgetsShow;
