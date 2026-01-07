import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Booking from './Booking';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper function to render Booking with router
const renderBooking = () => {
  return render(
    <BrowserRouter>
      <Booking />
    </BrowserRouter>
  );
};

describe('Booking Component - User Story 1: Boka datum, tid och antal spelare', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('ska kunna välja ett datum från kalendervalssystem', async () => {
    // Acceptanskriterier: Användaren ska kunna välja ett datum och en tid från ett kalender- och tidvalssystem
    const user = userEvent.setup();
    renderBooking();

    const dateInput = screen.getByTestId('when');
    expect(dateInput).toBeInTheDocument();
    expect(dateInput).toHaveAttribute('type', 'date');

    await user.type(dateInput, '2024-12-25');
    expect(dateInput).toHaveValue('2024-12-25');
  });

  it('ska kunna välja en tid från tidvalssystem', async () => {
    // Acceptanskriterier: Användaren ska kunna välja ett datum och en tid från ett kalender- och tidvalssystem
    const user = userEvent.setup();
    renderBooking();

    const timeInput = screen.getByTestId('time');
    expect(timeInput).toBeInTheDocument();
    expect(timeInput).toHaveAttribute('type', 'time');

    await user.type(timeInput, '18:00');
    expect(timeInput).toHaveValue('18:00');
  });

  it('ska kunna ange antal spelare (minst 1 spelare)', async () => {
    // Acceptanskriterier: Användaren ska kunna ange antal spelare (minst 1 spelare)
    const user = userEvent.setup();
    renderBooking();

    const peopleInput = screen.getByTestId('people');
    expect(peopleInput).toBeInTheDocument();
    expect(peopleInput).toHaveAttribute('type', 'number');

    await user.type(peopleInput, '3');
    expect(peopleInput).toHaveValue(3);
  });

  it('ska kunna reservera ett eller flera banor beroende på antal spelare', async () => {
    // Acceptanskriterier: Användaren ska kunna reservera ett eller flera banor beroende på antal spelare
    const user = userEvent.setup();
    renderBooking();

    const lanesInput = screen.getByTestId('lanes');
    expect(lanesInput).toBeInTheDocument();
    expect(lanesInput).toHaveAttribute('type', 'number');

    await user.type(lanesInput, '2');
    expect(lanesInput).toHaveValue(2);
  });
});

describe('Booking Component - User Story 2: Välja skostorlek för varje spelare', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('ska kunna lägga till skostorleksfält för spelare', async () => {
    // Acceptanskriterier: Användaren ska kunna ange skostorlek för varje spelare
    const user = userEvent.setup();
    renderBooking();

    const addShoeButton = screen.getByTestId('add-shoe-button');
    expect(addShoeButton).toBeInTheDocument();

    await user.click(addShoeButton);
    // Skostorleksfält har dynamiska ID:n, använd getAllByRole för att hitta dem
    const shoeInputs = screen.getAllByRole('textbox');
    const shoeInput = shoeInputs.find(input => input.getAttribute('maxlength') === '2');
    expect(shoeInput).toBeInTheDocument();
  });

  it('ska kunna ange skostorlek för varje spelare', async () => {
    // Acceptanskriterier: Användaren ska kunna ange skostorlek för varje spelare
    const user = userEvent.setup();
    renderBooking();

    // Lägg till en sko
    const addShoeButton = screen.getByTestId('add-shoe-button');
    await user.click(addShoeButton);

    // Ange skostorlek - hitta första skostorleksfältet
    const shoeInputs = screen.getAllByRole('textbox');
    const shoeInput = shoeInputs.find(input => input.getAttribute('maxlength') === '2');
    await user.type(shoeInput, '42');
    expect(shoeInput).toHaveValue('42');
  });

  it('ska kunna ändra skostorlek för varje spelare', async () => {
    // Acceptanskriterier: Användaren ska kunna ändra skostorlek för varje spelare
    const user = userEvent.setup();
    renderBooking();

    // Lägg till en sko och ange storlek
    const addShoeButton = screen.getByTestId('add-shoe-button');
    await user.click(addShoeButton);

    const shoeInputs = screen.getAllByRole('textbox');
    const shoeInput = shoeInputs.find(input => input.getAttribute('maxlength') === '2');
    await user.type(shoeInput, '42');
    expect(shoeInput).toHaveValue('42');

    // Ändra storleken
    await user.clear(shoeInput);
    await user.type(shoeInput, '43');
    expect(shoeInput).toHaveValue('43');
  });

  it('ska vara möjligt att välja skostorlek för alla spelare som ingår i bokningen', async () => {
    // Acceptanskriterier: Det ska vara möjligt att välja skostorlek för alla spelare som ingår i bokningen
    const user = userEvent.setup();
    renderBooking();

    // Lägg till 3 skor
    const addShoeButton = screen.getByTestId('add-shoe-button');
    await user.click(addShoeButton);
    await user.click(addShoeButton);
    await user.click(addShoeButton);

    // Kontrollera att alla 3 skostorleksfält finns
    const shoeInputs = screen.getAllByRole('textbox').filter(input => input.getAttribute('maxlength') === '2');
    expect(shoeInputs.length).toBe(3);

    // Ange skostorlekar för alla
    await user.type(shoeInputs[0], '42');
    await user.type(shoeInputs[1], '43');
    await user.type(shoeInputs[2], '44');

    expect(shoeInputs[0]).toHaveValue('42');
    expect(shoeInputs[1]).toHaveValue('43');
    expect(shoeInputs[2]).toHaveValue('44');
  });
});

describe('Booking Component - User Story 3: Ta bort skostorleksfält', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('ska kunna ta bort ett tidigare valt fält för skostorlek genom att klicka på "-"-knapp', async () => {
    // Acceptanskriterier: Användaren ska kunna ta bort ett tidigare valt fält för skostorlek genom att klicka på en "-"-knapp vid varje spelare
    const user = userEvent.setup();
    renderBooking();

    // Lägg till två skor
    const addShoeButton = screen.getByTestId('add-shoe-button');
    await user.click(addShoeButton);
    await user.click(addShoeButton);

    // Kontrollera att båda finns
    const shoeInputs = screen.getAllByRole('textbox').filter(input => input.getAttribute('maxlength') === '2');
    expect(shoeInputs.length).toBe(2);

    // Hitta remove-knapparna (de har dynamiska testIds baserat på shoe.id)
    const removeButtons = screen.getAllByText('-');
    expect(removeButtons.length).toBeGreaterThan(0);

    // Klicka på första remove-knappen
    await user.click(removeButtons[0]);

    // Kontrollera att en sko är borttagen
    await waitFor(() => {
      const remainingShoes = screen.getAllByRole('textbox').filter(input => input.getAttribute('maxlength') === '2');
      expect(remainingShoes.length).toBe(1);
    });
  });

  it('ska uppdatera bokningen när skostorlek tas bort så att inga skor längre är bokade för den spelaren', async () => {
    // Acceptanskriterier: När användaren tar bort skostorleken för en spelare ska systemet uppdatera bokningen så att inga skor längre är bokade för den spelaren
    const user = userEvent.setup();
    renderBooking();

    // Lägg till två skor med storlekar
    const addShoeButton = screen.getByTestId('add-shoe-button');
    await user.click(addShoeButton);
    await user.click(addShoeButton);

    const shoeInputs = screen.getAllByRole('textbox').filter(input => input.getAttribute('maxlength') === '2');
    await user.type(shoeInputs[0], '42');
    await user.type(shoeInputs[1], '43');

    // Ta bort första skon
    const removeButtons = screen.getAllByText('-');
    await user.click(removeButtons[0]);

    // Kontrollera att bara en sko finns kvar
    await waitFor(() => {
      const remainingShoes = screen.getAllByRole('textbox').filter(input => input.getAttribute('maxlength') === '2');
      expect(remainingShoes.length).toBe(1);
    });
  });
});

describe('Booking Component - User Story 4: Slutföra bokning med bokningsnummer och totalsumma', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('ska kunna slutföra bokningen genom att klicka på "slutför bokning"-knapp', async () => {
    // Acceptanskriterier: Användaren ska kunna slutföra bokningen genom att klicka på en "slutför bokning"-knapp
    const user = userEvent.setup();
    renderBooking();

    // Fyll i alla fält
    const dateInput = screen.getByTestId('when');
    const timeInput = screen.getByTestId('time');
    const peopleInput = screen.getByTestId('people');
    const lanesInput = screen.getByTestId('lanes');

    await user.type(dateInput, '2024-12-25');
    await user.type(timeInput, '18:00');
    await user.type(peopleInput, '2');
    await user.type(lanesInput, '1');

    // Lägg till skor
    const addShoeButton = screen.getByTestId('add-shoe-button');
    await user.click(addShoeButton);
    await user.click(addShoeButton);

    const shoeInputs = screen.getAllByRole('textbox').filter(input => input.getAttribute('maxlength') === '2');
    const shoeInput1 = shoeInputs[0];
    const shoeInput2 = shoeInputs[1];
    await user.type(shoeInput1, '42');
    await user.type(shoeInput2, '43');

    // Klicka på slutför bokning
    const completeButton = screen.getByTestId('complete-booking-button');
    await user.click(completeButton);

    // Vänta på att navigation ska ske
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/confirmation', expect.any(Object));
    });
  });

  it('ska generera ett bokningsnummer och visa detta till användaren efter att bokningen är slutförd', async () => {
    // Acceptanskriterier: Systemet ska generera ett bokningsnummer och visa detta till användaren efter att bokningen är slutförd
    const user = userEvent.setup();
    renderBooking();

    // Fyll i alla fält
    const dateInput = screen.getByTestId('when');
    const timeInput = screen.getByTestId('time');
    const peopleInput = screen.getByTestId('people');
    const lanesInput = screen.getByTestId('lanes');

    await user.type(dateInput, '2024-12-25');
    await user.type(timeInput, '18:00');
    await user.type(peopleInput, '2');
    await user.type(lanesInput, '1');

    // Lägg till skor
    const addShoeButton = screen.getByTestId('add-shoe-button');
    await user.click(addShoeButton);
    await user.click(addShoeButton);

    const shoeInputs = screen.getAllByRole('textbox').filter(input => input.getAttribute('maxlength') === '2');
    const shoeInput1 = shoeInputs[0];
    const shoeInput2 = shoeInputs[1];
    await user.type(shoeInput1, '42');
    await user.type(shoeInput2, '43');

    // Klicka på slutför bokning
    const completeButton = screen.getByTestId('complete-booking-button');
    await user.click(completeButton);

    // Vänta på att navigation ska ske och kontrollera att bokningsnummer finns i sessionStorage
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
      const confirmation = JSON.parse(sessionStorage.getItem('confirmation'));
      expect(confirmation).toBeTruthy();
      expect(confirmation.bookingId).toBeTruthy();
    });
  });

  it('ska beräkna och visa den totala summan för bokningen baserat på antalet spelare (120 kr per person) samt antalet reserverade banor (100 kr per bana)', async () => {
    // Acceptanskriterier: Systemet ska beräkna och visa den totala summan för bokningen baserat på antalet spelare (120 kr per person) samt antalet reserverade banor (100 kr per bana)
    const user = userEvent.setup();
    renderBooking();

    // Fyll i alla fält: 3 personer, 2 banor
    const dateInput = screen.getByTestId('when');
    const timeInput = screen.getByTestId('time');
    const peopleInput = screen.getByTestId('people');
    const lanesInput = screen.getByTestId('lanes');

    await user.type(dateInput, '2024-12-25');
    await user.type(timeInput, '18:00');
    await user.type(peopleInput, '3');
    await user.type(lanesInput, '2');

    // Lägg till skor
    const addShoeButton = screen.getByTestId('add-shoe-button');
    await user.click(addShoeButton);
    await user.click(addShoeButton);
    await user.click(addShoeButton);

    const shoeInputs = screen.getAllByRole('textbox').filter(input => input.getAttribute('maxlength') === '2');
    const shoeInput1 = shoeInputs[0];
    const shoeInput2 = shoeInputs[1];
    const shoeInput3 = shoeInputs[2];
    await user.type(shoeInput1, '42');
    await user.type(shoeInput2, '43');
    await user.type(shoeInput3, '44');

    // Klicka på slutför bokning
    const completeButton = screen.getByTestId('complete-booking-button');
    await user.click(completeButton);

    // Vänta på att bokningen ska sparas
    await waitFor(() => {
      const confirmation = JSON.parse(sessionStorage.getItem('confirmation'));
      expect(confirmation).toBeTruthy();
      // 3 personer * 120 kr + 2 banor * 100 kr = 360 + 200 = 560 kr
      expect(confirmation.price).toBe(560);
    });
  });

  it('ska visa totalsumman tydligt på bekräftelsesidan med uppdelning mellan spelare och banor', async () => {
    // Acceptanskriterier: Den totala summan ska visas tydligt på bekräftelsesidan och inkludera en uppdelning mellan spelare och banor
    // Detta testas i Confirmation.test.jsx
    // Men vi kontrollerar att priset beräknas korrekt här
    const user = userEvent.setup();
    renderBooking();

    // Fyll i alla fält: 2 personer, 1 bana
    const dateInput = screen.getByTestId('when');
    const timeInput = screen.getByTestId('time');
    const peopleInput = screen.getByTestId('people');
    const lanesInput = screen.getByTestId('lanes');

    await user.type(dateInput, '2024-12-25');
    await user.type(timeInput, '18:00');
    await user.type(peopleInput, '2');
    await user.type(lanesInput, '1');

    // Lägg till skor
    const addShoeButton = screen.getByTestId('add-shoe-button');
    await user.click(addShoeButton);
    await user.click(addShoeButton);

    const shoeInputs = screen.getAllByRole('textbox').filter(input => input.getAttribute('maxlength') === '2');
    const shoeInput1 = shoeInputs[0];
    const shoeInput2 = shoeInputs[1];
    await user.type(shoeInput1, '42');
    await user.type(shoeInput2, '43');

    // Klicka på slutför bokning
    const completeButton = screen.getByTestId('complete-booking-button');
    await user.click(completeButton);

    // Vänta på att bokningen ska sparas
    await waitFor(() => {
      const confirmation = JSON.parse(sessionStorage.getItem('confirmation'));
      expect(confirmation).toBeTruthy();
      // 2 personer * 120 kr + 1 bana * 100 kr = 240 + 100 = 340 kr
      expect(confirmation.price).toBe(340);
    });
  });
});

describe('Booking Component - Validering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('ska visa felmeddelande om alla fält inte är ifyllda', async () => {
    const user = userEvent.setup();
    renderBooking();

    const completeButton = screen.getByTestId('complete-booking-button');
    await user.click(completeButton);

    await waitFor(() => {
      expect(screen.getByText(/alla fälten måste vara ifyllda/i)).toBeInTheDocument();
    });
  });

  it('ska visa felmeddelande om antalet skor inte stämmer överens med antal spelare', async () => {
    const user = userEvent.setup();
    renderBooking();

    // Fyll i alla fält
    const dateInput = screen.getByTestId('when');
    const timeInput = screen.getByTestId('time');
    const peopleInput = screen.getByTestId('people');
    const lanesInput = screen.getByTestId('lanes');

    await user.type(dateInput, '2024-12-25');
    await user.type(timeInput, '18:00');
    await user.type(peopleInput, '2');
    await user.type(lanesInput, '1');

    // Lägg till bara en sko (borde vara 2)
    const addShoeButton = screen.getByTestId('add-shoe-button');
    await user.click(addShoeButton);

    const shoeInputs = screen.getAllByRole('textbox').filter(input => input.getAttribute('maxlength') === '2');
    const shoeInput1 = shoeInputs[0];
    await user.type(shoeInput1, '42');

    const completeButton = screen.getByTestId('complete-booking-button');
    await user.click(completeButton);

    await waitFor(() => {
      expect(screen.getByText(/antalet skor måste stämma överens med antal spelare/i)).toBeInTheDocument();
    });
  });

  it('ska visa felmeddelande om alla skor inte är ifyllda', async () => {
    const user = userEvent.setup();
    renderBooking();

    // Fyll i alla fält
    const dateInput = screen.getByTestId('when');
    const timeInput = screen.getByTestId('time');
    const peopleInput = screen.getByTestId('people');
    const lanesInput = screen.getByTestId('lanes');

    await user.type(dateInput, '2024-12-25');
    await user.type(timeInput, '18:00');
    await user.type(peopleInput, '2');
    await user.type(lanesInput, '1');

    // Lägg till två skor men fyll bara i en
    const addShoeButton = screen.getByTestId('add-shoe-button');
    await user.click(addShoeButton);
    await user.click(addShoeButton);

    const shoeInputs = screen.getAllByRole('textbox').filter(input => input.getAttribute('maxlength') === '2');
    await user.type(shoeInputs[0], '42');
    // Lämna andra skon tom

    const completeButton = screen.getByTestId('complete-booking-button');
    await user.click(completeButton);

    await waitFor(() => {
      expect(screen.getByText(/alla skor måste vara ifyllda/i)).toBeInTheDocument();
    });
  });

  it('ska visa felmeddelande om det är för många spelare per bana', async () => {
    const user = userEvent.setup();
    renderBooking();

    // Fyll i alla fält: 5 personer, 1 bana (max 4 per bana)
    const dateInput = screen.getByTestId('when');
    const timeInput = screen.getByTestId('time');
    const peopleInput = screen.getByTestId('people');
    const lanesInput = screen.getByTestId('lanes');

    await user.type(dateInput, '2024-12-25');
    await user.type(timeInput, '18:00');
    await user.type(peopleInput, '5');
    await user.type(lanesInput, '1');

    // Lägg till 5 skor
    const addShoeButton = screen.getByTestId('add-shoe-button');
    for (let i = 0; i < 5; i++) {
      await user.click(addShoeButton);
    }

    // Fyll i alla skor
    const shoeInputs = screen.getAllByRole('textbox').filter(input => input.getAttribute('maxlength') === '2');
    for (let i = 0; i < shoeInputs.length; i++) {
      await user.type(shoeInputs[i], '42');
    }

    const completeButton = screen.getByTestId('complete-booking-button');
    await user.click(completeButton);

    await waitFor(() => {
      expect(screen.getByText(/det får max vara 4 spelare per bana/i)).toBeInTheDocument();
    });
  });
});
