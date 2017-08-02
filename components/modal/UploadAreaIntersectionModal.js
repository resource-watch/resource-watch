import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import Dropzone from 'react-dropzone';

// Components
import Spinner from 'components/ui/Spinner';

class UploadAreaIntersectionModal extends React.Component {

  /**
   * Return the name of the file
   * @param {File} file
   * @returns {string}
   */
  static getFileName(file) {
    return file.name;
  }

  /**
   * Return the extension of the file
   * @param {File} file
   * @returns {string}
   */
  static getFileType(file) {
    return file.name.split('.').pop();
  }

  /**
   * Return the JSON object that the file represents
   * @static
   * @param {File} file JSON-compatible file
   * @returns {Promise<Object>}
   */
  static readJSONFile(file) {
    return new Promise((resolve) => {
      // We read the file and resolve the json object
      const reader = new FileReader();
      reader.onload = () => resolve(JSON.parse(reader.result));
      reader.onerror = () => {
        throw new Error('Unable to read the geojson file. Please try to upload it again.');
      };
      reader.readAsText(file);
    });
  }

  /**
   * Convert a file with one of these formats to a geojson one:
   * .csv, .kml, .kmz, .wkt, .shp
   * @static
   * @param {File} file File to convert
   * @returns {Promise<Object>} geojson object
   */
  static convertToJSON(file) {
    const formData = new FormData();
    formData.append('file', file);

    return fetch(`${process.env.WRI_API_URL}/ogr/convert`, {
      method: 'POST',
      body: formData,
      multipart: true
    })
      .then((response) => {
        if (!response.ok) throw new Error('The file couldn\'t be processed correctly. Try again in a few minutes.');
        return response.json();
      })
      .then(({ data }) => {
        const features = data.attributes.features;

        if (!features || !features.length || !Array.isArray(features)) {
          throw new Error('The geometry seems to be empty. Please make sure the file isn\'t empty.');
        }

        return data.attributes;
      });
  }

  /**
   * Convert the file to the geojson format if necessary
   * and store it in the geostore
   * NOTE: the method doesn't catch the errors but sends
   * comprehensive errors
   * @static
   * @param {File} file File to process
   * @returns {Promise<string>} hash Hash of the store file
   */
  static processFile(file) {
    // First step: we convert the file to a geojson format
    return new Promise((resolve) => {
      const fileType = UploadAreaIntersectionModal.getFileType(file);

      // If the file is already a geojson, we don't need to convert it
      if (fileType === 'geojson') {
        // If there's an error, it will be caught at a higher level
        UploadAreaIntersectionModal.readJSONFile(file)
          .then(resolve);
      } else { // Otherwise, we convert it
        // If there's an error, it will be caught at a higher level
        UploadAreaIntersectionModal.convertToJSON(file)
          .then(resolve);
      }
    })
    // Second: we store it in the geostore
    .then(geojson => fetch(`${process.env.WRI_API_URL}/geostore`, {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json'
      }),
      body: JSON.stringify({ geojson })
    }))
    .then((response) => {
      if (!response.ok) throw new Error('The file couldn\'t be processed correctly. Try again in a few minutes.');
      return response.json();
    })
    // Finally: we return the id of the geojson
    .then(({ data }) => data.id);
  }

  constructor(props) {
    super(props);

    this.state = {
      accepted: null, // Accepted file
      rejected: null, // Rejected file
      dropzoneActive: false,
      loading: false,
      errors: []
    };
  }

  /**
   * Event handler executed when the user drags a file over the
   * drop zone
   */
  @Autobind
  onDragEnter() {
    this.setState({
      dropzoneActive: true
    });
  }

  /**
   * Event handler executed when the user drags a file over the
   * drop zone
   */
  @Autobind
  onDragLeave() {
    this.setState({
      dropzoneActive: false
    });
  }

  /**
   * Event handler executed when the user drops a file in the
   * drop zone
   * @param {File[]} accepted List of accepted files
   * @param {File[]} rejected List of rejected files
   */
  @Autobind
  onDrop(accepted, rejected) {
    this.setState({
      accepted: accepted[0],
      rejected: rejected[0],
      dropzoneActive: false,
      loading: true
    }, () => {
      if (this.state.accepted) {
        UploadAreaIntersectionModal.processFile(this.state.accepted)
          .then(id => this.props.onUploadArea(id))
          .catch(err => this.setState({ errors: [err.message] }))
          .then(() => this.setState({ loading: false }));
      }
    });
  }

  /**
   * Event handler executed when the user clicks on the drop
   * zone
   */
  @Autobind
  onOpenDialog() {
    this.dropzone.open();
  }

  render() {
    const { dropzoneActive, loading, errors } = this.state;

    return (
      <div className="c-upload-area-intersection-modal">
        <Spinner isLoading={loading} />

        <Dropzone
          ref={(node) => { this.dropzone = node; }}
          className="c-dropzone"
          activeClassName="-active"
          rejectClassName="-reject"
          multiple={false}
          disableClick
          disablePreview
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
        >
          {dropzoneActive &&
            <div className="dropzone-active">
              <h2>Drop files...</h2>
            </div>
          }

          <header className="dropzone-header">
            <h2>Import files</h2>
            <p>
              Drop a file in the designated area to upload it.
              The recommended maximum file size is 1MB.
              Anything larger than that may not work properly.
            </p>
            <p>
              List of supported file formats
              <i>(click on any format to download the template)</i>:
            </p>
            <ul>
              <li>
                Unzipped: .csv, .geojson, .kml, .kmz, .wkt
                <i>(.csv files must contain a geom column that contains geographic information)</i>
              </li>
              <li>
                Zipped: .shp
                <i>(zipped shapefiles must include .shp, .shx, .dbf and .prj files)</i>
              </li>
            </ul>
          </header>

          <div className="dropzone-file">
            <div className="dropzone-file-input">
              <div
                role="presentation" // Disable the accessibility warning, don't know which other role to give
                className="dropzone-file-name"
                onClick={this.onOpenDialog}
              >
                { this.state.accepted
                  ? UploadAreaIntersectionModal.getFileName(this.state.accepted)
                  : 'Select file to import data'
                }
              </div>
              <button
                className="c-btn -primary -light"
                onClick={this.onOpenDialog}
              >
                Select file
              </button>
            </div>

            {errors && Array.isArray(errors) && !!errors.length &&
              <div className="dropzone-file-errors">
                <ul>
                  {errors.map(err =>
                    <li key={err}>{err}</li>
                  )}
                </ul>
              </div>
            }
          </div>
        </Dropzone>
      </div>
    );
  }

}

UploadAreaIntersectionModal.propTypes = {
  // Callback to call with the id of the area
  onUploadArea: PropTypes.func.isRequired
};

export default UploadAreaIntersectionModal;
