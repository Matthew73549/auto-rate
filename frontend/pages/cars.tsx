import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function CarsPage() {
  const [cars, setCars] = useState<any[]>([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const params: any = {};
      if (brand) params.brand = brand;
      if (model) params.model = model;
      const res = await axios.get(`${API_URL}/cars`, { params });
      setCars(res.data);
    };
    load();
  }, [brand, model]);

  const loadStats = async (carId: number) => {
    const res = await axios.get(`${API_URL}/cars/${carId}/services`);
    setStats(res.data);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Марки и модели</h1>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Марка"
          className="border rounded px-3 py-2 flex-1"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <input
          type="text"
          placeholder="Модель"
          className="border rounded px-3 py-2 flex-1"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((c) => (
          <div
            key={c.id}
            className="border rounded p-4 bg-white shadow-sm cursor-pointer hover:bg-gray-50"
            onClick={() => {
              setSelectedCar(c);
              loadStats(c.id);
            }}
          >
            <h3 className="font-semibold">
              {c.brand} {c.model}
            </h3>
            {c.generation && (
              <p className="text-sm text-gray-600">{c.generation}</p>
            )}
            {(c.year_from || c.year_to) && (
              <p className="text-sm text-gray-600">
                {c.year_from || "?"} – {c.year_to || "?"}
              </p>
            )}
          </div>
        ))}
      </div>

      {selectedCar && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">
            Типичные работы: {selectedCar.brand} {selectedCar.model}
          </h2>
          {stats.length === 0 ? (
            <p className="text-gray-600">Данных пока нет.</p>
          ) : (
            <ul className="list-disc pl-6 space-y-2">
              {stats.map((s) => (
                <li key={s.service_id}>
                  <span className="font-medium">{s.service_name}</span>
                  {s.notes && (
                    <span className="text-gray-700"> — {s.notes}</span>
                  )}
                  <span className="text-sm text-gray-500">
                    {" "}
                    (частота: {s.frequency_score}/10)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}