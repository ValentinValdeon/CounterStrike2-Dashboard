const {getFullPlayerData} = require('./services/steamApi')

const PLAYERS = [
    {steamId: "76561198838345957",displayName: "Pimpa", color: "#9A0BB0"},
    {steamId: "76561199010430670",displayName: "Oseki", color: "#47B00B"},
    {steamId: "76561199037938777",displayName: "Beiras", color: "#275EF5"},
    {steamId: "76561199220855486",displayName: "Nachito", color: "#F5DD27"},
    {steamId: "76561199029536832",displayName: "Jorginho", color: "#F59C27"}
]

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    try {
        const result = await Promise.all(
            PLAYERS.map(p => getFullPlayerData(p.steamId, p.displayName, p.color))
        )
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Error al obtener datos de los jugadores'})
    }
}
