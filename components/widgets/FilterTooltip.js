import React from 'react';
import { Autobind } from 'es-decorators';
import { toggleTooltip } from 'redactions/tooltip';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import DatasetService from 'services/DatasetService';
import CheckboxGroup from 'components/form/CheckboxGroup';
import Spinner from 'components/ui/Spinner';
import InputRange from 'react-input-range';

class FilterTooltip extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      values: [],
      rangeValue: null,
      loading: true
    }

    // DatasetService
    this.datasetService = new DatasetService(props.datasetID, {
      apiURL: process.env.WRI_API_URL
    });

    this.datasetService.getFilter({
      columnType: props.type,
      tableName: props.tableName,
      columnName: props.name
    }).then((result) => {
      console.log(result);
      const values = props.type === 'string' ? result.properties.map(val => ({ name: val, label: val, value: val })) : null;
      this.setState({
        loading: false,
        values,
        min: result.properties.min,
        max: result.properties.max,
        rangeValue: { min: result.properties.min, max: result.properties.max }
      })
    }).catch((error) => {
      console.log(error);
      this.setState({
        loading: false
      });
    });
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.triggerMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.triggerMouseDown);
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
    const { values, rangeValue, min, max, loading } = this.state;
    console.log(this.state);
    return (
      <div className="c-filter-tooltip">
        <Spinner
          className="-light"
          isLoading={loading}
        />
        { type === 'string' &&
          <div>
            <CheckboxGroup
              options={values}
            />
            <div>
              <button>Clear All</button>
              <button>Select All</button>
            </div>
          </div>
        }
        { type !== 'string' && !loading &&
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
  tableName: React.PropTypes.string.isRequired,
  datasetID: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  // store
  toggleTooltip: React.PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  }
});

export default withRedux(initStore, null, mapDispatchToProps)(FilterTooltip);
