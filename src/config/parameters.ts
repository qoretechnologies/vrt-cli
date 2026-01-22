import { QlipParameters, QlipResolvedDefaults, QlipScreenshotOptions } from '../types.js';

export interface QlipResolvedOptions {
  skip: boolean;
  viewport: { width: number; height: number };
}

export const resolveQlipOptions = ({
  defaults,
  story,
  override,
}: {
  defaults: QlipResolvedDefaults;
  story?: QlipParameters;
  override?: QlipScreenshotOptions;
}): QlipResolvedOptions => {
  return {
    skip: override?.skip ?? story?.skip ?? defaults.skip,
    viewport: override?.viewport ?? story?.viewport ?? defaults.viewport,
  };
};
