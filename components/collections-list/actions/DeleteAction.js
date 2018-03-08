import React from 'react';
import PropTypes from 'prop-types';

// SERVICES
import DatasetsService from 'services/DatasetsService';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

class DeleteAction extends React.Component {
  constructor(props) {
    super(props);

    // BINDINGS
    this.handleOnClickDelete = this.handleOnClickDelete.bind(this);

    // SERVICES
    this.service = new DatasetsService({
      authorization: props.authorization,
      language: props.locale
    });
  }

  handleOnClickDelete(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { data } = this.props;

    toastr.confirm(`Are you sure that you want to delete: "${data.name}"`, {
      onOk: () => {
        this.service.deleteData(data.id)
          .then(() => {
            this.props.onRowDelete(data.id);
            toastr.success('Success', `The dataset "${data.id}" - "${data.name}" has been removed correctly`);
          })
          .catch((err) => {
            try {
              err.map(er =>
                toastr.error('Error', `The dataset "${data.id}" - "${data.name}" was not deleted. ${er.detail}`)
              );
            } catch (e) {
              toastr.error('Error', `The dataset "${data.id}" - "${data.name}" was not deleted. Try again.`);
            }
          });
      }
    });
  }

  render() {
    return (
      <span>
        <a className="c-btn" href="#delete-dataset" onClick={this.handleOnClickDelete}> Remove </a>
      </span>
    );
  }
}

DeleteAction.propTypes = {
  data: PropTypes.object,
  locale: PropTypes.string.isRequired,
  authorization: PropTypes.string,
  onRowDelete: PropTypes.func
};

const mapStateToProps = state => ({
  locale: state.common.locale
});

export default connect(mapStateToProps, null)(DeleteAction);
