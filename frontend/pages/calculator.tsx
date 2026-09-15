import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://auto-rate.onrender.com";

type Service = {
  id: number;
  name: string;
};

type City = {
  id: number;
  name: string;
};

type CalculatorResult = {
  service_id: number;
  city_id: number;
  labor_time: number;
  base_price: number;
  coef_mileage: number;
  coef_age: number;
  coef_access: number;
  coef_urgency: number;
  coef_tool: number;
  total_coef: number;
  total_price: number;
};

export default function CalculatorPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [form, setForm] = useState({
    service_id: "",
    city_id: "",
    mileage: "under_50k",
    age: "under_3",
    access: "normal",
    urgency: "normal",
    tool: "none",
  });

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      setError("");

      try {
        const [servicesRes, citiesRes] = await Promise.all([
          axios.get(`${API_URL}/api/services`),
          axios.get(`${API_URL}/api/services/cities`),
        ]);

        const services = servicesRes.data || [];
        const cities = citiesRes.data || [];

        setServices(services);
        setCities(cities);

        if (services.length > 0) {
          setForm((current) => ({
            ...current,
            service_id: String(services[0].id),
          }));
        }

        if (cities.length > 0) {
          setForm((current) => ({
            ...current,
            city_id: String(cities[0].id),
          }));
        }
      } catch {
        setError(
          "Не удалось загрузить услуги и города. Убедитесь, что бэкенд доступен."
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleCalculate = async () => {
    if (!form.service_id || !form.city_id) {
      setError("Выберите услугу и город.");
      return;
    }

    setIsCalculating(true);
    setError("");
    setResult(null);

    try {
      const userId = localStorage.getItem("user_id");
      const response = await axios.post(`${API_URL}/api/calculate`, {
        service_id: Number(form.service_id),
        city_id: Number(form.city_id),
        mileage: form.mileage,
        age: form.age,
        access: form.access,
        urgency: form.urgency,
        tool: form.tool,
        user_id: userId ? Number(userId) : null,
      });

      setResult(response.data);
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.error ||
          "Не удалось выполнить расчёт. Проверьте данные и попробуйте ещё раз."
      );
    } finally {
      setIsCalculating(false);
    }
  };

  const selectedService = services.find(
    (service) => service.id === Number(form.service_id)
  );

  const selectedCity = cities.find(
    (city) => city.id === Number(form.city_id)
  );

  return (
    <div className="pb-8">
      <section className="border-b border-[#e3dbd0] pb-8">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#23686b]">
          Расчёт стоимости
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Калькулятор работ
        </h1>

        <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
          Укажите услугу, город и условия ремонта, чтобы получить
          ориентировочную стоимость работы.
        </p>
      </section>

      {error && (
        <div className="mt-7 rounded-2xl border border-[#e8b8a4] bg-[#fff3ee] p-5 leading-7 text-[#8d3d20]">
          {error}
        </div>
      )}

      {isLoadingData ? (
        <section className="mt-7 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="h-[620px] animate-pulse rounded-2xl border border-[#e3dbd0] bg-[#fbfaf7]" />
          <div className="h-[280px] animate-pulse rounded-2xl border border-[#e3dbd0] bg-[#fbfaf7]" />
        </section>
      ) : (
        <section className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-2xl border border-[#e3dbd0] bg-[#fbfaf7] p-5 shadow-sm sm:p-7">
            <div className="flex items-center gap-3 border-b border-[#eee8df] pb-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf3f2] font-bold text-[#23686b]">
                1
              </span>

              <div>
                <h2 className="font-bold text-slate-900">Выберите услугу</h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Укажите работу и город для расчёта.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Услуга
                </span>

                <select
                  className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
                  value={form.service_id}
                  onChange={(event) =>
                    setForm({ ...form, service_id: event.target.value })
                  }
                >
                  <option value="">Выберите услугу</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Город
                </span>

                <select
                  className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
                  value={form.city_id}
                  onChange={(event) =>
                    setForm({ ...form, city_id: event.target.value })
                  }
                >
                  <option value="">Выберите город</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-9 flex items-center gap-3 border-b border-[#eee8df] pb-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf3f2] font-bold text-[#23686b]">
                2
              </span>

              <div>
                <h2 className="font-bold text-slate-900">
                  Условия ремонта
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Параметры влияют на сложность и ориентировочную цену.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Пробег автомобиля
                </span>

                <select
                  className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
                  value={form.mileage}
                  onChange={(event) =>
                    setForm({ ...form, mileage: event.target.value })
                  }
                >
                  <option value="under_50k">До 50 000 км</option>
                  <option value="50k_100k">50 000–100 000 км</option>
                  <option value="over_100k">Более 100 000 км</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Возраст автомобиля
                </span>

                <select
                  className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
                  value={form.age}
                  onChange={(event) =>
                    setForm({ ...form, age: event.target.value })
                  }
                >
                  <option value="under_3">До 3 лет</option>
                  <option value="3_7">От 3 до 7 лет</option>
                  <option value="over_7">Более 7 лет</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Доступ к месту ремонта
                </span>

                <select
                  className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
                  value={form.access}
                  onChange={(event) =>
                    setForm({ ...form, access: event.target.value })
                  }
                >
                  <option value="normal">Обычный</option>
                  <option value="medium">Средний</option>
                  <option value="difficult">Затруднённый</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Срочность ремонта
                </span>

                <select
                  className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
                  value={form.urgency}
                  onChange={(event) =>
                    setForm({ ...form, urgency: event.target.value })
                  }
                >
                  <option value="normal">Обычная</option>
                  <option value="urgent">Срочная</option>
                  <option value="very_urgent">Очень срочная</option>
                </select>
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Нужен специальный инструмент
                </span>

                <select
                  className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
                  value={form.tool}
                  onChange={(event) =>
                    setForm({ ...form, tool: event.target.value })
                  }
                >
                  <option value="none">Не нужен</option>
                  <option value="special">Нужен специальный</option>
                  <option value="dealer">Дилерский</option>
                </select>
              </label>
            </div>

            <button
              type="button"
              onClick={handleCalculate}
              disabled={
                isCalculating ||
                !form.service_id ||
                !form.city_id ||
                services.length === 0
              }
              className="mt-8 w-full rounded-xl bg-[#23686b] px-6 py-4 text-base font-bold text-white transition hover:bg-[#1a5558] focus:outline-none focus:ring-4 focus:ring-[#23686b]/20 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isCalculating ? "Считаем стоимость…" : "Рассчитать стоимость"}
            </button>
          </div>

          <aside className="h-fit rounded-2xl border border-[#e3dbd0] bg-[#fbfaf7] p-6 shadow-sm lg:sticky lg:top-6">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#23686b]">
              Результат
            </p>

            {!result ? (
              <div className="pt-6">
                <p className="text-xl font-bold text-slate-900">
                  Заполните параметры
                </p>

                <p className="mt-3 leading-7 text-slate-600">
                  После расчёта здесь появится ориентировочная стоимость
                  выбранной работы.
                </p>
              </div>
            ) : (
              <div className="pt-6">
                <p className="text-sm text-slate-500">
                  {selectedService?.name || "Выбранная услуга"}
                  {selectedCity ? ` · ${selectedCity.name}` : ""}
                </p>

                <p className="mt-4 text-sm font-semibold text-slate-600">
                  Ориентировочная стоимость
                </p>

                <p className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
                  {Number(result.total_price).toLocaleString("ru-RU", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  ₽
                </p>

                <div className="mt-6 space-y-3 border-t border-[#eee8df] pt-5 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Средняя цена</span>
                    <span>
                      {Number(result.base_price).toLocaleString("ru-RU")} ₽
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Норма времени</span>
                    <span>{result.labor_time} ч.</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Коэффициент условий</span>
                    <span>×{result.total_coef}</span>
                  </div>
                </div>

                <p className="mt-6 rounded-xl bg-[#edf3f2] p-4 text-sm leading-6 text-[#28595a]">
                  Итог учитывает пробег, возраст автомобиля, доступ к месту
                  работ, срочность и необходимость специального инструмента.
                </p>
              </div>
            )}
          </aside>
        </section>
      )}
    </div>
  );
}