import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './src/utils/config.js'
import authRoutes from './src/routes/authRoutes.js'
import productRoutes from './src/routes/productRoutes.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://product-dashboard-adhit-vora.vercel.app'
  ],
  credentials: true
}))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
