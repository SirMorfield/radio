const path = require('path')
const fs = require('fs').promises

exports.cleanupStations = async (stationName) => {
  let stations = await fs.readFile(path.join(__dirname, './stations.json'))
  stations = JSON.parse(stations.toString())
  let sortedStations = {}
  // instead of saving each song played as obj, merging objects and saving when they were played
  for (let station in stations) {
    let originalSongs = []
    let numAllSongs = 0
    let latestSong = { dates: [0], name: '', artist: '' }
    stations[station].forEach(song => {
      if (song.error) return
      numAllSongs += 1
      latestSong = song
      if (originalSongs.length === 0) {
        originalSongs.push(song)
        return
      }

      let index = originalSongs.findIndex((originalSong) => originalSong.name == song.name)
      if (index > -1) originalSongs[index].dates.push(song.dates[0])
      else originalSongs.push(song)
    })

    // sorting from most played to least played song
    originalSongs.sort((a, b) => b.length - a.length)

    let newStation = {
      score: originalSongs.length == 0 || numAllSongs == 0 ? '0.0' : (originalSongs.length / numAllSongs * 100).toFixed(1),
      numOriginalSongs: originalSongs.length,
      numAllSongs: numAllSongs,
      latestSong: latestSong,
      songs: originalSongs
    }
    sortedStations[station] = newStation
  }
  return stationName ? sortedStations[stationName] : sortedStations
}
