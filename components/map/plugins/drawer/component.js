import { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

// styles
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

// constants
import { DRAWER_CONFIG } from './constants';

const Drawer = (props) => {
  const {
    drawing,
    map,
    onDrawComplete,
    onReady,
    onEscapeKey
  } = props;
  const draw = useRef(new MapboxDraw(DRAWER_CONFIG)).current;
  const [mounted, setMountedState] = useState(false);

  const handleEscapeKey = useCallback((evt) => {
    if (evt.key === 'Escape') onEscapeKey();
  }, [onEscapeKey]);

  const initDrawing = useCallback(() => {
    map.addControl(draw);
    map.on('draw.create', (e) => {
      const geoJSON = e.features && e.features[0];
      if (geoJSON) onDrawComplete(geoJSON);
    });

    setMountedState(true);
    if (onReady) onReady(draw);
  }, [map, onDrawComplete, draw, onReady]);

  const stopDrawing = useCallback(() => {
    map.off('draw.create');
    map.removeControl(draw);

    setMountedState(false);
  }, [map, draw]);

  useEffect(() => {
    if (drawing && !mounted) initDrawing();
    if (!drawing && mounted) stopDrawing();

    if (drawing) {
      window.addEventListener('keydown', handleEscapeKey);
    } else {
      window.removeEventListener('keydown', handleEscapeKey);
    }

    return () => { window.removeEventListener('keydown', handleEscapeKey); };
  }, [drawing, mounted, initDrawing, stopDrawing, handleEscapeKey]);

  return null;
};

Drawer.propTypes = {
  map: PropTypes.object.isRequired,
  drawing: PropTypes.bool.isRequired,
  onDrawComplete: PropTypes.func.isRequired,
  onEscapeKey: PropTypes.func,
  onReady: PropTypes.func
};

Drawer.defaultProps = {
  onReady: null,
  onEscapeKey: null
};

export default Drawer;
