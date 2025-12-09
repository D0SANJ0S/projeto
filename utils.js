function getLoggedUser() {
    return localStorage.getItem("loggedUser");
}

function getCards() {
    return JSON.parse(localStorage.getItem("cards") || "[]");
}

function saveCards(cards) {
    localStorage.setItem("cards", JSON.stringify(cards));
}

function formatarCusto(valor) {
    if (valor === undefined || valor === null || isNaN(valor)) return "R$ 0,00";

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}
