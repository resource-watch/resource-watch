import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';
import { toggleTooltip } from 'redactions/tooltip';

// Services
import DatasetService from 'components/widgets/editor/services/DatasetService';

// Components
import Button from 'components/widgets/editor/ui/Button';
import { Range } from 'rc-slider';

class FilterNumberTooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      min: 0,
      max: 0
    };

    // DatasetService
    this.datasetService = new DatasetService(props.datasetID, {
      apiURL: process.env.WRI_API_URL
    });
  }

  componentDidMount() {
    this.getFilter();
  }

  onClearAll = () => {
    this.props.onChange([]);
  }

  onSelectAll = () => {
    this.props.onChange(this.state.values.map(value => value.value));
  }

  /**
   * Fetch the data about the column and update the state
   * consequently
   */
  getFilter() {
    const { selected } = this.props;

    this.datasetService.getFilter({
      columnType: this.props.type,
      tableName: this.props.tableName,
      columnName: this.props.name,
      geostore: this.props.widgetEditor.areaIntersection
    })
      .then((result) => {
        this.setState({
          // We round the values to have a nicer UI
          min: Math.floor(result.properties.min),
          max: Math.ceil(result.properties.max)
        });

        if (this.props.onChange && !selected.length) {
          this.props.onChange([
            Math.floor(result.properties.min),
            Math.ceil(result.properties.max)
          ]);
        }

        if (this.props.onToggleLoading) {
          this.props.onToggleLoading(false);
        }

        // We let the tooltip know that the component has been resized
        if (this.props.onResize) {
          this.props.onResize();
        }
      })
      .catch((errors) => {
        this.props.onToggleLoading(false);

        try {
          errors.forEach(er =>
            toastr.error('Error', er.detail)
          );
        } catch (e) {
          toastr.error('Error', 'Oops');
        }
      });
  }

  handleMinChange = (event) => {
    const newValue = event.target.value;
    this.props.onChange([newValue, this.props.selected[1]]);
  }

  handleMaxChange = (event) => {
    const newValue = event.target.value;
    this.props.onChange([this.props.selected[0], newValue]);
  }

  // We debounce the method to avoid having to update the state
  // to often (around 60 FPS)
  updateRange = debounce((range) => {
    this.props.onChange(range);
  }, 10);


  render() {
    const { min, max } = this.state;
    const { selected, loading } = this.props;

    return (
      <div className="c-filter-string-tooltip">

        {!loading &&
          !isNaN(min) && min !== null && typeof min !== 'undefined' &&
          !isNaN(max) && max !== null && typeof max !== 'undefined' &&
          <div className="range">
            <Range
              allowCross={false}
              max={max}
              min={min}
              value={selected}
              onChange={range => this.updateRange(range)}
            />
          </div>
        }

        {!loading && selected.length &&
          <div className="text-inputs-container">
            <input className="-first" type="number" value={selected[0]} onChange={this.handleMinChange} />
            -
            <input className="-last" type="number" value={selected[1]} onChange={this.handleMaxChange} />
          </div>
        }

        {!loading && selected.length &&
          <div className="buttons">
            <Button
              properties={{ type: 'button', className: '-primary -compressed' }}
              onClick={() => this.props.onApply()}
            >
              Done
            </Button>
          </div>
        }

      </div>
    );
  }
}

FilterNumberTooltip.propTypes = {
  tableName: PropTypes.string.isRequired,
  datasetID: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  selected: PropTypes.array,
  loading: PropTypes.bool,
  onResize: PropTypes.func, // Passed from the tooltip component
  onChange: PropTypes.func,
  onToggleLoading: PropTypes.func,
  onApply: PropTypes.func,
  // store
  widgetEditor: PropTypes.object.isRequired
};

FilterNumberTooltip.defaultProps = {
  selected: []
};

const mapDispatchToProps = dispatch => ({
  toggleTooltip: (opened, opts) => {
    dispatch(toggleTooltip(opened, opts));
  }
});

const mapStateToProps = state => ({
  widgetEditor: state.widgetEditor
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterNumberTooltip);
