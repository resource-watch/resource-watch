import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Next
import { Link } from 'routes';

// Components
import Spinner from 'components/ui/Spinner';

// Constants
class ExploreDetailTags extends PureComponent {
  static propTypes = {
    tags: PropTypes.object
  }

  getRouteParams(tag) {
    const { id, labels } = tag;

    let treeSt = 'topics';
    if (labels.includes('TOPIC')) {
      treeSt = 'topics';
    } else if (labels.includes('GEOGRAPHY')) {
      treeSt = 'geographies';
    } else if (labels.includes('DATA_TYPE')) {
      treeSt = 'dataTypes';
    }

    return { [treeSt]: `["${id}"]` };
  }

  render() {
    const { tags } = this.props;

    return (
      <div className="c-explore-detail-tags">
        {tags.loading && <Spinner isLoading className="-light" />}
        {tags.list.map(tag => (
          <Link
            route="explore"
            params={this.getRouteParams(tag)}
            key={tag.id}
          >
            <a className="c-button -secondary -compressed">
              {tag.label}
            </a>
          </Link>
        ))}
      </div>
    );
  }
}

export default ExploreDetailTags;
