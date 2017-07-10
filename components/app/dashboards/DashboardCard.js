import React from 'react';
import PropTypes from 'prop-types';

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
      loading: false
    };
  }

  render() {
    return (
      <div className="c-dashboard-card">
        <header>
          <Title className="-default">{this.props.name}</Title>
          <ul className="categories">
            {this.props.categories.map(category => <li key={category}>{category}</li>)}
          </ul>
        </header>
        <div className="widget-container">
          <Spinner isLoading={this.state.loading} className="-light -small" />
          { this.props.data
            && this.props.data.attributes.widgetConfig.type === 'text'
            && <TextChart
              widgetConfig={this.props.data.attributes.widgetConfig}
              toggleLoading={loading => this.setState({ loading })}
            />
          }
          { this.props.data
            && this.props.data.attributes.widgetConfig.type !== 'text'
            && <VegaChart
              data={this.props.data.attributes.widgetConfig}
              theme={getChartTheme()}
              toggleLoading={loading => this.setState({ loading })}
            />
          }
          { !this.props.data
            && <div className="no-data"><span>No data</span></div>
          }
        </div>
      </div>
    );
  }

}

DashboardCard.propTypes = {
  name: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.object // Raw data from the server: { data: { attributes: { ... } } }
};

export default DashboardCard;
