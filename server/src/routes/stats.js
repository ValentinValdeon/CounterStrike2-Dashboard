const express = require('express')
const router = express.Router()
const {getFullPlayerData} = require('../services/steamApi')

const PLAYERS = [
    {steamId: "76561198838345957",displayName: "Pimpa", color: "#9A0BB0"},
    {steamId: "76561199010430670",displayName: "Oseki", color: "#47B00B"},
    {steamId: "76561199037938777",displayName: "Beiras", color: "#275EF5"},
    {steamId: "76561199220855486",displayName: "Nachito", color: "#F5DD27"},
    {steamId: "76561199029536832",displayName: "Jorginho", color: "#F59C27"}
]

//cada que se pide la api se ejecuta este bloque
router.get('/', async(req,res)=>{
    try {
        const result = await Promise.all( //se pide los 5 jugadores al mismo tiempo para ahorrar tiempo de respuesta
            PLAYERS.map(p => getFullPlayerData(p.steamId, p.displayName, p.color))
        )
        res.json(result)//devuelve el array de los 5 como JSON
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Error al obtener datos del los pj'})
    }
})

module.exports = router