import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

// components
import Banner from 'components/app/common/Banner';
import Layout from 'layout/layout/layout-app';
import DatasetList from 'components/datasets/list';

class LayoutPartnerDetail extends PureComponent {
  static propTypes = {
    partner: PropTypes.object,
    datasets: PropTypes.array,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    partner: {},
    datasets: [],
  };

  handleTagSelected(tag) {
    const {
      router,
    } = this.props;

    router.push('/data/explore', { topics: `["${tag.id}"]` });
  }

  render() {
    const {
      partner,
      datasets,
    } = this.props;
    const {
      name,
      summary,
      website,
      'white-logo': whiteLogo,
      cover,
      body,
    } = partner;
    const logoPath = whiteLogo ? whiteLogo.medium : '';
    const coverPath = cover && cover.cover;
    const logo = website !== '' ? (
      <a
        href={website}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          title={name}
          alt={name}
          className="logo"
          src={`${logoPath}`}
        />
      </a>
    )
      : (
        <img
          title={name}
          alt={name}
          className="logo"
          src={`${logoPath}`}
        />
      );
    const bannerStyles = { backgroundImage: `url(${coverPath})` };

    return (
      <Layout
        title="Partner detail"
        // TO-DO: fill description
        description="Partner detail description"
      >
        <div className="c-page partner-detail">
          <Banner
            className="intro -text-center"
            styles={bannerStyles}
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
                      {summary && (<p className="c-text -extra-big">{summary}</p>)}
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
                  <p>{body}</p>
                </div>
              </div>
              {!!datasets.length
                && (
                <div className="row align-center">
                  <div className="column small-12 datasets-container">
                    <div>
                      <h3>{`Datasets by ${name}`}</h3>
                      <DatasetList
                        active={[]}
                        list={datasets}
                        mode="grid"
                        showActions={false}
                        onTagSelected={this.handleTagSelected}
                      />
                    </div>
                  </div>
                </div>
                )}
            </div>
          </section>

          <div className="l-container learn-more">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center">
                  <p className="-claim">
                    Learn more about
                    {' '}
                    <br />
                    {name}
                  </p>
                  <a
                    className="c-button -primary -alt"
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
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

export default withRouter(LayoutPartnerDetail);
