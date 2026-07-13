(function () {
  "use strict";

  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".main-nav");

  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("is-open", !open);
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
      });
    });
  }

  const form = document.querySelector("#registrationForm");
  if (!form) return;

  const selectedAnimal = new URLSearchParams(window.location.search).get("animal");
  const animalInput = document.querySelector("#animal");
  const animalNote = document.querySelector(".selected-animal");

  if (selectedAnimal && animalInput && animalNote) {
    const cleanAnimal = selectedAnimal.replace(/[^a-záéíóúüñ\s-]/gi, "").trim();
    animalInput.value = cleanAnimal;
    animalNote.hidden = false;
    animalNote.textContent = `Quieres ayudar a ${cleanAnimal}. ¡Gracias por elegirle!`;
  }

  const status = document.querySelector("#form-status");
  const submitButton = form.querySelector("button[type='submit']");
  const fields = ["nombre", "edad", "cedula", "correo", "telefono"];

  function setError(field, message) {
    const input = document.querySelector(`#${field}`);
    const error = document.querySelector(`#${field}-error`);
    if (input) input.classList.toggle("is-invalid", Boolean(message));
    if (error) error.textContent = message || "";
  }

  function clearErrors() {
    fields.forEach((field) => setError(field, ""));
    status.textContent = "";
    status.className = "form-status";
  }

  function validEcuadorianId(value) {
    if (!/^\d{10}$/.test(value)) return false;
    const digits = value.split("").map(Number);
    if (digits[0] * 10 + digits[1] < 1 || digits[0] * 10 + digits[1] > 24 || digits[2] > 5) return false;
    const total = digits.slice(0, 9).reduce((sum, digit, index) => {
      if (index % 2 === 0) {
        const doubled = digit * 2;
        return sum + (doubled > 9 ? doubled - 9 : doubled);
      }
      return sum + digit;
    }, 0);
    return (10 - (total % 10)) % 10 === digits[9];
  }

  function validate(data) {
    let isValid = true;
    if (data.nombre.trim().length < 3) {
      setError("nombre", "Escribe tu nombre completo.");
      isValid = false;
    }
    const age = Number(data.edad);
    if (!Number.isInteger(age) || age < 12 || age > 120) {
      setError("edad", "Ingresa una edad válida.");
      isValid = false;
    }
    if (!validEcuadorianId(data.cedula.replace(/\s/g, ""))) {
      setError("cedula", "Ingresa una cédula ecuatoriana válida de 10 dígitos.");
      isValid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.correo)) {
      setError("correo", "Ingresa un correo electrónico válido.");
      isValid = false;
    }
    if (!/^\+?[\d\s-]{7,20}$/.test(data.telefono)) {
      setError("telefono", "Ingresa un número de teléfono válido.");
      isValid = false;
    }
    return isValid;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();

    const data = Object.fromEntries(new FormData(form).entries());
    data.nombre = data.nombre.trim();
    data.cedula = data.cedula.replace(/\s/g, "");
    data.correo = data.correo.trim().toLowerCase();
    data.telefono = data.telefono.trim();
    data.fechaRegistro = new Date().toISOString();

    if (!validate(data)) {
      status.textContent = "Revisa los campos marcados antes de registrarte.";
      status.classList.add("error");
      return;
    }

    const endpoint = window.PADRINOS_CONFIG && window.PADRINOS_CONFIG.registrationEndpoint;
    if (!endpoint) {
      status.textContent = "El formulario está listo, pero falta conectar el Excel de SharePoint. Agrega la URL del flujo de Power Automate en config.js.";
      status.classList.add("error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Guardando...";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error(`Respuesta ${response.status}`);

      form.reset();
      if (animalInput) animalInput.value = selectedAnimal || "";
      status.textContent = "¡Registro enviado con éxito! Muy pronto nos pondremos en contacto contigo.";
      status.classList.add("success");
    } catch (error) {
      console.error(error);
      status.textContent = "No se pudo guardar tu registro. Verifica la conexión con SharePoint e inténtalo nuevamente.";
      status.classList.add("error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Registrarme";
    }
  });
})();
