import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, BookOpen, CakeSlice, Camera, Car, Check, Coffee, Dumbbell,
  HeartPulse, Home, Laptop, Leaf, Music, PawPrint, Plane, Pizza, Printer,
  Scissors, ShoppingBag, Sparkles, Stethoscope, Store, Trophy, Utensils,
} from 'lucide-react'
import NavBar from '../components/NavBar'

const ICONS = [
  { id: 'bubble-tea', label: 'Bubble tea', keywords: 'bubble tea boba drink beverage cafe', Icon: Coffee },
  { id: 'printer', label: 'Printer', keywords: 'printer printing office business', Icon: Printer },
  { id: 'coffee', label: 'Coffee', keywords: 'coffee cafe mug drink beverage', Icon: Coffee },
  { id: 'pizza', label: 'Pizza', keywords: 'pizza restaurant food italian', Icon: Pizza },
  { id: 'cake', label: 'Cake', keywords: 'cake bakery dessert food', Icon: CakeSlice },
  { id: 'utensils', label: 'Restaurant', keywords: 'restaurant food dining utensils', Icon: Utensils },
  { id: 'laptop', label: 'Technology', keywords: 'technology computer software laptop', Icon: Laptop },
  { id: 'camera', label: 'Camera', keywords: 'camera photography photo studio', Icon: Camera },
  { id: 'stethoscope', label: 'Medical', keywords: 'medical healthcare doctor stethoscope', Icon: Stethoscope },
  { id: 'heart-pulse', label: 'Health', keywords: 'health wellness healthcare heart', Icon: HeartPulse },
  { id: 'shopping-bag', label: 'Shopping', keywords: 'shopping retail store bag', Icon: ShoppingBag },
  { id: 'store', label: 'Store', keywords: 'store shop retail business', Icon: Store },
  { id: 'car', label: 'Car', keywords: 'car automotive transport vehicle', Icon: Car },
  { id: 'plane', label: 'Travel', keywords: 'travel plane flight vacation', Icon: Plane },
  { id: 'paw-print', label: 'Pet care', keywords: 'pet animal dog cat veterinary', Icon: PawPrint },
  { id: 'scissors', label: 'Beauty salon', keywords: 'salon beauty haircut scissors', Icon: Scissors },
  { id: 'dumbbell', label: 'Fitness', keywords: 'fitness gym exercise workout', Icon: Dumbbell },
  { id: 'trophy', label: 'Achievement', keywords: 'achievement award sports trophy', Icon: Trophy },
  { id: 'music', label: 'Music', keywords: 'music audio band', Icon: Music },
  { id: 'book-open', label: 'Education', keywords: 'education school book learning', Icon: BookOpen },
  { id: 'leaf', label: 'Nature', keywords: 'nature eco organic plant leaf', Icon: Leaf },
  { id: 'home', label: 'Real estate', keywords: 'home house real estate property', Icon: Home },
  { id: 'sparkles', label: 'Sparkles', keywords: 'sparkles creative design general', Icon: Sparkles },
]

const ChooseLogoIcon = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const filteredIcons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return ICONS
    return ICONS.filter((icon) => `${icon.label} ${icon.keywords}`.toLowerCase().includes(normalizedQuery))
  }, [query])

  const chooseIcon = (icon) => {
    setSelectedId(icon.id)
  }

  const confirmIcon = () => {
    const selectedIcon = ICONS.find((icon) => icon.id === selectedId)
    if (!selectedIcon) return
    localStorage.setItem('selectedLogoIcon', JSON.stringify({ id: selectedIcon.id, label: selectedIcon.label }))
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <NavBar />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <button type="button" onClick={() => navigate('/')} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to logo creator
        </button>
        <div className="mb-10 max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Logo icon library</p>
          <h1 className="text-4xl font-bold sm:text-5xl">Choose your icon</h1>
          <p className="mt-3 text-slate-300">Search by business idea or browse the full icon collection.</p>
        </div>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search icons, like bubble tea or printer"
          className="mb-8 w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-lg text-white outline-none placeholder:text-slate-400 focus:border-cyan-300"
          autoFocus
        />
        {filteredIcons.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {filteredIcons.map((icon) => {
              const Icon = icon.Icon
              const isSelected = selectedId === icon.id
              return (
                <button
                  key={icon.id}
                  type="button"
                  onClick={() => chooseIcon(icon)}
                  className={`relative rounded-2xl border p-5 text-left transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-400/10 ${isSelected ? 'border-cyan-300 bg-cyan-400/15' : 'border-white/10 bg-white/5'}`}
                >
                  {isSelected && <Check className="absolute right-3 top-3 h-4 w-4 text-cyan-300" />}
                  <Icon className="mb-8 h-9 w-9 text-cyan-300" strokeWidth={1.7} />
                  <span className="font-semibold">{icon.label}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-300">
            No icons match “{query}”. Try a broader keyword.
          </div>
        )}
        <div className="mt-10 flex justify-end">
          <button
            type="button"
            onClick={confirmIcon}
            disabled={!selectedId}
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Choose icon
          </button>
        </div>
      </main>
    </div>
  )
}

export default ChooseLogoIcon
