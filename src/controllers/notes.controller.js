const notesCtrl = {
  
};

// Models
const Note = require("../models/Note");

notesCtrl.renderNoteForm = (req, res) => { // Renders the note form to the screen
  res.render("notes/new-note");
};

notesCtrl.createNewNote = async (req, res) => { // Controller method to create a new note
  
  const { title, description } = req.body;
  const errors = [];
  
  if (!title) { // If the note does not have a title
    errors.push({ text: "Please Write a Title." });
  }
  
  if (!description) { // If there is no description for the notes
    errors.push({ text: "Please Write a Description" }); // Push the text to the array
  }
  
  if (errors.length > 0) { //  If there are more than 0 errors
    res.render("notes/new-note", {
      errors,
      title,
      description,
    }); // Render  a new note
  } 
  
  else {
    const newNote = new Note({ title, description }); // Create a new Note instance
    newNote.user = req.user.id;
    
    await newNote.save();
    req.flash("success_msg", "Note Added Successfully");
    res.redirect("/notes");
  }
};

notesCtrl.renderNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id })
    .sort({ date: "desc" })
    .lean();
  res.render("notes/all-notes", { notes });
};

notesCtrl.renderEditForm = async (req, res) => {
  const note = await Note.findById(req.params.id).lean();
  
  if (note.user != req.user.id) { // If the user does not match the current one
    
    req.flash("error_msg", "Not Authorized"); // User is not authorized
    return res.redirect("/notes");
  }
  
  res.render("notes/edit-note", { note });
};

notesCtrl.updateNote = async (req, res) => { // UPDATES a NOTE
  const { title, description } = req.body;
  await Note.findByIdAndUpdate(req.params.id, { title, description });
  req.flash("success_msg", "Note Updated Successfully");
  res.redirect("/notes");
};

notesCtrl.deleteNote = async (req, res) => { // Controller routine that DELETES a note
  await Note.findByIdAndDelete(req.params.id);
  req.flash("success_msg", "Note Deleted Successfully");
  res.redirect("/notes");
};

module.exports = notesCtrl;
