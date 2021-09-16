import {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Carousel = dynamic(() => import('../../../components/ui/Carousel'), { ssr: false });

export default function PartnersCarousel({
  partners,
}) {
  const renderPartners = useCallback(() => partners
    .map((_partner) => (
      <div
        key={_partner.id}
        className="item"
      >
        <Link
          href={`/about/partners/${_partner.id}`}
        >
          <a>
            <img
              className="-img"
              src={`${_partner.logo.thumb}`}
              alt={_partner.name}
            />
          </a>
        </Link>
      </div>
    )),
  [partners]);

  return (
    <Carousel items={renderPartners()} />
  );
}

PartnersCarousel.propTypes = {
  partners: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      logo: PropTypes.shape({
        thumb: PropTypes.string.isRequired,
      }).isRequired,
    }),
  ).isRequired,
};
