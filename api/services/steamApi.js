const axios = require('axios')

const API_KEY = process.env.STEAM_API_KEY
const CS2_APP_ID = 730

async function getPlayerSummary(steamId) {
    const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/`
    const res = await axios.get(url, {
        params: {
            key: API_KEY,
            steamids: steamId
        }
    })
    return res.data.response.players[0]
}

async function getOwnedGameHours(steamId) {
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/`
    try {
        const res = await axios.get(url, {
            params: {
                key: API_KEY,
                steamid: steamId,
                appids_filter: CS2_APP_ID,
                include_appinfo: false,
            }
        })
        const games = res.data.response.games
        if (!games || games.length === 0) return 0
        const cs2 = games.find(g => g.appid === CS2_APP_ID)
        if (!cs2) return 0
        return Math.floor(cs2.playtime_forever / 60)
    } catch (error) {
        return 0
    }
}

async function getPlayerStats(steamId) {
    const url = `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/`
    try {
        const res = await axios.get(url,{
            params: {
                key: API_KEY,
                steamid: steamId,
                appid: CS2_APP_ID
            }
        })
        return res.data.playerstats.stats
    } catch (error) {
        return null
    } 
}

function parseStats(rawStats){
    if (!rawStats) return null

    const get = (name) => {
        const found = rawStats.find(s => s.name === name)
        return found ? found.value : 0
    }

    const kills          = get('total_kills')
    const deaths         = get('total_deaths')
    const shots          = get('total_shots_fired')
    const hits           = get('total_shots_hit')
    const hs             = get('total_kills_headshot')
    const roundsWon      = get('total_wins')
    const roundsPlayed   = get('total_rounds_played')
    const matchesWon     = get('total_matches_won')
    const matchesPlayed  = get('total_matches_played')
    const matchesLost    = matchesPlayed - matchesWon
    const mvps           = get('total_mvps')
    const timePlayed     = get('total_time_played')
    const totalDamage    = get('total_damage_done')
    const gunGameRoundsWon = get('total_gun_game_rounds_won')
    const winsPistolRound = get('total_wins_pistolround')
    const weaponsDonated = get('total_weapons_donated')
    const revenges = get('total_revenges')
    const ggMatchesWon = get('total_gg_matches_won')
    const ggMatchesPlayed = get('total_gg_matches_played')
    const killsTaser = get('total_kills_taser')
    const killsEnemyWeapon = get('total_kills_enemy_weapon')
    const antiSniper = get('total_kills_against_zoomed_sniper')
    const timePlayedHours = timePlayed / 3600

    const mapStats = (mapName) => {
        const rWon    = get(`total_wins_map_${mapName}`)
        const rPlayed = get(`total_rounds_map_${mapName}`)
        const rLost   = rPlayed - rWon
        return {
            roundsWon:    rWon,
            roundsPlayed: rPlayed,
            roundsLost:   rLost,
            winrate:      rPlayed > 0 ? +((rWon / rPlayed) * 100).toFixed(1) : 0,
        }
    }

    const weaponStats = (name) => {
        const k = get(`total_kills_${name}`)
        const s = get(`total_shots_${name}`)
        const h = get(`total_hits_${name}`)
        return {
            kills:          k,
            shots:          s,
            hits:           h,
            accuracy:       s > 0 ? +((h / s) * 100).toFixed(1) : 0,
            bulletsPerKill: k > 0 ? +(s / k).toFixed(1) : 0,
        }
    }

    return {
        kills,
        deaths,
        kd:              deaths > 0 ? +(kills / deaths).toFixed(2) : kills,
        roundsWon,
        roundsPlayed,
        matchesWon,
        matchesPlayed,
        matchesLost,
        winrate:         matchesPlayed > 0 ? +((matchesWon / matchesPlayed) * 100).toFixed(1) : 0,
        headshots:       hs,
        hsPercent:       kills > 0 ? +((hs / kills) * 100).toFixed(1) : 0,
        shotsFired:      shots,
        shotsHit:        hits,
        accuracy:        shots > 0 ? +((hits / shots) * 100).toFixed(1) : 0,
        mvps,
        timePlayed:      Math.floor(timePlayed / 60),
        timePlayedHours: +(timePlayed / 3600).toFixed(1),
        killsPerHour:    timePlayedHours > 0 ? +(kills / timePlayedHours).toFixed(1) : 0,
        bulletsPerKill:  kills > 0 ? +(shots / kills).toFixed(1) : 0,
        totalDamage,  
        adr:             roundsPlayed > 0 ? +(totalDamage / roundsPlayed).toFixed(1) : 0,
        gunGameRoundsWon,
        winsPistolRound,
        weaponsDonated,
        revenges,
        ggMatchesWon,
        ggMatchesPlayed,
        ggWinrate:       ggMatchesPlayed > 0 ? +((ggMatchesWon / ggMatchesPlayed) * 100).toFixed(1) : 0,
        killsTaser,
        killsEnemyWeapon,
        antiSniper,   

        weapons: {
            ak47:    weaponStats('ak47'),
            m4a1:    weaponStats('m4a1'),
            m4a4:    weaponStats('m4a4'),
            awp:     weaponStats('awp'),
            deagle:  weaponStats('deagle'),
            usp:     weaponStats('hkp2000'),
            glock:   weaponStats('glock'),
            famas:   weaponStats('famas'),
            galil:   weaponStats('galilar'),
            ssg08:   weaponStats('ssg08'),
            mac10:   weaponStats('mac10'),
            mp9:     weaponStats('mp9'),
            mp7:     weaponStats('mp7'),
            negev:   weaponStats('negev'),
            knife:   { kills: get('total_kills_knife'), shots: 0, hits: 0, accuracy: 0, bulletsPerKill: 0 },
            sawedoff: weaponStats('sawedoff'),
        },

        utility: {
            killsHE:        get('total_kills_hegrenade'),
            killsMolotov:   get('total_kills_molotov'),
            killsBlinded:   get('total_kills_enemy_blinded'),
            bombsPlanted:   get('total_planted_bombs'),
            bombsDefused:   get('total_defused_bombs'),
        },

        maps: {
            de_dust2:   mapStats('de_dust2'),
            de_inferno: mapStats('de_inferno'),
            de_nuke:    mapStats('de_nuke'),
            de_vertigo: mapStats('de_vertigo'),
            de_train:   mapStats('de_train'),
        },
    }
}

async function getFullPlayerData(steamId, displayName, color) {
    const [summary, rawStats, totalHours] = await Promise.all([
        getPlayerSummary(steamId),
        getPlayerStats(steamId),
        getOwnedGameHours(steamId)
    ])
    
    const stats = parseStats(rawStats)

    return {
        steamId,
        displayName,
        color,
        avatar:         summary?.avatarfull || null,
        online:         summary?.personastate > 0,
        profilePrivate: stats === null,
        totalHours,
        stats
    }
}

module.exports = {getFullPlayerData}
