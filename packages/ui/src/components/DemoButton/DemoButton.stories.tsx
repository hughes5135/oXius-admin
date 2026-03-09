import type { Meta, StoryObj } from '@storybook/react';
import { DemoButton } from './index';

const meta: Meta<typeof DemoButton> = {
  title: 'Components/DemoButton',
  component: DemoButton,
  tags: ['autodocs'],
  argTypes: {
    demo: {
      control: 'boolean',
      description: '是否显示为演示样式（primary）',
    },
    type: {
      control: 'select',
      options: ['primary', 'default', 'dashed', 'link', 'text'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof DemoButton>;

export const Default: Story = {
  args: {
    children: '默认按钮',
  },
};

export const Demo: Story = {
  args: {
    demo: true,
    children: '演示按钮',
  },
};

export const Primary: Story = {
  args: {
    type: 'primary',
    children: '主要按钮',
  },
};
