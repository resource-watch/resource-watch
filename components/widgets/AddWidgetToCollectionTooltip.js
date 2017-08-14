import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';
import { toggleTooltip } from 'redactions/tooltip';

// Components
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';

class AddWidgetToCollectionTooltip extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      collections: [],
      selectedCollections: []
    };
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
    const { collections, selectedCollections } = this.state;

    return (
      <div className="c-add-widget-to-collection-tooltip">
        <div className="" >
          <Field
            onChange={value => this.triggerTagsChange(value)}
            options={collections.map(val => ({ label: val, value: val }))}
            selected={selectedCollections.map(
              tag => ({ label: tag, value: tag })
            )}
            properties={{
              name: 'collections',
              multi: true,
              required: true,
              creatable: true,
              default: selectedCollections.map(
                tag => ({ label: tag, value: tag })
              ),
              value: selectedCollections.map(
                tag => ({ label: tag, value: tag })
              )
            }}
          >
            {Select}
          </Field>
        </div>
        <div className="buttons-div" >
          <button className="c-btn -a -compressed">
            Done
          </button>
          <button className="c-btn -b -compressed">
            Select all
          </button>
          <button className="c-btn -b -compressed">
            Clear
          </button>
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
