import { createSelector } from 'reselect';

const getPartners = state => state.partners.list;

const EXCLUSIVE_PARTNERS = ['founding_partners', 'funders', 'anchor_funder'];

export const getFilteredPartners = createSelector(
  [getPartners],
  _partners => ({
    founders: _partners.filter(p => p.partner_type === 'founding_partners'),
    funders: _partners.filter(p => p.partner_type === 'funders'),
    anchorFunders: _partners.filter(p => p.partner_type === 'anchor_funder'),
    partners: _partners.filter(p => !EXCLUSIVE_PARTNERS.includes(p.partner_type))
  })
);

export default { getFilteredPartners };
