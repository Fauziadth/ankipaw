import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

    try {
        const { tokens, userId } = req.body;

        if (!Array.isArray(tokens) || !userId) {
            return res.status(400).json({ message: "Invalid payload" });
        }

        const promises:any[] = tokens.map((token: any) : any =>
            addDoc(collection(db, "deck"), {
                surface: token.surface,
                pos: token.pos ?? "",
                reading: token.reading ?? "",
                context: token.context ?? "",
                createdAt: serverTimestamp(),
                userId,
            })
        );

        await Promise.all(promises);
        res.status(200).json({ message: "Saved!" });
    } catch (err) {
        console.error("[API:saveTokens]", err);
        res.status(500).json({ message: "Something went wrong" });
    }
}
