import {
  useCallback,
} from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import sortBy from 'lodash/sortBy';

// hooks
import {
  usePublishedPartners,
} from 'hooks/partners';

const Carousel = dynamic(() => import('../../../components/ui/Carousel'), { ssr: false });

export default function PartnersCarousel() {
  const {
    data: partners,
  } = usePublishedPartners({}, {
    select: (_partners) => sortBy(
      _partners.filter((_partner) => _partner.featured), 'name',
    ),
    placeholderData: [],
    refetchOnWindowFocus: false,
  });

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
