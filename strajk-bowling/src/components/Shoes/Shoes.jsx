import "./Shoes.scss";
import { nanoid } from "nanoid";

import Input from "../Input/Input";

function Shoes({ updateSize, addShoe, removeShoe, shoes }) {
  const shoeComps = shoes.map((input, index) => {
    const label = `Shoe size / person ${index + 1}`;
    const shoeInput = (
      <article className="shoes__form" key={input.id}>
        <Input
          label={label}
          type="text"
          customClass="shoes__input"
          name={input.id}
          handleChange={updateSize}
          maxLength={2}
        />
        {/* data-testid behövs för att testa att användaren kan ta bort skostorleksfält (User Story 3) */}
        <button
          className="shoes__button shoes__button--small"
          onClick={() => {
            removeShoe(input.id);
          }}
          data-testid={`remove-shoe-${input.id}`}
        >
          -
        </button>
      </article>
    );

    return shoeInput;
  });

  return (
    <section className="shoes">
      <header>
        <h2 className="shoes__heading">Shoes</h2>
      </header>
      {shoeComps}
      {/* data-testid behövs för att testa att användaren kan lägga till skostorleksfält (User Story 2) */}
      <button
        className="shoes__button"
        onClick={() => {
          addShoe(nanoid());
        }}
        data-testid="add-shoe-button"
      >
        +
      </button>
    </section>
  );
}

export default Shoes;
