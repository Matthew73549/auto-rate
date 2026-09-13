import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminPrices() {
  const [prices, setPrices] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [form, setForm] = useState({
    service_id: "",
    city_id: "",
    labor_rate: 1500,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = Cookies.get("access_token");

  const loadAll = async () => {
    try {
      const [pRes, sRes, cRes] = await Promise.all([
        axios.get(`${API_URL}/admin/prices`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/admin/services`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/admin/cities`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setPrices(pRes.data);
      setServices(sRes.data);
      setCities(cRes.data);
    } catch (e) {
      setError("Ошибка загрузки данных");
    }
  };

  useEffect(() => {
    if (!token) return;
    loadAll();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API_URL}/admin/prices`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        service_id: "",
        city_id: "",
        labor_rate: 1500,
        is_active: true,
      });
      await loadAll();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ошибка создания цены");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <p className="text-red-600">Требуется авторизация</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Цены (админка)</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Добавить цену</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <div className="grid gap-3 md:grid-cols-2">
          <select
            className="border rounded px-3 py-2"
            value={form.service_id}
            onChange={(e) => setForm({ ...form, service_id: e.target.value })}
            required
          >
            <option value="">Выберите услугу</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="border rounded px-3 py-2"
            value={form.city_id}
            onChange={(e) => setForm({ ...form, city_id: e.target.value })}
            required
          >
            <option value="">Выберите город</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Ставка за час (₽)"
            className="border rounded px-3 py-2"
            value={form.labor_rate}
            onChange={(e) =>
              setForm({ ...form, labor_rate: Number(e.target.value) })
            }
            min={100}
            step={50}
          />

          <label className="flex items-center gap-2 border rounded px-3 py-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Активно
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Сохраняем..." : "Добавить"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Список цен</h2>
      <div className="bg-white border rounded p-4">
        {prices.length === 0 ? (
          <p className="text-gray-600">Цен пока нет</p>
        ) : (
          <ul className="divide-y">
            {prices.map((p) => (
              <li key={p.id} className="py-2">
                <div className="font-semibold">
                  {p.service?.name} — {p.city?.name}
                </div>
                <div className="text-sm text-gray-600">
                  Ставка: {p.labor_rate} ₽/ч • {p.is_active ? "активно" : "неактивно"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}