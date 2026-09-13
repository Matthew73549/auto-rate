import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Админка</h1>
      <p className="text-gray-700 mb-6">
        Управление услугами, ценами, автомобилями и городами.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <Link href="/admin/services" className="text-blue-600 hover:underline">
            Услуги
          </Link>
        </li>
        <li>
          <Link href="/admin/prices" className="text-blue-600 hover:underline">
            Цены
          </Link>
        </li>
        <li>
          <Link href="/admin/cars" className="text-blue-600 hover:underline">
            Автомобили
          </Link>
        </li>
        <li>
          <Link href="/admin/cities" className="text-blue-600 hover:underline">
            Города
          </Link>
        </li>
      </ul>
    </div>
  );
}