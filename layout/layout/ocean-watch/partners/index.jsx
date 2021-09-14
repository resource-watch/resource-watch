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
import OceanWatchPartners from './component';

export default function OceanWatchPartnersContainer() {
  const {
    data: partners,
  } = usePublishedPartners({ env: process.env.NEXT_PUBLIC_ENVS_SHOW }, {
    select: (_partners) => sortBy(_partners.filter((_partner) => OCEAN_WATCH_EXCLUSIVE_PARTNER_TYPES.includes(_partner['partner-type'])), 'name'),
    placeholderData: [],
    refetchOnWindowFocus: false,
  });

  return (
    <OceanWatchPartners partners={partners} />
  );
}
