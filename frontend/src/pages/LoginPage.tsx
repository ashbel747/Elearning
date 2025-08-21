import React, { useState } from "react";
import { AxiosError } from "axios";
import { api } from "../services/api";
import { type LoginRequest, type AuthResponse } from "../shared/types";
import { useAuth } from "../hooks/useAuth";

export const Login: React.FC = () => {
  const { login } = useAuth();

  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // New state for success message

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null); // Clear both messages before a new attempt

    try {
      const res = await api.post<AuthResponse>("/login", form);
      setSuccessMessage("Login successful! Redirecting..."); // Set the success message
      // The original code redirects immediately, which might prevent the message from showing.
      // A small delay can be added here if needed:
      // setTimeout(() => login(res.data.user), 1500);
      login(res.data.user); // Redirect to the next page
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message ?? "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-200"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-200"
          />

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 p-3 font-semibold text-white transition duration-200 ease-in-out hover:bg-indigo-700"
          >
            Login
          </button>
        </form>

        {/* Display messages */}
        {successMessage && <p className="mt-4 text-center text-green-600">{successMessage}</p>}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      </div>
    </div>
  );
};