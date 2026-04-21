const text = "Valentine Maître";
const textContent = document.getElementById("textContent");
const actionDisplay = document.getElementById("actionDisplay");
let index = 0;

function typeChar() {
  if (index < text.length) {
    textContent.textContent += text.charAt(index);
    index++;
    setTimeout(typeChar, 80);
  } else {
    actionDisplay.classList.add("show");
  }
}

window.onload = () => {
  typeChar();
  document.getElementById("btnParcours").onclick = () => { window.location.href = "about.html"; };
  document.getElementById("btnProjets").onclick  = () => { window.location.href = "projects.html"; };
};
