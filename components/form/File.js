import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import omit from 'lodash/omit';

import Dropzone from 'react-dropzone';

// Utils
import { post } from 'utils/request';

// Components
import Spinner from 'components/ui/Spinner';

import FormElement from './FormElement';

// constants
const COLUMN_FORMAT = ['csv', 'tsv'];

class File extends FormElement {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      validations: props.validations,
      accepted: [],
      rejected: [],
      dropzoneActive: false,
      loading: false
    };

    // BINDINGS
    this.triggerBrowseOrCancel = this.triggerBrowseOrCancel.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  /**
   * DROPZONE EVENTS
   * - onDragEnter
   * - onDragLeave
   * - onDrop
  */
  onDragEnter() {
    this.setState({
      dropzoneActive: true
    });
  }

  onDragLeave() {
    this.setState({
      dropzoneActive: false
    });
  }

  onDrop(accepted, rejected) {
    this.setState({
      accepted,
      rejected,
      dropzoneActive: false
    }, () => {
      if (this.state.accepted.length) {
        this.uploadFile(this.state.accepted[0]);
      }
    });
  }

  /**
   * UI EVENTS
   * - triggerBrowseOrCancel
   * - triggerChange
  */
  triggerBrowseOrCancel() {
    const { accepted } = this.state;
    if (accepted.length) {
      this.setState({
        accepted: [],
        value: '',
        validations: ['required', 'url']
      }, () => {
        // Publish the new value to the form
        if (this.props.onChange) {
          this.props.onChange({
            value: this.state.value
          });
        }
        // Trigger validation
        this.triggerValidate();
      });
    } else {
      this.dropzone.open();
    }
  }

  triggerChange(e) {
    this.setState({
      value: e.currentTarget.value,
      validations: ['required', 'url']
    }, () => {
      // Publish the new value to the form
      if (this.props.onChange) {
        this.props.onChange({
          value: this.state.value
        });
      }
      // Trigger validation
      this.triggerValidate();
    });
  }

  /**
   * HELPERS
   * - getFileName
   * - uploadFile
  */
  getFileName() {
    const { accepted } = this.state;

    if (accepted.length) {
      const current = accepted[0];
      return current.name;
    }

    return 'Select file to import data';
  }

  uploadFile(file) {
    const formData = new FormData();
    const { provider } = this.props.properties || {};
    formData.append('dataset', file);
    formData.append('provider', provider);

    this.setState({ loading: true, errors: [] });

    post({
      type: 'POST',
      url: `${process.env.WRI_API_URL}/dataset/upload`,
      headers: [{
        key: 'Authorization', value: this.props.properties.authorization
      }],
      body: formData,
      multipart: true,
      onSuccess: ({ connectorUrl, fields }) => {
        this.setState({
          value: connectorUrl,
          validations: ['required'],
          loading: false
        }, () => {
          // Publish the new value to the form
          if (this.props.onChange) {
            this.props.onChange({
              ...COLUMN_FORMAT.includes(provider) && {
                // filters non-empty fields
                fields: fields.filter(field => (field || '').length)
              },
              value: connectorUrl
            });
          }
          // Trigger validation
          this.triggerValidate();
        });
      },
      onError: (err) => {
        this.setState({
          accepted: [],
          loading: false
        });
        if (this.props.onValid) this.props.onValid(false, err);
      }
    });
  }

  render() {
    const { properties } = this.props;
    const { accepted, loading } = this.state;

    const inputClassName = classnames({
      [properties.className]: !!properties.className
    });

    return (
      <div className="c-file">
        <Dropzone
          ref={(node) => { this.dropzone = node; }}
          className="file-dropzone"
          multiple={false}
          disableClick
          disablePreview
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
        >
          {/* {dropzoneActive &&
            <div className="dropzone-active">
              Drop files...
            </div>
          } */}

          <input
            {...omit(properties, 'authorization', 'provider')}
            className={`input ${inputClassName}`}
            value={this.state.value}
            id={`input-${properties.name}`}
            readOnly={!!accepted.length}
            onChange={this.triggerChange}
          />

          <button
            type="button"
            className="c-button -primary -compressed file-button"
            onClick={this.triggerBrowseOrCancel}
          >
            <Spinner className="-light -small" isLoading={loading} />
            {(accepted.length) ? 'Cancel' : 'Browse file'}
          </button>
        </Dropzone>
      </div>
    );
  }
}

File.propTypes = {
  properties: PropTypes.object.isRequired,
  validations: PropTypes.array,
  onChange: PropTypes.func
};

export default File;
