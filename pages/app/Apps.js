import React from 'react';
import Banner from 'components/app/common/Banner';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import Page from 'components/app/layout/Page';

const breadcrumbs = [
  {
    name: 'Get Involved',
    route: 'get_involved'
  }
];

function Apps() {
  return (
    <Page
      title="Apps"
      description="Apps description"
      url={this.props.url}
    >
      <div className="p-apps">
        <div className="c-page">
          <section className="l-section -header -breadcrumbs">
            <div className="l-container">
              <Breadcrumbs items={breadcrumbs} />
              <header>
                <h1 className="c-text -header-big -thin">Apps</h1>
              </header>
            </div>
          </section>

          <section className="l-section -bg-grey">
            <div className="l-container">
              <header className="row collapse">
                <div className="column small-12 medium-8">
                  <h1 className="c-text -header-big -primary -thin">Lorem ipsum casius sociis natoque pentibus et magnis dis montes</h1>
                </div>
              </header>

              <div className="row collapse">
                <article className="column small-12 medium-6">
                  <p className="c-text -extra-big">Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros eget libero posuere vulputate. Etiam elit elit, elementum sed varius at, adipiscing vitae est. Sed nec felis pellentesque, lacinia dui sed, ultricies sapien. Pellentesque orci lectus, consectetur vel posuere posuere, rutrum eu ipsum. Aliquam</p>
                </article>
              </div>
            </div>
          </section>

          <div className="row collapse">
            <div className="column small-12">
              <Banner>
                <h3 className="c-text -header-normal -thin">Awesome ideas?<br />Develop your app</h3>
                <button className="c-btn -primary -filled">
                  Learn more
                </button>
              </Banner>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

Apps.propTypes = {
  appsList: React.PropTypes.array
};

Apps.defaultProps = {
  appsList: []
};

export default Apps;
