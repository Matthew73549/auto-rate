import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const API_URL = "http://localhost:5000";

type UserProfile = {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  user_type: string;
  inn: string;
  city: string;
  address: string;
  company_name: string;
  subscription_end: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    user_type: "individual",
    inn: "",
    company_name: "",
    city: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      router.push("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/profile?user_id=${userId}`);
        const data = response.data;
        setProfile(data);
        setForm({
          full_name: data.full_name || "",
          phone: data.phone || "",
          user_type: data.user_type || "individual",
          inn: data.inn || "",
          company_name: data.company_name || "",
          city: data.city || "",
          address: data.address || "",
        });
      } catch {
        setError("Не удалось загрузить профиль");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleSave = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    setIsSaving(true);
    setError("");

    try {
      await axios.put(`${API_URL}/api/profile`, {
        user_id: userId,
        ...form,
      });
      setIsEditing(false);
      // Перезагружаем профиль
      const response = await axios.get(`${API_URL}/api/profile?user_id=${userId}`);
      setProfile(response.data);
    } catch {
      setError("Не удалось сохранить профиль");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    router.push("/login");
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
          <h1 className="text-3xl font-bold text-slate-900">Личный кабинет</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-600 hover:text-[#23686b] transition"
          >
            Выйти
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-[#e8b8a4] bg-[#fff3ee] p-4 text-[#8d3d20]">
            {error}
          </div>
        )}

        {/* Профиль */}
        <section className="rounded-2xl border border-[#e3dbd0] bg-white p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">👤 Профиль</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-[#23686b] font-semibold hover:underline"
              >
                Редактировать
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="text-sm text-[#23686b] font-semibold hover:underline disabled:opacity-50"
                >
                  {isSaving ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-3">
              <p><span className="text-slate-500">Email:</span> {profile?.email}</p>
              <p><span className="text-slate-500">Имя:</span> {profile?.full_name || "Не указано"}</p>
              <p><span className="text-slate-500">Телефон:</span> {profile?.phone || "Не указан"}</p>
              <p><span className="text-slate-500">Тип:</span> {profile?.user_type === "individual" ? "Частный механик" : "Автосервис"}</p>
              {profile?.user_type === "service" && (
                <>
                  <p><span className="text-slate-500">Название:</span> {profile?.company_name || "Не указано"}</p>
                  <p><span className="text-slate-500">ИНН:</span> {profile?.inn || "Не указан"}</p>
                </>
              )}
              <p><span className="text-slate-500">Город:</span> {profile?.city || "Не указан"}</p>
              <p><span className="text-slate-500">Адрес:</span> {profile?.address || "Не указан"}</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Тип пользователя
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="user_type"
                      value="individual"
                      checked={form.user_type === "individual"}
                      onChange={(e) => setForm({ ...form, user_type: e.target.value })}
                      className="text-[#23686b]"
                    />
                    <span className="text-slate-700">Частный механик</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="user_type"
                      value="service"
                      checked={form.user_type === "service"}
                      onChange={(e) => setForm({ ...form, user_type: e.target.value })}
                      className="text-[#23686b]"
                    />
                    <span className="text-slate-700">Автосервис</span>
                  </label>
                </div>
              </div>

              {form.user_type === "service" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Название сервиса
                    </label>
                    <input
                      type="text"
                      value={form.company_name}
                      onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                      className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      ИНН
                    </label>
                    <input
                      type="text"
                      value={form.inn}
                      onChange={(e) => setForm({ ...form, inn: e.target.value })}
                      className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Город
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Адрес
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full rounded-xl border border-[#d9d1c6] bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-[#23686b] focus:ring-2 focus:ring-[#23686b]/15"
                />
              </div>
            </div>
          )}
        </section>

        {/* Подписка */}
        <section className="rounded-2xl border border-[#e3dbd0] bg-white p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">💎 Подписка</h2>
          <div className="space-y-3">
            <p><span className="text-slate-500">Текущий тариф:</span> Пробный (7 дней)</p>
            <p><span className="text-slate-500">Активна до:</span> {profile?.subscription_end || "Не указано"}</p>
          </div>
          <button
            onClick={() => router.push("/pricing")}
            className="mt-6 rounded-xl bg-[#23686b] px-6 py-3 text-base font-bold text-white transition hover:bg-[#1a5558]"
          >
            Продлить подписку
          </button>
        </section>

        {/* Статистика */}
        <section className="rounded-2xl border border-[#e3dbd0] bg-white p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">📊 Статистика</h2>
            <button
              onClick={() => router.push("/history")}
              className="text-sm text-[#23686b] font-semibold hover:underline"
            >
              Вся история →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#edf3f2] p-4">
              <p className="text-sm text-slate-600">Расчётов за 48 часов</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
            <div className="rounded-xl bg-[#edf3f2] p-4">
              <p className="text-sm text-slate-600">Расчётов всего</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}