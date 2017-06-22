import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { toggleTooltip } from 'redactions/tooltip';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import InputRange from 'react-input-range';
import classNames from 'classnames';
import DatasetService from 'services/DatasetService';
import CheckboxGroup from 'components/form/CheckboxGroup';
import Spinner from 'components/ui/Spinner';
import Button from 'components/ui/Button';


class FilterTooltip extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      values: [],
      selected: [],
      rangeValue: null,
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
        loading: false,
        values,
        min: result.properties.min,
        max: result.properties.max,
        rangeValue: { min: result.properties.min, max: result.properties.max }
      });

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

  render() {
    const { type } = this.props;
    const { values, rangeValue, min, max, loading, selected } = this.state;
    const categoryValue = type === 'string';
    const classNameValue = classNames({
      'c-filter-tooltip': true,
      overflow: categoryValue
    });
    return (
      <div className={classNameValue}>
        <Spinner
          className="-light"
          isLoading={loading}
        />
        { categoryValue &&
          <div>
            <CheckboxGroup
              selected={selected}
              options={values}
            />
            <div className="buttons">
              <Button
                properties={{
                  type: 'button',
                  className: '-primary'
                }}
              >
              Clear All
              </Button>
              <Button
                properties={{
                  type: 'button',
                  className: '-primary'
                }}
              >
                Select All
              </Button>
            </div>
          </div>
        }
        { !categoryValue && !loading &&
          <InputRange
            maxValue={max}
            minValue={min}
            value={{ min: rangeValue.min, max: rangeValue.max }}
            onChange={opts => this.setState({ rangeValue: { min: opts.min, max: opts.max } })}
          />
        }
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
  // store
  toggleTooltip: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  }
});

export default withRedux(initStore, null, mapDispatchToProps)(FilterTooltip);
