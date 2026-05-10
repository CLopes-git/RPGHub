function voltar() {
  window.location.href = "dashboard.html";
}

function salvar() {
  const atributos = {
    forca: document.getElementById("forca").value,
    destreza: document.getElementById("destreza").value,
    constituicao: document.getElementById("constituicao").value,
    inteligencia: document.getElementById("inteligencia").value,
    sabedoria: document.getElementById("sabedoria").value,
    carisma: document.getElementById("carisma").value
  };

  localStorage.setItem("atributos", JSON.stringify(atributos));

  alert("Ficha salva com sucesso!");
}