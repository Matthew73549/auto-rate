import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://auto-rate.onrender.com";

type HistoryItem = {
  id: number;
  service_name: string;
  city_name: string;
  total_price: number;
  created_at: string;
  mileage: string;
  age: string;
  access: string;
  urgency: string;
  tool: string;
};

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<"48h" | "all">("48h");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      router.push("/login");
      return;
    }

    const loadHistory = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/history?user_id=${userId}`);
        setHistory(response.data);
      } catch {
        setError("Не удалось загрузить историю");
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [router]);

  const filteredHistory = history.filter((item) => {
    if (filter === "48h") {
      const twoDaysAgo = new Date();
      twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);
      return new Date(item.created_at) >= twoDaysAgo;
    }
    return true;
  });

  const handleExport = () => {
    // Простой экспорт в CSV
    const headers = ["Дата", "Услуга", "Город", "Пробег", "Возраст", "Доступ", "Срочность", "Инструмент", "Цена"];
    const rows = filteredHistory.map((item) => [
      new Date(item.created_at).toLocaleString("ru-RU"),
      item.service_name,
      item.city_name,
      item.mileage,
      item.age,
      item.access,
      item.urgency,
      item.tool,
      item.total_price,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(";")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `history_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fbfaf7] flex items-center justify-center">
        <p className="text-slate-600">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf7] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Шапка */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">📜 История расчётов</h1>
          <button
            onClick={() => router.push("/profile")}
            className="text-sm text-slate-600 hover:text-[#23686b] transition"
          >
            ← В профиль
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-[#e8b8a4] bg-[#fff3ee] p-4 text-[#8d3d20]">
            {error}
          </div>
        )}

        {/* Фильтр */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="filter"
                checked={filter === "48h"}
                onChange={() => setFilter("48h")}
                className="text-[#23686b]"
              />
              <span className="text-slate-700">Последние 48 часов</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="filter"
                checked={filter === "all"}
                onChange={() => setFilter("all")}
                className="text-[#23686b]"
              />
              <span className="text-slate-700">Все расчёты</span>
            </label>
          </div>

          <button
            onClick={handleExport}
            disabled={filteredHistory.length === 0}
            className="rounded-xl bg-[#23686b] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1a5558] disabled:opacity-50"
          >
            📥 Экспорт в Excel
          </button>
        </div>

        {/* Список */}
        {filteredHistory.length === 0 ? (
          <div className="rounded-2xl border border-[#e3dbd0] bg-white p-8 text-center">
            <p className="text-slate-600">Нет расчётов за выбранный период</p>
            <button
              onClick={() => router.push("/calculator")}
              className="mt-4 text-[#23686b] font-semibold hover:underline"
            >
              Перейти к калькулятору →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#e3dbd0] bg-white p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-slate-900">{item.service_name}</p>
                    <p className="text-sm text-slate-500">{item.city_name}</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {Number(item.total_price).toLocaleString("ru-RU")} ₽
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-slate-600 mb-3">
                  <div><span className="text-slate-500">Пробег:</span> {item.mileage}</div>
                  <div><span className="text-slate-500">Возраст:</span> {item.age}</div>
                  <div><span className="text-slate-500">Доступ:</span> {item.access}</div>
                  <div><span className="text-slate-500">Срочность:</span> {item.urgency}</div>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-400">
                    {new Date(item.created_at).toLocaleString("ru-RU")}
                  </p>
                  <button
                    onClick={handleExport}
                    className="text-xs text-[#23686b] font-semibold hover:underline"
                  >
                    📥 Скачать
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}