'use client'
import { useEffect, useState } from 'react'

export default function Test() {
  const [data, setData] = useState<any>(null)
  
  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/data')
      .then(r => r.json())
      .then(d => {
        console.log('GOT DATA:', d)
        setData(d)
      })
      .catch(e => console.log('ERROR:', e))
  }, [])
  
  if (!data) return <div>Loading...</div>
  
  return (
    <div>
      <h1>Test</h1>
      <p>Cities: {data.city?.length || 0}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
