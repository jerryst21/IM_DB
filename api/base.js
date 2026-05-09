export default function handler(req, res) {
    const { pin } = req.query;
    const correctPin = process.env.PIN_INIJOTOOL;

    if (pin !== correctPin) {
        return res.status(401).json({ error: "PIN Salah" });
    }

    // Daftar halaman yang mudah Anda edit
    const pageData = [
        {
            category: "ARSIP",
            links: [
                { name: "Nota Eden", url: "arsip/arsipeden12.html" },
                { name: "Nota SPBU Politeknik", url: "arsip/arsippoli77.html" },
                { name: "Nota SPBU Ring Road", url: "arsip/arsiprr78.html" },
                { name: "Nota XO", url: "arsip/arsipxo862.html" }
            ]
        },
        {
            category: "BOUNDLESS",
            links: [
                { name: "Known Colours", url: "boundless/known-colours.html" }
            ]
        },
        {
            category: "REMINDER",
            links: [
                { name: "Keluarga", url: "reminder/keluarga.html" }
            ]
        },
        {
            category: "TEST",
            links: [
                { name: "Menu XO", url: "test/menuxo.html" },
                { name: "Scanner", url: "test/scanner.html" }
            ]
        }
    ];

    return res.status(200).json(pageData);
}
