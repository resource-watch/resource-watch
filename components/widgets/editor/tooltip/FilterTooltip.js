import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import { toastr } from 'react-redux-toastr';
import { Range } from 'rc-slider';

// Redux

import { connect } from 'react-redux';
import { toggleTooltip } from 'redactions/tooltip';

// Services
import DatasetService from 'components/widgets/editor/services/DatasetService';

// Components
import CheckboxGroup from 'components/widgets/editor/form/CheckboxGroup';
import Spinner from 'components/widgets/editor/ui/Spinner';
import Button from 'components/widgets/editor/ui/Button';
import Checkbox from 'components/widgets/editor/form/Checkbox';

class FilterTooltip extends React.Component {
  constructor(props) {
    super(props);

    const filters = props.widgetEditor.filters;
    const filter = filters && filters.find(f => f.name === props.name);

    this.state = {
      values: [],
      // Selected strings in the filters
      selected: this.isCategorical() && filter
        ? filter.value
        : [],
      // Selected range in the filters
      rangeValue: !this.isCategorical() && filter && filter.value
        ? [filter.value[0], filter.value[1]]
        : null,
      notNullSelected: filter && filter.notNull,
      loading: true
    };

    // DatasetService
    this.datasetService = new DatasetService(props.datasetID, {
      apiURL: process.env.WRI_API_URL
    });
  }

  componentDidMount() {
    this.getFilter();
    document.addEventListener('mousedown', this.triggerMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.triggerMouseDown);
  }

  onClearAll() {
    this.setState({ selected: [] });
  }

  onSelectAll() {
    this.setState({
      selected: this.state.values.map(value => value.value)
    });
  }

  onApply() {
    const { selected, rangeValue, notNullSelected } = this.state;
    const filter = this.isCategorical() ? selected : [rangeValue[0], rangeValue[1]];
    this.props.onApply(filter, notNullSelected);

    // We close the tooltip
    this.props.toggleTooltip(false);
  }

  /**
   * Fetch the data about the column and update the state
   * consequently
   */
  getFilter() {
    this.datasetService.getFilter({
      columnType: this.props.type,
      tableName: this.props.tableName,
      columnName: this.props.name
    })
      .then((result) => {
        // We should rethink a little bit the organization of this tooltip.
        // As long as we have 4 types of values, don't you think that we should have a switch and render depending on the type...
        const values = this.props.type === 'string'
          ? result.properties.map(val => ({ name: val, label: val, value: val }))
          : null;

        this.setState({
          values,
          // We round the values to have a nicer UI
          min: Math.floor(result.properties.min),
          max: Math.ceil(result.properties.max)
        });

        // If we don't have values already set for the filter, then we
        // set the whole range as the filter
        if (!this.state.rangeValue) {
          this.setState({
            rangeValue: [
              Math.floor(result.properties.min), Math.ceil(result.properties.max)
            ]
          });
        }

        // We remove the loading state only after being sure we've
        // updated the range values (if needed)
        this.setState({ loading: false });

        // We let the tooltip know that the component has been resized
        if (this.props.onResize) {
          this.props.onResize();
        }
      })
      .catch(error => toastr.error('Error', error))
      .then(() => this.setState({ loading: false }));
  }

  @Autobind
  handleMinChange(event) {
    const newValue = event.target.value;
    this.setState({
      rangeValue: [newValue, this.state.rangeValue[1]]
    });
  }

  @Autobind
  handleMaxChange(event) {
    const newValue = event.target.value;
    this.setState({
      rangeValue: [this.state.rangeValue.min, newValue]
    });
  }

  @Autobind
  handleNotNullSelection(value) {
    this.setState({
      notNullSelected: value
    });
  }

  @Autobind
  triggerMouseDown(e) {
    const el = document.querySelector('.c-tooltip');
    const clickOutside = el && el.contains && !el.contains(e.target);
    if (clickOutside) {
      this.props.toggleTooltip(false);
    }
  }

  isCategorical() {
    const { widgetEditor, name } = this.props;
    const filters = widgetEditor.filters;
    const filter = filters && filters.find(f => f.name === name);
    return filter && filter.type === 'string';
  }

  renderCheckboxes() {
    const { values, selected } = this.state;

    return (
      <div className="checkboxes">
        <CheckboxGroup
          selected={selected}
          options={values}
          onChange={vals => this.setState({ selected: vals })}
        />
      </div>
    );
  }

  render() {
    const { loading, rangeValue, notNullSelected, min, max } = this.state;

    // Min and max values of the selected range
    const rangeMin = rangeValue ? rangeValue[0] : min;
    const rangeMax = rangeValue ? rangeValue[1] : max;

    // We debounce the method to avoid having to update the state
    // to often (around 60 FPS)
    const updateRange = debounce((range) => {
      this.setState({ rangeValue: range });
    }, 10);

    const categoryValue = this.isCategorical();
    const classNameValue = classNames({
      'c-filter-tooltip': true
    });

    return (
      <div className={classNameValue}>
        <Spinner
          className="-light"
          isLoading={loading}
        />
        {!loading &&
          <div className="c-checkbox-box">
            <Checkbox
              properties={{
                title: 'Not null values',
                checked: notNullSelected,
                default: false
              }}
              onChange={elem => this.handleNotNullSelection(elem.checked)}
            />
          </div>
        }
        {categoryValue && this.renderCheckboxes()}
        {!categoryValue && !loading &&
          !isNaN(min) && min !== null && typeof min !== 'undefined' &&
          !isNaN(max) && max !== null && typeof max !== 'undefined' &&
          <div className="range">
            <Range
              allowCross={false}
              max={max}
              min={min}
              value={[rangeMin, rangeMax]}
              onChange={range => updateRange(range)}
            />
          </div>
        }
        {!categoryValue && !loading && rangeValue &&
          <div className="text-inputs-container">
            <input className="-first" type="number" value={rangeValue[0]} onChange={this.handleMinChange} />
            -
            <input className="-last" type="number" value={rangeValue[1]} onChange={this.handleMaxChange} />
          </div>
        }

        <div className="buttons">
          {categoryValue &&
            <Button
              properties={{ type: 'button', className: ' -compressed' }}
              onClick={() => this.onSelectAll()}
            >
              Select all
            </Button>
          }
          {categoryValue &&
            <Button
              properties={{ type: 'button', className: ' -compressed' }}
              onClick={() => this.onClearAll()}
            >
              Clear
            </Button>
          }
          <Button
            properties={{ type: 'button', className: '-primary -compressed' }}
            onClick={() => this.onApply()}
          >
            Done
          </Button>
        </div>
      </div>
    );
  }
}

FilterTooltip.propTypes = {
  tableName: PropTypes.string.isRequired,
  datasetID: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onResize: PropTypes.func, // Passed from the tooltip component
  onApply: PropTypes.func.isRequired,
  // store
  toggleTooltip: PropTypes.func.isRequired,
  widgetEditor: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  }
});

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterTooltip);
