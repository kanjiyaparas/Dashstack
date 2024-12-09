const { Router } = require("express");
const asyncHandler = require('express-async-handler');
const expanseNoteController = require("./ExpanseNoteController");

const expanseNoteRouter = Router()

expanseNoteRouter.post("/create", asyncHandler(expanseNoteController.createNote))
expanseNoteRouter.get("/list/:societyId", asyncHandler(expanseNoteController.listNote))
expanseNoteRouter.get("/lsitbyid/:id", asyncHandler(expanseNoteController.listById))
expanseNoteRouter.put("/update/:id", asyncHandler(expanseNoteController.updateNote))
expanseNoteRouter.delete("/delete/:id", asyncHandler(expanseNoteController.deleteNote))

module.exports = expanseNoteRouter