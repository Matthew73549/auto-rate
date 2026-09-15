'use client'

import { useState, useEffect } from 'react'

interface Data {
  services: { id: number; name: string }[]
  city: { id: number; name: string }[]
  mileage: string[]
  age: string[]
  access: string[]
  urgency: string[]
  tool: string[]
}

interface CalculationResult {
  labor_time: number
  base_price: number
  total_coef: number
  total_price: number
}

interface HistoryItem {
  id: number
  service_id: number
  city_id: number
  mileage: string
  age: string
  access: string
  urgency: string
  tool: string
  labor_time: number
  base_price: number
  total_coef: number
  total_price: number
  created_at: string
}

export default function Home() {
  const [data, setData] = useState<Data | null>(null)
  const [selectedService, setSelectedService] = useState<number | null>(null)
  const [selectedCity, setSelectedCity] = useState<number | null>(null)
  const [selectedMileage, setSelectedMileage] = useState<string | ''>('')
  const [selectedAge, setSelectedAge] = useState<string | ''>('')
  const [selectedAccess, setSelectedAccess] = useState<string | ''>('')
  const [selectedUrgency, setSelectedUrgency] = useState<string | ''>('')
  const [selectedTool, setSelectedTool] = useState<string | ''>('')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/data')
      .then(res => res.json())
      .then(data => {
        console.log('API data:', data)
        console.log('City:', data.city); alert('Cities: ' + (data.city?.length || 0))
        setData(data)
      })
  }, [])

  useEffect(() => {
    if (showHistory) {
      fetch('http://127.0.0.1:5000/api/history')
        .then(res => res.json())
        .then(setHistory)
    }
  }, [showHistory])

  const handleCalculate = async () => {
    if (!selectedService || !selectedCity || !selectedMileage || !selectedAge || 
        !selectedAccess || !selectedUrgency || !selectedTool) {
      alert('Заполните все поля!')
      return
    }

    const response = await fetch('http://127.0.0.1:5000/api/calculator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: selectedService,
        city_id: selectedCity,
        mileage: selectedMileage,
        age: selectedAge,
        access: selectedAccess,
        urgency: selectedUrgency,
        tool: selectedTool
      })
    })

    const result = await response.json()
    setResult(result)
  }

  if (!data) {
    return <div>Загрузка...</div>
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Калькулятор стоимости работ</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Услуга:</label>
        <select 
          value={selectedService ?? ''} 
          onChange={e => setSelectedService(Number(e.target.value))}
          style={{ width: '300px', padding: '8px' }}
        >
          <option value="">Выберите услугу</option>
          {data.services.map(service => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Город:</label>
        <select 
          value={selectedCity ?? ''} 
          onChange={e => setSelectedCity(Number(e.target.value))}
          style={{ width: '300px', padding: '8px' }}
        >
          <option value="">Выберите город</option>
          {data.city.map(city => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Пробег:</label>
        <select 
          value={selectedMileage} 
          onChange={e => setSelectedMileage(e.target.value)}
          style={{ width: '300px', padding: '8px' }}
        >
          <option value="">Выберите пробег</option>
          {data.mileage.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Возраст авто:</label>
        <select 
          value={selectedAge} 
          onChange={e => setSelectedAge(e.target.value)}
          style={{ width: '300px', padding: '8px' }}
        >
          <option value="">Выберите возраст</option>
          {data.age.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Доступ:</label>
        <select 
          value={selectedAccess} 
          onChange={e => setSelectedAccess(e.target.value)}
          style={{ width: '300px', padding: '8px' }}
        >
          <option value="">Выберите доступ</option>
          {data.access.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Срочность:</label>
        <select 
          value={selectedUrgency} 
          onChange={e => setSelectedUrgency(e.target.value)}
          style={{ width: '300px', padding: '8px' }}
        >
          <option value="">Выберите срочность</option>
          {data.urgency.map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Инструмент:</label>
        <select 
          value={selectedTool} 
          onChange={e => setSelectedTool(e.target.value)}
          style={{ width: '300px', padding: '8px' }}
        >
          <option value="">Выберите инструмент</option>
          {data.tool.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <button 
        onClick={handleCalculate}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginBottom: '20px' }}
      >
        Рассчитать
      </button>

      {result && (
        <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2>Результат:</h2>
          <p>Время работы: {result.labor_time} ч.</p>
          <p>Базовая цена: {result.base_price} руб.</p>
          <p>Общий коэффициент: {result.total_coef.toFixed(2)}</p>
          <p><strong>Итоговая цена: {result.total_price} руб.</strong></p>
        </div>
      )}

      <button 
        onClick={() => setShowHistory(!showHistory)}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        {showHistory ? 'Скрыть историю' : 'Показать историю'}
      </button>

      {showHistory && history.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>История расчётов:</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#333', color: 'white' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Дата</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Услуга</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Город</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Цена</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {new Date(item.created_at).toLocaleString('ru-RU')}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {data.services.find(s => s.id === item.service_id)?.name}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {data.city.find(c => c.id === item.city_id)?.name}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {item.total_price} руб.
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
