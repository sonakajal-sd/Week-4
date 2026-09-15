import { Button } from "./button.js";

export function Card({ title = "", content = "", actions = [], onClick } = {}) {
  const card = document.createElement("div");
  card.className = "card";

  const heading = document.createElement("h3");
  heading.className = "card-title";
  heading.textContent = title;

  if (onClick) {
    heading.classList.add("card-title--link");
    heading.setAttribute("role", "button");
    heading.tabIndex = 0;
    heading.addEventListener("click", onClick);
    heading.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onClick(event);
      }
    });
  }

  const paragraph = document.createElement("p");
  paragraph.className = "card-content";
  paragraph.textContent = content;

  card.append(heading, paragraph);

  if (actions.length) {
    const actionsRow = document.createElement("div");
    actionsRow.className = "card-actions";
    actions.forEach((actionProps) => {
      actionsRow.append(Button(actionProps));
    });
    card.append(actionsRow);
  }

  return card;
}
