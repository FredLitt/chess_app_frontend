import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/games'
const id = "628124141df887e0ebdb0d1d"

const getGame = () => {
  const request = axios.get(`${baseUrl}/${id}/moves`)
  return request.then(response => response.data)
}

const updateGame = (move) => {
  console.log("updating game with:", move)
  const request = axios.post(`${baseUrl}/${id}/moves`, move)
  
  return request.then(response => 
    console.log(response.data))
    //response.data)
}

let gameService

export default gameService = { getGame, updateGame }