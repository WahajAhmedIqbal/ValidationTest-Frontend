import { Link, NavLink, Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">Nexa Console</Link>
          <nav className="space-x-4">
            <NavLink to="/" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700'}>Orders</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}


