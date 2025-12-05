import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Shoes from "../../components/Shoes/Shoes";
import userEvent from "@testing-library/user-event";

describe("Användaren skall kunna ange skostorlek för varje spelare", () => {
  const addShoe = vi.fn();
  const updateSize = vi.fn();
  const removeShoe = vi.fn();
  const shoes = [{ id: "p1" }];

  // AC: ”Användaren ska kunna ange skostorlek för varje spelare.”
  test("Användaren kan ange skostorlek", async () => {
    render(
      <Shoes
        shoes={shoes}
        updateSize={updateSize}
        addShoe={addShoe}
        removeShoe={removeShoe}
      />
    );

    const shoeSize = screen.getByTestId("shoe-input-1");

    await userEvent.type(shoeSize, "42");

    expect(shoeSize.value).toBe("42");
  });

  // AC: ”Användaren ska kunna ändra skostorlek för varje spelare.”
  test("Användaren ska kunna ändra skostorlek", async () => {
    render(
      <Shoes
        shoes={shoes}
        updateSize={updateSize}
        addShoe={addShoe}
        removeShoe={removeShoe}
      />
    );
    const shoeInput = screen.getByTestId("shoe-input-1");

    await userEvent.type(shoeInput, "45");

    expect(shoeInput.value).toBe("45");
    expect(updateSize).toHaveBeenCalled();
  });

  //AC: Det ska vara möjligt att välja skostorlek för alla spelare som ingår i bokningen.
  test("Renderar flera skostorleksfält när flera spelare finns", () => {
    const players = [{ id: "p1" }, { id: "p2" }, { id: "p3" }, { id: "p4" }];

    render(
      <Shoes
        shoes={players}
        updateSize={updateSize}
        addShoe={addShoe}
        removeShoe={removeShoe}
      />
    );
    const shoeInput1 = screen.getByTestId("shoe-input-1");
    const shoeInput2 = screen.getByTestId("shoe-input-2");
    const shoeInput3 = screen.getByTestId("shoe-input-3");
    const shoeInput4 = screen.getByTestId("shoe-input-4");

    expect(shoeInput1).toBeInTheDocument();
    expect(shoeInput2).toBeInTheDocument();
    expect(shoeInput3).toBeInTheDocument();
    expect(shoeInput4).toBeInTheDocument();
  });
});
