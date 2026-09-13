import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const API_URL = "http://localhost:5000";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/api/login`, form);
      // Сохраняем user_id в localStorage
      localStorage.setItem("user_id", String(response.data.id));
      localStorage.setItem("user_email", response.data.email);
      console.log("Вход успешен:", response.data);
      router.push("/profile");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Ошибка входа");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-8">
          Вход
        </h1>

        {error && (
          <div className="mb-6 rounded-xl border border-[#e8b8a4] bg-[#fff3ee] p-4 text-[#8d3d20]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#23686b] px-6 py-4 text-base font-bold text-white transition hover:bg-[#1a5558] focus:outline-none focus:ring-4 focus:ring-[#23686b]/20 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          Нет аккаунта?{" "}
          <a href="/register" className="text-[#23686b] font-semibold hover:underline">
            Зарегистрироваться
          </a>
        </p>
      </div>
    </div>
  );
}