import { describe, it, expect, vi, beforeEach } from "vitest";

import { Modal } from "../../components/modal.js";

describe("Modal keyboard navigation", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    const modal = Modal({ title: "Confirm?", content: "Are you sure?", onClose });
    document.body.append(modal);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.body.contains(modal)).toBe(false);
  });

  it("confirms on Enter", () => {
    const onConfirm = vi.fn();
    const modal = Modal({ title: "Confirm?", content: "Are you sure?", onConfirm });
    document.body.append(modal);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(document.body.contains(modal)).toBe(false);
  });

  it("removes its keydown listener once closed", () => {
    const onConfirm = vi.fn();
    const modal = Modal({ title: "Confirm?", content: "Are you sure?", onConfirm });
    document.body.append(modal);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
