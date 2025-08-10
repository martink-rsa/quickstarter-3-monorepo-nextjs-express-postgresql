import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies primary variant classes by default', () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('text-white');
  });

  it('applies secondary variant classes when specified', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-200');
    expect(button).toHaveClass('text-gray-900');
  });

  it('applies danger variant classes when specified', () => {
    render(<Button variant="danger">Danger Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600');
    expect(button).toHaveClass('text-white');
  });

  it('applies small size classes when specified', () => {
    render(<Button size="small">Small Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-3');
    expect(button).toHaveClass('py-1.5');
    expect(button).toHaveClass('text-sm');
  });

  it('applies medium size classes by default', () => {
    render(<Button>Medium Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');
    expect(button).toHaveClass('text-base');
  });

  it('applies large size classes when specified', () => {
    render(<Button size="large">Large Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6');
    expect(button).toHaveClass('py-3');
    expect(button).toHaveClass('text-lg');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button).toHaveClass('cursor-not-allowed');
    expect(button).toHaveClass('opacity-50');
  });

  it('does not trigger click when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('passes through additional HTML button props', () => {
    render(
      <Button type="submit" aria-label="Submit form" data-testid="submit-button">
        Submit
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
    expect(button).toHaveAttribute('data-testid', 'submit-button');
  });
});

describe('Button Snapshot Tests', () => {
  it('matches snapshot for primary button', () => {
    const { container } = render(<Button>Primary Button</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for secondary button', () => {
    const { container } = render(<Button variant="secondary">Secondary Button</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for danger button', () => {
    const { container } = render(<Button variant="danger">Danger Button</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for small button', () => {
    const { container } = render(<Button size="small">Small Button</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for large button', () => {
    const { container } = render(<Button size="large">Large Button</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for disabled button', () => {
    const { container } = render(<Button disabled>Disabled Button</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for button with all props', () => {
    const { container } = render(
      <Button variant="secondary" size="large" disabled className="custom-class">
        Complex Button
      </Button>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
