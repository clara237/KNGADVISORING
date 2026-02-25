import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ContactSection from "../components/ContactSection";
import * as api from "../lib/api";

// helper to fill basic data
async function fillForm() {
  fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: "Foo" } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "foo@bar.com" } });
  fireEvent.change(screen.getByLabelText(/sujet/i), { target: { value: "Sujet" } });
  fireEvent.change(screen.getByLabelText(/message/i), { target: { value: "Un message valide..." } });
}

describe("ContactSection component", () => {
  beforeAll(() => {
    // framer-motion uses IntersectionObserver which isn't available in JSDOM
    // environment; provide a no-op stub so components render during tests.
    global.IntersectionObserver = class {
      constructor() {}
      observe() {}
      disconnect() {}
      unobserve() {}
    } as any;
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows detail error from server", async () => {
    vi.spyOn(api, "submitContactForm").mockResolvedValue({ success: false, detail: "oops" });
    render(<ContactSection />);
    await fillForm();
    fireEvent.click(screen.getByRole("button", { name: /envoyer/i }));
    await waitFor(() => {
      expect(screen.getByText(/oops/)).toBeInTheDocument();
    });
  });

  it("shows generic server message when provided", async () => {
    vi.spyOn(api, "submitContactForm").mockResolvedValue({ success: false, message: "serveur" });
    render(<ContactSection />);
    await fillForm();
    fireEvent.click(screen.getByRole("button", { name: /envoyer/i }));
    await waitFor(() => expect(screen.getByText(/serveur/)).toBeInTheDocument());
  });

  it("displays field errors", async () => {
    vi.spyOn(api, "submitContactForm").mockResolvedValue({
      success: false,
      errors: { nom: ["nom invalide"] },
    });
    render(<ContactSection />);
    await fillForm();
    fireEvent.click(screen.getByRole("button", { name: /envoyer/i }));
    await waitFor(() => expect(screen.getByText(/nom invalide/)).toBeInTheDocument());
  });
});
