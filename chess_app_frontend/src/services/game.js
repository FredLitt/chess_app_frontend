import axios from 'axios'
//const baseUrl = '/api/games'
const baseUrl = 'http://localhost:3001/api/games'

const createGame = async () => {
  const response = await axios.post(`${baseUrl}`)
  return response.data
}

const getGame = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}/moves`)
    return response.data
  }
  catch {
    return { error: "error" }
  }
}

const playMove = async (id, move) => {
  try {
    const response = await axios.post(`${baseUrl}/${id}/moves`, move)
    return response.data
  } catch {
    return { error: "error" }
  }
}

let gameService

export default gameService = { getGame, playMove, createGame }