let i = 0;
let ans = new Array(questions.length).fill(null);

const app = document.getElementById("app");

function transition(render) {
    app.style.opacity = "0";
    app.style.transform = "translateY(20px)";
    setTimeout(() => {
        render();
        app.style.opacity = "1";
        app.style.transform = "translateY(0)";
    }, 250);
}

function startScreen() {
    app.innerHTML = `
    <div class="start-screen">
        <h1>TEST FINALE</h1>
        <p>
            Rispondi correttamente per otterrenere il<br>
            Certificato di Stregoneria!
        </p>
        <button id="startButton">INIZIA</button>
    </div>`;

    document.getElementById("startButton").onclick = () => {
        i = 0;
        transition(draw);
    };
}

function draw() {

    if (i >= questions.length) {
        showLoading();
        return;
    }

    const q = questions[i];

    app.innerHTML = `
        <div class="progress-text">Domanda ${i + 1} di ${questions.length}</div>
        <h2>${q.question}</h2>
    `;

    q.answers.forEach((text, index) => {

        const b = document.createElement("button");
        b.className = "answer";
        b.textContent = text;

        if (ans[i] === index) {
            b.classList.add("selected");
        }

        b.onclick = () => {

            ans[i] = index;

            document
                .querySelectorAll(".answer")
                .forEach(x => x.classList.remove("selected"));

            b.classList.add("selected");

        };

        app.appendChild(b);

    });

    const nav = document.createElement("div");
    nav.className = "nav-buttons";

    const next = document.createElement("button");
    next.textContent = i === questions.length - 1 ? "CONCLUDI" : "AVANTI ❯";

    next.onclick = () => {

        if (ans[i] === null) {
            alert("Seleziona una risposta.");
            return;
        }

        i++;
        transition(draw);

    };

    const prev = document.createElement("button");
    prev.textContent = "❮ INDIETRO";

    if (i === 0) {
        prev.style.visibility = "hidden";
    }

    prev.onclick = () => {

        if (i > 0) {
            i--;
            transition(draw);
        }

    };

    nav.appendChild(next);
    nav.appendChild(prev);

    app.appendChild(nav);

}

function showLoading() {

    app.innerHTML = `
        <div class="loading-screen">
            <div class="magic-loader">
                <div class="ring"></div>
                <div class="orb"></div>
            </div>
        </div>
    `;

    app.style.opacity = "0";

    requestAnimationFrame(() => {

        app.style.opacity = "1";

    });

    setTimeout(() => {

        transition(end);

    }, 2500);

}

function end() {

    let score = 0;

    ans.forEach((a, n) => {
        if (a === questions[n].correct) score++;
    });

    if (score >= 6) {

        app.innerHTML = `
        <div class="result">

            <h1>COMPLIMENTI</h1>

            <p>
                Hai risposto correttamente a
                <b>${score}</b> domande su
                <b>${questions.length}</b>.
            </p>

            <br>

            <p>Inserisci il nome che desideri sul certificato</p>

            <input
                id="certificateName"
                type="text"
                maxlength="40"
                placeholder="Nome e Cognome"
            >

            <br><br>

            <button id="generateCertificate">
                📜 Genera Certificato
            </button>
            <p class="aspetta" id="downloadMessage">
    <small>(aspetta qualche secondo l'inizio del download)</small>
</p>
            <canvas
                id="certificateCanvas"
                style="display:none"
            ></canvas>

        </div>
    `;

        document
            .getElementById("generateCertificate")
            .onclick = generateCertificate;

    } else {
        app.innerHTML = `
        <div class="result">
            <h2>📚 Test non superato</h2>
            <br><p>Hai risposto correttamente a <b>${score}</b> domande su <b>${questions.length}</b>.</p>
            <br><p>Devi ottenere almeno <b>6 risposte corrette su ${questions.length}</b>.</p>
            <br><button id="retryButton">🔄 Ritenta il test</button>
        </div>`;

        document.getElementById("retryButton").onclick = () => {
            i = 0;
            ans = new Array(questions.length).fill(null);
            transition(startScreen);
        };
    }
}

async function generateCertificate() {

    const input = document.getElementById("certificateName");

    let name = input.value.trim();

    // Mantiene solo lettere (di qualsiasi lingua), segni diacritici,
    // apostrofi, trattini e spazi.
    name = name.replace(/[^\p{L}\p{M}' -]/gu, "");

    // Elimina spazi multipli
    name = name.replace(/\s+/g, " ");

    // Maiuscola automatica delle iniziali
name = name
    .split(" ")
    .map(word =>
        word.charAt(0).toLocaleUpperCase() +
        word.slice(1).toLocaleLowerCase()
    )
    .join(" ");
    
    // Aggiorna il campo
    input.value = name;

    if (name === "") {
        alert("Inserisci il tuo nome.");
        return;
    }

    if (name.split(" ").length < 2) {
        alert("Inserisci nome e cognome.");
        return;
    }

    document
        .getElementById("downloadMessage")
        .classList.add("show");

    const canvas = document.getElementById("certificateCanvas");
    const ctx = canvas.getContext("2d");

    const font = new FontFace(
        "Elven",
        "url(fonts/elvencommonspeak.ttf)"
    );

    await font.load();
    document.fonts.add(font);

    const image = new Image();

    image.crossOrigin = "anonymous";
    image.src = "download/certificato.png";

    image.onload = () => {

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        let size = 500;
        ctx.font = `${size}px Elven`;

        while (
            ctx.measureText(name).width > 900 &&
            size > 40
        ) {
            size--;
            ctx.font = `${size}px Elven`;
        }

        ctx.fillStyle = "#3a2b22";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            name,
            canvas.width / 2,
            560
        );

        const link = document.createElement("a");

        link.download = `Certificato - ${name}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();

    };

}

app.style.transition = "opacity .25s ease, transform .25s ease";
startScreen();

