import dataLinks from './datalinks.json';

export default function handler(req, res) {
    const { pin } = req.query;
    const correctPin = process.env.PIN_INIJOTOOL;

    if (pin !== correctPin) return res.status(401).json({ error: "PIN Salah" });
    if (id) return res.status(200).json(dataLinks[id.toLowerCase()] || []);
    return res.status(200).json(dataLinks.personal_links || []);
}
