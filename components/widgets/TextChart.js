import React from 'react';
import PropTypes from 'prop-types';
import 'isomorphic-fetch';
import { format } from 'd3-format';

class TextChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      data: null
    };
  }

  componentDidMount() {
    this.getData();
  }

  /**
   * Fetch the data of the widget
   */
  getData() {
    // We let the parent component we're loading
    this.props.toggleLoading(true);
    this.setState({ loading: true });

    const url = this.props.widgetConfig.data.url;

    fetch(url)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error(res.statusText);
      })
      .then((res) => {
        // RW's API uses res.data, Carto, res.rows
        const data = null || (res.data && res.data.length && res.data[0])
          || (res.rows && res.rows.length && res.rows[0]);

        // If the data is not set at this point, then the render function
        // will display "no data"
        if (!data) return;

        this.setState({ data, error: null });
      })
      .catch(err => this.setState({ error: err.message }))
      .then(() => {
        this.props.toggleLoading(false);
        this.setState({ loading: false });
      });
  }

  /**
   * Return the actual content of the widget
   */
  getContent() {
    const { template_config, template } = this.props.widgetConfig;
    // List the keys that can't be found in the data
    const missingKeys = [];

    const content = template_config.reduce((res, config) => {
      const key = config.key;
      const value = this.state.data[key];

      // If the value can't be found, we just skip the substitution
      if (!value) {
        missingKeys.push(key);
        return res;
      }

      const suffix = config.suffix || '';
      const formatter = config.format && !isNaN(parseInt(value, 10))
        ? val => format(config.format)(parseInt(val, 10))
        : val => val;
      const substitution = (!isNaN(parseInt(value, 10)) || formatter(value).length)
        ? `<span class="token">${formatter(value)}${suffix}</span>`
        : '';

      return res.replace(new RegExp(`{{${key}}}`, 'g'), substitution);
    }, template);

    // If there's at least one key that couldn't be found, we display
    // an error message
    if (missingKeys.length) {
      this.setState({
        error: `The widget is malformed: the key${missingKeys.length > 1 ? 's' : ''} ${missingKeys.join(', ')} can't be found in the data`
      });
    }

    return content;
  }

  render() {
    return (
      <div className="c-text-chart">
        { this.state.error && <div className="error">Unable to load the widget <span>{this.state.error}</span></div> }
        { !this.state.error && this.state.data
          && <div className="content" dangerouslySetInnerHTML={{ __html: this.getContent() }} />  // eslint-disable-line react/no-danger
        }
        { !this.state.error && !this.state.loading && !this.state.data
          && <div className="no-data">No data</div>
        }
      </div>
    );
  }

}

TextChart.propTypes = {
  widgetConfig: PropTypes.object.isRequired,
  toggleLoading: PropTypes.func // Will be called with the loading state
};

TextChart.defaultProps = {
  toggleLoading: () => {}
};

export default TextChart;
