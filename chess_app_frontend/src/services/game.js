import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/games'

const getGame = () => {
  const id = "628124141df887e0ebdb0d1d"
  const request = axios.get(`${baseUrl}/${id}/moves`)
  return request.then(response => response.data)
}

const updateGame = (id, move) => {
  const request = axios.put(`${baseUrl}/${id}`, move)
  return request.then(response => response.data)
}

let gameService

export default gameService = { getGame, updateGame }