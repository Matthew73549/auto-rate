import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function VinPage() {
  const router = useRouter();
  const [vin, setVin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleDecode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    if (vin.length !== 17) {
      setError("VIN должен состоять из 17 символов");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/vin/decode`, { vin });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Ошибка декодирования VIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Поиск по VIN</h1>
      <p className="text-gray-700 mb-6">
        Введите VIN автомобиля (17 символов), чтобы узнать марку, модель и год,
        а также перейти к типичным работам для этой модели.
      </p>

      <form onSubmit={handleDecode} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 uppercase"
            placeholder="VIN (например, XTA...)"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            maxLength={17}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Декодируем..." : "Найти"}
          </button>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>

      {result && (
        <div className="bg-white border rounded p-4 shadow">
          <h2 className="text-xl font-semibold mb-3">Результат</h2>
          <div className="grid gap-2 md:grid-cols-2 text-sm">
            <div>
              <span className="text-gray-600">VIN:</span> {result.vin}
            </div>
            <div>
              <span className="text-gray-600">Марка:</span>{" "}
              {result.brand || "—"}
            </div>
            <div>
              <span className="text-gray-600">Модель:</span>{" "}
              {result.model || "—"}
            </div>
            <div>
              <span className="text-gray-600">Год:</span>{" "}
              {result.year || "—"}
            </div>
            <div>
              <span className="text-gray-600">Кузов:</span>{" "}
              {result.body_class || "—"}
            </div>
            <div>
              <span className="text-gray-600">Двигатель:</span>{" "}
              {result.engine || "—"}
            </div>
          </div>

          {result.matched_car ? (
            <div className="mt-4">
              <p className="text-gray-700">
                Найдено совпадение в базе AutoRate:
              </p>
              <p className="font-semibold">
                {result.matched_car.brand} {result.matched_car.model}
                {result.matched_car.generation &&
                  ` (${result.matched_car.generation})`}
              </p>
              {result.matched_car.year_from && result.matched_car.year_to && (
                <p className="text-sm text-gray-600">
                  {result.matched_car.year_from} – {result.matched_car.year_to}
                </p>
              )}
              <button
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => router.push(`/cars?id=${result.matched_car.id}`)}
              >
                Посмотреть типичные работы
              </button>
            </div>
          ) : (
            <div className="mt-4 text-gray-700">
              <p>
                Совпадение с конкретной моделью в базе не найдено. Вы можете:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Попробовать найти вручную в разделе «Авто».</li>
                <li>Использовать марку и модель для фильтра в калькуляторе.</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}