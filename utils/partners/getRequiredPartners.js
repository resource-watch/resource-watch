export function getFeaturedPartners(list, featured) {
  return list.filter(p => p.attributes.featured === featured);
}
