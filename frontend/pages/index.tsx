import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import CalculatorModal from "../components/CalculatorModal";

const popularServices = [
  { title: "Замена масла", category: "ТО" },
  { title: "Замена тормозных колодок", category: "Тормоза" },
  { title: "Компьютерная диагностика", category: "Диагностика" },
  { title: "Замена свечей зажигания", category: "Электрика" },
  { title: "Замена сцепления", category: "Трансмиссия" },
  { title: "Ремонт подвески", category: "Подвеска" },
];

const advantages = [
  {
    number: "01",
    title: "Выберите услугу",
    text: "Найдите нужную работу в каталоге или через поиск.",
  },
  {
    number: "02",
    title: "Укажите город",
    text: "Добавьте город, чтобы увидеть более подходящий ориентир.",
  },
  {
    number: "03",
    title: "Сравните цены",
    text: "Узнайте разумный диапазон стоимости до визита в сервис.",
  },
];

const faqItems = [
  {
    question: "Откуда берутся цены?",
    answer:
      "AutoRate собирает и приводит к единому виду данные по автоуслугам, чтобы показать понятный ориентир по стоимости работ.",
  },
  {
    question: "Это точная цена ремонта?",
    answer:
      "Нет. Итоговая стоимость зависит от марки автомобиля, сложности работ, запчастей и конкретного автосервиса. Сервис показывает ориентир для сравнения.",
  },
  {
    question: "Можно пользоваться бесплатно?",
    answer:
      "Да. Поиск услуг и просмотр ориентировочных цен доступны бесплатно.",
  },
  {
    question: "Для каких городов работает сервис?",
    answer:
      "Вы можете указать свой город в поиске. Если по нему пока мало данных, сервис всё равно покажет общий ориентир.",
  },
];

export default function Home() {
  const router = useRouter();
  const [service, setService] = useState("");
  const [city, setCity] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (service.trim()) {
      params.set("search", service.trim());
    }

    if (city.trim()) {
      params.set("city", city.trim());
    }

    const query = params.toString();
    router.push(query ? `/services?${query}` : "/services");
  };

  const openCalculator = () => {
    setIsCalculatorOpen(true);
  };

  const closeCalculator = () => {
    setIsCalculatorOpen(false);
  };

  return (
    <div className="hero-shell">
      {/* Hero */}
      <section className="hero">
        <div className="container-x">
          <div className="hero-grid">
            {/* Левая часть: текст + кнопки */}
            <div>
              <div className="eyebrow">
                <span />
                Ориентир по стоимости работ
              </div>

              <h1>
                Сравните цены на <span>автоуслуги</span>
              </h1>

              <div className="hero-copy">
                <p>
                  Узнайте ориентировочную стоимость ремонта, обслуживания и
                  диагностики автомобиля по России и в вашем городе.
                </p>
              </div>

              <form
                onSubmit={handleSearch}
                className="mt-6 rounded-2xl border border-[var(--hero-x-card-line)] bg-white p-4 shadow-sm sm:grid-cols-2"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Какая услуга нужна?
                    </span>
                    <input
                      value={service}
                      onChange={(event) => setService(event.target.value)}
                      placeholder="Например, замена масла"
                      className="w-full rounded-xl border border-[#d9d1c6] bg-[#fbfaf7] px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--hero-accent)] focus:ring-2 focus:ring-[var(--hero-accent)]/15"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                      Ваш город
                    </span>
                    <input
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      placeholder="Например, Москва"
                      className="w-full rounded-xl border border-[#d9d1c6] bg-[#fbfaf7] px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--hero-accent)] focus:ring-2 focus:ring-[var(--hero-accent)]/15"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="mt-3 w-full rounded-xl bg-[var(--hero-accent)] px-5 py-3.5 text-base font-bold text-white transition hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-[var(--hero-accent)]/20 sm:mt-4 sm:w-auto"
                >
                  Сравнить цены →
                </button>
              </form>

              <div className="hero-benefits">
                <span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Каталог услуг
                </span>
                <span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Расчёт стоимости
                </span>
                <span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Данные по городам
                </span>
              </div>
            </div>

            {/* Правая часть: визуал с карточкой */}
            <div className="hero-visual">
              <div className="visual-grid" />

              <div className="estimate-card rise">
                <div className="estimate-heading">
                  <div className="square-icon">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <strong>Ориентир по цене</strong>
                    <div className="meta">
                      <span>Замена масла</span>
                      <span>•</span>
                      <span>Москва</span>
                      <span className="tiny-dot" />
                    </div>
                  </div>
                </div>

                <div className="estimate-body">
                  <span className="overline">Примерный диапазон</span>
                  <div className="big-price">
                    2 200 <span>₽</span>
                  </div>

                  <div className="price-range">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <i style={{ left: "38%" }} />
                  </div>
                  <div className="range-label">
                    <span>1 500 ₽</span>
                    <span>3 500 ₽</span>
                  </div>

                  <div className="receipt-row">
                    <span>Работа</span>
                    <b>1 200 ₽</b>
                  </div>
                  <div className="receipt-row">
                    <span>Материалы</span>
                    <b>1 000 ₽</b>
                    <em>масло 5W‑40</em>
                  </div>

                  <div className="receipt-total">
                    <span>Итого</span>
                    <strong>2 200 ₽</strong>
                  </div>

                  <div className="soft-note">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                    <span>
                      Это ориентир. Итоговая цена зависит от автомобиля и сервиса.
                    </span>
                  </div>
                </div>

                <div className="estimate-foot">
                  AutoRate — честные цены на автоуслуги
                </div>

                {/* Плавающие элементы */}
                <div className="floating-label">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  <span>Проверено</span>
                </div>

                <div className="floating-bottom">
                  <div className="check-round">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <div>
                    <b>Средняя цена</b>
                    <div>
                      <span>по данным сервисов</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div className="trust-strip">
        <div className="container-x">
          <span>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
            Прозрачные ориентиры
          </span>
          <span>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Экономия времени
          </span>
          <span>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M12 2 2 7l10 5 10-5-10-5Z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Работы по категориям
          </span>
          <span>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <path d="M16 2v4" />
              <path d="M8 2v4" />
              <path d="M3 10h18" />
            </svg>
            Актуальные данные
          </span>
        </div>
      </div>
      {/* Быстрый расчёт */}
      <section id="calculator" className="container-x" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="feature-card">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--hero-accent)]">
                Быстрый расчёт
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Получите ориентир за пару минут
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                Выберите услугу, параметры автомобиля и город — калькулятор
                подскажет примерный диапазон стоимости.
              </p>
            </div>

            <button
              type="button"
              onClick={openCalculator}
              className="btn-x primary"
            >
              Открыть калькулятор →
            </button>
          </div>
        </div>
      </section>

      {/* Каталог */}
      <section id="services" className="container-x" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--hero-accent)]">
              Каталог
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Популярные услуги
            </h2>
          </div>

          <Link href="/services" className="btn-secondary">
            Открыть все услуги →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularServices.map((item) => (
            <Link
              key={item.title}
              href={`/services?search=${encodeURIComponent(item.title)}`}
              className="feature-card"
            >
              <p className="text-sm font-semibold text-[var(--hero-accent)]">
                {item.category}
              </p>
              <div className="mt-3 flex items-start justify-between gap-4">
                <h3 className="text-lg font-bold leading-snug text-slate-900">
                  {item.title}
                </h3>
                <span className="text-xl text-[#e77b35] transition group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Как это работает */}
      <section id="how-it-works" className="container-x" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="feature-card" style={{ background: "var(--hero-x-hero-3)" }}>
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--hero-accent)]">
              Как это работает
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              От поиска услуги до понятной цены
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {advantages.map((item) => (
              <article
                key={item.number}
                className="rounded-2xl border border-[var(--hero-x-card-line)] bg-white p-6"
              >
                <p className="text-sm font-bold text-[var(--hero-accent)]">
                  {item.number}
                </p>
                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container-x" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--hero-accent)]">
            Ответы на вопросы
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Всё, что важно знать о расчёте
          </h2>
        </div>

        <div className="mt-6 divide-y divide-[var(--hero-x-card-line)] overflow-hidden rounded-2xl border border-[var(--hero-x-card-line)] bg-white">
          {faqItems.map((item, index) => {
            const isOpen = openFaq === index;

            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left transition hover:bg-[var(--hero-x-hero-1)] sm:px-6"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-bold text-slate-900">
                    {item.question}
                  </span>
                  <span className="text-2xl font-medium text-[var(--hero-accent)]">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <p className="border-t border-[var(--hero-x-card-line)] px-5 py-5 leading-7 text-slate-600 sm:px-6">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
      {/* CTA */}
      <section className="container-x" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div
          className="feature-card"
          style={{
            background: "linear-gradient(135deg, var(--hero-accent), #1d4ed8)",
            color: "#ffffff",
          }}
        >
          <div className="text-center">
            <p
              className="text-sm font-bold uppercase tracking-[0.14em]"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              Начните сейчас
            </p>
            <h2
              className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ color: "#ffffff" }}
            >
              Проверьте стоимость автоуслуги до обращения в сервис
            </h2>
            <p
              className="mx-auto mt-4 max-w-xl leading-7"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              Найдите нужную работу, сравните ориентир по цене и принимайте
              решение уверенно.
            </p>

            <Link
              href="/services"
              className="btn-secondary"
              style={{
                marginTop: 28,
                background: "#ffffff",
                color: "#111827",
                borderColor: "rgba(255,255,255,0.5)",
              }}
            >
              Найти услугу →
            </Link>
          </div>
        </div>
      </section>

      <CalculatorModal isOpen={isCalculatorOpen} onClose={closeCalculator} />
    </div>
  );
}