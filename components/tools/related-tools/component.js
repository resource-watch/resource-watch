import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import CardApp from 'components/app/common/CardApp';
import Spinner from 'components/ui/Spinner';

// Constants
class RelatedTools extends PureComponent {
  static propTypes = {
    list: PropTypes.array,
    active: PropTypes.array,
    loading: PropTypes.bool,

    fetchTools: PropTypes.func
  }

  componentDidMount() {
    this.props.fetchTools();
  }

  render() {
    const { list, active, loading } = this.props;

    return (
      <div className="c-related-tools">
        <Spinner isLoading={loading} className="-light" />

        {!loading && !active.length &&
          <p>No data available</p>
        }

        <div className="row">
          {list
            .filter(t => active.includes(t.slug))
            .map(tool => (
              <div key={tool.id} className="column small-12 medium-6 large-4 c-card-column">
                <CardApp
                  background={tool.thumbnail.original}
                  title={tool.title}
                  description={tool.summary}
                  link={{
                    label: 'Go to site',
                    route: tool.url,
                    external: true
                  }}
                />
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default RelatedTools;
