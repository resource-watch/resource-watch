export const isLoadedExternally = (referer) => !/localhost|(staging\.)?resourcewatch.org/.test(referer);

export default { isLoadedExternally };
