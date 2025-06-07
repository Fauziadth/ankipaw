export function katakanaToHiragana(katakana: string): string {
    return katakana.replace(/[\u30a1-\u30f6]/g, (char) =>
        String.fromCharCode(char.charCodeAt(0) - 0x60)
    );
}