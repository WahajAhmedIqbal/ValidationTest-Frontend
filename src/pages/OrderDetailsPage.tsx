import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { assignOrder, attachAdl, cancelOrder, completeOrder, getOrder, updateStatus } from '../api/orders'

export default function OrderDetailsPage() {
  const { id } = useParams()
  const orderId = Number(id)
  const [data, setData] = useState<any>()
  const [msg, setMsg] = useState<string|undefined>()
  const [adl, setAdl] = useState({ type: 'photo', url: '', gps_lat: '', gps_lng: '', capturedAt: '' })

  async function load() {
    const o = await getOrder(orderId)
    setData(o)
  }

  useEffect(() => { if (orderId) load() }, [orderId])

  async function onAssign() {
    try { await assignOrder(orderId); setMsg('Assigned'); await load() } catch (e:any) { setMsg(e?.response?.data?.error || e.message) }
  }
  async function onComplete() {
    try { await completeOrder(orderId); setMsg('Completed'); await load() } catch (e:any) { setMsg(e?.response?.data?.error || e.message) }
  }
  async function onReject() {
    try { await cancelOrder(orderId); setMsg('Rejected'); await load() } catch (e:any) { setMsg(e?.response?.data?.error || e.message) }
  }
  async function onAdl(e: React.FormEvent) {
    e.preventDefault()
    try {
      await attachAdl(orderId, {
        type: adl.type as any,
        url: adl.url,
        gps_lat: Number(adl.gps_lat),
        gps_lng: Number(adl.gps_lng),
        capturedAt: adl.capturedAt
      })
      setMsg('ADL uploaded')
      setAdl({ type: 'photo', url: '', gps_lat: '', gps_lng: '', capturedAt: '' })
      await load()
    } catch (e:any) { setMsg(e?.response?.data?.error || e.message) }
  }

  async function onMarkInProgress() {
    try { await updateStatus(orderId, 'in_progress'); setMsg('Marked in_progress'); await load() } catch (e:any) { setMsg(e?.response?.data?.error || e.message) }
  }

  if (!data) return <p>Loading...</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Order #{data.id}</h1>
        <Link to="/" className="text-blue-600 underline">Back</Link>
      </div>
      {msg && <div className="p-2 rounded bg-yellow-50 border text-sm">{msg}</div>}

      <section className="bg-white p-4 rounded-md shadow grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="text-sm text-gray-500">Title</div>
          <div>{data.title}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Status</div>
          <div><span className="px-2 py-0.5 rounded bg-gray-100 border">{data.status}</span></div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Assigned Master</div>
          <div>{data.master ? `${data.master.name} (#${data.master.id})` : '—'}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Location</div>
          <div>{data.geo_lat}, {data.geo_lng}</div>
        </div>
      </section>

      <section className="bg-white p-4 rounded-md shadow space-y-3">
        <div className="font-semibold">Actions</div>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={onAssign}>Assign</button>
          <button className="px-3 py-1 rounded bg-gray-800 text-white" onClick={onMarkInProgress}>Mark In Progress</button>
          <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={onComplete}>Complete</button>
          <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={onReject}>Reject</button>
        </div>
      </section>

      <section className="bg-white p-4 rounded-md shadow">
        <div className="font-semibold mb-3">Upload ADL</div>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={onAdl}>
          <select className="border rounded px-2 py-1" value={adl.type} onChange={e=>setAdl({...adl, type: e.target.value})}>
            <option value="photo">photo</option>
            <option value="video">video</option>
          </select>
          <input className="border rounded px-2 py-1" placeholder="URL" value={adl.url} onChange={e=>setAdl({...adl,url:e.target.value})} required />
          <input className="border rounded px-2 py-1" placeholder="GPS lat" value={adl.gps_lat} onChange={e=>setAdl({...adl,gps_lat:e.target.value})} required />
          <input className="border rounded px-2 py-1" placeholder="GPS lng" value={adl.gps_lng} onChange={e=>setAdl({...adl,gps_lng:e.target.value})} required />
          <input className="border rounded px-2 py-1" placeholder="CapturedAt ISO" value={adl.capturedAt} onChange={e=>setAdl({...adl,capturedAt:e.target.value})} required />
          <div className="sm:col-span-2">
            <button className="bg-blue-600 text-white px-3 py-1 rounded">Upload</button>
          </div>
        </form>
      </section>

      <section className="bg-white p-4 rounded-md shadow">
        <div className="font-semibold mb-2">ADL Entries</div>
        <ul className="list-disc ml-5 space-y-1">
          {data.adl?.map((a:any) => (
            <li key={a.id}>
              <span className="font-mono text-xs">[{a.type}]</span> <a className="text-blue-600 underline" href={a.url} target="_blank">media</a> — {a.capturedAt}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}


