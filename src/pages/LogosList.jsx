import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Plus } from 'lucide-react'
import NavBar from '../components/NavBar';

const STORAGE_KEY = 'createdLogos'

const LogosList = () => {
  const [logos, setLogos] = useState([])

  useEffect(() => {
    const storedLogos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    setLogos(storedLogos)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
    <NavBar />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Your creations
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">Logos you created</h1>
            <p className="mt-2 text-slate-300">
              Every logo you generate will appear here so you can review and reuse them.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
          >
            <Plus className="h-4 w-4" />
            Create another logo
          </Link>
        </div>

        {logos.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-xl backdrop-blur">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
              <Sparkles className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-semibold">No logos created yet</h2>
            <p className="mt-2 text-slate-400">
              Create your first logo and it will show up here instantly.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {logos.map((logo) => (
              <div
                key={logo.id}
                className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-xl backdrop-blur"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-bold text-white">
                  {logo.companyName.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-semibold text-white">{logo.companyName}</h3>
                <p className="mt-2 text-sm text-slate-300">
                  Industry: <span className="font-medium text-cyan-200">{logo.industry}</span>
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">
                  Created {new Date(logo.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LogosList