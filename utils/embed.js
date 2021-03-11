export const isLoadedExternally = () => {
  if (typeof document === 'undefined' || document.referrer === '') return false;

  return !/localhost|(staging\.)?resourcewatch.org/.test(document.referrer);
};

export default { isLoadedExternally };
