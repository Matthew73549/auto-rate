import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminCities() {
  const [cities, setCities] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    region: "",
    labor_rate_default: 1500,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = Cookies.get("access_token");

  const loadCities = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/cities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCities(res.data);
    } catch (e) {
      setError("Ошибка загрузки городов");
    }
  };

  useEffect(() => {
    if (!token) return;
    loadCities();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API_URL}/admin/cities`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        name: "",
        region: "",
        labor_rate_default: 1500,
        is_active: true,
      });
      await loadCities();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ошибка создания города");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <p className="text-red-600">Требуется авторизация</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Города (админка)</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Добавить город</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Название (напр. Москва)"
            className="border rounded px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Регион (напр. Московская обл.)"
            className="border rounded px-3 py-2"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
          />
          <input
            type="number"
            placeholder="Ставка по умолчанию (₽/ч)"
            className="border rounded px-3 py-2"
            value={form.labor_rate_default}
            onChange={(e) =>
              setForm({ ...form, labor_rate_default: Number(e.target.value) })
            }
            min={500}
            step={50}
          />
          <label className="flex items-center gap-2 border rounded px-3 py-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Активен
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

      <h2 className="text-xl font-semibold mb-3">Список городов</h2>
      <div className="bg-white border rounded p-4">
        {cities.length === 0 ? (
          <p className="text-gray-600">Городов пока нет</p>
        ) : (
          <ul className="divide-y">
            {cities.map((c) => (
              <li key={c.id} className="py-2">
                <div className="font-semibold">
                  {c.name} {c.region && `(${c.region})`}
                </div>
                <div className="text-sm text-gray-600">
                  Ставка: {c.labor_rate_default} ₽/ч • {c.is_active ? "активен" : "неактивен"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}