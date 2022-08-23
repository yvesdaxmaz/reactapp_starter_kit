import { render, screen } from '@testing-library/react';
import Home from './Home';

test('render a card with title and image', () => {
  render(<Home />);
  const pageTitle = screen.getByText('Home Page');
    const mernSkeletonImg = screen.getByAltText('Mern skeleton bike');
  expect(pageTitle).toBeInTheDocument();
  expect(mernSkeletonImg).toBeInTheDocument();

});
