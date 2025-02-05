const firebaseConfig = {
    apiKey: "AIzaSyBCiQrrtx-69rppeMRY07PZokkatjNd3rI",
    authDomain: "jogo-bae80.firebaseapp.com",
    databaseURL: "https://jogo-bae80-default-rtdb.firebaseio.com/",
    projectId: "jogo-bae80",
    storageBucket: "jogo-bae80.firebasestorage.app",
    messagingSenderId: "799584591971",
    appId: "1:799584591971:web:4c6026c9430ffdc724d856"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Criar uma nova sala
function confirmarSala() {
    let nomeSala = document.getElementById("nomeSala").value;
    let nomeUsuario = document.getElementById("nomeUsuario").value;

    if (!nomeSala || !nomeUsuario) return alert("Preencha todos os campos!");

    let ref = db.ref("salas/" + nomeSala);
    ref.set({ jogador1: nomeUsuario, jogador2: "" }).then(() => {
        window.location.href = `jogo.html?sala=${nomeSala}`;
    });
}

// Listar salas disponíveis
function listarSalas() {
    const lista = document.getElementById("listaSalas");
    if (!lista) return;

    lista.innerHTML = "";
    db.ref("salas").on("value", snapshot => {
        snapshot.forEach(sala => {
            let nome = sala.key;
            let dados = sala.val();
            if (dados.jogador2 === "") {
                let li = document.createElement("li");
                li.innerHTML = `${nome} <button onclick="entrarSala('${nome}')">Entrar</button>`;
                lista.appendChild(li);
            }
        });
    });
}

// Entrar em uma sala
function entrarSala(nomeSala) {
    let nomeUsuario = prompt("Digite seu nome:");
    if (!nomeUsuario) return;

    let ref = db.ref("salas/" + nomeSala);
    ref.update({ jogador2: nomeUsuario }).then(() => {
        window.location.href = `jogo.html?sala=${nomeSala}`;
    });
}

// Monitorar o jogo e remover sala após saída
listarSalas();
