const text = "Bonjour, je suis Valentine Maître";
const textContent = document.getElementById("textContent");
const actionDisplay = document.getElementById("actionDisplay");
let index = 0;

function typeChar() {
  if (index < text.length) {
    textContent.textContent += text.charAt(index);
    index++;
    setTimeout(typeChar, 70);
  } else {
    console.log("Texte terminé, affichage boutons...");
    actionDisplay.classList.add("show"); // déclenche l’opacité en fondu
  }
}

window.onload = () => {
  typeChar();

  document.getElementById("btnParcours").onclick = () => {
    window.location.href = "about.html";
  };
  document.getElementById("btnProjets").onclick = () => {
    window.location.href = "projects.html";
  };
};
