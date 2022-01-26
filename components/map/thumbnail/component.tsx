import { APILayerSpec } from 'types/layer';

export interface MapThumbnailProps {
  layer: APILayerSpec;
}

export const MapThumbnail = ({ layer }: MapThumbnailProps): JSX.Element => {
  return (
    <div
      className="relative w-full h-full bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: `url(${
          layer?.thumbnailUrl || '/static/images/placeholder-layer-thumbnail.png'
        })`,
      }}
    ></div>
  );
};

export default MapThumbnail;
