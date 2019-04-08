import { createSelector } from 'reselect';

// states
const getPartners = state => state.partners.published.list;

const EXCLUSIVE_PARTNERS = ['founding_partners', 'funders', 'anchor_funder'];

export const getFilteredPartners = createSelector(
  [getPartners],
  _partners => ({
    founders: _partners.filter(_partner => _partner['partner-type'] === 'founding_partners'),
    funders: _partners.filter(_partner => _partner['partner-type'] === 'funders'),
    anchorFunders: _partners.filter(_partner => _partner['partner-type'] === 'anchor_funder'),
    partners: _partners.filter(_partner => !EXCLUSIVE_PARTNERS.includes(_partner['partner-type']))
  })
);

export default { getFilteredPartners };
