import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { ColorField, Field, Range, TextInput } from '../src/react';
import { FIGMA } from './figma';

const meta = {
  title: 'Components/Forms',
  parameters: { docs: { description: { component: `Field: label (Mono 13), control, hint (14, muted), error (14, --danger). Gap 8. Text input: surface, 1px --line-strong border, radius 2, padding 8/12, placeholder --muted; \`aria-invalid="true"\` gives a doubled --danger border. Range: native, \`accent-color: --accent\`. Color field: native picker 40×40 in a --line-strong frame and the hex value in mono. Focus: 3px ring with 3px offset. Field connects label, hint and error with for/id and aria-describedby. [Figma](${FIGMA})` } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const TextField: Story = {
  name: 'Text input',
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: '24rem' }}>
      <Field label="Name"><TextInput placeholder="glow" /></Field>
      <Field label="Logo text" hint="Up to 24 characters."><TextInput defaultValue="bereg.dev" maxLength={24} /></Field>
      <Field label="Email" error="Enter an email like name@example.com."><TextInput type="email" defaultValue="name@" /></Field>
      <Field label="Disabled"><TextInput defaultValue="Read only" disabled /></Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText('Email');
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAccessibleDescription('Enter an email like name@example.com.');
    await expect(canvas.getByLabelText('Logo text')).toHaveAccessibleDescription('Up to 24 characters.');
    await userEvent.tab();
    await expect(canvas.getByLabelText('Name')).toHaveFocus();
  },
};

function RangeDemo() {
  const [value, setValue] = useState(60);
  return (
    <div style={{ maxWidth: '24rem' }}>
      <Field label={`Brightness: ${value}%`} hint="How much brighter than white the glow is.">
        <Range min={0} max={100} value={value} onChange={(e) => setValue(Number(e.target.value))} />
      </Field>
    </div>
  );
}
export const RangeStory: Story = { name: 'Range', render: () => <RangeDemo /> };

function ColorDemo() {
  const [color, setColor] = useState('#78c2ff');
  return <ColorField label="Glow color" value={color} onChange={setColor} hint="Any color; the project decides what to do with it." />;
}
export const ColorFieldStory: Story = {
  name: 'Color field',
  render: () => <ColorDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('Glow color')).toHaveAttribute('type', 'color');
    await expect(canvas.getByText('#78c2ff')).toBeInTheDocument();
  },
};

export const CssOnly: Story = {
  name: 'CSS only',
  parameters: { docs: { description: { story: 'The same markup without React.' } } },
  render: () => (
    <div className="field" style={{ maxWidth: '24rem' }}>
      <label className="field-label" htmlFor="css-url">Image URL</label>
      <input id="css-url" className="input" type="url" placeholder="https://" aria-invalid="true" aria-describedby="css-url-hint css-url-error" />
      <p className="field-hint" id="css-url-hint">PNG, JPG or SVG.</p>
      <p className="field-error" id="css-url-error">The link does not start with https://.</p>
    </div>
  ),
};
