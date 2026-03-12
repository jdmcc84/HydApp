import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

const app = express()

// middleware
app.use(express.json())

// CORS: allow your local Vite dev and (later) your Vercel frontend
const allowedOrigin = process.env.ORIGIN || 'http://localhost:5173'
app.use(cors({ origin: allowedOrigin }))

// --- Health ---
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'API is healthy' })
})

// --- Example model & routes ---
const NoteSchema = new mongoose.Schema({
  title: String,
  createdAt: { type: Date, default: Date.now }
})
const Note = mongoose.model('Note', NoteSchema)

app.get('/api/notes', async (_req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 }).lean()
  res.json(notes)
})

app.post('/api/notes', async (req, res) => {
  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'title is required' })
  const note = await Note.create({ title })
  res.status(201).json(note)
})

const PORT = process.env.PORT || 5000

async function start() {
  try {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      console.warn('MONGODB_URI not set — continuing without DB connection')
    } else {
      await mongoose.connect(uri)
      console.log('MongoDB connected')
    }
    app.listen(PORT, () => console.log(`API listening on :${PORT}`))
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
start()