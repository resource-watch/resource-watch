export function isStagingAPI() {
  if (!process.env.NEXT_PUBLIC_WRI_API_URL) throw new Error('NEXT_PUBLIC_WRI_API_URL not defined');

  return !!(process.env.NEXT_PUBLIC_WRI_API_URL.includes('staging-api.resourcewatch.org'));
}

export default {
  isStagingAPI,
};
