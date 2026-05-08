const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DB_ARSIP_POLI;
const PIN_MASTER = process.env.PIN_EDIT_ARSIP_POLI; 

export default async function handler(req, res) {
    
    // 1. GET DATA TUNGGAL
    if (req.method === 'GET') {
        const { id } = req.query;
        if (!id) return res.status(400).json({ message: 'ID Page diperlukan' });

        try {
            const page = await notion.pages.retrieve({ page_id: id });
            const props = page.properties;

            const data = {
                id: page.id,
                // Diperbaiki: 'tanggal' -> 'Tanggal'
                tanggal: props.Tanggal?.date?.start || "",
                keterangan: props.Keterangan?.title.map(t => t.plain_text).join("") || "",
                jumlah: props.Jumlah?.number || 0,
                rincian_nota: props["Rincian Nota"]?.rich_text.map(t => t.plain_text).join("") || "",
            };

            return res.status(200).json({ data });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // 2. UPDATE DATA
    if (req.method === 'PUT') {
        const { id, tanggal, keterangan, jumlah, rincian_nota, pin } = req.body;

        if (pin !== PIN_MASTER) {
            return res.status(403).json({ message: 'PIN Salah!' });
        }

        try {
            await notion.pages.update({
                page_id: id,
                properties: {
                    // Diperbaiki: 'tanggal' -> 'Tanggal'
                    'Tanggal': { date: { start: tanggal } },
                    'Keterangan': { title: [{ text: { content: keterangan } }] },
                    'Jumlah': { number: parseFloat(jumlah) || 0 },
                    'Rincian Nota': { rich_text: [{ text: { content: rincian_nota } }] }
                }
            });
            return res.status(200).json({ message: 'Data Arsip XO berhasil diperbarui' });
        } catch (error) {
            return res.status(500).json({ error: 'Gagal update: ' + error.message });
        }
    }

    // 3. HAPUS DATA
    if (req.method === 'DELETE') {
        const { id, pin } = req.body;

        if (pin !== PIN_MASTER) {
            return res.status(403).json({ message: 'PIN Salah!' });
        }

        try {
            await notion.pages.update({
                page_id: id,
                archived: true
            });
            return res.status(200).json({ message: 'Data Arsip XO berhasil dihapus' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // 4. LIST DATA (POST)
    if (req.method === 'POST') {
        const { keyword, cursor } = req.body;

        try {
            const filters = [];

            if (keyword && keyword.trim() !== "") {
                const words = keyword.trim().split(/\s+/);
                
                words.forEach(word => {
                    filters.push({
                        or: [
                            { property: "Keterangan", title: { contains: word } },
                            { property: "Rincian Nota", rich_text: { contains: word } }
                        ]
                    });
                });
            }

            const queryOptions = {
                database_id: databaseId,
                // Diperbaiki: 'tanggal' -> 'Tanggal'
                sorts: [{ property: "Tanggal", direction: "descending" }],
                page_size: 20,
                start_cursor: cursor || undefined,
            };

            if (filters.length > 0) {
                queryOptions.filter = { and: filters };
            }

            const response = await notion.databases.query(queryOptions);

            const results = response.results.map((page) => {
                const props = page.properties;
                
                const docs = props.Dokumentasi?.files.map(f => ({
                    name: f.name,
                    url: f.type === 'file' ? f.file.url : f.external.url
                })) || [];

                return {
                    id: page.id,
                    // Diperbaiki: 'tanggal' -> 'Tanggal'
                    tanggal: props.Tanggal?.date?.start || "-",
                    keterangan: props.Keterangan?.title.map(t => t.plain_text).join("") || "Tanpa Judul",
                    jumlah: props.Jumlah?.number || 0,
                    rincian_nota: props["Rincian Nota"]?.rich_text.map(t => t.plain_text).join("") || "-",
                    dokumentasi: docs
                };
            });

            return res.status(200).json({
                data: results,
                next_cursor: response.next_cursor,
                has_more: response.has_more
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
