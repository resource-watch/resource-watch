
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// components
import Icon from 'components/ui/icon';

// styles
import './styles.scss';

class DrawPolygonControls extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    drawing: PropTypes.bool.isRequired,
    showRemovePolygonButton: PropTypes.bool,
    onDrawPolygon: PropTypes.func.isRequired,
    onRemovePolygon: PropTypes.func.isRequired
  }

  static defaultProps = {
    className: null,
    showRemovePolygonButton: true
  }

  handleDrawPolygon = () => {
    const { onDrawPolygon } = this.props;

    onDrawPolygon();
  }

  handleRemovePolygon = () => {
    const { onRemovePolygon } = this.props;

    onRemovePolygon();
  }

  render() {
    const { className, drawing, showRemovePolygonButton } = this.props;
    const componentClass = classnames({
      'c-draw-polygon-control': true,
      [className]: !!className
    });

    const drawPolygonBtnClass = classnames({
      'draw-polygon--btn': true,
      '-drawing': drawing
    });

    return (
      <div className={componentClass}>
        <button
          type="button"
          className={drawPolygonBtnClass}
          onClick={this.handleDrawPolygon}
        >
          <Icon name="icon-draw-polygon" />
        </button>
        {showRemovePolygonButton && (
          <button
            type="button"
            className="remove-polygon--btn"
            onClick={this.handleRemovePolygon}
          >
            <Icon name="icon-bin" />
          </button>)}
      </div>
    );
  }
}

export default DrawPolygonControls;
