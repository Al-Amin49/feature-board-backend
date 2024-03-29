import express from'express';
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import authRouters from './routes/users.routes.js'
import featureRouters from './routes/features.route.js'
dotenv.config()
const app = express()

const port= process.env.PORT || 3000;

//database config;
connectDB()

//middlewares
app.use(express.json())
app.use(cors())

//application routes

app.use('/api/v1/users', authRouters)
app.use('/api/v1/features', featureRouters)

//health route
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})