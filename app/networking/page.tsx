'use client'
import { useState, useEffect, useRef } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { createClient } from '@/lib/supabase-browser'

const supabase = createClient()

interface DJProfile {
  id: string
  nombre_artistico: string
  ciudad: string
  bio: string
  instagram: string
  soundcloud: string
  genres: string[]
  looking_for: string[]
  visible: boolean
}

interface Message {
  id: string
  from_id: string
  to_id: string
  content: string
  created_at: string
}

const GENRES = ['House', 'Afro House', 'Techno', 'Melodic', 'Deep House', 'D&B', 'Disco', 'Trance']
const LOOKING_FOR_OPTIONS = ['b2b', 'Warm-up', 'Residency swap', 'Festival', 'Booking']

export default function NetworkingPage() {
  const [activeTab, setActiveTab] = useState<'directory' | 'messages' | 'profile'>('directory')
  const [djs, setDjs] = useState<DJProfile[]>([])
  const [currentUser, setCurrentUser] = useState<DJProfile | null>(null)
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(true)
  const [cityFilter, setCityFilter] = useState('All')
  const [genreFilter, setGenreFilter] = useState('All')

  const [selectedDJ, setSelectedDJ] = useState<DJProfile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<DJProfile[]>([])
  const [newMsg, setNewMsg] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [editGenres, setEditGenres] = useState<string[]>([])
  const [editLooking, setEditLooking] = useState<string[]>([])
  const [editVisible, setEditVisible] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    setUserId(user.id)

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile) {
      setCurrentUser(profile)
      setEditGenres(profile.genres || [])
      setEditLooking(profile.looking_for || [])
      setEditVisible(profile.visible !== false)
    }

    const { data: allDJs } = await supabase
      .from('profiles')
      .select('*')
      .neq('id', user.id)
      .eq('visible', true)

    setDjs(allDJs || [])
    setLoading(false)
  }

  async function loadMessages(djId: string) {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(from_id.eq.${userId},to_id.eq.${djId}),and(from_id.eq.${djId},to_id.eq.${userId})`)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  async function sendMessage() {
    if (!newMsg.trim() || !selectedDJ) return
    const { error } = await supabase.from('messages').insert({
      from_id: userId,
      to_id: selectedDJ.id,
      content: newMsg.trim(),
    })
    if (!error) {
      setNewMsg('')
      loadMessages(selectedDJ.id)
    }
  }

  async function saveNetworkProfile() {
    setSaving(true)
    await supabase.from('profiles').upsert({
      id: userId,
      genres: editGenres,
      looking_for: editLooking,
      visible: editVisible,
    })
    setSaving(false)
    loadData()
  }

  function toggleGenre(g: string) {
    setEditGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])
  }

  function toggleLooking(l: string) {
    setEditLooking(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])
  }

  const cities = ['All', ...Array.from(new Set(djs.map(d => d.ciudad).filter(Boolean)))]
  const filteredDJs = djs.filter(dj => {
    if (cityFilter !== 'All' && dj.ciudad !== cityFilter) return false
    if (genreFilter !== 'All' && !dj.genres?.includes(genreFilter)) return false
    return true
  })

  const filterBtnClass = (active: boolean) =>
    `text-xs px-3 py-1.5 rounded-full border transition-all ${active ? 'bg-[#EEEDFE] border-[#AFA9EC] text-[#534AB7]' : 'border-white/[0.08] text-muted hover:bg-surface2'}`

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted text-sm">Loading...</div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div>
        <h1 className="page-title">DJ Network</h1>
        <p className="page-sub">Connect with other DJs on BeatBroker</p>

        <div className="flex gap-1 border-b border-white/[0.08] mb-5">
          {[
            { id: 'directory', label: 'Directory' },
            { id: 'messages', label: 'Messages' },
            { id: 'profile', label: 'My network profile' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-sm px-4 py-2.5 border-b-2 transition-colors ${activeTab === tab.id ? 'border-accent2 text-white font-medium' : 'border-transparent text-muted hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DIRECTORY */}
        {activeTab === 'directory' && (
          <div>
            <div className="flex gap-2 flex-wrap mb-4">
              {cities.map(c => (
                <button key={c} onClick={() => setCityFilter(c)} className={filterBtnClass(cityFilter === c)}>{c}</button>
              ))}
              <div className="w-px bg-white/[0.08] mx-1" />
              {['All', ...GENRES].map(g => (
                <button key={g} onClick={() => setGenreFilter(g)} className={filterBtnClass(genreFilter === g)}>{g}</button>
              ))}
            </div>

            {filteredDJs.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-muted text-sm mb-2">No DJs found with these filters.</div>
                <div className="text-muted text-xs">Invite other DJs to join BeatBroker to grow the network.</div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {filteredDJs.map(dj => (
                  <div key={dj.id} className="card">
                    <div className="w-11 h-11 rounded-full bg-[#EEEDFE] flex items-center justify-center text-sm font-medium text-[#534AB7] mb-3">
                      {(dj.nombre_artistico || 'DJ').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="text-sm font-medium text-white mb-0.5">{dj.nombre_artistico || 'Anonymous DJ'}</div>
                    <div className="text-xs text-muted mb-2">{dj.ciudad || '—'}</div>
                    {dj.genres && dj.genres.length > 0 && (
                      <div className="flex gap-1 flex-wrap mb-2">
                        {dj.genres.slice(0, 3).map(g => (
                          <span key={g} className="text-[10px] px-2 py-0.5 rounded-full bg-surface2 text-muted border border-white/[0.08]">{g}</span>
                        ))}
                      </div>
                    )}
                    {dj.looking_for && dj.looking_for.length > 0 && (
                      <div className="text-xs text-muted mb-3">
                        Open to: {dj.looking_for.join(', ')}
                      </div>
                    )}
                    <button
                      className="w-full text-xs py-1.5 rounded-lg bg-[#EEEDFE] border border-[#AFA9EC] text-[#534AB7]"
                      onClick={() => {
                        setSelectedDJ(dj)
                        setActiveTab('messages')
                        loadMessages(dj.id)
                      }}
                    >
                      Send message
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-[200px_1fr] gap-4">
            <div>
              <div className="text-[10px] text-muted uppercase tracking-wider mb-2">Conversations</div>
              {djs.length === 0 ? (
                <div className="text-xs text-muted">No conversations yet.</div>
              ) : (
                djs.map(dj => (
                  <button
                    key={dj.id}
                    onClick={() => { setSelectedDJ(dj); loadMessages(dj.id) }}
                    className={`w-full flex items-center gap-2 p-2.5 rounded-xl mb-1 text-left transition-colors ${selectedDJ?.id === dj.id ? 'bg-surface2' : 'hover:bg-surface2'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#EEEDFE] flex items-center justify-center text-[10px] font-medium text-[#534AB7] flex-shrink-0">
                      {(dj.nombre_artistico || 'DJ').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-white truncate">{dj.nombre_artistico || 'DJ'}</div>
                      <div className="text-[10px] text-muted truncate">{dj.ciudad || '—'}</div>
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="card flex flex-col" style={{ height: '500px' }}>
              {!selectedDJ ? (
                <div className="flex-1 flex items-center justify-center text-muted text-sm">
                  Select a DJ to start a conversation
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 pb-3 mb-3 border-b border-white/[0.08]">
                    <div className="w-9 h-9 rounded-full bg-[#EEEDFE] flex items-center justify-center text-xs font-medium text-[#534AB7]">
                      {(selectedDJ.nombre_artistico || 'DJ').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{selectedDJ.nombre_artistico}</div>
                      <div className="text-xs text-muted">{selectedDJ.ciudad}</div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto flex flex-col gap-2 mb-3">
                    {messages.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-muted text-xs">
                        No messages yet. Say hello!
                      </div>
                    ) : (
                      messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.from_id === userId ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${msg.from_id === userId ? 'bg-accent2 text-white rounded-br-sm' : 'bg-surface2 text-white rounded-bl-sm'}`}>
                            {msg.content}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="flex gap-2">
                    <input
                      className="form-input flex-1 text-sm"
                      placeholder="Write a message..."
                      value={newMsg}
                      onChange={e => setNewMsg(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    />
                    <button className="btn-primary text-sm px-4" onClick={sendMessage} disabled={!newMsg.trim()}>
                      Send
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* NETWORK PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-xl">
            <div className="card mb-4">
              <div className="text-xs text-muted uppercase tracking-wider mb-4 font-medium">Your genres</div>
              <div className="flex gap-2 flex-wrap">
                {GENRES.map(g => (
                  <button
                    key={g}
                    onClick={() => toggleGenre(g)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${editGenres.includes(g) ? 'bg-[#EEEDFE] border-[#AFA9EC] text-[#534AB7]' : 'border-white/[0.08] text-muted hover:bg-surface2'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="card mb-4">
              <div className="text-xs text-muted uppercase tracking-wider mb-4 font-medium">Open to</div>
              <div className="flex gap-2 flex-wrap">
                {LOOKING_FOR_OPTIONS.map(l => (
                  <button
                    key={l}
                    onClick={() => toggleLooking(l)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${editLooking.includes(l) ? 'bg-[#E1F5EE] border-[#5DCAA5] text-[#0F6E56]' : 'border-white/[0.08] text-muted hover:bg-surface2'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="card mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Visible in directory</div>
                  <div className="text-xs text-muted mt-0.5">Other BeatBroker DJs can find and message you</div>
                </div>
                <button
                  onClick={() => setEditVisible(!editVisible)}
                  className={`w-11 h-6 rounded-full transition-colors ${editVisible ? 'bg-accent' : 'bg-surface2'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform mx-1 ${editVisible ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <button className="btn-primary" onClick={saveNetworkProfile} disabled={saving}>
              {saving ? 'Saving...' : 'Save network profile'}
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
