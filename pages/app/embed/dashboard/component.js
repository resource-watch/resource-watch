import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// components
import LayoutEmbed from 'layout/layout/layout-embed';
import DashboardDetail from 'components/dashboards/detail';
import Modal from 'components/modal/modal-component';
import ShareModal from 'components/modal/share-modal';
import Icon from 'components/ui/Icon';

// utils
import { logEvent } from 'utils/analytics';

class EmbedDashboardPage extends PureComponent {
  static propTypes = { dashboard: PropTypes.object.isRequired }

  state = { showShareModal: false }

  handleToggleShareModal = (bool) => { this.setState({ showShareModal: bool }); }

  render() {
    const { dashboard } = this.props;

    return (
      <LayoutEmbed
        title={dashboard.name}
        description={dashboard.summary}
        className="page-dashboards c-page-dashboards"
        pageHeader
      >
        <header className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <h1>{dashboard.name}</h1>

                  <div className="page-header-info">
                    <ul>
                      <li>
                        <button
                          className="c-btn -tertiary -alt -clean"
                          onClick={() => this.handleToggleShareModal(true)}
                        >
                          <Icon name="icon-share" className="-small" />
                          <span>Share</span>
                        </button>

                        <Modal
                          isOpen={this.state.showShareModal}
                          className="-medium"
                          onRequestClose={() => this.handleToggleShareModal(false)}
                        >
                          <ShareModal
                            links={{
                              link: typeof window !== 'undefined' && window.location.href,
                              embed: typeof window !== 'undefined' && `${window.location.origin}/embed/dashboard/${dashboard.slug}`
                            }}
                            analytics={{
                              facebook: () => logEvent('Share (embed)', `Share dashboard: ${dashboard.name}`, 'Facebook'),
                              twitter: () => logEvent('Share (embed)', `Share dashboard: ${dashboard.name}`, 'Twitter'),
                              copy: type => logEvent('Share (embed)', `Share dashboard: ${dashboard.name}`, `Copy ${type}`)
                            }}
                          />
                        </Modal>
                      </li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="l-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <DashboardDetail />
              </div>
            </div>
          </div>
        </div>
      </LayoutEmbed>
    );
  }
}

export default EmbedDashboardPage;
