import { render, screen } from '@testing-library/react';
import Navbar from '../../components/Navbar';
import { withMockAuthProvider } from '../context/withMockAuthProvider';

describe('Navbar', () => {
  it('renders logo and navigation', () => {
    render(withMockAuthProvider(<Navbar />));
    expect(screen.getByText(/yourspace/i)).toBeInTheDocument();
  });
});
