import { render, screen } from '@testing-library/react';
import App from './App';

test('renders city input', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/enter city/i);
  expect(inputElement).toBeInTheDocument();
});
