import React from 'react';

// Layout
import Page from 'components/admin/layout/Page';
import Tabs from 'components/ui/Tabs';

// Components
import Title from 'components/ui/Title';

// Contants
const DATA_TABS = [{
  label: 'Datasets',
  value: 'datasets',
  route: 'admin_data',
  params: { tab: 'datasets' }
}, {
  label: 'Widgets',
  value: 'widgets',
  route: 'admin_data',
  params: { tab: 'widgets' }
}, {
  label: 'Layers',
  value: 'layers',
  route: 'admin_data',
  params: { tab: 'layers' }
}, {
  label: 'Dashboards',
  value: 'dashboards',
  route: 'admin_data',
  params: { tab: 'dashboards' }
}, {
  label: 'Vocabularies',
  value: 'vocabularies',
  route: 'admin_data',
  params: { tab: 'vocabularies' }
}];

class Data extends React.Component {

  constructor(props) {
    super(props);

    const { url } = props;

    this.state = {
      tab: url.query.tab || 'datasets',
      subtab: url.query.subtab
    };
  }

  componentWillReceiveProps(nextProps) {
    const { url } = nextProps;

    this.setState({
      tab: url.query.tab || 'datasets',
      subtab: url.query.subtab
    });
  }

  render() {
    const { url } = this.props;
    const { tab, subtab } = this.state;

    return (
      <Page
        title="Data"
        description="Data description..."
        url={url}
      >
        {/* PAGE HEADER */}
        <div className="c-page-header -admin">
          <div className="l-container">
            <div className="page-header-content -padding-b-0">
              <Title className="-primary -huge page-header-title" >
                Data
              </Title>
              <Tabs
                options={DATA_TABS}
                defaultSelected={tab}
                selected={tab}
              />
            </div>
          </div>
        </div>
        <div className="row">
          {tab === 'datasets' &&
            <h2>Datasets</h2>
          }

          {tab === 'widgets' &&
            <h2>Widgets</h2>
          }

          {tab === 'layers' &&
            <h2>Layers</h2>
          }

          {tab === 'dashboards' &&
            <h2>Dashboards</h2>
          }

          {tab === 'vocabularies' &&
            <h2>Vocabularies</h2>
          }
        </div>
      </Page>
    );
  }
}

Data.propTypes = {
  url: React.PropTypes.object
};


export default Data;
