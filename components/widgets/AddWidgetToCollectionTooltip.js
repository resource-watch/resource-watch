import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Components
import Field from 'components/form/Field';
import Select from 'components/form/SelectInput';
import Spinner from 'components/ui/Spinner';

// Services
import WidgetService from 'services/WidgetService';

class AddWidgetToCollectionTooltip extends React.Component {

  constructor(props) {
    super(props);

    const tags = props.widgetCollections.length > 0 ?
      props.widgetCollections[0].tags.map(val => val.replace(`${props.user.id}-`, '')) :
      [];

    this.state = {
      collections: [],
      selectedCollections: tags,
      loading: false
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
    const el2 = document.querySelector('.Select-clear-zone'); // Clear selection
    const el3 = document.querySelector('.Select-value');  // Cross icon
    // The last two selectors above have to be explicitly checked as well, otherwise
    // it doesn't work

    const clickOutside = el && el.contains && !el.contains(e.target)
      && !el2.contains(e.target) && !el3.contains(e.target);
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
    const { user, widget } = this.props;

    this.setState({ loading: true });
    this.widgetService.addWidgetToCollection(user, widget, selectedCollections)
      .then((response) => {
        console.log('response', response);
        this.setState({
          loading: false
        });
      }).catch(err => console.log(err));
  }

  render() {
    const { collections, selectedCollections, loading } = this.state;

    return (
      <div className="c-add-widget-to-collection-tooltip">
        <Spinner isLoading={loading} className="-light" />
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
            onClick={() => this.props.toggleTooltip(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}


AddWidgetToCollectionTooltip.defaultProps = {
  widgetCollections: []
};

AddWidgetToCollectionTooltip.propTypes = {
  onAddWidgetToCollection: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  widget: PropTypes.object.isRequired,
  toggleTooltip: PropTypes.func.isRequired,
  widgetCollections: PropTypes.array.isRequired
};

export default AddWidgetToCollectionTooltip;
