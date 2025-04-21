import type { NextApiRequest, NextApiResponse } from 'next'
import kuromoji from 'kuromoji'
import path from 'path'

const dicPath = path.join(process.cwd(), 'public/kuromoji/dict')

function createTokenizer(): Promise<kuromoji.Tokenizer<any>> {
    return new Promise((resolve, reject) => {
        kuromoji.builder({ dicPath }).build((err, tokenizer) => {
            if (err) reject(err)
            else resolve(tokenizer)
        })
    })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { sentence } = req.body;

    if (!sentence) {
        return res.status(400).json({ error: 'No sentence provided' })
    }

    try {
        const tokenizer = await createTokenizer()
        const tokens = tokenizer.tokenize(sentence)
        const surfaceForms = tokens.map((t) => t.surface_form)

        return res.status(200).json({ tokens: surfaceForms })
    } catch (err) {
        console.error('Tokenization error:', err)
        return res.status(500).json({ error: 'Tokenization failed' })
    }
}