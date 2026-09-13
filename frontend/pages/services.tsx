import { useEffect, useState } from "react";
import axios from "axios";
import ServiceCard from "../components/ServiceCard";

const API_URL = "http://localhost:5000";

const categories = [
  { value: "", label: "Все категории" },
  { value: "масла", label: "Масло" },
  { value: "тормоз", label: "Тормоза" },
  { value: "диагностика", label: "Диагностика" },
];

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError("");

      try {
        const params: Record<string, string> = {};

        if (search.trim()) {
          params.search = search.trim();
        }

        if (category) {
          params.category = category;
        }

        const response = await axios.get(`${API_URL}/services`, { params });
        setServices(response.data);
      } catch {
        setServices([]);
        setError(
          "Не удалось загрузить услуги. Проверьте, что сервер запущен, и обновите страницу."
        );
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(load, 250);

    return () => clearTimeout(timer);
  }, [search, category]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
  };

  const hasFilters = search.length > 0 || category.length > 0;

  return (
    <div className="pb-8">
      <section className="border-b border-[#e3dbd0] pb-8">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#23686b]">
          Каталог работ
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Все услуги
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
          Найдите нужную работу и посмотрите ориентиры по стоимости ремонта,
          обслуживания и диагностики автомобиля.
        </p>
      </section>

      <section className="mt-7 rounded-2xl border border-[#e3dbd0] bg-[#fbfaf7] p-4 shadow-sm sm:p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_280px]">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Поиск услуги
            </span>
            <input
              type="search"
              placeholder="Например, замена масла или диагностика"
              className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Категория
            </span>
            <select
              className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item.value || "all"} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee8df] pt-4">
          <p className="text-sm text-slate-500">
            {isLoading
              ? "Загружаем каталог…"
              : `Найдено услуг: ${services.length}`}
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg px-3 py-2 text-sm font-bold text-[#23686b] transition hover:bg-[#edf3f2]"
            >
              Сбросить фильтры
            </button>
          )}
        </div>
      </section>

      <section className="mt-7">
        {error && (
          <div className="rounded-2xl border border-[#e8b8a4] bg-[#fff3ee] p-5 text-[#8d3d20]">
            {error}
          </div>
        )}

        {!error && isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-44 animate-pulse rounded-2xl border border-[#e3dbd0] bg-[#fbfaf7]"
              />
            ))}
          </div>
        )}

        {!error && !isLoading && services.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        {!error && !isLoading && services.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#cfc5b8] bg-[#fbfaf7] px-6 py-14 text-center">
            <p className="text-xl font-bold text-slate-800">
              Услуги не найдены
            </p>
            <p className="mx-auto mt-2 max-w-md leading-7 text-slate-600">
              Попробуйте изменить запрос или выбрать другую категорию.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-[#23686b] px-5 py-3 font-bold text-white transition hover:bg-[#1a5558]"
              >
                Показать все услуги
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}