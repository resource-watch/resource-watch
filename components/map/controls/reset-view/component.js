import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// components
import Icon from 'components/ui/icon';

// styles
import './styles.scss';

class ResetViewControls extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onResetView: PropTypes.func.isRequired
  }

  static defaultProps = { className: null }

  handleResetView = (e) => {
    const { onResetView } = this.props;

    onResetView(e);
  }

  render() {
    const { className } = this.props;
    const componentClass = classnames({
      'c-reset-view-control': true,
      [className]: !!className
    });

    return (
      <div className={componentClass}>
        <button
          type="button"
          className="reset-view--btn"
          onClick={this.handleResetView}
        >
          <Icon name="icon-compass" />
        </button>
      </div>
    );
  }
}

export default ResetViewControls;
