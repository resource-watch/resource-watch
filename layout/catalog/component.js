/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

import { Router } from 'routes';

// Components
import Layout from 'layout/layout/layout-app';

class CatalogComponent extends React.Component {
  render() {
    return (
      <Layout
        title="Catalog"
        description=""
      >
        <div className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">
                  <h1>Catalog</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default CatalogComponent;
