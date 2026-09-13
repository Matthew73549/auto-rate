import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const API_URL = "http://localhost:5000";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    user_type: "individual",
    inn: "",
    company_name: "",
    city: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/api/register`, form);
      console.log("Регистрация успешна:", response.data);
      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Ошибка регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-8">
          Регистрация
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

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Имя
            </label>
            <input
              type="text"
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
              placeholder="Иван Иванов"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Телефон
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
              placeholder="+7 (999) 123-45-67"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Тип пользователя
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="user_type"
                  value="individual"
                  checked={form.user_type === "individual"}
                  onChange={(e) => setForm({ ...form, user_type: e.target.value })}
                  className="text-[#23686b]"
                />
                <span className="text-slate-700">Частный механик</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="user_type"
                  value="service"
                  checked={form.user_type === "service"}
                  onChange={(e) => setForm({ ...form, user_type: e.target.value })}
                  className="text-[#23686b]"
                />
                <span className="text-slate-700">Автосервис</span>
              </label>
            </div>
          </div>

          {form.user_type === "service" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Название сервиса
                </label>
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
                  placeholder="ООО АвтоМастер"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ИНН
                </label>
                <input
                  type="text"
                  value={form.inn}
                  onChange={(e) => setForm({ ...form, inn: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
                  placeholder="1234567890"
                  maxLength={10}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Город
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
              placeholder="Москва"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Адрес
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
              placeholder="ул. Ленина, д. 10"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-[#23686b] px-6 py-4 text-base font-bold text-white transition hover:bg-[#1a5558] focus:outline-none focus:ring-4 focus:ring-[#23686b]/20 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          Уже есть аккаунт?{" "}
          <a href="/login" className="text-[#23686b] font-semibold hover:underline">
            Войти
          </a>
        </p>
      </div>
    </div>
  );
}