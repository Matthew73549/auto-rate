import Link from "next/link";

const categoryNames: Record<string, string> = {
  "ТО": "Техническое обслуживание",
  engine: "Двигатель",
  transmission: "Трансмиссия",
  suspension: "Подвеска",
  brakes: "Тормоза",
  "Тормоза": "Тормоза",
  electrical: "Электрика",
  electrics: "Электрика",
  steering: "Рулевое управление",
  cooling: "Система охлаждения",
  fuel: "Топливная система",
  exhaust: "Выхлопная система",
  diagnostics: "Диагностика",
  "Диагностика": "Диагностика",
  wheels: "Колёса и шины",
  interior: "Салон",
  body: "Кузов",
  detailing: "Детейлинг",
  drivetrain: "Привод",
};

export default function ServiceCard({ service }: { service: any }) {
  const category = categoryNames[service.category] || service.category || "Услуга";

  return (
    <article className="group flex min-h-44 flex-col rounded-2xl border border-[#e3dbd0] bg-[#fbfaf7] p-5 transition hover:-translate-y-0.5 hover:border-[#a8c9c6] hover:shadow-md">
      <p className="text-sm font-bold text-[#23686b]">{category}</p>

      <h2 className="mt-3 text-xl font-bold leading-snug text-slate-900">
        {service.name}
      </h2>

      {service.description && (
        <p className="mt-3 line-clamp-3 leading-6 text-slate-600">
          {service.description}
        </p>
      )}

      <div className="mt-auto pt-5">
        <Link
          href="/calculator"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#23686b] transition group-hover:text-[#1a5558]"
        >
          Рассчитать стоимость <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}