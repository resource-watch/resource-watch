import React from 'react';
import { Link } from 'react-router';
import Banner from 'components/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';

const breadcrumbs = [
  {
    name: 'Get Involved',
    url: '/get-involved'
  }
];

class ContributeData extends React.Component {
  componentWillMount() {
    this.props.getStaticData('contribute-data', 'contributeData');
  }

  render() {
    const { data } = this.props;

    return (
      <div className="p-contribute-data">
        <div className="c-page">
          <section className="l-section -header">
            <div className="l-container">
              <Breadcrumbs items={breadcrumbs} />
              <header>
                <h1 className="c-text -header-big -thin">{data.title}</h1>
              </header>
            </div>
          </section>

          <section className="l-section -bg-grey">
            <div className="l-container">
              <header className="row">
                <div className="column small-12 medium-8">
                  <h1 className="c-text -header-big -primary -thin">{data.summary}</h1>
                </div>
              </header>
              <div className="row description">
                <div
                  className="cols column small-12"
                  dangerouslySetInnerHTML={{ __html: data.description }}
                />
              </div>
            </div>
          </section>

          <div className="row collapse">
            <div className="column small-12">
              <Banner className="partners">
                <h3 className="c-text -header-normal -normal">We have a massive opportunity<br />to build a sustainable society</h3>
                <button className="c-btn -primary -filled">
                  <Link to="/about/partners">Partners list</Link>
                </button>
              </Banner>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ContributeData.propTypes = {
  data: React.PropTypes.object,
  getStaticData: React.PropTypes.func
};

export default ContributeData;
