import Link from 'next/link';
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
        <div className="row">
          <div className="column small-12">
            <Link prefetch href="/"><img src="/static/images/logo.png" /></Link>
          </div>
          <ul className="menu">
            <li><Link prefetch href="/"><a href="/dataset">Datasets</a></Link></li>
            <li><Link prefetch href="/"><a href="/partners">Partners</a></Link></li>
            <li><Link prefetch href="/"><a href="/page">Pages</a></Link></li>
            <li><Link prefetch href="/"><a href="/insights">Insights</a></Link></li>
            <li><Link prefetch href="/"><a href="/vocabularies">Vocabularies</a></Link></li>
            <li><Link prefetch href="/"><a href="/logout">Logout</a></Link></li>
          </ul>
        </div>
      </header>
    );
  }
}
