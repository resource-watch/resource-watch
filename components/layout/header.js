import { Link } from '../../routes';
import React from 'react';

export default class Header extends React.Component {

  static propTypes() {
    return {
      session: React.PropTypes.object.isRequired
    };
  }

  render() {
    return (
      <header className="l-header c-header">
        <div className="row collapse">
          <div className="column">
            <Link prefetch href="/"><img src="/static/images/logo.png" /></Link>
          </div>
          <ul className="menu">
            <li><Link prefetch route="datasets"><a>Datasets</a></Link></li>
            <li><Link prefetch route="partners"><a>Partners</a></Link></li>
            <li><Link prefetch route="pages"><a>Pages</a></Link></li>
            <li><Link prefetch route="insights"><a>Insights</a></Link></li>
            <li><Link prefetch route="vocabularies"><a>Vocabularies</a></Link></li>
            <li><Link prefetch route="logout"><a>Logout</a></Link></li>
          </ul>
        </div>
      </header>
    );
  }
}
