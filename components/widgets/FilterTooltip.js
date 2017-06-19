import React from 'react';
import { Autobind } from 'es-decorators';
import { toggleTooltip } from 'redactions/tooltip';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import DatasetService from 'services/DatasetService';
import CheckboxGroup from 'components/form/CheckboxGroup';

class FilterTooltip extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      values: []
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
        values,
        max: result.properties.max,
        min: result.properties.min
      })
    }).catch((error) => {
      console.log(error);
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
    const { values } = this.state;
    return (
      <div className="c-filter-tooltip">
        { type === 'string' &&
          <CheckboxGroup
            options={values}
          />
        }
        { type !== 'string' &&
          <CheckboxGroup
            options={values}
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
