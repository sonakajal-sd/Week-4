export function Button({
  text = "",
  onClick,
  variant = "primary",
  type = "button",
  disabled = false
} = {}) {
  const button = document.createElement("button");
  button.type = type;
  button.textContent = text;
  button.className = `btn btn-${variant}`;
  button.disabled = disabled;

  if (onClick) {
    button.addEventListener("click", onClick);
  }

  return button;
}
