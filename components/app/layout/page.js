import React from 'react';
import Modal from 'components/ui/Modal';
import Header from 'components/app/layout/Header';
import Footer from 'components/app/layout/Footer';
import Tooltip from 'components/ui/Tooltip';
import Head from 'components/admin/layout/head';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { toggleModal, setModalOptions } from 'redactions/modal';

const fullScreenPages = [
  '/explore',
  '/planet-pulse'
];


class Page extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: props.modal.open || false
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.state.modalOpen !== newProps.modal.open) {
      this.setState({ modalOpen: newProps.modal.open });
    }
  }

  render() {
    const { title, description, modal } = this.props;
    const fullScreen = fullScreenPages.indexOf(this.props.location.pathname) !== -1;
    return (
      <div className="c-page">
        <Head
          title={title}
          description={description}
        />
        <Header fullScreen={fullScreen} />
        { this.props.children }
        {!fullScreen && <Footer />}
        <Tooltip />
        <Modal
          open={this.state.modalOpen}
          options={modal.options}
          loading={modal.loading}
          toggleModal={this.props.toggleModal}
          setModalOptions={this.props.setModalOptions}
        />
      </div>
    );
  }

}

Page.propTypes = {
  children: React.PropTypes.element.isRequired,
  location: React.PropTypes.object,
  modal: React.PropTypes.object,
  toggleModal: React.PropTypes.func,
  setModalOptions: React.PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  toggleModal: () => {
    dispatch(toggleModal());
  },
  setModalOptions: () => {
    dispatch(setModalOptions());
  }
});

Page = withRedux(initStore, state => ({ modal: state.modal }), mapDispatchToProps)(Page);

export default Page;
