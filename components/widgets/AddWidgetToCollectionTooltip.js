import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Components
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';

// Services
import WidgetService from 'services/WidgetService';

class AddWidgetToCollectionTooltip extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      collections: [],
      selectedCollections: []
    };

    this.widgetService = new WidgetService(null, { apiURL: process.env.CONTROL_TOWER_URL });
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
    const el2 = document.querySelector('.Select');
    const clickOutside = el && el.contains && !el.contains(e.target) && !el2.contains(e.target);
    if (clickOutside) {
      this.props.toggleTooltip(false);
    }
  }

  @Autobind
  handleCollectionsChange(value) {
    this.setState({
      selectedCollections: value
    });
  }

  @Autobind
  handleApply() {
    const { selectedCollections } = this.state;
    const { user } = this.props;
    this.widgetService.addWidgetToCollection(user, null, selectedCollections)
      .then(response => {

      }).catch(err => console.log(err));
  }

  render() {
    const { collections, selectedCollections } = this.state;

    return (
      <div className="c-add-widget-to-collection-tooltip">
        <div className="" >
          <Field
            onChange={value => this.handleCollectionsChange(value)}
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
          <button
            className="c-btn -a -compressed"
            onClick={this.handleApply}
          >
            Apply
          </button>
          <button
            className="c-btn -b -compressed"
            onClick={() => this.toggleTooltip(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

AddWidgetToCollectionTooltip.propTypes = {
  onAddWidgetToCollection: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  widget: PropTypes.object.isRequired,
  toggleTooltip: PropTypes.func.isRequired
};

export default AddWidgetToCollectionTooltip;
