import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Dropzone } from '../src/react';
import { FIGMA } from './figma';

const meta = {
  title: 'Components/Dropzone',
  component: Dropzone,
  parameters: { docs: { description: { component: `A <label> around a visually hidden file input: click, Enter/Space and drag and drop reach the same input. Surface, 2px dashed --line-strong border, radius 2, padding 32/24. Hover: accent border. Drag: solid accent border and accent-subtle tint. Keyboard focus: 3px ring around the whole zone. \`onFiles(files)\` gets the files; checks (type, size) stay in the project. [Figma](${FIGMA})` } } },
  args: { title: 'Drop an image or choose a file', hint: 'PNG, JPG, SVG', accept: 'image/*', onFiles: () => {} },
} satisfies Meta<typeof Dropzone>;
export default meta;
type Story = StoryObj<typeof meta>;

function DropzoneDemo(props: Omit<Parameters<typeof Dropzone>[0], 'onFiles'>) {
  const [names, setNames] = useState<string[]>([]);
  return (
    <div style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: '32rem' }}>
      <Dropzone {...props} onFiles={(files) => setNames(files.map((f) => f.name))} />
      <p className="text-meta" role="status">{names.length ? `Chosen: ${names.join(', ')}` : 'No file yet'}</p>
    </div>
  );
}

export const Default: Story = { render: (args) => <DropzoneDemo {...args} /> };

export const KeyboardFocus: Story = {
  name: 'Keyboard focus',
  render: (args) => <DropzoneDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByLabelText(/Drop an image/)).toHaveFocus();
  },
};

export const States: Story = {
  name: 'States (CSS)',
  parameters: { docs: { description: { story: 'Default, drag (`data-drag`) and disabled (`data-disabled`), as plain markup.' } } },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: '32rem' }}>
      <label className="dropzone"><input type="file" className="visually-hidden" /><span className="dropzone-title">Default</span><span className="dropzone-hint">PNG, JPG</span></label>
      <label className="dropzone" data-drag=""><input type="file" className="visually-hidden" /><span className="dropzone-title">Drag over</span><span className="dropzone-hint">Release to add</span></label>
      <label className="dropzone" data-disabled=""><input type="file" className="visually-hidden" disabled /><span className="dropzone-title">Disabled</span></label>
    </div>
  ),
};
