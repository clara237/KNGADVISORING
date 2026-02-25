import { describe, it, expect } from "vitest";

import { describe, it, expect, beforeEach, vi } from "vitest";
import { submitContactForm, type ContactFormData } from "../lib/api";

// small helper to mock fetch
function mockFetch(status: number, body: any) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }));
}

const sampleData: ContactFormData = {
  nom: "Foo",
  email: "foo@example.com",
  sujet: "Test",
  message: "Hello world",
};

describe("submitContactForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the parsed JSON on success", async () => {
    mockFetch(201, { success: true, message: "ok" });
    const res = await submitContactForm(sampleData);
    expect(res.success).toBe(true);
    expect(res.message).toBe("ok");
  });

  it("propagates validation errors", async () => {
    const errors = { nom: ["required"] };
    mockFetch(400, { success: false, errors });
    const res = await submitContactForm(sampleData);
    expect(res.success).toBe(false);
    expect(res.errors).toEqual(errors);
  });

  it("handles non-json responses gracefully", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("invalid json");
      },
    }));
    const res = await submitContactForm(sampleData);
    expect(res.success).toBe(false);
    expect(res.message).toMatch(/Réponse serveur invalide/);
  });
});
