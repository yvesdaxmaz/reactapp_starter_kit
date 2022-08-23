import { render, screen } from '@testing-library/react';
import Header from './Header';

test('render Mern skeleton logo', () => {
  render(<Header />);
  const logoLink = screen.getByRole('logo');
  expect(logoLink).toBeInTheDocument();
});
