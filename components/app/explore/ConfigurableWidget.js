import React from 'react';
import classNames from 'classnames';
import TetherComponent from 'react-tether';

import WidgetConfigurator from 'components/app/explore/WidgetConfigurator';
import Button from 'components/ui/Button';
import Icon from 'components/ui/Icon';
import bar from 'utils/widgets/bar';
import pie from 'utils/widgets/pie';
import line from 'utils/widgets/line';
import Spinner from 'components/ui/Spinner';
import VegaChart from 'components/widgets/VegaChart';
import getQueryByFiltersfrom from 'utils/getQueryByFilters';

const chartTypes = { bar, pie, line };

class ConfigurableWidget extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      configureDropdownActive: false,
      vegaChartLoading: false,
      parsedConfig: null
    };

    // BINDINGS
    this.triggerConfigureChart = this.triggerConfigureChart.bind(this);
    this.onScreenClick = this.onScreenClick.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleWidgetChartToggleLoading = this.handleWidgetChartToggleLoading.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onScreenClick);
  }

  onScreenClick(e) {
    const el = document.querySelector('.c-tooltip');
    const clickOutside = el && el.contains && !el.contains(e.target);

    if (clickOutside) {
      this.triggerConfigureChart();
    }
  }

  handleSelectionChange(columns, chartType) {
    const sql = getQueryByFilters(this.props.dataset.attributes.tableName, [], columns);

    this.setState({
      parsedConfig: Object.assign(
        {},
        chartTypes[chartType],
        {
          data:
          [{
            url: `https://api.resourcewatch.org/v1/query/${this.props.dataset.id}?sql=${sql}`,
            name: 'table',
            format: {
              type: 'json',
              property: 'data'
            }
          }]
        }
        )
    });
  }

  triggerConfigureChart() {
    const { configureDropdownActive } = this.state;

    // requestAnimationFrame
    //   - Goal: Prevent double trigger at first atempt
    //   - Issue: When you add the listener the click event is not finished yet
    //            so it will trigger onScreenClick
    //   - Stop propagation?: if I put e.stopPropagation clicking on another
    //                        filter btn won't trigger the screenClick,
    //                        so we will have 2 dropdown filters at the same time
    requestAnimationFrame(() => window[configureDropdownActive ?
      'removeEventListener' : 'addEventListener']('click', this.onScreenClick));

    this.setState({ configureDropdownActive: !configureDropdownActive });
  }

  handleWidgetChartToggleLoading(loaded) {
    this.setState({ vegaChartLoading: loaded });
  }

  render() {
    const { configureDropdownActive } = this.state;

    // if (this.state.parsedConfig){
    //   console.info(JSON.stringify(this.state.parsedConfig));
    // }

    const newClassConfigureButton = classNames({
      '-active': this.state.configureDropdownActive
    });

    return (
      <div className="c-configurable-widget">
        {this.state.parsedConfig &&
          <VegaChart
            data={this.state.parsedConfig}
            toggleLoading={this.handleWidgetChartToggleLoading}
          />
        }
        <Spinner
          isLoading={this.state.vegaChartLoading}
        />
        <TetherComponent
          attachment="top right"
          constraints={[{
            to: 'scrollToParent'
          }]}
          targetOffset="0px 100%"
          classes={{
            element: 'c-tooltip -arrow-right'
          }}
        >
          {/* First child: This is what the item will be tethered to */}
          <Button
            onClick={this.triggerConfigureChart}
            properties={{ className: newClassConfigureButton }}
          >
            <Icon name="icon-cog" className="-small" />
            CONFIGURE
          </Button>
          {/* Second child: If present, this item will be tethered to the the first child */}
          { configureDropdownActive &&
            <WidgetConfigurator
              dataset={this.props.datasetData}
              onSelectionChange={this.handleSelectionChange}
            />
          }
        </TetherComponent>
      </div>
    );
  }

}

ConfigurableWidget.propTypes = {
  datasetData: React.PropTypes.array.isRequired,
  dataset: React.PropTypes.object.isRequired
};

export default ConfigurableWidget;
