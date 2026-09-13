import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminCars() {
  const [cars, setCars] = useState<any[]>([]);
  const [form, setForm] = useState({
    make: "",
    model: "",
    year_from: 2010,
    year_to: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = Cookies.get("access_token");

  const loadCars = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/cars`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(res.data);
    } catch (e) {
      setError("Ошибка загрузки автомобилей");
    }
  };

  useEffect(() => {
    if (!token) return;
    loadCars();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API_URL}/admin/cars`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({
        make: "",
        model: "",
        year_from: 2010,
        year_to: new Date().getFullYear(),
      });
      await loadCars();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ошибка создания авто");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <p className="text-red-600">Требуется авторизация</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Автомобили (админка)</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Добавить автомобиль</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <div className="grid gap-3 md:grid-cols-2">
          <input
            type="text"
            placeholder="Марка (напр. Toyota)"
            className="border rounded px-3 py-2"
            value={form.make}
            onChange={(e) => setForm({ ...form, make: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Модель (напр. Camry)"
            className="border rounded px-3 py-2"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Год от"
            className="border rounded px-3 py-2"
            value={form.year_from}
            onChange={(e) =>
              setForm({ ...form, year_from: Number(e.target.value) })
            }
            min={1990}
            max={new Date().getFullYear()}
          />
          <input
            type="number"
            placeholder="Год до"
            className="border rounded px-3 py-2"
            value={form.year_to}
            onChange={(e) =>
              setForm({ ...form, year_to: Number(e.target.value) })
            }
            min={1990}
            max={new Date().getFullYear()}
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

      <h2 className="text-xl font-semibold mb-3">Список автомобилей</h2>
      <div className="bg-white border rounded p-4">
        {cars.length === 0 ? (
          <p className="text-gray-600">Автомобилей пока нет</p>
        ) : (
          <ul className="divide-y">
            {cars.map((c) => (
              <li key={c.id} className="py-2">
                <div className="font-semibold">
                  {c.make} {c.model}
                </div>
                <div className="text-sm text-gray-600">
                  {c.year_from} – {c.year_to}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}