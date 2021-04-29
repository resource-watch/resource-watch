import PropTypes from 'prop-types';
import Link from 'next/link';

function PartnerBlock(props) {
  const partner = props.item;

  if (!partner) {
    return null;
  }

  const imgPath = partner.logo ? `${partner.logo.medium}` : '';

  return (
    <article className="c-partners-block">
      <div className="logo-container">
        <Link href={`/about/partners/${partner.slug}`}>
          <img src={imgPath} className="logo" title={partner.name} alt={partner.name} />
        </Link>
      </div>
      <p>{partner.summary}</p>
      <div className="buttons -align-center">
        <Link href={`/about/partners/${partner.slug}`}>
          <a className="c-btn -secondary">Read more</a>
        </Link>
      </div>
    </article>
  );
}

PartnerBlock.propTypes = {
  item: PropTypes.object,
};

export default PartnerBlock;
