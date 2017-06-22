import React from 'react';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getPartners } from 'redactions/partners';

// Components
import Page from 'components/app/layout/Page';
import Title from 'components/ui/Title';
import PartnerBlock from 'components/app/common/Partners/PartnerBlock';
import Banner from 'components/app/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';


class Partners extends React.Component {
  componentWillMount() {
    this.props.getPartners();
  }

  render() {
    const founders = this.props.list.filter(p => p.attributes['partner-type'] === 'founding_partners');
    const funders = this.props.list.filter(p => p.attributes['partner-type'] === 'funders');

    return (
      <Page
        title="Partners"
        description="Partners description"
      >
        <div className="c-page-header">
          <div className="l-container">
            <div className="page-header-content">
              <Breadcrumbs
                items={[{ name: 'About', url: 'about' }]}
              />

              <Title className="-primary -huge page-header-title" >
                Partners
              </Title>
            </div>
          </div>
        </div>

        <div className="p-partners">
          <div className="c-page">

            <section className="l-section -bg-grey">
              <div className="l-container">
                <header className="row">
                  <div className="column small-12 medium-8">
                    <h1 className="c-text -header-big -primary -thin">
                      We have a massive opportunity to build a sustainable society
                    </h1>
                  </div>
                </header>

                <div className="row">
                  <article className="column small-12 medium-6">
                    <p className="c-text -extra-big">
                      Mauris non tempor quam, et lacinia sapien. Mauris accumsan
                       eros eget libero posuere vulputate. Etiam elit elit, elementum
                       sed varius at, adipiscing vitae est. Sed nec felis pellentesque,
                       lacinia dui sed, ultricies sapien. Pellentesque orci lectus,
                       consectetur vel posuere posuere, rutrum eu ipsum. Aliquam
                    </p>
                  </article>
                  <article className="column small-12 medium-6">
                    <p className="c-text -extra-big">
                      eget odio sed ligula iaculis consequat at eget orci. Mauris
                       molestie sit amet metus mattis varius.  Mauris non tempor quam,
                       et lacinia sapien. Mauris accumsan eros eget libero posuere vulputate.
                       Etiam elit elit, elementum sed varius at, adipiscing vitae est.
                       Sed nec felis pellentesque.
                     </p>
                  </article>
                </div>
              </div>
            </section>

            <section className="l-section -partners -first">
              <div className="l-container">
                <div className="row">
                  <div className="column small-12">
                    <h2 className="title c-text -huger -primary -thin">Founding partners</h2>
                  </div>
                </div>
                <div className="row">
                  {founders.map((p, i) => <PartnerBlock key={i} item={p} />)}
                </div>
              </div>
            </section>

            <section className="l-section -partners">
              <div className="l-container">
                <div className="row">
                  <div className="column small-12">
                    <h2 className="title c-text -huger -primary -thin">Funders</h2>
                  </div>
                </div>
                <div className="row">
                  {funders.map((p, i) => <PartnerBlock key={i} item={p} />)}
                </div>
              </div>
            </section>

            <div className="row">
              <div className="column small-12">
                <Banner>
                  <h3 className="c-text -header-normal -normal">
                    See yourself as part<br /> of this team?
                  </h3>
                  <button className="c-btn -primary -filled">
                    Get in touch
                  </button>
                </Banner>
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

Partners.propTypes = {
  list: React.PropTypes.array.isRequired,
  getPartners: React.PropTypes.func
};

Partners.defaultProps = {
  list: []
};

const mapStateToProps = state => ({
  list: state.partners.list
});

const mapDispatchToProps = dispatch => ({
  getPartners: () => { dispatch(getPartners()); }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Partners)
