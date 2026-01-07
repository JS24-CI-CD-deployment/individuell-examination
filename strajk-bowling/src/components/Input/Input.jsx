import "./Input.scss";

function Input({
  label,
  type,
  customClass,
  name,
  handleChange,
  defaultValue,
  disabled,
  maxLength,
  testId,
}) {
  return (
    <section className="input">
      <label className="input__label">{label}</label>
      {/* data-testid behövs för att testa inputfält i user stories (User Story 1, 2, 3) */}
      <input
        type={type}
        className={`input__field ${customClass ? customClass : ""}`}
        name={name}
        onChange={handleChange}
        defaultValue={defaultValue ? defaultValue : ""}
        maxLength={maxLength}
        disabled={disabled}
        data-testid={testId || name}
      />
    </section>
  );
}

export default Input;
