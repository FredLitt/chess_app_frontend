import axios from 'axios'
const baseUrl = '/api/games'

const getGame = (id) => {
  const request = axios.get(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

const updateGame = (id, move) => {
  const request = axios.put(`${baseUrl}/${id}`, move)
  return request.then(response => response.data)
}

let gameService

export default gameService = { getGame, updateGame }