import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// components
import Icon from 'components/ui/icon';

// styles
import './styles.scss';

class ZoomControls extends PureComponent {
  static propTypes = {
    viewport: PropTypes.shape({}).isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired
  }

  static defaultProps = { className: null }

  increaseZoom = (e) => {
    e.stopPropagation();
    const { viewport, onClick } = this.props;
    const { zoom, maxZoom } = viewport;

    onClick(zoom === maxZoom ? zoom : zoom + 1);
  }

  decreaseZoom = (e) => {
    e.stopPropagation();
    const { viewport, onClick } = this.props;
    const { zoom, minZoom } = viewport;

    onClick(zoom === minZoom ? zoom : zoom - 1);
  }

  render() {
    const { className, viewport } = this.props;
    const { zoom, maxZoom, minZoom } = viewport;

    const componentClass = classnames({
      'c-zoom-control': true,
      [className]: !!className
    });

    const zoomInClass = classnames('zoom-control--btn', { '-disabled': zoom >= maxZoom });
    const zoomOutClass = classnames('zoom-control--btn', { '-disabled': zoom <= minZoom });

    return (
      <div className={componentClass}>
        <button
          type="button"
          className={zoomInClass}
          disabled={zoom === maxZoom}
          onClick={this.increaseZoom}
        >
          <Icon name="icon-plus" />
        </button>
        <button
          type="button"
          className={zoomOutClass}
          disabled={zoom === minZoom}
          onClick={this.decreaseZoom}
        >
          <Icon name="icon-minus" />
        </button>
      </div>
    );
  }
}

export default ZoomControls;
