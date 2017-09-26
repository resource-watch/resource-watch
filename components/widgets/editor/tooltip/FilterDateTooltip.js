import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

// Redux
import { connect } from 'react-redux';
import { toggleTooltip } from 'redactions/tooltip';

// Services
import DatasetService from 'components/widgets/editor/services/DatasetService';

// Components
import Button from 'components/widgets/editor/ui/Button';

const moment = extendMoment(Moment);

class FilterDateTooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: []
    };

    // DatasetService
    this.datasetService = new DatasetService(props.datasetID, {
      apiURL: process.env.WRI_API_URL
    });
  }

  componentDidMount() {
    this.getFilter();
  }

  onValueChange = (selected) => {
    this.props.onChange(selected);
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
        const range = moment.range(result.properties.min, result.properties.max);
        const years = Array.from(range.by('year'));

        this.setState({
          values: years.map(y => ({
            value: y,
            label: y.format('YYYY')
          })),
          // We round the values to have a nicer UI
          min: moment(result.properties.min),
          max: moment(result.properties.max)
        });


        if (this.props.onChange && !selected.length) {
          this.props.onChange([
            moment(result.properties.min).utc().format(),
            moment(result.properties.max).utc().format()
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

  render() {
    const { values } = this.state;
    const { selected, loading } = this.props;

    return (
      <div className="c-filter-string-tooltip">
        {!loading && selected.length &&
          <select
            value={moment(selected[0]).utc().format()}
            onChange={(e) => {
              this.props.onChange([
                moment(e.currentTarget.value).utc().format(),
                moment(selected[1]).utc().format()
              ]);
            }}
          >
            {values.map(v => (
              <option
                key={v.label}
                disabled={v.value.valueOf() > moment(selected[1]).valueOf()}
                value={v.value.utc().format()}
              >
                {v.label}
              </option>
            ))}
          </select>
        }

        {!loading && selected.length &&
          <select
            value={moment(selected[1]).utc().format()}
            onChange={(e) => {
              this.props.onChange([
                moment(selected[0]).utc().format(),
                moment(e.currentTarget.value).utc().format()
              ]);
            }}
          >
            {values.map(v => (
              <option
                key={v.label}
                disabled={v.value.valueOf() < moment(selected[0]).valueOf()}
                value={v.value.utc().format()}
              >
                {v.label}
              </option>
            ))}
          </select>
        }


        {!loading &&
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

FilterDateTooltip.propTypes = {
  tableName: PropTypes.string.isRequired,
  datasetID: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  selected: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onResize: PropTypes.func, // Passed from the tooltip component
  onChange: PropTypes.func,
  onToggleLoading: PropTypes.func,
  onApply: PropTypes.func,
  // store
  widgetEditor: PropTypes.object.isRequired
};

FilterDateTooltip.defaultProps = {
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

export default connect(mapStateToProps, mapDispatchToProps)(FilterDateTooltip);
