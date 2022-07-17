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
    console.log(response)
    return response.data
  }
  catch {
    return { error: "serverError" }
  }
}

const playMove = async (id, move) => {
  const response = await axios.post(`${baseUrl}/${id}/moves`, move)
  console.log(response)
  return response.data
}

const takebackMove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}/moves`)
  return response.data
}

let gameService

export default gameService = { getGame, playMove, takebackMove, createGame }