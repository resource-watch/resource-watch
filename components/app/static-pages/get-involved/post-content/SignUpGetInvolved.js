import React from 'react';
import { Link } from 'routes';

// Components
import CardApp from 'components/app/common/CardApp';
import Banner from 'components/app/common/Banner';

// Utils
import { logEvent } from 'utils/analytics';

function SignUpGetInvolved() {
  const cards = [
    {
      id: 'api-documentation',
      title: 'API documentation',
      description:
        'Pull data from Resource Watch into your application, and learn how the Resource Watch platform works.',
      link: {
        route: 'https://api.resourcewatch.org',
        label: 'Read the docs',
        external: true
      }
    },
    {
      id: 'fork-code',
      title: 'Fork our source code',
      description:
        'Build on our open source code for your next project, or contribute to the development of Resource Watch.',
      link: {
        route: 'https://github.com/resource-watch/',
        label: 'Visit our Github',
        external: true
      }
    },
    {
      id: 'submit-app',
      title: 'Submit an app',
      description:
        'Share your map or app with the Resource Watch community. Please review our app review guidelines before submission.',
      link: {
        route:
          'https://docs.google.com/forms/d/e/1FAIpQLSfZ79GW0jF7BL_-mUjHOgXEUN3U2p95FgiOp-_ZaqqwTfI7Gg/viewform?usp=sf_link',
        label: 'Submit your app',
        external: true
      }
    }
  ];

  return (
    <div>
      <aside className="l-postcontent">
        <p>hola</p>
      </aside>
    </div>
  );
}

SignUpGetInvolved.propTypes = {};

export default SignUpGetInvolved;
