import type { NextApiRequest, NextApiResponse } from 'next'
import kuromoji from 'kuromoji';
import path from 'path';
import {katakanaToHiragana} from "@/lib/utils";

const dicPath = path.join(process.cwd(), 'src/public/kuromoji/dict')

function createTokenizer(): Promise<kuromoji.Tokenizer<any>> {
    return new Promise((resolve, reject) => {
        kuromoji.builder({ dicPath }).build((err, tokenizer) => {
            if (err) reject(err)
            else resolve(tokenizer)
        })
    })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ error: 'Method not allowed' })

    const { sentence } = req.body;
    if (!sentence) return res.status(400).json({ error: "No sentence provided" });

    try {
        const tokenizer = await createTokenizer();
        const tokens = tokenizer.tokenize(sentence);

        const result = tokens.map((t) => ({
            surface: t.surface_form,
            reading: t.reading ? katakanaToHiragana(t.reading) : "",
            pos: t.pos,
            context: sentence,
        }));

        return res.status(200).json(result);
    } catch (e) {
        console.error('Tokenization error:', e);
        return res.status(500).json({ error: "Tokenization failed" });
    }
}