import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import classNames from 'classnames';
import InputRange from 'react-input-range';
import debounce from 'lodash/debounce';

// Redux
import { initStore } from 'store';
import withRedux from 'next-redux-wrapper';
import { toggleTooltip } from 'redactions/tooltip';

// Services
import DatasetService from 'services/DatasetService';

// Components
import CheckboxGroup from 'components/form/CheckboxGroup';
import Spinner from 'components/ui/Spinner';
import Button from 'components/ui/Button';


class FilterTooltip extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      values: [],
      // Selected strings in the filters
      selected: this.isCategorical(props) && props.filter
        ? props.filter
        : [],
      // Selected range in the filters
      rangeValue: !this.isCategorical(props) && props.filter
        ? { min: props.filter[0], max: props.filter[1] }
        : null,
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
    this.props.onApply(this.isCategorical()
      ? this.state.selected
      : [this.state.rangeValue.min, this.state.rangeValue.max]
    );

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
          rangeValue: {
            min: Math.floor(result.properties.min),
            max: Math.ceil(result.properties.max)
          }
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
    .catch(error => console.error(error))
    .then(() => this.setState({ loading: false }));
  }

  @Autobind
  triggerMouseDown(e) {
    const el = document.querySelector('.c-tooltip');
    const clickOutside = el && el.contains && !el.contains(e.target);
    if (clickOutside) {
      this.props.toggleTooltip(false);
    }
  }

  isCategorical(props) {
    return (props || this.props).type === 'string';
  }

  renderCheckboxes() {
    const { values, selected } = this.state;

    return (
      <div className="checkboxes">
        <div className="buttons">
          <button type="button" onClick={() => this.onClearAll()}>Clear all</button>
          <button type="button" onClick={() => this.onSelectAll()}>Select all</button>
        </div>
        <CheckboxGroup
          selected={selected}
          options={values}
          onChange={vals => this.setState({ selected: vals })}
        />
      </div>
    );
  }

  renderRange() {
    // Min and max values of the dataset
    const min = this.state.min;
    const max = this.state.max;

    // The step musn't depend on rangeMin and rangeMax otherwise
    // when moving either of them, both of them will be updated
    // to the nearest multiple of the step
    const step = Math.floor((max - min) / 100);

    // Min and max values of the selected range
    const rangeMin = this.state.rangeValue.min;
    const rangeMax = this.state.rangeValue.max;

    // We debounce the method to avoid having to update the state
    // to often (around 60 FPS)
    const updateRange = debounce(range => this.setState({ rangeValue: range }), 16);

    return (
      <div className="range">
        <InputRange
          maxValue={max}
          minValue={min}
          value={{ min: rangeMin, max: rangeMax }}
          step={step}
          onChange={range => updateRange(range)}
        />
      </div>
    );
  }

  render() {
    const { loading } = this.state;
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

        { categoryValue && this.renderCheckboxes() }
        { !categoryValue && !loading && this.renderRange() }

        <Button
          properties={{ type: 'button', className: '-primary' }}
          onClick={() => this.onApply()}
        >
          Done
        </Button>
      </div>
    );
  }
}

FilterTooltip.propTypes = {
  tableName: PropTypes.string.isRequired,
  datasetID: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  filter: PropTypes.any, // Current value of the filter
  onResize: PropTypes.func, // Passed from the tooltip component
  onApply: PropTypes.func.isRequired,
  // store
  toggleTooltip: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  }
});

export default withRedux(initStore, null, mapDispatchToProps)(FilterTooltip);
