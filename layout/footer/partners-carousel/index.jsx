import sortBy from 'lodash/sortBy';

// hooks
import {
  usePublishedPartners,
} from 'hooks/partners';

// constants
import {
  OCEAN_WATCH_EXCLUSIVE_PARTNER_TYPES,
} from 'constants/ocean-watch';

// components
import PartnersCarousel from './component';

export default function PartnersCarouselContainer() {
  const {
    data: partners,
  } = usePublishedPartners({}, {
    select: (_partners) => sortBy(_partners.filter((_partner) => !OCEAN_WATCH_EXCLUSIVE_PARTNER_TYPES.includes(_partner['partner-type']) && _partner.featured), 'name'),
    placeholderData: [],
    refetchOnWindowFocus: false,
  });

  return (
    <PartnersCarousel partners={partners} />
  );
}
