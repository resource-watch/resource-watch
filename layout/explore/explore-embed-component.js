/* eslint max-len: 0 */
import React from 'react';

// Components
import Layout from 'layout/layout/layout-embed';

import ExploreMap from 'layout/explore/explore-map';

class Explore extends React.Component {
  render() {
    return (
      <Layout
        title="Explore"
        description="Explore description"
        className="-fullscreen"
        category="Dataset"
      >
        <div className="c-embed-widget">
          {/* Desktop map */}
          <ExploreMap embed />
        </div>
      </Layout>
    );
  }
}

export default Explore;
