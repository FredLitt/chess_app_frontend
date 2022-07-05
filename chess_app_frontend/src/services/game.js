import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/games'
//const id = "62c464f30b42f2ea24ae6845"

const createGame = async () => {
  const request = await axios.post(`${baseUrl}`)
  console.log(request.data)
  return request.data
}

const getGame = async (id) => {
  const request = await axios.get(`${baseUrl}/${id}/moves`)
  return request.data
}

const playMove = async (id, move) => {
  const request = await axios.post(`${baseUrl}/${id}/moves`, move)
  return request.data
}

const takebackMove = async (id) => {
  const request = await axios.delete(`${baseUrl}/${id}/moves`)
  return request.data
}

let gameService

export default gameService = { getGame, playMove, takebackMove, createGame }