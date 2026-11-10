
const $ = id => document.getElementById(id);

let selectedFiles = [];

const endpoint = () =>
  $("endpoint").value.trim().replace(/\/+$/, "");

function setStatus(message, color = "#fbbf24") {
  $("status").textContent = message;
  $("status").style.color = color;
}

async function loadModels() {
  try {
    setStatus("Conectando...");

    const response = await fetch(`${endpoint()}/api/tags`);
    if (!response.ok) throw new Error("Servidor no disponible");

    const data = await response.json();
    const select = $("model");
    const previous = select.value;

    select.replaceChildren();

    for (const model of data.models || []) {
      const option = document.createElement("option");
      option.value = model.name;
      option.textContent = model.name;
      select.appendChild(option);
    }

    if (previous && [...select.options].some(o => o.value === previous)) {
      select.value = previous;
    }

    setStatus("● Conectado", "#4ade80");

    if (!select.options.length) {
      setStatus("Sin modelos instalados", "#fbbf24");
    }
  } catch (error) {
    setStatus("● Ollama desconectado", "#f87171");
    $("model").replaceChildren();
    $("model").add(new Option("No se encontraron modelos", ""));
  }
}

function renderFiles() {
  const list = $("file-list");
  list.replaceChildren();

  selectedFiles.forEach((file, index) => {
    const row = document.createElement("div");
    row.className = "file";

    const name = document.createElement("span");
    name.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

    const remove = document.createElement("button");
    remove.textContent = "×";
    remove.onclick = () => {
      selectedFiles.splice(index, 1);
      renderFiles();
    };

    row.append(name, remove);
    list.appendChild(row);
  });
}

function addFiles(files) {
  const allowed = /\.(txt|md|csv|json|log|html|xml|yaml|yml|ini|py|js|css|sql|ps1|bat|png|jpg|jpeg|webp)$/i;

  for (const file of files) {
    if (!allowed.test(file.name)) continue;

    if (!selectedFiles.some(f =>
      f.name === file.name && f.size === file.size
    )) {
      selectedFiles.push(file);
    }
  }

  renderFiles();
}

$("dropzone").onclick = () => $("files").click();

$("files").onchange = event => {
  addFiles(event.target.files);
  event.target.value = "";
};

$("dropzone").ondragover = event => {
  event.preventDefault();
  $("dropzone").classList.add("drag");
};

$("dropzone").ondragleave = () => {
  $("dropzone").classList.remove("drag");
};

$("dropzone").ondrop = event => {
  event.preventDefault();
  $("dropzone").classList.remove("drag");
  addFiles(event.dataTransfer.files);
};

async function readFile(file) {
  if (file.type.startsWith("image/") ||
      /\.(png|jpg|jpeg|webp)$/i.test(file.name)) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    let binary = "";
    const chunkSize = 8192;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(
        ...bytes.subarray(i, i + chunkSize)
      );
    }

    return {
      type: "image",
      name: file.name,
      data: btoa(binary)
    };
  }

  return {
    type: "text",
    name: file.name,
    data: await file.text()
  };
}

async function sendMessage() {
  const question = $("question").value.trim();
  const model = $("model").value;

  if (!model) {
    $("result").textContent = "Selecciona un modelo de Ollama.";
    return;
  }

  if (!question && !selectedFiles.length) {
    $("result").textContent = "Añade archivos o escribe una pregunta.";
    return;
  }

  const button = $("send");
  button.disabled = true;
  button.textContent = "Procesando...";
  $("result").textContent = "Enviando información a Ollama...";

  try {
    const contents = await Promise.all(
      selectedFiles.map(readFile)
    );

    const images = contents
      .filter(file => file.type === "image")
      .map(file => file.data);

    const documents = contents
      .filter(file => file.type === "text")
      .map(file =>
        `\n\n--- ARCHIVO: ${file.name} ---\n${file.data}`
      ).join("");

    const prompt = `
Eres un asistente que analiza documentos locales.

Utiliza el contenido de los archivos proporcionados
para responder a la pregunta del usuario.

No inventes información. Si no encuentras algo,
indícalo claramente.

${documents}

PREGUNTA DEL USUARIO:
${question || "Analiza los archivos proporcionados."}
`;

    const message = {
      role: "user",
      content: prompt
    };

    if (images.length) {
      message.images = images;
    }

    const response = await fetch(`${endpoint()}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages: [message],
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();

    $("result").textContent =
      data.message?.content || "Ollama no devolvió una respuesta.";

  } catch (error) {
    $("result").textContent =
      "Error al conectar con Ollama:\n" + error.message +
      "\n\nComprueba que Ollama está iniciado y que permite " +
      "conexiones desde la extensión.";
  } finally {
    button.disabled = false;
    button.textContent = "Enviar a Ollama →";
  }
}

$("send").onclick = sendMessage;
$("refresh").onclick = loadModels;

$("clear").onclick = () => {
  $("result").textContent = "Aquí aparecerán las respuestas de Ollama.";
  $("question").value = "";
  selectedFiles = [];
  renderFiles();
};

$("endpoint").onchange = loadModels;

loadModels();
