import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// Components
import Field from 'components/widgets/editor/form/Field';
import Select from 'components/widgets/editor/form/SelectInput';
import Spinner from 'components/widgets/editor/ui/Spinner';

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
      collectionsAreEmpty: tags.length === 0,
      loading: false
    };

    // Services
    this.widgetService = new WidgetService(null, { apiURL: process.env.CONTROL_TOWER_URL });

    // ---------------------- Bindings --------------------------
    this.triggerMouseDown = this.triggerMouseDown.bind(this);
    this.handleCollectionsChange = this.handleCollectionsChange.bind(this);
    this.handleApply = this.handleApply.bind(this);
    // ----------------------------------------------------------
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.triggerMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.triggerMouseDown);
  }

  triggerMouseDown(e) {
    const el = document.querySelector('.c-tooltip');
    const el2 = document.querySelector('.Select-clear-zone');
    const el3 = document.querySelector('.Select-value');
    const el4 = document.querySelector('.Select-option');
    // The selectors above have to be explicitly checked as well, otherwise
    // it doesn't work

    // TO-DO this is a temporal hack for it to work, for some reason contains does not
    // work with some of the inner elements of the Select component
    const clickOutside = el && el.contains && !el.contains(e.target)
      && (el2 && !el2.contains(e.target))
      && e.target.tagName !== 'SPAN'
      && (el3 && !el3.contains(e.target))
      && (el4 && !el4.contains(e.target)
      && e.target.parentNode !== null);

    if (clickOutside) {
      this.props.toggleTooltip(false);
    }
  }

  handleCollectionsChange(value) {
    this.setState({
      selectedCollections: value
    });
  }

  handleApply() {
    const { selectedCollections, collectionsAreEmpty } = this.state;
    const { user, widget, toggleTooltip, onUpdateWidgetCollections } = this.props;

    let method = 'PATCH';
    let newCollectionsAreaEmtpy = false;
    if (selectedCollections.length === 0 && !collectionsAreEmpty) {
      method = 'DELETE';
      newCollectionsAreaEmtpy = true;
    }
    if (collectionsAreEmpty && selectedCollections.length > 0) {
      method = 'POST';
    }

    this.setState({ loading: true });
    this.widgetService.updateWidgetCollections(user, widget, selectedCollections, method)
      .then((response) => {
        const collections = response.data.length > 0 ? response.data[0].attributes.tags : [];
        onUpdateWidgetCollections(collections);
        this.setState({
          loading: false,
          collectionsAreEmpty: newCollectionsAreaEmtpy
        });
        toggleTooltip(false);
      }).catch(err => toastr.error('Error', err));
  }

  render() {
    const { selectedCollections, loading } = this.state;
    const { widgetCollectionsOptions } = this.props;

    return (
      <div className="c-add-widget-to-collection-tooltip">
        <Spinner isLoading={loading} className="-light" />
        <div className="" >
          <Field
            onChange={value => this.handleCollectionsChange(value)}
            options={widgetCollectionsOptions}
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
  onUpdateWidgetCollections: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  widget: PropTypes.object.isRequired,
  toggleTooltip: PropTypes.func.isRequired,
  widgetCollections: PropTypes.array.isRequired,
  widgetCollectionsOptions: PropTypes.array.isRequired
};

export default AddWidgetToCollectionTooltip;
