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
            category: "PROPERTI",
            links: [
                { name: "Kalkulator Jual Beli", url: "properti/kalk-jual-beli.html" },
                { name: "Info Pajak Sewa Menyewa", url: "properti/pajak-sewa.html" }
            ]
        },
        {
            category: "CODING",
            links: [
                { name: "Editor & Viewer", url: "https://htmleditor.gitlab.io/" },
                { name: "Compare Text", url: "https://www.textcompare.org/" },
                { name: "Code Pen-Format Code", url: "https://codepen.io/pen/?editors=1000" },
                { name: "Toolpix-Format Code", url: "https://toolpix.pythonanywhere.com/free-online-ai-html-editor" },
                { name: "HTML Playground", url: "https://playcode.io/html-template" }
            ]
        },
        {
            category: "TEST",
            links: [
                { name: "Menu XO", url: "test/menuxo.html" },
                { name: "Reminder Keluarga", url: "test/reminder.html" },
                { name: "Scanner", url: "test/scanner.html" }
            ]
        }
    ];

    return res.status(200).json(pageData);
}
