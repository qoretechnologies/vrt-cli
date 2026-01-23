import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import { AnimatedBox } from './AnimatedBox.js';

const meta = {
  title: 'Example/Capture on Test Failure',
  component: AnimatedBox,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AnimatedBox>;

export default meta;
type Story = StoryObj<typeof meta>;
type StoryContext = Parameters<NonNullable<Story['play']>>[0];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const CaptureOnTestFailure: Story = {
  parameters: {
    qlip: {
      captureOnError: true,
    },
  },
  play: async (ctx: StoryContext) => {
    const canvas = within(ctx.canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: /missingButton/i }),
    );

    await wait(350);

    await userEvent.click(canvas.getByRole('button', { name: /toggle/i }));
  },
};
