import React from 'react';
import Modal from 'components/ui/Modal';
import Header from 'components/app/layout/Header';
import Footer from 'components/app/layout/Footer';
import Tooltip from 'components/ui/Tooltip';

export default class Page extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modalOpen: props.modal.open || false
    };
  }

  render() {
    const { title, description } = this.props;
    return (
      <div>
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
