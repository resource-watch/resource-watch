import React from 'react';
import Banner from 'components/app/common/Banner';
import Page from 'components/app/layout/Page';
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getPartnerData } from 'redactions/partnerDetail';

class PartnerDetail extends React.Component {

  static async getInitialProps({ query }) {
    const partnerID = query.id;
    return { partnerID };
  }

  componentWillMount() {
    this.props.getPartnerData(this.props.partnerID);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.partnerID !== newProps.partnerID) {
      this.props.getPartnerData(newProps.partnerID);
    }
  }

  splitInTwoParts(str) {
    const strArray = str.split(' ');
    const midIndex = Math.floor(strArray.length / 2);
    return [
      strArray.slice(0, midIndex).join(' '),
      strArray.slice(midIndex + 1, strArray.length).join(' ')
    ];
  }

  render() {
    const { data } = this.props;
    const description = data.summary ? this.splitInTwoParts(data.summary) : ['', ''];
    const imgPath = data['white-logo'] ? data['white-logo'].medium : '';
    const logo = data.website !== '' ?
      (<a href={data.website} target="_blank" rel="noopener noreferrer">
        <img src={`${process.env.CMS_API_URL}${imgPath}`} className="logo" title={data.name} alt={data.name} />
      </a>) :
      <img src={`${process.env.CMS_API_URL}${imgPath}`} className="logo" title={data.name} alt={data.name} />;

    return (
      <Page
        title="Partner detail"
        description="Partner detail description"
        url={this.props.url}
      >
        <div className="c-page partner-detail">
          <Banner className="intro">
            <div className="row">
              <div className="column small-12">
                <h4 className="title c-text -default -bold -uppercase">RESOURCE WATCH PARTNER</h4>
                <div className="logo-container">
                  {logo}
                </div>
                <div className="description">
                  <div className="row">
                    <div className="column small-12 medium-6">
                      <p className="c-text -extra-big">{description[0]}</p>
                    </div>

                    <div className="column small-12 medium-6">
                      <p className="c-text -extra-big">{description[1]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Banner>

          <Banner className="learn-more">
            <div className="row">
              <div className="column small-12">
                <h3 className="c-text -header-big -thin">
                  Important work,<br /> beautifully crafted
                </h3>
                <button className="c-btn -primary -filled">
                  LEARN ABOUT OUR WORK
                </button>
              </div>
            </div>
          </Banner>
        </div>
      </Page>
    );
  }
}

PartnerDetail.propTypes = {
  partnerID: React.PropTypes.string,
  data: React.PropTypes.object,
  getPartnerData: React.PropTypes.func
};

PartnerDetail.defaultProps = {
  data: {}
};

const mapStateToProps = state => ({
  data: state.partnerDetail.data
});

const mapDispatchToProps = dispatch => ({
  getPartnerData: (id) => { dispatch(getPartnerData(id)); }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(PartnerDetail)
