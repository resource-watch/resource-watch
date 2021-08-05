import {
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import classnames from 'classnames';

// components
import Spinner from 'components/ui/Spinner';

// utils
import { processFile } from 'utils/areas';

// styles
import './styles.scss';

const UploadArea = ({
  onUploadArea,
}) => {
  const dropzoneRef = useRef(null);
  const [uploadState, setUploadState] = useState({
    accepted: null,
    rejected: null,
    dropzoneActive: false,
    loading: false,
    errors: [],
  });
  const {
    accepted,
    dropzoneActive,
    loading,
    errors,
  } = uploadState;

  /**
   * Event handler executed when the user drags a file over the
   * drop zone
   */
  const onDragEnter = useCallback(() => {
    setUploadState((prevUploadState) => ({
      ...prevUploadState,
      dropzoneActive: true,
    }));
  }, []);

  /**
   * Event handler executed when the user drags a file over the
   * drop zone
   */
  const onDragLeave = useCallback(() => {
    setUploadState((prevUploadState) => ({
      ...prevUploadState,
      dropzoneActive: false,
    }));
  }, []);

  /**
   * Event handler executed when the user drops a file in the
   * drop zone
   * @param {File[]} accepted List of accepted files
   * @param {File[]} rejected List of rejected files
   */
  const onDrop = useCallback(async (_accepted, rejected) => {
    setUploadState((prevUploadState) => ({
      ...prevUploadState,
      accepted: _accepted[0],
      rejected: rejected[0],
      dropzoneActive: false,
      loading: true,
      errors: [],
    }));

    if (_accepted[0]) {
      try {
        const id = await processFile(_accepted[0]);
        onUploadArea(id);
        setUploadState((prevUploadState) => ({
          ...prevUploadState,
          loading: false,
        }));
      } catch (e) {
        setUploadState((prevUploadState) => ({
          ...prevUploadState,
          errors: [e.message],
          loading: false,
        }));
      }
    }
  }, [onUploadArea]);

  /**
   * Event handler executed when the user clicks on the drop
   * zone
   */
  const onOpenDialog = useCallback(() => {
    if (dropzoneRef) dropzoneRef.current.open();
  }, []);

  /**
   * Return the name of the file
   * @param {File} file
   * @returns {string}
   */
  const getFileName = useCallback((file) => file.name, []);

  const fileInputContent = useMemo(() => {
    if (dropzoneActive) return 'Drop the file here';
    if (accepted) return getFileName(accepted);
    return 'Select a file';
  }, [dropzoneActive, accepted, getFileName]);

  return (
    <div className="c-upload-area">
      {loading && (
        <Spinner
          isLoading
          className="-light"
        />
      )}

      <Dropzone
        ref={dropzoneRef}
        className="c-dropzone"
        activeClassName="-active"
        rejectClassName="-reject"
        multiple={false}
        disableClick
        disablePreview
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
      >
        <div className={classnames({ 'dropzone-file-input': true, '-active': dropzoneActive })}>
          <div
            role="presentation"
            className="dropzone-file-name"
            onClick={onOpenDialog}
          >
            { fileInputContent }
          </div>
          <button
            type="button"
            className="c-button"
            onClick={onOpenDialog}
          >
            Select file
          </button>
        </div>

        {!!errors.length && (
          <ul className="dropzone-file-errors">
            {errors.map((err, index) => (
              <li key={err}>
                {index === 0 && <span>Error</span>}
                &nbsp;
                {err}
              </li>
            ))}
          </ul>
        )}

        <p>
          Drop a file in the designated area or click the button to upload it.
          The recommended
          &nbsp;
          <strong>maximum file size is 1MB</strong>
          .Anything larger than that may not work properly.
        </p>
        <p>
          If you want to draw the area, you can use&nbsp;
          <a href="http://geojson.io" target="_blank" rel="noopener noreferrer">geojson.io</a>
          &nbsp;and download a file with one of the supported format below.
        </p>

        <div className="info">
          <div className="complementary-info">
            <p>
              List of supported file formats:
            </p>
            <ul>
              <li>
                Unzipped:
                <strong>.csv</strong>
                &nbsp;
                (must contain a geom column that contains geographic information),
                &nbsp;
                <strong>.geojson</strong>
                ,&nbsp;
                <strong>.kml</strong>
                ,&nbsp;
                <strong>.kmz</strong>
                ,&nbsp;
                <strong>.wkt</strong>
              </li>
              <li>
                Zipped:
                &nbsp;
                <strong>.shp</strong>
                &nbsp;(must include the .shp, .shx, .dbf and .prj files)
              </li>
            </ul>
          </div>
        </div>
      </Dropzone>
    </div>
  );
};

UploadArea.propTypes = {
  onUploadArea: PropTypes.func.isRequired,
};

export default UploadArea;
