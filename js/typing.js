const text = "Je suis passionnée par la création d'applications fluides, esthétiques et utiles. J'aime explorer l'écosystème Apple, concevoir des interfaces soignées et apprendre en continu de nouvelles technologies. Ce portfolio est une extension de mon univers, mêlant technique et design.";
const textContent = document.getElementById("textContent");
const actionButtons = document.getElementById("actionButtons");
let index = 0;

function typeChar() {
  if (index < text.length) {
    textContent.textContent += text.charAt(index);
    index++;
    setTimeout(typeChar, 70);
  } else {
    console.log("Texte terminé, affichage boutons...");
    actionButtons.style.display = "block";
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
