// utils
import { logger } from 'utils/logs';
import { WRIAPI } from 'utils/axios';

export const takeWidgetWebshot = (
  widgetId: string,
  params: Record<string, string | number> = {},
): Promise<ImageBitmap> => {
  logger.info(`Taking webshot to widget ${widgetId}...`);

  return WRIAPI.post(
    `webshot/widget/${widgetId}/thumbnail`,
    {},
    {
      params,
    },
  )
    .then(({ data }) => data.data)
    .catch(({ response }) => {
      const { status, statusText } = response;

      if (status >= 300) {
        logger.error(`Error taking webshot to widget ${widgetId}:  ${statusText}`);
        throw new Error(`Error taking webshot to widget ${widgetId}:  ${statusText}`);
      }
    });
};
