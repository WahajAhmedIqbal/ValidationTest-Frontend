import api from './client'

export type Order = {
  id: number
  title: string
  description?: string
  status: 'new' | 'assigned' | 'in_progress' | 'completed' | 'rejected'
  customerName?: string
  customerPhone?: string
  geo_lat?: number
  geo_lng?: number
  assignedMasterId?: number | null
  createdAt: string
  updatedAt: string
}

export async function listOrders() {
  const { data } = await api.get<Order[]>('/orders')
  return data
}

export async function getOrder(id: number) {
  const { data } = await api.get(`/orders/${id}`)
  return data
}

export async function createOrder(payload: Partial<Order>) {
  const { data } = await api.post('/orders', payload)
  return data
}

export async function assignOrder(id: number) {
  const { data } = await api.post(`/orders/${id}/assign`)
  return data
}

export async function attachAdl(id: number, payload: { type: 'photo'|'video', url: string, gps_lat: number, gps_lng: number, capturedAt: string, meta?: any }) {
  const { data } = await api.post(`/orders/${id}/adl`, payload)
  return data
}

export async function completeOrder(id: number) {
  const { data } = await api.post(`/orders/${id}/complete`)
  return data
}

export async function cancelOrder(id: number) {
  const { data } = await api.post(`/orders/${id}/cancel`)
  return data
}

export async function updateStatus(id: number, status: Order['status']) {
  const { data } = await api.patch(`/orders/${id}/status`, { status })
  return data
}


