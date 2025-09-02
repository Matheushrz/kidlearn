import React, { useMemo, useState } from 'react'
import { useProgress } from './useProgress'

type Tile = {
  id: string
  label: string
  emoji: string
  color: 'green'|'red'|'yellow'|'blue'|'purple'|'gray'
  say?: string
  colSpan?: number
}

// ======= PALETA (ajuste aqui se quiser tons diferentes) =======
const COLOR = {
  green:  'bg-green-200 text-green-900 border-green-300',
  red:    'bg-red-200 text-red-900 border-red-300',
  yellow: 'bg-yellow-200 text-yellow-900 border-yellow-300',
  blue:   'bg-blue-200 text-blue-900 border-blue-300',
  purple: 'bg-purple-200 text-purple-900 border-purple-300',
  gray:   'bg-gray-200 text-gray-900 border-gray-300',
}

// ======= LAYOUT IGUAL AO DA PLACA DA FOTO =======
// Observação: usei emojis equivalentes aos pictogramas.
// Você pode trocar os emojis/labels livremente aqui.
const GRID: Tile[][] = [
  // Linha 1 (5 colunas)
  [
    { id:'comer',      label:'COMER',        emoji:'🍽️', color:'green'  },
    { id:'naoquero',   label:'NÃO QUERO',    emoji:'🚫',  color:'red'    },
    { id:'minhavez',   label:'MINHA VEZ',    emoji:'🖐️',  color:'yellow' },
    { id:'sim',        label:'SIM',          emoji:'✅',  color:'green'  },
    { id:'nao',        label:'NÃO',          emoji:'❌',  color:'red'    },
  ],
  // Linha 2 (5 colunas)
  [
    { id:'outro',      label:'OUTRO',        emoji:'↪️',  color:'yellow' },
    { id:'euquero',    label:'EU QUERO',     emoji:'👉',  color:'green'  },
    { id:'ajuda',      label:'AJUDA',        emoji:'🆘',  color:'green'  },
    { id:'meda',       label:'ME DÁ',        emoji:'🤲',  color:'green'  },
    { id:'abrir',      label:'ABRIR',        emoji:'📖',  color:'green'  },
  ],
  // Linha 3 (5 colunas)
  [
    { id:'acabou',     label:'ACABOU',       emoji:'👐',  color:'gray'   },
    { id:'pegar',      label:'PEGAR',        emoji:'✋',  color:'green'  },
    { id:'guardar',    label:'GUARDAR',      emoji:'📦',  color:'green'  },
    { id:'esperar',    label:'ESPERAR',      emoji:'⏳',  color:'green'  },
    { id:'atividades', label:'ATIVIDADES',   emoji:'📚',  color:'green'  },
  ],
  // Linha 4 (4 colunas)
  [
    { id:'tchau',      label:'TCHAU',        emoji:'👋',  color:'gray'   },
    { id:'sentar',     label:'SENTAR',       emoji:'🪑',  color:'green'  },
    { id:'levantar',   label:'LEVANTAR',     emoji:'🧍',  color:'green'  },
    { id:'brincar',    label:'BRINCAR',      emoji:'🧩',  color:'green'  },
  ],
  // Linha 5 (3 colunas — “IR PARA CASA” tem destaque roxo na foto)
  [
    { id:'ircasA',     label:'IR PARA CASA', emoji:'🏠',  color:'purple', colSpan:2 },
    { id:'xixi',       label:'XIXI',         emoji:'🚻',  color:'yellow' },
    // Na placa há também um botão “MAIS” azul ao lado do “XIXI”
  ],
  // Linha 6 (apenas “MAIS” azul — para ficar idêntico visualmente)
  [
    { id:'mais',       label:'MAIS',         emoji:'➕',  color:'blue',  colSpan:3 },
  ]
]

// Mapeia o texto falado (se quiser diferente do label)
function speakTextOf(tile: Tile) {
  const custom: Record<string,string> = {
    naoquero: 'não quero',
    euquero: 'eu quero',
    meda: 'me dá',
    ircasA: 'ir para casa',
    xixi: 'xixi',
    mais: 'mais',
    brincAR: 'brincar'
  }
  // fallback para label se não tiver mapeamento
  return custom[tile.id] || tile.label
}

const AAC: React.FC = () => {
  const { save } = useProgress('aac')

  const [sentence, setSentence] = useState<Tile[]>([])
  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

  function add(tile: Tile) {
    setSentence(prev => [...prev, tile])
    // salva “última seleção” (útil p/ relatórios simples)
    save({ last: tile.label }, 0, 1)
    // fala item isolado (feedback imediato)
    say(tile)
  }

  function say(tile: Tile){
    if (!canSpeak) return
    const text = speakTextOf(tile)
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'pt-BR'
    speechSynthesis.cancel()
    speechSynthesis.speak(u)
  }

  function speakAll() {
    if (!canSpeak || sentence.length === 0) return
    speechSynthesis.cancel()
    const text = sentence.map(s => speakTextOf(s)).join(' ')
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'pt-BR'
    speechSynthesis.speak(u)
    // guarda a frase montada
    save({ phrase: sentence.map(s=>s.label) }, 1, sentence.length)
  }

  function clearAll() {
    setSentence([])
  }

  // grade responsiva: 5 colunas no desktop, 3 no tablet, 2 no mobile
  const gridCols = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3'

  return (
    <div className="max-w-5xl mx-auto px-4 mt-8">
      <h1 className="text-2xl font-bold mb-4 text-primary">AAC (Comunicação Alternativa)</h1>

      {/* Tira de frase (como na placa: frase montada) */}
      <div className="card mb-4">
        <div className="text-sm text-gray-500 mb-2">Frase:</div>
        <div className="flex flex-wrap gap-2">
          {sentence.length === 0 && (
            <div className="text-gray-400">Toque nos cartões para montar a frase</div>
          )}
          {sentence.map((t, i) => (
            <div
              key={i}
              className={`px-3 py-2 rounded-xl border ${COLOR[t.color]} flex items-center gap-2`}
            >
              <span className="text-xl">{t.emoji}</span>
              <span className="text-sm font-semibold">{t.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn" onClick={speakAll} disabled={sentence.length===0}>
            🔊 Falar
          </button>
          <button className="btn-outline" onClick={clearAll} disabled={sentence.length===0}>
            🧹 Limpar
          </button>
        </div>
      </div>

      {/* Grade de cartões (idêntica à foto, com cores/ordem) */}
      <div className="space-y-3">
        {GRID.map((row, rIdx) => (
          <div key={rIdx} className={gridCols}>
            {row.map((tile) => (
              <button
                key={tile.id}
                className={`relative select-none rounded-2xl border p-3 sm:p-4 text-center shadow-soft active:scale-[0.98] transition ${COLOR[tile.color]} ${tile.colSpan ? `col-span-${Math.min(tile.colSpan, 5)}` : ''}`}
                onClick={()=>add(tile)}
              >
                <div className="text-3xl sm:text-4xl mb-1 leading-none">{tile.emoji}</div>
                <div className="font-bold text-xs sm:text-sm tracking-wide">{tile.label}</div>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Nota: se quiser “falar” automaticamente cada clique sem montar frase, já está chamando say(tile). */}
    </div>
  )
}

export default AAC
