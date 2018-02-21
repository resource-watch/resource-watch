import React from 'react';
import PropTypes from 'prop-types';
import Progress from 'react-progress-2';

import { Router } from 'routes';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';
import { updateIsLoading } from 'redactions/page';

// Components
import Header from 'components/layout/header-admin';
import Icons from 'components/layout/icons';
import Head from 'components/layout/head/admin';

import Modal from 'components/ui/Modal';
import Tooltip from 'components/ui/Tooltip';
import Dock from 'components/ui/Dock';
import Toastr from 'react-redux-toastr';
import { setConfig,
  Modal as WidgetModal,
  Tooltip as WidgetTooltip,
  Icons as WidgetIcons } from 'widget-editor';

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false
    };

    // WIDGET EDITOR
    // Change the configuration according to your needs
    setConfig({
      url: process.env.WRI_API_URL,
      env: 'production,preproduction',
      applications: process.env.APPLICATIONS,
      authUrl: process.env.CONTROL_TOWER_URL, // is this the correct one????
      assetsPath: '/static/images/widget-editor/',
      userToken: props.user.token,
      userEmail: props.user.email
    });
  }

  componentDidMount() {
    Router.onRouteChangeStart = () => {
      if (Progress && Progress.Component.instance) Progress.show();
      this.props.toggleTooltip(false);
      this.props.updateIsLoading(true);
    };
    Router.onRouteChangeComplete = () => {
      this.props.updateIsLoading(false);
      if (Progress && Progress.Component.instance) Progress.hideAll();
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.state.modalOpen !== newProps.modal.open) {
      this.setState({ modalOpen: newProps.modal.open });
    }
  }

  render() {
    const { title, description, url, modal } = this.props;
    return (
      <div id="#main" className="l-page">
        <Head
          title={title}
          description={description}
        />

        <Icons />

        <Progress.Component />

        <Header url={url} />

        <div className="container">
          { this.props.children }
        </div>

        <Tooltip />

        <Modal
          open={this.state.modalOpen}
          options={modal.options}
          loading={modal.loading}
          toggleModal={this.props.toggleModal}
          setModalOptions={this.props.setModalOptions}
        />

        <Dock />

        <Toastr
          preventDuplicates
          transitionIn="fadeIn"
          transitionOut="fadeOut"
        />

        <WidgetModal />
        <WidgetTooltip />
        <WidgetIcons />
      </div>
    );
  }
}

Layout.propTypes = {
  url: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,

  // STORE
  modal: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setModalOptions: PropTypes.func.isRequired,
  toggleTooltip: PropTypes.func.isRequired,
  updateIsLoading: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  modal: state.modal,
  user: state.user
});


const mapDispatchToProps = dispatch => ({
  toggleTooltip: () => dispatch(toggleTooltip()),
  toggleModal: open => dispatch(toggleModal(open, {}, true)),
  setModalOptions: options => dispatch(setModalOptions(options)),
  updateIsLoading: bindActionCreators(isLoading => updateIsLoading(isLoading), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
