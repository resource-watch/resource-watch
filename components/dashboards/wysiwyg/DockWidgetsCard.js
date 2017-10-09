import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Redux
import { connect } from 'react-redux';

// Components
import Title from 'components/widgets/editor/ui/Title';

class DockWidgetsCard extends React.Component {
  /**
   * UI EVENTS
   * @return {[type]} [description]
  */
  onSelect = () => {
    const { widget } = this.props;
    this.props.onSelect(widget);
  }

  render() {
    const { widget, selected } = this.props;
    const classNames = classnames({
      '-selected': selected
    })

    return (
      <div
        className={`c-widget-card ${classNames}`}
        onClick={this.onSelect}
      >
        <div className="info">
          <div className="detail">
            {/* Title */}
            <Title className="-default -primary">
              {widget.name}
            </Title>
          </div>
        </div>
      </div>
    );
  }
}

DockWidgetsCard.defaultProps = {
};

DockWidgetsCard.propTypes = {
  widget: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired
};

const mapStateToProps = null;

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(DockWidgetsCard);
