import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-[#f7f4ef] text-slate-800">
      {/* Липкая шапка */}
      <header className="sticky top-0 z-50 border-b border-[#e5ddd2] bg-[#fbfaf7]/90 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-5 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#23686b] text-lg text-white shadow-sm">
              🚗
            </span>

            <span className="leading-tight">
              <span className="block text-sm font-bold text-slate-900">
                AutoRate
              </span>
              <span className="block text-xs text-slate-600">
                Честные цены на автоуслуги
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-semibold text-slate-600 transition hover:text-[#23686b] sm:inline"
            >
              Войти
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-[#23686b] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1b5759] sm:px-5"
            >
              Начать бесплатно →
            </Link>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        <Component {...pageProps} />
      </main>

      {/* Футер */}
      <footer className="mt-16 border-t border-[#e5ddd2] bg-[#fbfaf7]">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-slate-600 sm:px-6">
          © {new Date().getFullYear()} AutoRate. Все права защищены.
        </div>
      </footer>
    </div>
  );
}