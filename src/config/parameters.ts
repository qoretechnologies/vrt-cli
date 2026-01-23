import { QlipParameters, QlipResolvedDefaults, QlipScreenshotOptions } from '../types.js';

export interface QlipResolvedOptions {
  skip: boolean;
  viewport: { width: number; height: number };
  disableAnimations: boolean;
  pauseAnimationsAtEnd: boolean;
  waitForIdleMs: number;
  maxWaitForIdleMs: number;
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
    disableAnimations:
      override?.disableAnimations ??
      story?.disableAnimations ??
      defaults.disableAnimations,
    pauseAnimationsAtEnd:
      override?.pauseAnimationsAtEnd ??
      story?.pauseAnimationsAtEnd ??
      defaults.pauseAnimationsAtEnd,
    waitForIdleMs:
      override?.waitForIdleMs ??
      story?.waitForIdleMs ??
      defaults.waitForIdleMs,
    maxWaitForIdleMs:
      override?.maxWaitForIdleMs ??
      story?.maxWaitForIdleMs ??
      defaults.maxWaitForIdleMs,
  };
};
