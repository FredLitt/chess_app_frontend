import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/games'
const id = "628124141df887e0ebdb0d1d"

const getGame = async () => {
  const request = await axios.get(`${baseUrl}/${id}/moves`)
  return request.data
}

const playMove = async (move) => {
  const request = await axios.post(`${baseUrl}/${id}/moves`, move)
  return request.data
}

const takebackMove = async () => {
  const request = await axios.delete(`${baseUrl}/${id}/moves`)
  return request.data
}

const startNewGame = async () => {
  const request = await axios.delete(`${baseUrl}/${id}/new`)
  return request.data
}

let gameService

export default gameService = { getGame, playMove, takebackMove, startNewGame }