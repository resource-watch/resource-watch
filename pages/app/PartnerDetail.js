import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getPartnerData, getDatasets } from 'redactions/partnerDetail';

// Next
import { Router } from 'routes';

// Components
import Banner from 'components/app/common/Banner';
import Page from 'layout/page';
import Layout from 'layout/layout/layout-app';
import Spinner from 'components/ui/Spinner';
import DatasetList from 'components/datasets/list';

// Utils
import { PARTNERS_CONNECTIONS } from 'utils/partners/partnersConnections';

class PartnerDetail extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    await context.store.dispatch(getPartnerData(props.url.query.id));

    return { props };
  }

  componentDidMount() {
    const datasetIds = PARTNERS_CONNECTIONS
      .filter(p => p.partnerId === this.props.url.query.id).map(elem => elem.datasetId);
    if (datasetIds.length > 0) {
      this.props.getDatasets(datasetIds);
    }
  }
  componentWillReceiveProps(newProps) {
    if (this.props.url.query.id !== newProps.url.query.id) {
      this.props.getPartnerData(newProps.url.query.id);
    }
  }

  static splitInTwoParts(str) {
    const strArray = str.split(' ');
    const midIndex = Math.floor(strArray.length / 2);
    return [
      strArray.slice(0, midIndex).join(' '),
      strArray.slice(midIndex + 1, strArray.length).join(' ')
    ];
  }

  handleTagSelected(tag) {
    Router.pushRoute('explore', { topics: `["${tag.id}"]` });
  }

  render() {
    const { data, datasets } = this.props;
    const { loading, list } = datasets;
    const logoPath = data['white-logo'] ? data['white-logo'].medium : '';
    const coverPath = data.cover && data.cover.cover;

    const logo = data.website !== '' ?
      (
        <a href={data.website} target="_blank" rel="noopener noreferrer">
          <img
            title={data.name}
            alt={data.name}
            className="logo"
            src={`${process.env.STATIC_SERVER_URL}${logoPath}`}
          />
        </a>) :
      (<img
        title={data.name}
        alt={data.name}
        className="logo"
        src={`${process.env.STATIC_SERVER_URL}${logoPath}`}
      />);

    const backgroundImage = { 'background-image': `url(${process.env.STATIC_SERVER_URL}${coverPath})` };

    return (
      <Layout
        title="Partner detail"
        description="Partner detail description"
        url={this.props.url}
        user={this.props.user}
      >
        <div className="c-page partner-detail">
          <Banner
            className="intro -text-center"
            styles={backgroundImage}
            useBackground={false}
          >
            <div className="row">
              <div className="column small-12 partner-header">
                <h4 className="title c-text -default -bold -uppercase">RESOURCE WATCH PARTNER</h4>
                <div className="logo-container">
                  {logo}
                </div>
                <div className="description">
                  <div className="row">
                    <div className="column small-12 medium-12">
                      <p className="c-text -extra-big">{data.summary}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Banner>
          <section className="l-section">
            <div className="l-container">
              <div className="row align-center">
                <div className="column small-12 medium-8">
                  <p>{data.body}</p>
                </div>
              </div>
              <div className="row align-center">
                <div className="column small-12 datasets-container">
                  <Spinner isLoading={loading} className="-light -relative" />
                  {list && list.length > 0 &&
                    <div>
                      <h3>{`Datasets by ${data.name}`}</h3>
                      <DatasetList
                        active={[]}
                        list={list}
                        mode="grid"
                        showActions={false}
                        onTagSelected={this.handleTagSelected}
                      />
                    </div>
                  }
                </div>
              </div>
            </div>
          </section>

          <div className="l-container learn-more">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center">
                  <p className="-claim">
                    Learn more about <br />
                    {data.name}
                  </p>
                  <a
                    className="c-btn -primary -alt"
                    href={data.website}
                    target="_blank"
                  >
                    Our work
                  </a>
                </Banner>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

PartnerDetail.propTypes = {
  url: PropTypes.object,
  data: PropTypes.object,
  getPartnerData: PropTypes.func
};

PartnerDetail.defaultProps = {
  data: {},
  datasets: []
};

const mapStateToProps = state => ({
  data: state.partnerDetail.data,
  datasets: state.partnerDetail.datasets
});

const mapDispatchToProps = {
  getPartnerData,
  getDatasets
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(PartnerDetail);
