'use client'
import { useState } from 'react'

export default function SentenceInput() {
    const [input, setInput] = useState('')
    const [tokens, setTokens] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const handleTokenize = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/tokenize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sentence: input }),
            })

            const data = await res.json()
            setTokens(data.tokens || [])
        } catch (err) {
            console.error('Tokenize error:', err)
        }
        setLoading(false)
    }

    return (
        <div className="p-4 space-y-4">
      <textarea
          className="w-full p-2 border border-gray-300 rounded"
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik kalimat Jepang di sini..."
      />

            <button
                onClick={handleTokenize}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                {loading ? 'Memproses...' : 'Tokenize'}
            </button>

            {tokens.length > 0 && (
                <div className="mt-4">
                    <h2 className="font-semibold mb-2">Hasil Tokenisasi:</h2>
                    <div className="flex flex-wrap gap-2">
                        {tokens.map((word, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-200 rounded">
                {word}
              </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}