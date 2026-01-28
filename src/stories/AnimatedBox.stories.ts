import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import { AnimatedBox } from './AnimatedBox.js';

const meta = {
  title: 'Example/ShouldFinishFullyAnimated',
  component: AnimatedBox,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AnimatedBox>;

export default meta;
type Story = StoryObj<typeof meta>;
type StoryContext = Parameters<NonNullable<Story['play']>>[0];

export const ShouldFinishFullyAnimated: Story = {
  parameters: {
    qlip: {
      disableAnimations: true,
    },
  },
  play: async (ctx: StoryContext) => {
    const canvas = within(ctx.canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /toggle/i }));
  },
};
