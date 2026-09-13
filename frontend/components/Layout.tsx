import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = Cookies.get("access_token");

  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-700 text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            AutoRate
          </Link>
          <nav className="space-x-4 space-x-reverse">
            <Link href="/services" className="hover:underline">
              Услуги
            </Link>
            <Link href="/calculator" className="hover:underline">
              Калькулятор
            </Link>
            <Link href="/cars" className="hover:underline">
              Авто
            </Link>
            <Link href="/vin" className="hover:underline">
              VIN
            </Link>
            <Link href="/pricing" className="hover:underline">
              Тарифы
            </Link>
            {!token ? (
              <>
                <Link href="/login" className="hover:underline">
                  Вход
                </Link>
                <Link href="/register" className="hover:underline">
                  Регистрация
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="hover:underline">
                Выход
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <footer className="bg-gray-800 text-gray-300">
        <div className="container mx-auto px-4 py-4 text-sm">
          <div className="flex flex-wrap justify-between">
            <div>
              © {new Date().getFullYear()} AutoRate. Все права защищены.
            </div>
            <div className="space-x-4 space-x-reverse">
              <a href="/offer" className="hover:underline">
                Оферта
              </a>
              <a href="/privacy" className="hover:underline">
                Конфиденциальность
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}