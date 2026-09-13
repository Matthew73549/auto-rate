import { useRouter } from "next/router";

export default function PricingPage() {
  const router = useRouter();

  const tariffs = [
    {
      name: "Месяц",
      price: 1299,
      period: "/мес",
      effectivePrice: "",
      features: [
        "Безлимитные расчёты",
        "История расчётов",
        "Экспорт в Excel",
        "Email-уведомления",
      ],
    },
    {
      name: "Квартал",
      price: 3399,
      period: "/3 мес",
      effectivePrice: "1 133 ₽/мес",
      features: [
        "Всё из тарифа Месяц",
        "Экономия 15%",
        "Приоритетная поддержка",
      ],
    },
    {
      name: "Полгода",
      price: 6399,
      period: "/6 мес",
      effectivePrice: "1 066 ₽/мес",
      features: [
        "Всё из тарифа Квартал",
        "Экономия 20%",
        "Персональный менеджер",
      ],
    },
    {
      name: "Год",
      price: 11999,
      period: "/12 мес",
      effectivePrice: "999 ₽/мес",
      features: [
        "Всё из тарифа Полгода",
        "Экономия 33%",
        "VIP-поддержка 24/7",
      ],
    },
  ];

  const handleSelect = (tariffName: string) => {
    // TODO: Открыть окно оплаты
    alert(`Выбран тариф "${tariffName}". Скоро будет оплата!`);
  };

  return (
    <div className="min-h-screen bg-[#fbfaf7] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Шапка */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            💳 Тарифы
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Выберите подходящий тариф для вашего бизнеса
          </p>
        </div>

        {/* Карточки тарифов */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tariffs.map((tariff) => (
            <div
              key={tariff.name}
              className="rounded-2xl border border-[#e3dbd0] bg-white p-6 flex flex-col"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900">{tariff.name}</h3>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-slate-900">
                    {tariff.price.toLocaleString("ru-RU")}
                  </span>
                  <span className="text-slate-600 ml-1">{tariff.period}</span>
                </div>
                {tariff.effectivePrice && (
                  <p className="text-sm text-slate-500 mt-1">
                    ({tariff.effectivePrice})
                  </p>
                )}
              </div>

              <ul className="space-y-2 mb-6 flex-grow">
                {tariff.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-[#23686b]">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelect(tariff.name)}
                className="w-full rounded-xl bg-[#23686b] px-6 py-3 text-base font-bold text-white transition hover:bg-[#1a5558]"
              >
                Выбрать
              </button>
            </div>
          ))}
        </div>

        {/* Общая информация */}
        <div className="rounded-2xl border border-[#e3dbd0] bg-white p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Все тарифы включают
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">∞</div>
              <p className="font-semibold text-slate-900">Безлимитные расчёты</p>
              <p className="text-sm text-slate-600 mt-1">
                Считайте сколько угодно раз
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📊</div>
              <p className="font-semibold text-slate-900">История расчётов</p>
              <p className="text-sm text-slate-600 mt-1">
                Доступ ко всем расчётам за всё время
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📥</div>
              <p className="font-semibold text-slate-900">Экспорт в Excel</p>
              <p className="text-sm text-slate-600 mt-1">
                Выгружайте данные для отчётности
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📧</div>
              <p className="font-semibold text-slate-900">Email-уведомления</p>
              <p className="text-sm text-slate-600 mt-1">
                Напоминания об окончании подписки
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔒</div>
              <p className="font-semibold text-slate-900">Безопасность</p>
              <p className="text-sm text-slate-600 mt-1">
                Ваши данные под надёжной защитой
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">💬</div>
              <p className="font-semibold text-slate-900">Поддержка</p>
              <p className="text-sm text-slate-600 mt-1">
                Поможем с любыми вопросами
              </p>
            </div>
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/profile")}
            className="text-[#23686b] font-semibold hover:underline"
          >
            ← Вернуться в профиль
          </button>
        </div>
      </div>
    </div>
  );
}