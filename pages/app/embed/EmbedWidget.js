import React from 'react';

// Components
import Spinner from 'components/ui/Spinner';

// Services
import WidgetService from 'services/WidgetService';

export default class EmbedWidget extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      widget: null,
      loading: true
    };

    // WidgetService
    this.widgetService = new WidgetService(this.props.url.query.id, {
      apiURL: process.env.WRI_API_URL
    });
  }

  componentWillMount() {
    this.widgetService.fetchData().then((data) => {
      this.setState({
        loading: false,
        widget: data
      });
    });
  }

  render() {
    const { widget, loading } = this.state;
    console.log('widget', widget);

    return (
      <div className="c-embed-widget">
        <Spinner
          isLoading={loading}
          className="-light"
        />
      </div>
    );
  }
}
