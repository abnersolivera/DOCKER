const express = require('express')
const mysql = require('mysql')

const app = express()
const port = 3000

app.use(express.json());

const connection = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
})

connection.connect((err) => {
  if(err){
    console.log('Erro ao conectar ao banco de dados', err)
    return
  }
  console.log('Conectado ao banco de dados')
})

app.get('/people', (req, res) => {
  const query = 'SELECT name FROM people'
  connection.query(query, (err, result) => {
      if (err) {
        console.log('Erro ao executar a query', err)
        res.status(500).send('Erro ao executar a consulta')
        return
      }
    res.send('<h2>Names:</h2>' + result.map(r => '<p>' + r.name + '</p>').join(''))
  })
})

app.get('/people/:id', (req, res) => {
  const id = req.params.id
  const query = `SELECT name FROM people WHERE id = ${id}`
  connection.query(query, (err, result) => {
    if (err) {
      console.log('Erro ao executar a query', err)
      res.status(500).send('Erro ao executar a consulta')
      return
    }
    if (result.length === 0) {
      res.status(404).send('Pessoa não encontrada')
      return
    }
    res.send('<h2>Name:</h2>' + result.map(r => '<p>' + r.name + '</p>').join(''))
  })
})

app.post('/people', (req, res) => {
  const name = req.body.name
  console.log('name', name)
  if (!name) {
    res.status(400).send('O nome é obrigatório')
    return
  }

  const query = `INSERT INTO people(name) values('${name}')`
  connection.query(query, (err, result) => {
    if (err) {
      console.log('Erro ao executar a query', err)
      res.status(500).send('Erro ao executar a consulta')
      return
    }
    res.send('Pessoa inserida com sucesso')
  })
})

app.patch('/people/:id', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  if (!name) {
    res.status(400).send('O nome é obrigatório')
    return
  }

  const query = `UPDATE people SET name = '${name}' WHERE id = ${id}`
  connection.query(query, (err, result) => {
    if (err) {
      console.log('Erro ao executar a query', err)
      res.status(500).send('Erro ao executar a consulta')
      return
    }
    res.send('Pessoa atualizada com sucesso')
  })
})

app.delete('/people/:id', (req, res) => {
  const id = req.params.id

  const query = `DELETE FROM people WHERE id = ${id}`
  connection.query(query, (err, result) => {
    if (err) {
      console.log('Erro ao executar a query', err)
      res.status(500).send('Erro ao executar a consulta')
      return
    }
    res.send('Pessoa removida com sucesso')
  })
})

app.listen(port, ()=>{
    console.log(`Servidor rodando em http://localhost:${port}`)
})

process.on('SIGINT', () => {
  connection.end((err) => {
    if(err){
      console.log('Erro ao desconectar do banco de dados', err)
      return
    }

    console.log('Conexão com o banco de dados encerrada')
    process.exit(0)
  })
})