import PropTypes from 'prop-types';
import Link from 'next/link';

export default function PartnerBlock({
  item,
  isExternal,
}) {
  const PartnerLogo = (
    <img
      src={item?.logo?.medium || ''}
      className="logo"
      title={item.name}
      alt={item.name}
    />
  );

  return (
    <article className="c-partners-block">
      <div className="logo-container">
        {isExternal && (
          <a href={item.website} target="_blank" rel="noopener noreferrer">
            {PartnerLogo}
          </a>
        )}
        {!isExternal && (
          <Link href={`/about/partners/${item.slug}`}>
            {PartnerLogo}
          </Link>
        )}
      </div>
      <p>{item.summary}</p>
      <div className="buttons -align-center">
        {isExternal && (
          <a
            href={item.website}
            target="_blank"
            rel="noopener noreferrer"
            className="c-btn -secondary"
          >
            Read more
          </a>
        )}
        {!isExternal && (
          <Link href={`/about/partners/${item.slug}`}>
            <a className="c-btn -secondary">Read more</a>
          </Link>
        )}
      </div>
    </article>
  );
}

PartnerBlock.defaultProps = {
  isExternal: false,
};

PartnerBlock.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    summary: PropTypes.string,
    logo: PropTypes.shape({
      medium: PropTypes.string,
    }),
    website: PropTypes.string,
  }).isRequired,
  isExternal: PropTypes.bool,
};
