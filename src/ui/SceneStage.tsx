import { useState, type CSSProperties, type SyntheticEvent } from 'react';

interface SceneStageProps {
  src: string;
  alt: string;
}

/**
 * The scene panel beside or above a sheet. A blurred copy fills the frame while
 * the crisp copy is shown with `object-fit: contain`, so the whole artwork is
 * always visible — no crop, no small strip.
 *
 * `--art-ratio` is published once the artwork loads so the wide layout can size
 * the stage to the picture instead of leaving letterbox bands.
 */
export function SceneStage({ src, alt }: SceneStageProps) {
  const [ratio, setRatio] = useState<string>();

  const hideOnError = (imageEvent: SyntheticEvent<HTMLImageElement>) => {
    imageEvent.currentTarget.style.display = 'none';
  };

  const rememberRatio = (imageEvent: SyntheticEvent<HTMLImageElement>) => {
    const image = imageEvent.currentTarget;
    if (image.naturalWidth > 0 && image.naturalHeight > 0) {
      setRatio(`${image.naturalWidth} / ${image.naturalHeight}`);
    }
  };

  return (
    <div
      className="scene-stage"
      style={ratio ? ({ '--art-ratio': ratio } as CSSProperties) : undefined}
    >
      <img className="scene-stage-blur" src={src} alt="" aria-hidden="true" onError={hideOnError} />
      <img
        className="scene-stage-art"
        src={src}
        alt={alt}
        onLoad={rememberRatio}
        onError={hideOnError}
      />
    </div>
  );
}
