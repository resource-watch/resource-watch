import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';
import { toggleTooltip } from 'redactions/tooltip';

// Components
import Button from 'components/ui/Button';

class AddWidgetToCollectionTooltip extends React.Component {

  constructor(props) {
    super(props);

  }

  componentDidMount() {
    document.addEventListener('mousedown', this.triggerMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.triggerMouseDown);
  }

  onApply() {
    this.props.onAddWidgetToCollection();

    // We close the tooltip
    this.props.toggleTooltip(false);
  }

  @Autobind
  triggerMouseDown(e) {
    const el = document.querySelector('.c-tooltip');
    const clickOutside = el && el.contains && !el.contains(e.target);
    if (clickOutside) {
      this.props.toggleTooltip(false);
    }
  }

  render() {
    return (
      <div className="c-add-widget-to-collection-tooltip">
        <div className="buttons-div" >
          
        </div>
      </div>
    );
  }
}

AddWidgetToCollectionTooltip.propTypes = {
  onAddWidgetToCollection: PropTypes.func.isRequired,
  // store
  toggleTooltip: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  }
});

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, mapDispatchToProps)(AddWidgetToCollectionTooltip);
