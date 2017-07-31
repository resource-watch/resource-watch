import React from 'react';
import { Link } from 'routes';

function PartnerBlock(props) {
  const partner = props.item.attributes;
  const imgPath = `${process.env.API_URL}/../${partner.logo.medium}`;

  return (
    <article className="c-partners-block column small-12 medium-6">
      <div className="logo-container">
        <Link
          route={'partner'}
          params={{ id: props.item.id }}
        >
          <img src={imgPath} className="logo" title={partner.name} alt={partner.name} />
        </Link>
      </div>
      <p className="description c-text -extra-big">{partner.summary}</p>
      <Link
        route={'partner'}
        params={{ id: props.item.id }}
      >
        <a className="action c-btn -transparent -primary -extra-big">Read more</a>
      </Link>
    </article>
  );
}

PartnerBlock.propTypes = {
  item: React.PropTypes.object
};

export default PartnerBlock;
