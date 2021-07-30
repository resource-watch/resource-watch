import AppLayout from 'layout/layout/layout-app';

import PropTypes from 'prop-types';
import AzaveaSampleViz from 'components/azavea/sampleViz';

// Most other Layouts in this project seem to be thin wrappers for wiring up props (e.g. for
// authentication info), and the actual JSX is inside a separate component.  Currently this Layout
// doesn't rely on any external information, so there are no props to wire up, and our style tends
// to keep wiring and the actual component together in the same file anyway, so I've leaned toward
// Azavea style rather than project style in this case.
export default function AzaveaTestLayout({ children }) {
  return (
    <AppLayout
      title="Test Page"
      description="A simple test page to help understand how this project works"
    >
      {/* This might be good to pull out into a separate component when we do this "for real"; it
      seems to be repeated with minor variations in several places. */}
      <header className="l-page-header">
        <div className="l-container">
          <div className="row">
            <div className="column small-12">
              <div className="page-header-content">
                <h1>Azavea Test Page</h1>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section className="l-section -secondary">
        {/* <iframe src="https://resourcewatch.org/embed/widget/81bd8d06-07f3-4a6f-8a4f-ba680850947d" width="100%" height="500px" frameBorder="0" /> */}
        <AzaveaSampleViz />
        <p>
          This is a test page. It was created using a single Page, a single Layout, and no other
          components.
        </p>
        <p>If there is other content nested inside this layout, it will show up here:</p>
        {children}
        <p>And this will show up after any child content.</p>
      </section>
    </AppLayout>
  );
}

// There are linting rules that enforce the presence of this.
AzaveaTestLayout.propTypes = { children: PropTypes.node.isRequired };
