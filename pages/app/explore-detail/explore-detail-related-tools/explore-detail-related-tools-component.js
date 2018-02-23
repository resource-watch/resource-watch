import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Components
import CardApp from 'components/app/common/CardApp';

// Constants
class ExploreDetailRelatedTools extends PureComponent {
  static propTypes = {
    tools: PropTypes.array
  }

  render() {
    const { tools } = this.props;

    return (
      <div className="c-explore-detail-related-tools">
        <div className="row">
          {tools.map(tool => (
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
          ))}
        </div>
      </div>
    );
  }
}

export default ExploreDetailRelatedTools;
