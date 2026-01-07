import "./Confirmation.scss";
import { useLocation } from "react-router-dom";

import Top from "../components/Top/Top";
import Navigation from "../components/Navigation/Navigation";
import Input from "../components/Input/Input";

function Confirmation() {
  const { state } = useLocation();

  const confirmation =
    state?.confirmationDetails ||
    JSON.parse(sessionStorage.getItem("confirmation"));

  return (
    <section className="confirmation">
      <Navigation />
      <Top title="See you soon!" />
      {state || confirmation ? (
        <form className="confirmation__details">
          <Input
            label="When"
            type="text"
            customClass="confirmation__input"
            defaultValue={confirmation.when.replace("T", " ")}
            disabled="disabled"
          />
          <Input
            label="Who"
            type="text"
            customClass="confirmation__input"
            defaultValue={confirmation.people}
            disabled="disabled"
          />
          <Input
            label="Lanes"
            type="text"
            customClass="confirmation__input"
            defaultValue={confirmation.lanes}
            disabled="disabled"
          />
          <Input
            label="Booking number"
            type="text"
            customClass="confirmation__input"
            defaultValue={confirmation.bookingId}
            disabled="disabled"
            testId="booking-number"
          />
          {/* data-testid behövs för att testa att totalsumman visas (User Story 4) */}
          <article className="confirmation__price" data-testid="total-price">
            <p>Total:</p>
            <p>{confirmation.price} sek</p>
          </article>
          <button className="button confirmation__button">
            Sweet, let's go!
          </button>
        </form>
      ) : (
        // data-testid behövs för att testa att "Ingen bokning gjord" visas när ingen bokning finns (User Story 5)
        <h2 className="confirmation__no-booking" data-testid="no-booking-message">Inga bokning gjord!</h2>
      )}
    </section>
  );
}

export default Confirmation;
