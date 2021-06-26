const noteRouter = require('express').Router()
const Note = require('../models/note')

noteRouter.get('/', async (request, response) => {
    const notes = await Note.find({})
      response.json(notes.map(note => note.toJSON()))
  })
  
  noteRouter.post('/', async (request, response, next) => {
      const body = request.body
  
      if (!body.content) {
          return response.status(400).json({
              error: 'content missing'
          })
      }
  
      const note = new Note({
          content: body.content,
          important : body.important || false,
          date: new Date(),
      })
      try {
        const savedNote = await note.save()
        response.json(savedNote.toJSON())
      } catch(exception) {
        next(exception)
      }

  })
  
  noteRouter.get('/:id', async (request, response, next) => {
    try {
      const note = await Note.findById(request.params.id)
      if (note) {
          response.json(note.toJSON())
      } else {
        response.status(404).end()
      }
  } catch(exception) {
    next(exception)
  }
})

  noteRouter.delete('/:id', async (request, response, next) => {
    try {
      await Note.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch(exception) {
      next(exception)
    }
  })
  
  noteRouter.put('/:id', (request, response, next) => {
    const body = request.body
  
    const note = {
      content: body.content,
      important: body.important,
    }
  
    Note.findByIdAndUpdate(request.params.id, note, { new: true })
      .then(updatedNote => {
        response.json(updatedNote)
      })
      .catch(error => next(error))
  })

  module.exports = noteRouter
  