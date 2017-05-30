import React from 'react';
import Modal from 'components/ui/Modal';
import Header from 'components/app/layout/Header';
import Footer from 'components/app/layout/Footer';
import Tooltip from 'components/ui/Tooltip';
import Head from 'components/app/layout/head';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { toggleModal, setModalOptions } from 'redactions/modal';
import Icons from 'components/app/layout/icons';

const fullScreenPages = [
  '/app/Explore',
  '/app/Pulse'
];


class Page extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }

  componentWillReceiveProps(newProps) {
    // if (this.state.modalOpen !== newProps.modal.open) {
    //   this.setState({ modalOpen: newProps.modal.open });
    // }
  }

  render() {
    const { title, description, pathname } = this.props;
    const fullScreen = fullScreenPages.indexOf(pathname) !== -1;
    return (
      <div className="c-page">
        <Head
          title={title}
          description={description}
        />
        <Icons />
        <Header fullScreen={fullScreen} />
        <div className="container">
          { this.props.children }
          {!fullScreen && <Footer />}
        </div>
        <Tooltip />
      </div>
    );

    // <Modal
    //   open={this.state.modalOpen}
    //   options={modal.options}
    //   loading={modal.loading}
    //   toggleModal={this.props.toggleModal}
    //   setModalOptions={this.props.setModalOptions}
    // />
  }

}

Page.propTypes = {
  children: React.PropTypes.element.isRequired,
  title: React.PropTypes.string,
  description: React.PropTypes.string,
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

export default withRedux(initStore, state => ({ modal: state.modal }), mapDispatchToProps)(Page);
