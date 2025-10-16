import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { createOrder, listOrders, Order } from '../api/orders'

const statuses: Order['status'][] = ['new','assigned','in_progress','completed','rejected']

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|undefined>()
  const [filter, setFilter] = useState<Order['status']|''>('')

  const [form, setForm] = useState({ title: '', description: '', geo_lat: '', geo_lng: '' })
  const [submitMsg, setSubmitMsg] = useState<string|undefined>()

  const filtered = useMemo(() => orders.filter(o => !filter || o.status === filter), [orders, filter])

  async function load() {
    try {
      setLoading(true)
      const data = await listOrders()
      setOrders(data)
    } catch (e:any) {
      setError(e?.response?.data?.error || e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    setSubmitMsg(undefined)
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        geo_lat: Number(form.geo_lat),
        geo_lng: Number(form.geo_lng)
      }
      const created = await createOrder(payload)
      setSubmitMsg(`Created order #${created.id}`)
      setForm({ title: '', description: '', geo_lat: '', geo_lng: '' })
      await load()
    } catch (e:any) {
      setSubmitMsg(e?.response?.data?.error || e.message)
    }
  }

  return (
    <div className="space-y-8">
      <section className="bg-white p-4 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-3">Create Order</h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={onCreate}>
          <input className="border rounded px-2 py-1" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required />
          <input className="border rounded px-2 py-1" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
          <input className="border rounded px-2 py-1" placeholder="Latitude" value={form.geo_lat} onChange={e=>setForm({...form,geo_lat:e.target.value})} required />
          <input className="border rounded px-2 py-1" placeholder="Longitude" value={form.geo_lng} onChange={e=>setForm({...form,geo_lng:e.target.value})} required />
          <div className="sm:col-span-2 flex items-center gap-3">
            <button className="bg-blue-600 text-white px-3 py-1 rounded">Create</button>
            {submitMsg && <p className="text-sm text-gray-600">{submitMsg}</p>}
          </div>
        </form>
      </section>

      <section className="bg-white p-4 rounded-md shadow">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Orders</h2>
          <div className="flex items-center gap-2">
            <select className="border rounded px-2 py-1" value={filter} onChange={e=>setFilter(e.target.value as any)}>
              <option value=''>All</option>
              {statuses.map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="text-sm underline" onClick={load}>Refresh</button>
          </div>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} className="border-b">
                  <td className="py-2 pr-4">{o.id}</td>
                  <td className="py-2 pr-4">{o.title}</td>
                  <td className="py-2 pr-4"><span className="px-2 py-0.5 rounded bg-gray-100 border">{o.status}</span></td>
                  <td className="py-2 pr-4">
                    <Link className="text-blue-600 underline" to={`/orders/${o.id}`}>Open</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}


