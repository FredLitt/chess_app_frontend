import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/games'
const id = "628124141df887e0ebdb0d1d"

const getGame = () => {
  const request = axios.get(`${baseUrl}/${id}/moves`)
  return request.then(response => response.data)
}

const playMove = (move) => {
  console.log("updating game with:", move)
  const request = axios.post(`${baseUrl}/${id}/moves`, move)
  return request.then(response => response.data)
}

const takebackMove = () => {
  const request = axios.delete(`${baseUrl}/${id}/moves`)
  return request.then(response => response.data)
}

const startNewGame = () => {

}

let gameService

export default gameService = { getGame, playMove, takebackMove, startNewGame }