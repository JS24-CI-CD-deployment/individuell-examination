import userEvent from "@testing-library/user-event";
import { describe, expect, expectTypeOf, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import BookingInfo from "../../../src/components/BookingInfo/BookingInfo";
import { handlers } from "../mocks/handlers";
import { BrowserRouter } from "react-router-dom";
import Booking from "../../views/Booking";

const mockUpdate = vi.fn();

describe("TEST: Time Input", () => {
  // AC: Användaren ska kunna välja en tid från ett kalender- och tidvalssystem.
  test("Användaren kan välja en tid och updateBookingDetails anropas korrekt", async () => {
    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const timeInput = document.querySelector("input[name='time']");

    await userEvent.type(timeInput, "18:30");

    expect(timeInput.value).toBe("18:30");
    expect(mockUpdate).toHaveBeenCalledWith(expect.anything());
  });
});

// AC: Användaren ska kunna välja ett datum från datumvalssystemet
describe("Test: Date Input", () => {
  // AC: Användaren ska kunna välja ett datum från ett kalender- och tidvalssystem.
  test("Användaren kan välja ett datum och updateBookingDetails anropas korrekt", async () => {
    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const dateInput = document.querySelector("input[name='when']");

    await userEvent.type(dateInput, "2025-05-04");

    expect(dateInput.value).toBe("2025-05-04");
    expect(mockUpdate).toHaveBeenCalledWith(expect.anything());
  });
});

describe("TEST: players Input", () => {
  // AC: Användaren ska kunna ange antal spelare (minst 1 spelare)
  test("Användaren kan ange antal spelare och updateBookingDetails anropas korrekt", async () => {
    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const playerInput = screen.getAllByRole("spinbutton")[0];

    await userEvent.type(playerInput, "2");

    expect(playerInput.value).toBe("2");
    expect(mockUpdate).toHaveBeenCalledWith(expect.anything());
  });
});
describe("Test: Lanes Input", () => {
  test("Användaren kan ange antal banor och updateBookngDetails anropas korrekt", async () => {
    render(<BookingInfo updateBookingDetails={mockUpdate} />);

    const lanesInput = screen.getAllByRole("spinbutton")[1];

    await userEvent.type(lanesInput, "1");

    expect(lanesInput.value).toBe("1");

    expect(mockUpdate).toHaveBeenCalledWith(expect.anything());
  });
  test("visar felmeddelande vid fullbokning (MSW 400)", async () => {
    server.use(handlers[1]);

    render(
      <BrowserRouter>
        <Booking />
      </BrowserRouter>
    );
    const { dateInput, timeInput, peopleInput, lanesInput } = getInputs();
    const submitButton = await screen.findByRole("button", {
      name: /strIIIIIike!/i,
    });
    const addShoeButton = screen.getByRole("button", { name: "+" });

    await userEvent.type(dateInput, "2026-06-06");
    await userEvent.type(timeInput, "18:00");
    await userEvent.type(peopleInput, "2");
    await userEvent.type(lanesInput, "1");

    await userEvent.click(addShoeButton);
    await userEvent.click(addShoeButton);
    const shoeInput = document.querySelectorAll(".input__field.shoes__input");
    for (const input of shoeInput) {
      await userEvent.type(input, "42");
    }

    await userEvent.click(submitButton);

    expect(
      await screen.findByText(/Banorna är tyvärr fullbokade/i)
    ).toBeInTheDocument();
    expect(mockedNavigate);
  });
});
