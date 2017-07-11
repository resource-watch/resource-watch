import React from 'react';
import PropTypes from 'prop-types';
import 'isomorphic-fetch';

// Components
import Title from 'components/ui/Title';
import TextChart from 'components/widgets/TextChart';
import VegaChart from 'components/widgets/VegaChart';
import Spinner from 'components/ui/Spinner';

// Utils
import getChartTheme from 'utils/widgets/theme';

class DashboardCard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null, // Error message
      loading: false,
      name: null, // Name of the widget
      widgetConfig: null // Vega config of the widget
    };
  }

  componentDidMount() {
    if (this.props.widgetId) {
      this.getData();
    }
  }

  /**
   * Fetch the widget's data and set a few properties in the
   * state once done
   */
  getData() {
    this.setState({ loading: true });

    fetch(`${process.env.WRI_API_URL}/widget/${this.props.widgetId}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.statusText);
      })
      .then(({ data }) => {
        this.setState({
          name: data.attributes.name,
          widgetConfig: data.attributes.widgetConfig
        });
      })
      .catch(err => this.setState({ error: err.message }));
      // TODO error message
  }

  render() {
    const widgetConfig = (this.props.data && this.props.data.attributes.widgetConfig)
      || this.state.widgetConfig;

    // Type of the widget: "vega", "text" or "map"
    const widgetType = (widgetConfig && widgetConfig.type) || 'vega';

    return (
      <div className="c-dashboard-card">
        <header>
          <Title className="-default">{this.state.name || this.props.name || '–'}</Title>
          <ul className="categories">
            {this.props.categories.map(category => <li key={category}>{category}</li>)}
          </ul>
        </header>
        <div className="widget-container">
          <Spinner isLoading={this.state.loading} className="-light -small" />
          { widgetType === 'text'
            && <TextChart
              widgetConfig={widgetConfig}
              toggleLoading={loading => this.setState({ loading })}
            />
          }
          { widgetConfig && widgetType === 'vega'
            && <VegaChart
              data={widgetConfig}
              theme={getChartTheme()}
              toggleLoading={loading => this.setState({ loading })}
            />
          }
          { !this.props.data && !this.props.widgetId
            && <div className="no-data"><span>No data</span></div>
          }
        </div>
      </div>
    );
  }

}

DashboardCard.propTypes = {
  widgetId: PropTypes.string,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  // NOTE:
  // The following props will be deprecated once the dashboards
  // have all of their widgets in the API
  name: PropTypes.string,
  data: PropTypes.object // Raw data from the server: { data: { attributes: { ... } } }
};

export default DashboardCard;
