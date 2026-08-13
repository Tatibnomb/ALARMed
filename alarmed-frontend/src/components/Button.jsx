function Button({ text, onClick }) {
  return (
    <button
      className="primary-button"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;