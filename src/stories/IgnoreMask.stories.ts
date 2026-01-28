import type { Meta, StoryObj } from '@storybook/react-vite';

import { IgnoreMask } from './IgnoreMask.js';

const meta = {
  title: 'Example/Ignore Mask',
  component: IgnoreMask,
  parameters: {
    qlip: {
      ignoreElements: ['.ignore-mask .ignore-mask__card--ignored'],
    },
  },
} satisfies Meta<typeof IgnoreMask>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
