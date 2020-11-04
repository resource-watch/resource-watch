import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import { Tooltip } from 'vizzuality-components';
import { toastr } from 'react-redux-toastr';

// utils
import { processFile } from 'utils/areas';

// components
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import ProminentButton from 'components/prominent-button';
import Icon from 'components/ui/icon';
import CountrySelector from './country-selector';

// styles
import './styles.scss';

const AREA_ACTIONS = {
  'draw-area': 'DRAW_AREA',
  'preset-country': 'PRESET_COUNTRY',
  'upload-file': 'UPLOAD_FILE',
};

const ExploreAreaForm = ({
  area,
  isDrawing,
  setIsDrawing,
  stopDrawing,
  onSubmit,
  onCancel,
}) => {
  const dropzoneRef = useRef(null);
  const editionMode = !!area;
  const [form, setForm] = useState({
    name: area ? area.name : '',
    geostore: area ? area.geostore : null,
  });
  const [visibility, setVisibility] = useState(false);
  const [action, setAction] = useState(null);
  const [dropzone, setDropzone] = useState({
    accepted: null,
    rejected: null,
    dropzoneActive: false,
    loading: false,
    errors: [],
  });
  const handleSubmit = useCallback((evt) => {
    evt.preventDefault();
    onSubmit(form);
  }, [onSubmit, form]);
  const handleName = useCallback((value) => {
    setForm({ ...form, name: value });
  }, [setForm, form]);
  const handleCountry = useCallback((geostore) => {
    setForm({ ...form, geostore });
    setVisibility(false);
  }, [setForm, form]);
  const handleVisibility = useCallback((_visible) => {
    if (isDrawing) stopDrawing();
    setAction(_visible ? AREA_ACTIONS['preset-country'] : null);
    setVisibility(_visible);
  }, [isDrawing, stopDrawing]);
  const handleDrawArea = useCallback(() => {
    const isSelected = action !== AREA_ACTIONS['draw-area'];
    setIsDrawing(isSelected);
    setAction(isSelected ? AREA_ACTIONS['draw-area'] : null);
  }, [action, setIsDrawing]);

  const handleDropzoneClick = useCallback(() => {
    if (isDrawing) stopDrawing();
    setAction(null);
    dropzoneRef.current.open();
  }, [isDrawing, stopDrawing]);

  const onDragEnter = useCallback(() => {
    setDropzone({ ...dropzone, dropzoneActive: true });
  }, [dropzone]);
  const onDragLeave = useCallback(() => {
    setDropzone({ ...dropzone, dropzoneActive: false });
  }, [dropzone]);

  const onDropFile = useCallback(async (accepted, rejected) => {
    setAction(AREA_ACTIONS['upload-file']);
    setDropzone({
      accepted: accepted[0],
      rejected: rejected[0],
      dropzoneActive: false,
      loading: true,
      errors: [],
    });

    try {
      const geostore = await processFile(accepted[0]);
      setForm({
        ...form,
        geostore,
      });
    } catch (e) {
      toastr.error('There was an error processing the file', e.message);
    }
  }, [form]);

  const { name } = form;

  return (
    <form
      onSubmit={handleSubmit}
      className="c-explore-area-form"
    >
      <fieldset className="c-field-container">
        <Field
          onChange={handleName}
          validations={['required']}
          properties={{
            name: 'name',
            label: 'Title',
            type: 'text',
            value: name,
            default: name,
            placeholder: 'Type a name',
            required: true,
          }}
        >
          {Input}
        </Field>
      </fieldset>

      {!editionMode && (
        <>
          <div className="areas-actions">
            <ProminentButton
              onClick={handleDrawArea}
              className={classnames({ '-alt': action === AREA_ACTIONS['draw-area'] })}
            >
              <Icon name="icon-meta-draw" />
              <span>
                Draw your area in the map
              </span>
            </ProminentButton>

            <Tooltip
              overlay={(
                <CountrySelector
                  onClickCountry={handleCountry}
                />
              )}
              overlayClassName="c-rc-tooltip -default"
              placement="bottom"
              trigger="click"
              visible={visibility}
              onVisibleChange={handleVisibility}
              destroyTooltipOnHide
            >
              <ProminentButton
                className={classnames({ '-alt': action === AREA_ACTIONS['preset-country'] })}
              >
                <Icon name="icon-meta-select" />
                <span>
                  Select a preset area
                </span>
              </ProminentButton>
            </Tooltip>

            <Dropzone
              ref={dropzoneRef}
              className="dropzone-container"
              activeClassName="-active"
              rejectClassName="-reject"
              multiple={false}
              disableClick
              disablePreview
              onDrop={onDropFile}
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
            >
              <ProminentButton
                onClick={handleDropzoneClick}
                className={classnames({ '-alt': action === AREA_ACTIONS['upload-file'] })}
              >
                <Icon name="icon-meta-upload" />
                <span>
                  Upload a shapefile
                </span>
              </ProminentButton>
            </Dropzone>

          </div>

          <div className="specs">
            <p>
              Recommended maximum file size: 1MB. Anything larger than that may not work properly.
            </p>
            <p>
              Supported file formats: .csv (must contain a geom column
              that contains geographic information), .geojson, .kml, .kmz,
              .wkt, .shp (must include the .shp, .shx, .dbf and .prj files)
            </p>
          </div>
        </>
      )}

      <div className="buttons -align-left">
        <button
          type="submit"
          className="c-btn -primary"
        >
          Save
        </button>
        <button
          type="button"
          className="c-btn -tertiary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

ExploreAreaForm.defaultProps = {
  area: null,
};

ExploreAreaForm.propTypes = {
  area: PropTypes.shape({
    name: PropTypes.string,
    geostore: PropTypes.string,
  }),
  isDrawing: PropTypes.bool.isRequired,
  setIsDrawing: PropTypes.func.isRequired,
  stopDrawing: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ExploreAreaForm;
