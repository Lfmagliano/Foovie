'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import VideoPlayer from './VideoPlayer'

const TAG_LABEL = { popular: 'Popular', novo: 'Novo', veg: 'Vegano' }
const TAG_STYLE = {
  popular: { background: '#FFEEE8', color: '#C8541A' },
  novo:    { background: '#FFF7E0', color: '#9A6B00' },
  veg:     { background: '#E8F5EC', color: '#1A7A3C' },
}

function fmt(cents) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function SearchIcon({ color = 'var(--muted)' }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function PlayTriangle({ size = 6 }) {
  return (
    <span style={{
      display: 'inline-block', width: 0, height: 0,
      borderTop: `${size}px solid transparent`,
      borderBottom: `${size}px solid transparent`,
      borderLeft: `${size * 1.5}px solid currentColor`,
    }} />
  )
}

function SectionHead({ title, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 16px 2px' }}>
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, color: 'var(--text)' }}>{title}</h2>
      {count !== undefined && (
        <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 300 }}>{count} itens</span>
      )}
    </div>
  )
}

function FeaturedCard({ item, onClick }) {
  const thumb = item.cf_thumbnail_url ?? item.thumbnail_url
  return (
    <div onClick={onClick} style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border)' }}>
      {thumb
        ? <img src={thumb} alt={item.name} style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
        : <div style={{ width: '100%', height: 200, background: 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🥐</div>
      }
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 16px 16px', background: 'linear-gradient(0deg,rgba(28,18,8,.88) 0%,transparent 100%)' }}>
        {item.tag && (
          <span style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 6, marginBottom: 8 }}>
            ★ {TAG_LABEL[item.tag]}
          </span>
        )}
        <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 500, color: '#FFF8F0', lineHeight: 1.2, marginBottom: 4 }}>
          {item.name}
        </h3>
        {item.description && (
          <p style={{ fontSize: 11, color: 'rgba(255,240,220,0.6)', fontWeight: 300, lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.description}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 500, color: 'var(--gold2)' }}>
            {fmt(item.price)}
          </span>
          {item.cf_video_id && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.25)', borderRadius: 20, padding: '6px 12px 6px 9px', color: '#fff', fontSize: 11, fontWeight: 500 }}>
              <PlayTriangle /> Ver preparo
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ItemCard({ item, delay = 0, onClick }) {
  const thumb = item.cf_thumbnail_url ?? item.thumbnail_url
  return (
    <div
      onClick={onClick}
      className="animate-fade-up"
      style={{ display: 'flex', alignItems: 'stretch', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', minHeight: 92, border: '1px solid var(--border)', background: 'var(--card)', animationDelay: `${delay}s`, transition: 'transform .15s' }}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.985)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ position: 'relative', width: 96, minWidth: 96, overflow: 'hidden', background: '#F5EDE0' }}>
        {thumb
          ? <img src={thumb} alt={item.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, opacity: 0.4 }}>🍞</div>
        }
        {item.cf_video_id && (
          <div style={{ position: 'absolute', top: 7, left: 7, background: 'var(--accent)', borderRadius: 6, padding: '2px 7px 2px 5px', display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, color: '#fff', fontWeight: 600 }}>
            <PlayTriangle size={5} /> vídeo
          </div>
        )}
      </div>
      <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', lineHeight: 1.35, marginBottom: 3 }}>{item.name}</p>
          {item.description && (
            <p style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 300, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 6 }}>
              {item.description}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: 15, fontWeight: 500, color: 'var(--accent)' }}>{fmt(item.price)}</span>
          {item.tag && (
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', padding: '3px 8px', borderRadius: 8, ...TAG_STYLE[item.tag] }}>
              {TAG_LABEL[item.tag]}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MenuPageClient({ restaurant, sections, featured }) {
  const [activeCat, setActiveCat]       = useState('todos')
  const [search, setSearch]             = useState('')
  const [searchOpen, setSearchOpen]     = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const modalRef  = useRef(null)
  const searchRef = useRef(null)

  const allItems = sections.flatMap(s => s.items)

  const filtered = activeCat === 'todos'
    ? sections
    : sections.filter(s => s.category.id === activeCat)

  const searchResults = search.trim().length > 1
    ? allItems.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        (i.description ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : []

  useEffect(() => { if (searchOpen) searchRef.current?.focus() }, [searchOpen])

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setSelectedItem(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = selectedItem ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedItem])

  const closeModal = useCallback(e => {
    if (e.target === modalRef.current) setSelectedItem(null)
  }, [])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', maxWidth: 480, margin: '0 auto' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(160deg,#2A1500 0%,#4A2200 60%,#6B3410 100%)', padding: '48px 20px 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--gold2)', marginBottom: 16 }}>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--gold2)', display: 'inline-block' }} />
          Desde 2018
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--gold2)', display: 'inline-block' }} />
        </div>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(28px,8vw,38px)', fontWeight: 600, color: '#FFF8F0', lineHeight: 1.1, marginBottom: 6 }}>
          {restaurant.name}
        </h1>
        <p style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,240,220,0.6)', marginBottom: 24 }}>
          {restaurant.address}
          {restaurant.address && <span style={{ display: 'inline-block', width: 3, height: 3, borderRadius: '50%', background: 'var(--gold)', margin: '0 8px', verticalAlign: 'middle' }} />}
          {restaurant.is_open ? 'Aberto agora' : 'Fechado'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, paddingBottom: 24 }}>
          {[{ num: allItems.length, label: 'Itens' }, { num: '4.9', label: 'Nota' }, { num: 'Wi-Fi', label: 'Grátis' }].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 500, color: 'var(--gold2)', display: 'block' }}>{s.num}</span>
              <span style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,240,220,0.45)' }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ height: 28, background: 'var(--bg)', borderRadius: '28px 28px 0 0', marginTop: -1 }} />
      </div>

      {/* BUSCA */}
      <div style={{ padding: '0 16px 4px' }}>
        {!searchOpen ? (
          <button onClick={() => setSearchOpen(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 14, padding: '12px 14px', cursor: 'text', font: 'inherit' }}>
            <SearchIcon />
            <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 300 }}>Buscar no cardápio…</span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--card)', border: '1.5px solid var(--accent)', borderRadius: 14, padding: '12px 14px' }}>
              <SearchIcon color="var(--accent)" />
              <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar no cardápio…"
                style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, color: 'var(--text)', fontFamily: 'inherit', outline: 'none' }} />
            </div>
            <button onClick={() => { setSearchOpen(false); setSearch('') }} style={{ fontSize: 13, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* RESULTADOS DE BUSCA */}
      {search.trim().length > 1 && (
        <div style={{ padding: '12px 16px 0' }}>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>
            {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para &quot;{search}&quot;
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {searchResults.map(item => <ItemCard key={item.id} item={item} onClick={() => setSelectedItem(item)} />)}
          </div>
          {searchResults.length === 0 && (
            <p style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center', padding: '24px 0' }}>Nenhum item encontrado 🥐</p>
          )}
        </div>
      )}

      {/* CONTEÚDO NORMAL */}
      {!search.trim() && (
        <>
          {/* Categorias */}
          <div className="scrollbar-hide" style={{ display: 'flex', gap: 8, padding: '14px 16px', overflowX: 'auto' }}>
            {[{ id: 'todos', name: 'Todos' }, ...sections.map(s => s.category)].map(cat => (
              <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{ flexShrink: 0, fontSize: 12, fontWeight: 500, padding: '7px 16px', borderRadius: 20, whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all .2s', fontFamily: 'inherit', background: activeCat === cat.id ? 'var(--accent)' : 'var(--card)', color: activeCat === cat.id ? '#fff' : 'var(--text2)', border: activeCat === cat.id ? '1.5px solid var(--accent)' : '1.5px solid var(--border2)' }}>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Destaque */}
          {featured && activeCat === 'todos' && (
            <>
              <SectionHead title="Em destaque" />
              <div style={{ padding: '0 16px 4px' }}>
                <FeaturedCard item={featured} onClick={() => setSelectedItem(featured)} />
              </div>
            </>
          )}

          {/* Seções */}
          {filtered.map((section, si) => (
            <div key={section.category.id} style={{ paddingTop: 20 }}>
              <SectionHead title={section.category.name} count={section.items.length} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 16px 0' }}>
                {section.items.map((item, ii) => (
                  <ItemCard key={item.id} item={item} delay={si * 0.04 + ii * 0.06} onClick={() => setSelectedItem(item)} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {/* FOOTER */}
      <div style={{ textAlign: 'center', padding: '28px 20px 48px', marginTop: 28, borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'Fraunces, serif', fontStyle: 'italic' }}>
          Cardápio por <span style={{ color: 'var(--accent)', fontStyle: 'normal' }}>MenuQR</span>
        </p>
        {restaurant.wifi_name && (
          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, fontWeight: 300 }}>
            Wi-Fi: <strong style={{ color: 'var(--text2)', fontWeight: 500 }}>{restaurant.wifi_name}</strong>
            {restaurant.wifi_password ? ` · ${restaurant.wifi_password}` : ' · sem senha'}
          </p>
        )}
      </div>

      {/* MODAL */}
      <div ref={modalRef} onClick={closeModal} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(28,18,8,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', opacity: selectedItem ? 1 : 0, pointerEvents: selectedItem ? 'auto' : 'none', transition: 'opacity 0.25s' }}>
        <div className={selectedItem ? 'animate-slide-up' : ''} style={{ width: '100%', maxWidth: 480, maxHeight: '92vh', overflowY: 'auto', borderRadius: '24px 24px 0 0', border: '1px solid var(--border2)', background: 'var(--card)', scrollbarWidth: 'none' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border2)', margin: '12px auto 0' }} />
          {selectedItem && (
            <>
              <VideoPlayer item={selectedItem} />
              <div style={{ padding: '20px 20px 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 500, marginBottom: 8, color: 'var(--text)' }}>
                      {selectedItem.name}
                    </h2>
                    {selectedItem.description && (
                      <p style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 300, lineHeight: 1.7, marginBottom: 16 }}>
                        {selectedItem.description}
                      </p>
                    )}
                    <span style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 500, color: 'var(--accent)' }}>
                      {fmt(selectedItem.price)}
                    </span>
                  </div>
                  <button onClick={() => setSelectedItem(null)} style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--text2)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ✕
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  )
}