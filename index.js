import express from 'express'

const app = express()
const PORT = 3000

app.use(express.json())

let usuarios = []
let contador = 1

//ROTA DE TESTE
app.get("/status", (req, res) => {
  res.json({message: "API Online"})
})

app.post("/usuarios", (req, res) => {
  const { nome } = req.body

  const novoUsuario = {
    id: contador++,
    nome
  }

  usuarios.push(novoUsuario)
  res.status(201).json(novoUsuario)
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})