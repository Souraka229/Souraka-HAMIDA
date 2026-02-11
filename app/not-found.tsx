import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-gray-400 mb-8">Page not found</p>

        <Link href="/" className="inline-flex px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition">
          Go Home
        </Link>
      </div>
    </main>
  )
}
