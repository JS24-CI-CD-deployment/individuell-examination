import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Confirmation from './Confirmation';

describe('Confirmation Component - User Story 4: Visa bokningsnummer och totalsumma', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('ska visa bokningsnummer efter att bokningen är slutförd', () => {
    // Acceptanskriterier: Systemet ska generera ett bokningsnummer och visa detta till användaren efter att bokningen är slutförd
    const mockConfirmation = {
      bookingId: 'BK123456',
      when: '2024-12-25T18:00',
      people: 2,
      lanes: 1,
      shoes: ['42', '43'],
      price: 340,
    };

    sessionStorage.setItem('confirmation', JSON.stringify(mockConfirmation));

    render(
      <BrowserRouter>
        <Confirmation />
      </BrowserRouter>
    );

    const bookingNumberInput = screen.getByTestId('booking-number');
    expect(bookingNumberInput).toBeInTheDocument();
    expect(bookingNumberInput).toHaveValue('BK123456');
  });

  it('ska beräkna och visa den totala summan för bokningen', () => {
    // Acceptanskriterier: Systemet ska beräkna och visa den totala summan för bokningen baserat på antalet spelare (120 kr per person) samt antalet reserverade banor (100 kr per bana)
    const mockConfirmation = {
      bookingId: 'BK123456',
      when: '2024-12-25T18:00',
      people: 3,
      lanes: 2,
      shoes: ['42', '43', '44'],
      price: 560, // 3 * 120 + 2 * 100 = 560
    };

    sessionStorage.setItem('confirmation', JSON.stringify(mockConfirmation));

    render(
      <BrowserRouter>
        <Confirmation />
      </BrowserRouter>
    );

    const totalPrice = screen.getByTestId('total-price');
    expect(totalPrice).toBeInTheDocument();
    expect(totalPrice).toHaveTextContent('560 sek');
  });

  it('ska visa totalsumman tydligt på bekräftelsesidan', () => {
    // Acceptanskriterier: Den totala summan ska visas tydligt på bekräftelsesidan och inkludera en uppdelning mellan spelare och banor
    const mockConfirmation = {
      bookingId: 'BK123456',
      when: '2024-12-25T18:00',
      people: 2,
      lanes: 1,
      shoes: ['42', '43'],
      price: 340, // 2 * 120 + 1 * 100 = 340
    };

    sessionStorage.setItem('confirmation', JSON.stringify(mockConfirmation));

    render(
      <BrowserRouter>
        <Confirmation />
      </BrowserRouter>
    );

    const totalPrice = screen.getByTestId('total-price');
    expect(totalPrice).toBeInTheDocument();
    expect(totalPrice).toHaveTextContent('Total:');
    expect(totalPrice).toHaveTextContent('340 sek');
  });
});

describe('Confirmation Component - User Story 5: Navigera mellan boknings- och bekräftelsevyn', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('ska kunna navigera från bokningsvyn till bekräftelsevyn när bokningen är klar', () => {
    // Acceptanskriterier: Användaren ska kunna navigera från bokningsvyn till bekräftelsevyn när bokningen är klar
    // Detta testas genom att visa bekräftelsesidan med state från navigation
    const mockConfirmation = {
      bookingId: 'BK123456',
      when: '2024-12-25T18:00',
      people: 2,
      lanes: 1,
      shoes: ['42', '43'],
      price: 340,
    };

    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/confirmation',
            state: { confirmationDetails: mockConfirmation },
          },
        ]}
      >
        <Confirmation />
      </MemoryRouter>
    );

    // Kontrollera att bekräftelsesidan visas med korrekt data
    expect(screen.getByTestId('booking-number')).toHaveValue('BK123456');
    expect(screen.getByTestId('total-price')).toHaveTextContent('340 sek');
  });

  it('ska visa "Ingen bokning gjord" om användaren navigerar till bekräftelsevyn och ingen bokning är gjord eller finns i session storage', () => {
    // Acceptanskriterier: Om användaren navigerar till bekräftelsevyn och ingen bokning är gjord eller finns i session storage ska texten "Ingen bokning gjord visas"
    sessionStorage.clear();
    // Mock sessionStorage.getItem to return null explicitly
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={['/confirmation']}>
        <Confirmation />
      </MemoryRouter>
    );

    const noBookingMessage = screen.getByTestId('no-booking-message');
    expect(noBookingMessage).toBeInTheDocument();
    expect(noBookingMessage).toHaveTextContent('Inga bokning gjord!');
    
    vi.restoreAllMocks();
  });

  it('ska visa bokningen om användaren navigerar till bekräftelsevyn och det finns en bokning sparad i session storage', () => {
    // Acceptanskriterier: Om användaren navigerar till bekräftelsevyn och det finns en bokning sparad i session storage ska denna visas
    const mockConfirmation = {
      bookingId: 'BK789012',
      when: '2024-12-26T19:00',
      people: 4,
      lanes: 2,
      shoes: ['40', '41', '42', '43'],
      price: 680, // 4 * 120 + 2 * 100 = 680
    };

    sessionStorage.setItem('confirmation', JSON.stringify(mockConfirmation));

    render(
      <MemoryRouter initialEntries={['/confirmation']}>
        <Confirmation />
      </MemoryRouter>
    );

    // Kontrollera att bokningen visas
    expect(screen.getByTestId('booking-number')).toHaveValue('BK789012');
    expect(screen.getByTestId('total-price')).toHaveTextContent('680 sek');
    expect(screen.queryByTestId('no-booking-message')).not.toBeInTheDocument();
  });

  it('ska visa korrekt datum och tid i bekräftelsen', () => {
    const mockConfirmation = {
      bookingId: 'BK123456',
      when: '2024-12-25T18:00',
      people: 2,
      lanes: 1,
      shoes: ['42', '43'],
      price: 340,
    };

    sessionStorage.setItem('confirmation', JSON.stringify(mockConfirmation));

    render(
      <BrowserRouter>
        <Confirmation />
      </BrowserRouter>
    );

    // Kontrollera att datum och tid visas korrekt (T ska ersättas med mellanslag)
    // Input-komponenten använder inte htmlFor, så vi använder getByRole istället
    const whenInputs = screen.getAllByRole('textbox');
    const whenInput = whenInputs.find(input => input.value.includes('2024-12-25'));
    expect(whenInput).toHaveValue('2024-12-25 18:00');
  });

  it('ska visa korrekt antal personer och banor i bekräftelsen', () => {
    const mockConfirmation = {
      bookingId: 'BK123456',
      when: '2024-12-25T18:00',
      people: 3,
      lanes: 2,
      shoes: ['42', '43', '44'],
      price: 560,
    };

    sessionStorage.setItem('confirmation', JSON.stringify(mockConfirmation));

    render(
      <BrowserRouter>
        <Confirmation />
      </BrowserRouter>
    );

    // Input-komponenten använder inte htmlFor, så vi använder getByRole istället
    const textInputs = screen.getAllByRole('textbox');
    const whoInput = textInputs.find(input => input.value === '3');
    const lanesInput = textInputs.find(input => input.value === '2');

    expect(whoInput).toHaveValue('3');
    expect(lanesInput).toHaveValue('2');
  });
});
