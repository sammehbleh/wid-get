const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.message || "Request failed", res.status);
  }
  return data;
}

export const api = {
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
  register: (name, email, password) =>
    request("/auth/register", { method: "POST", body: { name, email, password } }),
  me: (token) => request("/me", { token }),

  listAccounts: (token) => request("/accounts", { token }),
  createAccount: (token, data) => request("/accounts", { method: "POST", body: data, token }),

  listReminders: (token) => request("/reminders", { token }),
  createReminder: (token, data) => request("/reminders", { method: "POST", body: data, token }),
  updateReminder: (token, id, data) => request(`/reminders/${id}`, { method: "PATCH", body: data, token }),
  deleteReminder: (token, id) => request(`/reminders/${id}`, { method: "DELETE", token }),

  listNotes: (token) => request("/notes", { token }),
  createNote: (token, data) => request("/notes", { method: "POST", body: data, token }),
  updateNote: (token, id, data) => request(`/notes/${id}`, { method: "PATCH", body: data, token }),
  deleteNote: (token, id) => request(`/notes/${id}`, { method: "DELETE", token }),

  listTodos: (token) => request("/todos", { token }),
  createTodo: (token, data) => request("/todos", { method: "POST", body: data, token }),
  updateTodo: (token, id, data) => request(`/todos/${id}`, { method: "PATCH", body: data, token }),
  deleteTodo: (token, id) => request(`/todos/${id}`, { method: "DELETE", token }),

  listEvents: (token) => request("/events", { token }),
  createEvent: (token, data) => request("/events", { method: "POST", body: data, token }),
  deleteEvent: (token, id) => request(`/events/${id}`, { method: "DELETE", token }),
};
