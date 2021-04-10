const words = ['application', 'programming', 'interface', 'wizard','dog',"hi","we","I"];

export function selectWord(){
  return words[Math.floor(Math.random() * words.length)];
}

export function showNotification(setter) {
    setter(true);
    setTimeout(() => {
      setter(false);
    }, 2000);
}