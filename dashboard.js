window.onload = () => {
    if (!getLoggedUser()) window.location = "index.html";
    loadUserFilter();
    loadCards();
};

function loadUserFilter() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const sel = document.getElementById("filterUser");
    sel.innerHTML = "<option value=''>Todos</option>";

    users.forEach(u => {
        const op = document.createElement("option");
        op.value = u.user;
        op.textContent = u.user;
        sel.appendChild(op);
    });
}

function addCard() {
    const newCard = {
        id: Date.now(),
        user: getLoggedUser(),
        tipo: document.getElementById("tipo").value,
        escopo: document.getElementById("escopo").value,
        custo: document.getElementById("custo").value,
        prazo: document.getElementById("prazo").value,
        obs: document.getElementById("obs").value,
        created: new Date().toLocaleString()
    };

    const cards = getCards();
    cards.push(newCard);
    saveCards(cards);

    loadCards();
}

function loadCards() {
    const filter = document.getElementById("filterUser").value;
    const cards = getCards();
    const logged = getLoggedUser();

    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";

    cards
        .filter(c => !filter || c.user === filter)
        .forEach(card => {
            const div = document.createElement("div");
            div.className = "card";

            if (card.editing) {
                div.classList.add("editing");
                div.innerHTML = `
                    <h4>${card.tipo}</h4>

                    <label>Escopo</label>
                    <textarea id="edit-escopo-${card.id}">${card.escopo}</textarea>

                    <label>Custo (R$)</label>
                    <input type="number" step="0.01" id="edit-custo-${card.id}" value="${card.custo}">

                    <label>Prazo (dias)</label>
                    <input type="number" id="edit-prazo-${card.id}" value="${card.prazo}">

                    <label>Observações</label>
                    <textarea id="edit-obs-${card.id}">${card.obs}</textarea>

                    <button onclick="saveEdit(${card.id})">Salvar</button>
                    <button onclick="cancelEdit(${card.id})">Cancelar</button>
                `;
            } else {
                div.innerHTML = `
                    <h4>${card.tipo}</h4>

                    <div class="card-row">
                        <span class="card-label">Escopo:</span>
                        <span class="card-value">${card.escopo}</span>
                    </div>

                    <div class="card-row">
                        <span class="card-label">Custo:</span>
                        <span class="card-value">${formatarCusto(Number(card.custo))}</span>
                    </div>

                    <div class="card-row">
                        <span class="card-label">Prazo:</span>
                        <span class="card-value">${card.prazo} dias</span>
                    </div>

                    <div class="card-row">
                        <span class="card-label">Observações:</span>
                        <span class="card-value">${card.obs}</span>
                    </div>

                    <small>Criado em: ${card.created}</small><br>
                    <small>Autor: ${card.user}</small><br>
                `;
            }

            if (card.user === logged && !card.editing) {
                const btnEdit = document.createElement("button");
                btnEdit.textContent = "Editar";
                btnEdit.onclick = () => editCard(card.id);

                const btnDel = document.createElement("button");
                btnDel.textContent = "Excluir";
                btnDel.onclick = () => deleteCard(card.id);

                div.appendChild(btnEdit);
                div.appendChild(btnDel);
            }

            container.appendChild(div);
        });
}

function deleteCard(id) {
    const cards = getCards().filter(c => c.id !== id);
    saveCards(cards);
    loadCards();
}

function editCard(id) {
    const cards = getCards();
    const card = cards.find(c => c.id === id);

    card.editing = true;
    saveCards(cards);
    loadCards();
}

function saveEdit(id) {
    const cards = getCards();
    const card = cards.find(c => c.id === id);

    card.escopo = document.getElementById(`edit-escopo-${id}`).value;
    card.custo = Number(document.getElementById(`edit-custo-${id}`).value);
    card.prazo = Number(document.getElementById(`edit-prazo-${id}`).value);
    card.obs   = document.getElementById(`edit-obs-${id}`).value;

    card.editing = false;

    saveCards(cards);
    loadCards();
}

function cancelEdit(id) {
    const cards = getCards();
    const card = cards.find(c => c.id === id);

    card.editing = false;
    saveCards(cards);
    loadCards();
}

async function exportarPDF() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();
    let y = 10; // posição vertical

    const cards = getCards();

    doc.setFontSize(18);
    doc.text("Relação de Manutenções", 10, y);
    y += 10;

    doc.setFontSize(12);

    cards.forEach(card => {
        doc.text(`Tipo: ${card.tipo}`, 10, y); y += 7;
        doc.text(`Escopo: ${card.escopo}`, 10, y); y += 7;
        doc.text(`Custo: R$ ${card.custo}`, 10, y); y += 7;
        doc.text(`Prazo: ${card.prazo} dias`, 10, y); y += 7;
        doc.text(`Observações: ${card.obs}`, 10, y); y += 7;
        doc.text(`Criado em: ${card.created}`, 10, y); y += 7;
        doc.text(`Autor: ${card.user}`, 10, y); y += 10;

        if (y > 270) {
            doc.addPage();
            y = 10;
        }
    });

    doc.save("manutencoes.pdf");
}
