import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    category: "maintenance",
    description: "",
    base_time_minutes: 60,
    complexity_factor: 1.0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = Cookies.get("access_token");

  const loadServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data);
    } catch (e) {
      setError("Ошибка загрузки услуг");
    }
  };

  useEffect(() => {
    if (!token) return;
    loadServices();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API_URL}/admin/services`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        name: "",
        category: "maintenance",
        description: "",
        base_time_minutes: 60,
        complexity_factor: 1.0,
      });
      await loadServices();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ошибка создания услуги");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <p className="text-red-600">Требуется авторизация</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Услуги (админка)</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Добавить услугу</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Название"
            className="border rounded px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <select
            className="border rounded px-3 py-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="engine">Двигатель</option>
            <option value="transmission">Трансмиссия</option>
            <option value="suspension">Подвеска</option>
            <option value="brakes">Тормоза</option>
            <option value="electrics">Электрика</option>
            <option value="body">Кузов</option>
            <option value="maintenance">ТО</option>
          </select>
          <textarea
            placeholder="Описание"
            className="border rounded px-3 py-2 md:col-span-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Базовое время (мин)"
            className="border rounded px-3 py-2"
            value={form.base_time_minutes}
            onChange={(e) =>
              setForm({ ...form, base_time_minutes: Number(e.target.value) })
            }
            min={1}
          />
          <input
            type="number"
            placeholder="Коэфф. сложности"
            className="border rounded px-3 py-2"
            value={form.complexity_factor}
            onChange={(e) =>
              setForm({ ...form, complexity_factor: Number(e.target.value) })
            }
            min={0.5}
            step={0.1}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Сохраняем..." : "Добавить"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Список услуг</h2>
      <div className="bg-white border rounded p-4">
        {services.length === 0 ? (
          <p className="text-gray-600">Услуг пока нет</p>
        ) : (
          <ul className="divide-y">
            {services.map((s) => (
              <li key={s.id} className="py-2">
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-gray-600">
                  {s.category} • {s.base_time_minutes} мин • коэфф. {s.complexity_factor}
                </div>
                {s.description && (
                  <div className="text-sm text-gray-700 mt-1">{s.description}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
