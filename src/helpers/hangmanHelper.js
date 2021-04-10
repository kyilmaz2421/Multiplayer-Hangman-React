const words = ["alaffia", "reactjs", "graphql"]; // in theory this would be linked to a dictionary database of some sort

export function selectWord() {
  return words[Math.floor(Math.random() * words.length)];
}

export function showNotification(setter) {
  setter(true);
  setTimeout(() => {
    setter(false);
  }, 2000);
}
