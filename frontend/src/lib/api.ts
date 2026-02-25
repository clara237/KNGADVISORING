const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export interface ContactFormData {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export async function submitContactForm(data: ContactFormData): Promise<ContactResponse> {
  const res = await fetch(`${API_BASE}/contact/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  let json: any;
  try {
    json = await res.json();
  } catch {
    // si la réponse n'est pas du JSON valide (parse error), on renvoie
    // un objet générique pour que l'appelant n'ait pas à gérer une
    // exception.
    return { success: false, message: "Réponse serveur invalide." };
  }

  if (!res.ok) {
    return json;
  }
  return json;
}
