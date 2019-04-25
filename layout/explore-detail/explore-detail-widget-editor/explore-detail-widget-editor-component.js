import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import WidgetEditor, { VegaChart } from 'widget-editor';
import MediaQuery from 'react-responsive';

// components
import Modal from 'components/modal/modal-component';
import SaveWidgetModal from 'components/modal/SaveWidgetModal';
import LoginModal from 'components/modal/login-modal';

// utils
import { getDatasetDefaultEditableWidget } from 'layout/explore-detail/explore-detail-helpers';
import { getDefaultTheme } from 'utils/widget';
import { breakpoints } from 'utils/responsive';

const defaultTheme = getDefaultTheme();

class ExploreDetailWidgetEditor extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
    text: PropTypes.string,
    dataset: PropTypes.object.isRequired,
    responsive: PropTypes.object.isRequired
  }

  static defaultProps = { text: '' }

  state = {
    showSaveModal: false,
    showLoginModal: false
  }

  handleToggleModals = (bool) => {
    const { user } = this.props;

    if (!user.id) {
      this.setState({ showLoginModal: bool });
    } else {
      this.setState({ showSaveModal: bool });
    }
  }

  handleToggleSaveWidget = (bool) => {
    this.setState({ showSaveModal: bool });
  }

  handleToggleLoginModal = (bool) => {
    this.setState({ showLoginModal: bool });
  }

  render() {
    const { dataset, responsive, text } = this.props;
    const defaultEditableWidget = getDatasetDefaultEditableWidget(dataset);

    return (
      <div className="c-explore-detail-widget-editor">
        <MediaQuery
          minDeviceWidth={breakpoints.large}
          values={{ deviceWidth: responsive.fakeWidth }}
        >
          <WidgetEditor
            datasetId={dataset.id}
            widgetId={defaultEditableWidget && defaultEditableWidget.id}
            saveButtonMode="always"
            embedButtonMode="auto"
            titleMode="auto"
            provideWidgetConfig={(func) => { this.onGetWidgetConfig = func; }}
            onSave={() => this.handleToggleModals(true)}
          />

          <Modal
            isOpen={this.state.showSaveModal}
            className="-medium"
            onRequestClose={() => this.handleToggleSaveWidget(false)}
          >
            <SaveWidgetModal
              dataset={dataset.id}
              getWidgetConfig={this.onGetWidgetConfig}
              onRequestClose={() => this.handleToggleSaveWidget(false)}
            />
          </Modal>
          <Modal
            isOpen={this.state.showLoginModal}
            className="-medium"
            onRequestClose={() => this.handleToggleLoginModal(false)}
          >
            <LoginModal text={text} />
          </Modal>
        </MediaQuery>

        {defaultEditableWidget &&
          <MediaQuery
            maxDeviceWidth={breakpoints.large - 1}
            values={{ deviceWidth: responsive.fakeWidth }}
          >
            <div className="l-container">
              <div className="row">
                <div className="column small-12">
                  <VegaChart
                    data={defaultEditableWidget.widgetConfig}
                    theme={defaultTheme}
                    reloadOnResize
                  />
                </div>
              </div>
            </div>
          </MediaQuery>
        }

      </div>
    );
  }
}

export default ExploreDetailWidgetEditor;
