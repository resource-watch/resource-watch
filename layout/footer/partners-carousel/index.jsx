import PropTypes from 'prop-types';
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

export default function PartnersCarouselContainer({
  isOceanWatch,
}) {
  const {
    data: partners,
  } = usePublishedPartners({ env: process.env.NEXT_PUBLIC_ENVS_SHOW }, {
    select: (_partners) => {
      let partnersList = [];

      if (isOceanWatch) {
        partnersList = _partners.filter((_partner) => OCEAN_WATCH_EXCLUSIVE_PARTNER_TYPES.includes(_partner['partner-type']));
      } else {
        partnersList = _partners.filter((_partner) => _partner.featured);
      }

      return sortBy(partnersList, 'name');
    },
    placeholderData: [],
    refetchOnWindowFocus: false,
  });

  return (
    <PartnersCarousel partners={partners} />
  );
}

PartnersCarouselContainer.defaultProps = {
  isOceanWatch: false,
};

PartnersCarouselContainer.propTypes = {
  isOceanWatch: PropTypes.bool,
};
