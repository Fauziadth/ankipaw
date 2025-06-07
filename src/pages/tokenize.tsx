import { useState } from "react";

type Token = {
    surface: string;
    pos?: string;
    reading?: string;
};

export default function TokenizePage() {
    const [sentence, setSentence] = useState("");
    const [tokens, setTokens] = useState<Token[]>([]);
    const [selected, setSelected] = useState<Set<number>>(new Set());

    const handleTokenize = async () => {
        const res = await fetch("/api/tokenize", {
            method: "POST",
            body: JSON.stringify({ sentence }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setTokens(data); // [{ surface: "一例", pos: "名詞", ... }]
        setSelected(new Set()); // reset
    };

    const toggleSelection = (index: number) => {
        const newSet = new Set(selected);
        newSet.has(index) ? newSet.delete(index) : newSet.add(index);
        setSelected(newSet);
    };

    const handleSave = async () => {
        const userId = "uid_dummy";

        const payload = Array.from(selected).map((index: number) => {
            const t = tokens[index];
            return {
                surface: t.surface,
                reading: t.reading ?? "",
                pos: t.pos ?? "",
                context: sentence,
            };
        });

        const res = await fetch("/api/saveToken", {
            method: "POST",
            body: JSON.stringify({ tokens: payload, userId }),
            headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
            alert("Saved!");
        } else {
            alert("Error saving.");
        }
    };

    return (
        <div className="p-4 space-y-4 max-w-xl mx-auto">
            <h1 className="text-xl font-bold">Tokenize Kalimat</h1>
            <textarea
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                className="w-full border rounded p-2"
                rows={3}
                placeholder="Masukkan kalimat..."
            />
            <button
                onClick={handleTokenize}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Tokenize
            </button>

            {tokens.length > 0 && (
                <div className="space-y-2">
                    <h2 className="font-semibold">Pilih kata yang ingin disimpan:</h2>
                    <div className="flex flex-wrap gap-2">
                        {tokens.map((token, index) => (
                            <button
                                key={index}
                                onClick={() => toggleSelection(index)}
                                className={`px-2 py-1 rounded border ${
                                    selected.has(index)
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-100"
                                }`}
                            >
                                {token.surface}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
                    >
                        Simpan ke Deck
                    </button>
                </div>
            )}
        </div>
    );
}
