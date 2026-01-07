import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Navigation from './Navigation';

describe('Navigation Component - User Story 5: Navigera mellan vyer', () => {
  beforeEach(() => {
    // Reset any state
  });

  it('ska kunna navigera till bokningsvyn', async () => {
    // Acceptanskriterier: Användaren ska kunna navigera från bokningsvyn till bekräftelsevyn när bokningen är klar
    const user = userEvent.setup();
    
    // Mock window.location för att testa navigation
    delete window.location;
    window.location = { pathname: '/confirmation' };

    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    // Öppna menyn först (klicka på ikonen)
    const navIcon = screen.getByRole('img');
    await user.click(navIcon);

    // Hitta och klicka på Booking-länken
    const bookingLink = screen.getByTestId('nav-booking');
    expect(bookingLink).toBeInTheDocument();
    
    await user.click(bookingLink);
    
    // Kontrollera att länken finns och är klickbar
    expect(bookingLink).toHaveTextContent('Booking');
  });

  it('ska kunna navigera till bekräftelsevyn', async () => {
    // Acceptanskriterier: Användaren ska kunna navigera från bokningsvyn till bekräftelsevyn när bokningen är klar
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

    // Öppna menyn först
    const navIcon = screen.getByRole('img');
    await user.click(navIcon);

    // Hitta och klicka på Confirmation-länken
    const confirmationLink = screen.getByTestId('nav-confirmation');
    expect(confirmationLink).toBeInTheDocument();
    
    await user.click(confirmationLink);
    
    // Kontrollera att länken finns och är klickbar
    expect(confirmationLink).toHaveTextContent('Confirmation');
  });
});
