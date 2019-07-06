const path = require('path')
const fs = require('fs').promises

function parseStation(songArr) {
  let parsed = {
    score: 0,
    numOriginalSongs: 0,
    numAllSongs: 0,
    songs: [],
    lastSong: { dates: [0], name: '', artist: '' }
  }
  if (songArr.length === 0) return parsed

  let originalSongs = []
  for (const song of songArr) {
    if (originalSongs.length === 0) {
      originalSongs.push(song)
    } else {
      let index = originalSongs.findIndex((originalSong) => originalSong.name == song.name)
      if (index > -1) originalSongs[index].dates.push(song.dates[0])
      else originalSongs.push(song)
    }
  }
  originalSongs.sort((a, b) => b.length - a.length)

  parsed.lastSong = songArr[songArr.length - 1]
  parsed.songs = originalSongs
  parsed.numAllSongs = songArr.length
  parsed.numOriginalSongs = originalSongs.length
  parsed.score = parseFloat((parsed.numOriginalSongs / parsed.numAllSongs * 100).toFixed(1))

  return parsed
}

exports.cleanupStations = async (stationName) => {
  let stations = await fs.readFile(path.join(__dirname, './stations.json'))
  stations = JSON.parse(stations.toString())

  if (stationName) return parseStation(stations[stationName])

  let parsedStations = {}
  for (const station in stations) {
    parsedStations[station] = parseStation(stations[station])
  }
  return parsedStations
}
