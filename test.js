const readline = require('readline-sync');

function getValidatedTitle() {
  while (true) {
    const title = readline.question("Enter a note title: ").trim();  // remove leading/trailing spaces

    if (title.length === 0) {
      console.log("❌ Title cannot be empty. Please enter a valid title.\n");
    } else {
      return title;  // valid title entered
    }
  }
}

const noteTitle = getValidatedTitle();
console.log("✅ Title received:", noteTitle);
