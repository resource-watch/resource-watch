import LayoutLandWatch from 'layout/layout/land-watch';
import Hero from 'layout/layout/land-watch/hero';
import Header from 'layout/header';

const description = `
Lorem ipsum dolor sit amet, consectetur adipisicing elit.
Ratione obcaecati facilis consequuntur sapiente consectetur
ea voluptates ipsa veniam necessitatibus dolores quasi ad maxime,
cum totam ex ut illo eius voluptatibus!
`;

const LandWatchLandingPage = () => (
  <LayoutLandWatch title="Land Watch – Introduction" description="Land Watch description">
    <Header />
    <Hero title="Land Watch" description={description} />

    {/* Content goes here */}
    <div
      className="l-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#cccccc',
        height: '800px',
        marginTop: '45px',
      }}
    >
      Max width content
    </div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#cccccc',
        height: '800px',
        marginTop: '45px',
      }}
    >
      Full width content
    </div>
  </LayoutLandWatch>
);

export default LandWatchLandingPage;

export async function getStaticProps() {
  // Selectively display Land Watch content
  if (process.env.NEXT_PUBLIC_FEATURE_FLAG_LAND_WATCH !== 'true') {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
}
