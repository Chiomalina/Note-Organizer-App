/**
 * Note Organizer App
 *
 * Before running this script, install dependencies:
 *   npm install readline-sync
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline-sync');

// Path to the JSON file where notes will be stored
const NOTES_FILE = path.join(__dirname, 'notes.json');

// Initial notes for first run (can be empty or pre-filled)
const initialNotes = [];

/**
 * Load notes from the JSON file or initialize with default.
 * @returns {Array<{title: string, body: string, time_added: string}>}
 */
function loadNotes() {
  if (!fs.existsSync(NOTES_FILE)) {
    saveNotes(initialNotes);
    return initialNotes;
  }

  try {
    const data = fs.readFileSync(NOTES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('❌ Error reading notes file:', err);
    process.exit(1);
  }
}

/**
 * Save notes to the JSON file.
 * @param {Array} notes
 */
function saveNotes(notes) {
  try {
    fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
  } catch (err) {
    console.error('❌ Error writing notes file:', err);
    process.exit(1);
  }
}

/**
 * Find a note by exact or partial title match (case-insensitive).
 * @param {Array} notes
 * @param {string} titleInput
 * @returns {object|null}
 */
function findNoteByTitle(notes, titleInput) {
  const query = titleInput.toLowerCase();
  return notes.find(n => n.title.toLowerCase() === query)
      || notes.find(n => n.title.toLowerCase().includes(query));
}

/**
 * Add a new note.
 */
function addNote(notes) {
  let title;
  do {
    title = readline.question('Enter note title: ').trim();
    if (!title) console.log('❌ Title cannot be empty.');
  } while (!title);

  if (notes.some(n => n.title.toLowerCase() === title.toLowerCase())) {
    console.log(`❌ A note with the title "${title}" already exists.`);
    return;
  }

  let body;
  do {
    body = readline.question('Enter note body: ').trim();
    if (!body) console.log('❌ Note body cannot be empty.');
  } while (!body);

  notes.push({ title, body, time_added: new Date().toISOString() });
  saveNotes(notes);
  console.log('✅ Note added successfully!');
}

/**
 * List all notes.
 */
function listAllNotes(notes) {
  if (notes.length === 0) return console.log('📭 No notes found.');

  console.log('\n📒 All Notes:');
  notes.forEach((note, i) => {
    console.log(`${i + 1}. Title: ${note.title}`);
    console.log(`   Body: ${note.body}`);
    console.log(`   Added on: ${note.time_added}\n`);
  });
}

/**
 * Read a note by title.
 */
function readNote(notes) {
  const titleInput = readline.question('Enter part of the note title: ').trim();
  if (!titleInput) return console.log("❌ Title input cannot be empty.");

  const note = findNoteByTitle(notes, titleInput);
  if (!note) return console.log(`❌ No note found containing "${titleInput}".`);

  console.log(`\n✅ Title: ${note.title}`);
  console.log(`📝 Body: ${note.body}`);
  console.log(`📅 Added on: ${note.time_added}\n`);
}

/**
 * Delete a note by title.
 */
function deleteNote(notes) {
  const titleInput = readline.question('Enter part of the note title to delete: ').trim();
  if (!titleInput) return console.log("❌ Title input cannot be empty.");

  const index = notes.findIndex(n =>
    n.title.toLowerCase() === titleInput.toLowerCase() ||
    n.title.toLowerCase().includes(titleInput.toLowerCase())
  );

  if (index === -1) return console.log(`❌ No note found containing "${titleInput}".`);

  const [deletedNote] = notes.splice(index, 1);
  saveNotes(notes);
  console.log(`✅ Note titled "${deletedNote.title}" deleted successfully!`);
}

/**
 * Update the body of a note.
 */
function updateNote(notes) {
  const titleInput = readline.question('Enter part of the note title to update: ').trim();
  if (!titleInput) return console.log("❌ Title input cannot be empty.");

  const note = findNoteByTitle(notes, titleInput);
  if (!note) return console.log(`❌ No note found containing "${titleInput}".`);

  const newBody = readline.question('Enter new note body: ').trim();
  if (!newBody) return console.log("❌ Note body cannot be empty.");

  note.body = newBody;
  saveNotes(notes);
  console.log('✅ Note updated successfully!');
}

/**
 * Display the main menu and handle user choices.
 */
function main() {
  const notes = loadNotes();

  while (true) {
    console.log('\n=== 🗂️ Note Organizer Menu ===');
    console.log('1. Add a note');
    console.log('2. List all notes');
    console.log('3. Read a note');
    console.log('4. Delete a note');
    console.log('5. Update a note');
    console.log('6. Exit');

    const choice = readline.question('\nEnter your choice (1-6): ').trim();

    switch (choice) {
      case '1': addNote(notes); break;
      case '2': listAllNotes(notes); break;
      case '3': readNote(notes); break;
      case '4': deleteNote(notes); break;
      case '5': updateNote(notes); break;
      case '6': console.log('👋 Goodbye!'); process.exit(0);
      default: console.log('❌ Invalid choice. Please enter a number between 1 and 6.'); break;
    }
  }
}

if (require.main === module) main();
