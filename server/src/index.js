require('dotenv').config() //carga lo de .env en el programa

//imports
const express = require('express')
const cors = require('cors')
const statsRouter = require('./routes/stats')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors()) //permite que react se comunique con el servidor (puerto 5173->3001)
app.use(express.json()) //aca le indica que entiendo json en las request
app.use('/api/stats', statsRouter)
app.listen(PORT, () =>{
    console.log(`Server corriendo en  http://localhost:${PORT}`)
})

