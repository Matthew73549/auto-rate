import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://auto-rate.onrender.com";

interface Service {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

interface CalculateResult {
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
}

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalculatorModal({ isOpen, onClose }: CalculatorModalProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CalculateResult | null>(null);
  const [error, setError] = useState('');
  const [dataLoading, setDataLoading] = useState(true);

  const [selectedService, setSelectedService] = useState<{ value: string; label: string } | null>(null);
  const [selectedCity, setSelectedCity] = useState<{ value: string; label: string } | null>(null);

  const [formData, setFormData] = useState({
    mileage: 'under_50k',
    age: 'under_3',
    access: 'normal',
    urgency: 'normal',
    tool: 'none',
  });

  useEffect(() => {
    const loadApiData = async () => {
      setDataLoading(true);
      setError('');
      setResult(null);

      try {
        const [servicesRes, citiesRes] = await Promise.all([
          fetch(`${API_URL}/api/services`),
          fetch(`${API_URL}/api/services/cities`),
        ]);

        const services = servicesRes.ok ? await servicesRes.json() : [];
        const cities = citiesRes.ok ? await citiesRes.json() : [];

        setServices(services);
        setCities(cities);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Не удалось загрузить данные. Убедитесь, что бэкенд доступен.');
      } finally {
        setDataLoading(false);
      }
    };

    if (isOpen) {
      loadApiData();
    } else {
      // Сброс при закрытии
      setSelectedService(null);
      setSelectedCity(null);
      setResult(null);
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService || !selectedCity) {
      setError('Выберите услугу и город');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/api/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: parseInt(selectedService.value),
          city_id: parseInt(selectedCity.value),
          mileage: formData.mileage,
          age: formData.age,
          access: formData.access,
          urgency: formData.urgency,
          tool: formData.tool,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Ошибка расчёта');
      }
    } catch (err) {
      setError('Не удалось подключиться к серверу');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const serviceOptions = services.map(s => ({
    value: String(s.id),
    label: s.name,
  }));

  const cityOptions = cities.map(c => ({
    value: String(c.id),
    label: c.name,
  }));

  const customStyles = {
    control: (base: any) => ({
      ...base,
      borderColor: '#d1d5db',
      borderRadius: '0.5rem',
      padding: '0.25rem',
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">🔧 Калькулятор стоимости</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-3xl font-light"
            >
              ×
            </button>
          </div>

          {dataLoading ? (
            <div className="text-center py-12 text-gray-500">
              Загрузка данных...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Услуга</label>
                <Select
                  value={selectedService}
                  onChange={(option) => setSelectedService(option)}
                  options={serviceOptions}
                  placeholder="Начните вводить название услуги..."
                  isClearable
                  isSearchable
                  styles={customStyles}
                  noOptionsMessage={() => 'Услуга не найдена'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Город</label>
                <Select
                  value={selectedCity}
                  onChange={(option) => setSelectedCity(option)}
                  options={cityOptions}
                  placeholder="Начните вводить название города..."
                  isClearable
                  isSearchable
                  styles={customStyles}
                  noOptionsMessage={() => 'Город не найден'}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Пробег</label>
                  <select
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="under_50k">До 50 000 км</option>
                    <option value="50k_100k">50 000 - 100 000 км</option>
                    <option value="100k_200k">100 000 - 200 000 км</option>
                    <option value="over_200k">Более 200 000 км</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Возраст авто</label>
                  <select
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="under_3">До 3 лет</option>
                    <option value="3_7">3 - 7 лет</option>
                    <option value="7_15">7 - 15 лет</option>
                    <option value="over_15">Более 15 лет</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Доступ к месту</label>
                  <select
                    value={formData.access}
                    onChange={(e) => setFormData({ ...formData, access: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="normal">Нормальный</option>
                    <option value="difficult">Затруднён</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Срочность</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="normal">Обычная</option>
                    <option value="urgent">Срочная</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Спец. инструмент</label>
                  <select
                    value={formData.tool}
                    onChange={(e) => setFormData({ ...formData, tool: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="none">Не нужен</option>
                    <option value="special">Нужен</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !selectedService || !selectedCity}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Расчёт...' : 'Рассчитать стоимость'}
              </button>
            </form>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              ⚠️ {error}
            </div>
          )}

          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-lg mb-3 text-green-600">✓ Результат расчёта</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Услуга:</span>
                  <span className="font-medium">{selectedService?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Город:</span>
                  <span className="font-medium">{selectedCity?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Базовая цена:</span>
                  <span>{result.base_price} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span>Время работ:</span>
                  <span>{result.labor_time} ч.</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Пробег (×{result.coef_mileage}):</span>
                    <span>{(result.base_price * result.labor_time * (result.coef_mileage - 1)).toFixed(0)} ₽</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Возраст (×{result.coef_age}):</span>
                    <span>{(result.base_price * result.labor_time * (result.coef_age - 1)).toFixed(0)} ₽</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Доступ (×{result.coef_access}):</span>
                    <span>{(result.base_price * result.labor_time * (result.coef_access - 1)).toFixed(0)} ₽</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Срочность (×{result.coef_urgency}):</span>
                    <span>{(result.base_price * result.labor_time * (result.coef_urgency - 1)).toFixed(0)} ₽</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Инструмент (×{result.coef_tool}):</span>
                    <span>{(result.base_price * result.labor_time * (result.coef_tool - 1)).toFixed(0)} ₽</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Итого:</span>
                  <span className="text-green-600">{result.total_price} ₽</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}