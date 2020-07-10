// elementos manipulables
let btnResp = document.getElementById("btnResponder");
let fback = document.getElementById("container-feedback");
let siguiente = document.getElementById("siguiente");
let consulta = document.getElementById("consulta");
let msg = "";
let subMsg = "";

// valores ejercicio

// opciones
let opt = {
    values: ["1","2","3"],
    labels: [
        "Dos rectas <br> paralelas",
        "Dos rectas <br> coincidentes",
        "Dos rectas <br> secantes"
    ]
};

// mensajes feedback
let correcta = "¡Lo lograste!";
let incorrecta = [
    {
        m: "¡No del todo!",
        sm: "Dos rectas coincidentes son equivalentes"
    },
    {
        m: "¡Vuelve a intentarlo!",
        sm: "Dos rectas secantes tienen distintas pendientes"
    },
]

// funciones para establecer valores de inicio

// resetear opciones
resetRadios = () => {

    inp = document.getElementsByTagName("input");
    for (let i = 0; i < inp.length; i++ )
    {
        inp[i].checked = false;
        if (inp[i].id == `radio-${[i]}`) {
            inp[i].value = opt.values[i];
        }
    }
}

setLabels = () => {
    radio
}

// ocultar/mostrar footer feedback
toggleFback = (fb,sig,con) => {
    fback.style.display = fb;
    siguiente.style.display = sig;
    consulta.style.display = con;
}

// agregar/quitar clases feedback
addRemoveClass = () => {
let fback = document.querySelector(".feedback");
    if (correct) {
        fback.classList.add("feedback-correcto");
        fback.classList.remove("feedback-incorrecto");
    }
    else if (!correct)
    {
        fback.classList.add("feedback-incorrecto");
        fback.classList.remove("feedback-correcto");
    }
    else {
        console.log("AddRemoveClass Exception");
    }
}

// fijar mensajes feedback
setFbMsg = () => {
    document.getElementById("feedback-span").innerHTML = msg;
    document.getElementById("feedback-p").innerHTML = subMsg;
}

// (re) iniciar prueba técnica
setStart = () => {
    console.log("COMENZANDO PRUEBA TÉCNICA...");
    start = true;
    msg = "";
    subMsg = "";
    setFbMsg();
    selectedOption = "";
    attemps = 0;
    correct = false;
    glosaOn = false;
    addRemoveClass();
    resetRadios();
    if (!btnResp.disabled) btnResp.disabled = true; 
    toggleFback("none", "block", "block");
}

// COMENZAR PRUEBA TÉCNICA
setStart();

// evaluación de valores
evalOptions = (e) => {
    toggleFback("none", "block", "block");

    // compara opciones cliqueadas
    switch(e.value) {
        case "1":
        correct = true;
          break;
        case "2":
        correct = false;
          break;
        case "3":
        correct = false;
          break;
        default:
        console.log("EvalOptions Exception: Error obteniendo caso");
    }
    selectedOption = e.value;
    if (btnResp.disabled) btnResp.disabled = false; 
}

// responder
answer = () => {
    attemps++;
    domSwitch();
    resetRadios();
    footerSwitch();
    toggleFback("block", "none", "none");
}

// determinar si continúa o sigue
domSwitch = () => {
    // responde correctamente
    if (correct)
    {
        footerSwitch();
        console.log("Reiniciando prueba en 2 segundos");
        setTimeout(() => { setStart(); }, 2000);
    }
    // excede intentos
    else if (attemps >= 2 && !correct)
    {
        console.log("Excede intentos");

        // activa & desactiva glosa
        glosaSwitch();
        
        // activa & desactiva footer
        footerSwitch();
    }
}

// manipula glosa
glosaSwitch = () => {
    glosaOn = !glosaOn;
    document.getElementById("glosa").style.display = "flex";
}

cerrarFeedGlosa = () => {
    glosaSwitch();
    setStart();
    document.getElementById("glosa").style.display = "none";
}

// manipula footer
footerSwitch = () => {

    // decide mensaje en footer
    switch(correct) {
        case true:
            msg = correcta;
            addRemoveClass(correct);
            setFbMsg();
            break;
        case false:
            addRemoveClass(correct);
            if (selectedOption == 2)
            {
                msg = incorrecta[0].m;
                subMsg = incorrecta[0].sm; 
            }
            else if (selectedOption == 3)
            {
                msg = incorrecta[1].m; 
                subMsg = incorrecta[1].sm;
            }
            setFbMsg();
            break;
        default:
        console.log("Mensaje de footer no encontrado.");
    }
}