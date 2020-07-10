//datos ejercicio
var contenidoBody = JSON.parse(document.body.getAttribute('data-content').replace(/'/g, '"'));
var versionBody = JSON.parse(document.body.getAttribute('data-version').replace(/'/g, '"'));
var nivelEjercicio = document.body.dataset.id.charAt(1)
var svgGlosa = [];

katex.render("c = \\pm\\sqrt{a^2 + b^2}", element, {
    throwOnError: false
});

const FUNCIONES = [
	{
		name: 'General', tag: 'general', fns: [
			{ id: 'Insertar Texto', action: insertarTexto },
			{ id: 'Insertar Input', action: insertarInput },
			{ id: 'Insertar Input Fracción', action: insertarInputFraccion },
			{ id: 'Insertar Tabla', action: insertarTabla },
			{ id: 'Insertar Imagen', action: insertarImagen }
		]
	}, {
		name: 'HTML', tag: 'html', fns:[
			{ id:'Tabla Posicional V2', action: tabPos }
		]
	}, {
		name: 'SVG', tag: 'svg', fns: [
			{ id: 'Recta', action: recta },
			{ id: 'Formador Grupos', action: formadorGrupos },
			{ id: 'Sucesiones', action: sucesiones },
			{ id: 'Tabla Secuencia', action: tablaSecuencia },
			{ id: 'Diagrama Barra', action: diagramaBarra },
			{ id: 'Patrones', action: patrones },
			{ id: 'Tarjeta', action: tarjeta },
			{ id: 'Balanza', action: balanza },
			{ id: 'Patrón de Segmentos', action: patronSegmentos }
		]
	}, {
		name: 'Numeración', tag: 'numeracion', fns: [
			{ id: 'Repetición Bidimensional', action: repeticionBidimensional },
			{ id: 'Multiplicación Pictóricos', action: multiplicacionPic },
			{ id: 'Ábaco', action: abaco },
			{ id: 'Multiplicacin Elementos', action: multiplicacionElem },
			{ id: 'Repetición Pictóricos V2', action: repeticionPicV2 }
		]
	}, {
		name: 'Medición', tag: 'medicion', fns: [
		]
	}
]

window.onload = function () {
	dibujaHtml()
	print()
	iniciaListeners()
}

function iniciaListeners() {
	const preventAction = (event) => {
		event.preventDefault()
		return false
	}
	document.body.addEventListener('drop', preventAction)
	document.body.addEventListener('contextmenu', preventAction)

	document.querySelectorAll('input[type=radio]').forEach(input => {
		input.addEventListener('change', () => {
			document.getElementById('btnResponder').disabled = false
		})
	})
	document.querySelectorAll('input[type=text]').forEach(input => {
		input.addEventListener('keyup', () => {
			let todasRespondidas = true
			for (let input of document.querySelectorAll('input[type=text]')) {
				if (input.value.trim() === '') {
					todasRespondidas = false
					break
				}
			}
			document.getElementById('btnResponder').disabled = !todasRespondidas
		})
		input.addEventListener('copy', preventAction)
		input.addEventListener('paste', preventAction)
		input.addEventListener('cut', preventAction)
	})
	document.querySelectorAll('[data-tipoinput="alfanumerico"]').forEach(input => {
		input.addEventListener('keypress', (e) => {
			let validacion = (e.keyCode >= 48 && e.keyCode <= 57) //numeros
				|| (e.keyCode >= 65 && e.keyCode <= 90) //letra mayuzc
				|| (e.keyCode >= 97 && e.keyCode <= 122) //letra minusc
				|| (e.keyCode == 241 || e.keyCode == 209) //ñ y Ñ
				|| (e.keyCode == 225 || e.keyCode == 233 || e.keyCode == 237 || e.keyCode == 243 || e.keyCode == 250) //áéíóú
				|| (e.keyCode == 193 || e.keyCode == 201 || e.keyCode == 205 || e.keyCode == 211 || e.keyCode == 218) //ÁÉÍÓÚ
				|| (e.keyCode == 32) //espacio
			if (!validacion) {
				e.preventDefault();
				return false;
			}
		})
	})
	document.querySelectorAll('[data-tipoinput="texto-numerico"],[data-tipoinput="texto"]').forEach(input => {
		input.addEventListener('keypress', (e) => {
			let validacion = (e.keyCode >= 65 && e.keyCode <= 90) //letra mayuzc
				|| (e.keyCode >= 97 && e.keyCode <= 122) //letra minusc
				|| (e.keyCode == 241 || e.keyCode == 209) //ñ y Ñ
				|| (e.keyCode == 225 || e.keyCode == 233 || e.keyCode == 237 || e.keyCode == 243 || e.keyCode == 250) //áéíóú
				|| (e.keyCode == 193 || e.keyCode == 201 || e.keyCode == 205 || e.keyCode == 211 || e.keyCode == 218) //ÁÉÍÓÚ
				|| (e.keyCode == 32) //espacio
			if (!validacion) {
				e.preventDefault();
				return false;
			}
		})
	})
	document.querySelectorAll('[data-tipoinput="comparacion"]').forEach(input => {
		input.addEventListener('keypress', (e) => {
			let validacion = (e.keyCode === 60 || e.keyCode === 61 || e.keyCode === 62)
			if (!validacion) {
				e.preventDefault();
				return false;
			}
		})
	})
	document.querySelectorAll('[data-tipoinput="numero"]').forEach(input => {
		input.addEventListener('keypress', (e) => {
			var validacion = e.keyCode >= 48 && e.keyCode <= 57 //solo numero
			if (!validacion) {
				e.preventDefault();
				return false;
			}
		})
		input.addEventListener('keyup', (e) => {
			var arrayReverse = String(e.target.value).replace(/\s/g, '').split("").reverse(); //espacio cada 3 numeros
			for (var i = 0, count = 0, valor = ''; i < arrayReverse.length; i++) {
				count++;
				if (count === 3 && arrayReverse[i + 1]) {
					valor = ' ' + arrayReverse[i] + valor;
					count = 0;
				} else {
					valor = arrayReverse[i] + valor;
				}
			}
			e.target.value = valor;
		})
	})
	document.querySelectorAll('[data-tipoinput="decimal"]').forEach(input => {
		input.addEventListener('keypress', (e) => {
			var validacion = e.keyCode >= 48 && e.keyCode <= 57 || //solo numero
				e.keyCode === 44 //coma
			if (!validacion) {
				e.preventDefault();
				return false;
			}
		})
		input.addEventListener('keyup', (e) => {
			let valorReal = String(e.target.value).replace(' ', '')
			let entero = String(valorReal).split(',')[0]
			let decimal = String(valorReal).split(',')[1]
			let enteroEspaciado = entero.length >= 4 ? '' : entero
			if (entero.length >= 4) {
				let enteroReverse = entero.split('').reverse()
				let count = 1
				enteroReverse.forEach(function (numero) {
					if (count === 3) {
						enteroEspaciado = ' ' + numero + enteroEspaciado
						count = 1
					} else {
						enteroEspaciado = numero + enteroEspaciado
						count++;
					}
				})
			}
			e.target.value = `${enteroEspaciado}${typeof decimal === 'undefined' ? '' : ','}${typeof decimal === 'undefined' ? '' : decimal}`
		})
	})
}

function convertirARutaRelativa(rutaAbsoluta) {
	return rutaAbsoluta.replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../')
}

function capitalize(a) {
	return a.charAt(0).toUpperCase() + a.slice(1)
}

function imagenEnTexto(imgsrc, alto, ancho) {
	return `<img src="${imgsrc.replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../')}" height="${alto}" width="${ancho}"/>`
}

function repeticiones(cantidad, numero, signo) {
	cantidad = Number(cantidad);
	let con = "";
	for (let i = 0; i < cantidad; i++) {
		con += i + 1 === cantidad ? ` ${numero} ` : ` ${numero} ${signo} `;
	}
	return con;
}

function repeticionesImg(cantidad, imgsrc, alto, ancho, signo) {
	cantidad = Number(cantidad);
	let con = "";
	for (let i = 0; i < cantidad; i++) {
		con += i + 1 === cantidad ? ` <img src="${imgsrc.replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../')}" height="${alto}" width="${ancho}"/> ` : `<img src="${imgsrc.replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../')}" height="${alto}" width="${ancho}"/> ${signo} `;
	}
	return con;

}

function b64_to_utf8(str) {
	return decodeURIComponent(escape(window.atob(str)));
}

function utf8_to_b64(str) {
	return window.btoa(unescape(encodeURIComponent(str)));
}

function shuffle(arr, t = 10) {
	for (let i = 0; i < t; i++) {
		arr = arr.sort(() => (.5 - Math.random()));
	};
	return arr
}

function replace(texto, variables) {
	var result = texto.toString().replace(/\$[a-z]/g, function (coincidencia) { //coincidencia => '$a'
		for (var indexVar = 0; indexVar < variables.length; indexVar++) {
			if (variables[indexVar].var == coincidencia[1]) {
				return variables[indexVar].var;
			}
		}
	});
	return result;
}

function regex(theInput, theVariables, isTutorial) {
	var result = theInput.toString().replace(/\$[a-z]/g, function (coincidencia) { //coincidencia => '$a'
		for (var indexVar = 0; indexVar < theVariables.length; indexVar++) {
			if (theVariables[indexVar].var == coincidencia[1]) {
				return isTutorial ? theVariables[indexVar].vt : theVariables[indexVar].val;
			}
		}
	});
	return result;
}

function numeroAPartitivo(numero, plural) {
	let s = plural === 'si' ? 's' : ''
	switch (numero) {
		case '2':
			return `medio${s}`
		case '3':
			return `tercio${s}`
		case '4':
			return `cuarto${s}`
		case '5':
			return `quinto${s}`
		case '6':
			return `sexto${s}`
		case '7':
			return `séptimo${s}`
		case '8':
			return `octavo${s}`
		case '9':
			return `noveno${s}`
		case '10':
			return `décimo${s}`
		case '11':
			return `onceavo${s}`
		case '12':
			return `doceavo${s}`
		default:
			return `[[[hay que agregar el partitivo]]]`
	}
}



function regexFunctions(text) {
	var result = text.replace(/\/\[.*?\/\]/g, function (coincidencia) { //coincidencia => '{funcion()}' o '[latex]'
		var final = coincidencia.length - 4;
		var funcion = coincidencia.substr(2, final).replace(/&gt;/g, '>').replace(/&lt;/, '<');
		try {
			return eval(funcion)
		} catch (error) {
			/*console.log(error);
			console.log(funcion)*/
			return coincidencia;
		}
	})
	return result;
}

function espacioMilesRegex(texto) {
	return texto.replace(/\d{1,}(\.\d{1,})?/g, function (coincidencia) { //coincidencia => 2000
		let entero = coincidencia.split('.')[0]
		let decimal = coincidencia.split('.')[1]
		let enteroEspaciado = entero.length >= 4 ? '' : entero
		if (entero.length >= 4) {
			let enteroReverse = entero.split('').reverse()
			let count = 1
			enteroReverse.forEach(function (numero) {
				if (count === 3) {
					enteroEspaciado = '&nbsp;' + numero + enteroEspaciado
					count = 1
				} else {
					enteroEspaciado = numero + enteroEspaciado
					count++;
				}
			})
		}
		return `${enteroEspaciado}${decimal ? ',' : ''}${decimal ? decimal : ''}`
	})
}
function espacioMilesRegexx(texto) {
	return texto.replace(/\d{1,}(\.\d{1,})?/g, function (coincidencia) { //coincidencia => 2000
		let entero = coincidencia.split('.')[0]
		let decimal = coincidencia.split('.')[1]
		let enteroEspaciado = entero.length >= 4 ? '' : entero
		if (entero.length >= 4) {
			let enteroReverse = entero.split('').reverse()
			let count = 1
			enteroReverse.forEach(function (numero) {
				if (count === 3) {
					enteroEspaciado = ' ' + numero + enteroEspaciado
					count = 1
				} else {
					enteroEspaciado = numero + enteroEspaciado
					count++;
				}
			})
		}
		return `${enteroEspaciado}${decimal ? ',' : ''}${decimal ? decimal : ''}`
	})
}

function cargaImagen(src) {
	return new Promise(function (resolve, reject) {
		var img = new Image();
		img.src = src;
		img.onload = function () {
			resolve(img);
		}
		img.onerror = function () {
			reject('no pasa nada');
		}
	});
}

function cargaFuente(nombre, src) {
	return new Promise(function (resolve, reject) {
		var font = new FontFace(nombre, `url('${src}')`, {});
		font.load().then(function (loadedFont) {
			document.fonts.add(loadedFont);
			loadedFont.load();
			loadedFont.loaded.then(() => {
				////console.log('fuente ', nombre, ' cargada');
			}).catch(error => {
				////console.log('errror al cargar imagen => ', error);
			});
			document.fonts.ready.then((fontFaceSet) => {
				////console.log(fontFaceSet.size, 'FontFaces loaded.');
				resolve(nombre);
			})
		}).catch(function (error) {
			reject(error);
		});
	});
}

// ---INICIO--- funciones para modificar texto en texto

function espacioMiles(stringNumero) {
	if (stringNumero.length >= 4) {
		var arrayReverse = String(stringNumero).split("").reverse();
		for (var i = 0, count = 0, valor = ''; i < arrayReverse.length; i++) {
			count++;
			if (count === 3 && arrayReverse[i + 1]) {
				valor = ' ' + arrayReverse[i] + valor;
				count = 0;
			} else {
				valor = arrayReverse[i] + valor;
			}
		}
		return valor;
	} else {
		return stringNumero;
	}
}
// ---FIN--- funciones para modificar texto en texto

function print() { //Dibujar ejercicios
	var h = ['e', 'r', 'g'];
	h.forEach(n => {
		contenidoBody[n].forEach((m, i) => {
			for (var oaIndex = 0; oaIndex < FUNCIONES.length; oaIndex++) {

				if (FUNCIONES[oaIndex].tag === m.tag) {

					for (var funcionIndex = 0; funcionIndex < FUNCIONES[oaIndex].fns.length; funcionIndex++) {

						if (FUNCIONES[oaIndex].fns[funcionIndex].id === m.name) {

							FUNCIONES[oaIndex].fns[funcionIndex].action({
								container: document.getElementById(`container-${n}${i}`),
								params: m.params,
								versions: versionBody.vars,
								vt: false
							}, m.tag == 'svg' ? n : undefined);

							break;
						}
					}
					break;
				}
			}
		})
	})
	if (window.MathJax) {
		MathJax.Hub.Queue(["Typeset", MathJax.Hub, function () {
			if (document.querySelectorAll('#respuesta script').length > 0) {
				var respuestas = document.querySelectorAll('#respuesta .radio-div');
				var altoRespuestas = [];
				for (var i = 0; i < respuestas.length; i++) {
					altoRespuestas.push(respuestas[i].offsetHeight);
				}
				var maximo = Math.max(...altoRespuestas);
				for (var i = 0; i < respuestas.length; i++) {
					if (respuestas[i].offsetHeight != maximo) {
						respuestas[i].style.height = maximo + 'px';
					}
				}
			}
		}]);
	}
}

function dibujaHtml() {
	// INICIO ENUNCIADO
	var contenidoDiv = document.getElementById('contenido');
	var contenidoHtml = '';
	contenidoBody['e'].forEach((m, i) => {
		contenidoHtml += `<div class="col-md-${m.width.md} col-sm-${m.width.sm} col-${m.width.xs}">`
		if (m.tag != 'general' && m.tag != 'html') {
			if (m.tag == 'svg') {
				contenidoHtml += `<svg id="container-e${i}" class="img-fluid mx-auto d-block"></svg>`
			} else {
				contenidoHtml += `<canvas id="container-e${i}" class="img-fluid mx-auto d-block"></canvas>`
			}
		} else {
			contenidoHtml += `<div id="container-e${i}"></div>`
		}
		contenidoHtml += '</div>'
	});
	contenidoDiv.innerHTML = contenidoHtml;
	// INICIO RESPUESTA
	var respuestaDiv = document.getElementById('respuesta');
	var respuestaHtml = '';

	var contenidoRespuestas = contenidoBody['r'].filter((item) => { //respuestas que deben estar en forma de imagen seleccionable
		if (item.tag != 'general' && item.tag != 'html') {
			return true;
		} else {
			return item.name === 'Insertar Imagen' || item.name === 'Insertar Tabla' || item.name === 'Tabla Posicional V2';
		}
	});
	if (contenidoRespuestas.length > 0) {
		contenidoRespuestas = shuffle(contenidoBody['r']);
		respuestaHtml += `<div class="row justify-content-center">`
		contenidoRespuestas.forEach(function (item, index) {
			let valor = regexFunctions(regex(item.params.errFrec, versionBody.vars, false)).replace(/\s/g, ' ')
			let textoOpcion = item.params.textoOpcion ? regexFunctions(regex(item.params.textoOpcion, versionBody.vars, false)).replace('#', index+1) : null
			respuestaHtml += `<div class="col-md-${item.params.colmd} col-sm-${item.params.colsm} col-${item.params.col}" style="margin-bottom: 5px;">
          <div class="opcionradio opcionradio-imagen">
            <input type="radio" id="radio-${index}" name="answer" value="${valor}"/>
            <label for="radio-${index}">
              ${textoOpcion ? `<span>${textoOpcion}</span>` : ''}
              ${item.tag != 'general' && item.tag != 'html' ?
					item.tag == 'svg' ?
						`<svg id="container-r${index}" class="img-fluid" ${textoOpcion ? '' : `style="padding:5px;"`}></svg>` :
						`<canvas class="img-fluid" id="container-r${index}"></canvas>` :
					`<div id="container-r${index}"></div>`
				}
            </label>
          </div>  
        </div>`;
		});
		respuestaHtml += `</div>`
	} else {
		contenidoBody['r'].forEach(function (item, index) {
			if (item.tag != 'general') {
				if (m.tag == 'svg') {
					contenidoHtml += `<svg id="container-r${index}" class="img-fluid mx-auto d-block"></svg>`
				} else {
					contenidoHtml += `<canvas id="container-r${index}" class="img-fluid mx-auto d-block"></canvas>`
				}
			} else {
				respuestaHtml += `<div id="container-r${index}"></div>`
			}
		});
	}

	respuestaDiv.innerHTML = respuestaHtml;
	// INICIO GLOSA
	var glosaDiv = document.getElementById('contenido-glosa');
	var glosaHtml = '';
	contenidoBody['g'].forEach((m, i) => {
		glosaHtml += `<div class="col-md-${m.width.md} col-sm-${m.width.sm} col-${m.width.xs}">`
		if (m.tag != 'general' && m.tag != 'html') {
			if (m.tag == 'svg') {
				glosaHtml += `<svg id="container-g${i}" class="img-fluid mx-auto d-block"></svg>`
			} else {
				glosaHtml += `<canvas id="container-g${i}" class="img-fluid mx-auto d-block"></canvas>`
			}
		} else {
			glosaHtml += `<div id="container-g${i}"></div>`
		}
		glosaHtml += '</div>'
	});
	glosaDiv.innerHTML = glosaHtml;
}

function insertarTexto(config) {
	const { container, params, variables, versions, vt } = config
	if (container) {
		let vars = vt ? variables : versions;
		var texto = regex(params.content, vars, vt);
		texto = regexFunctions(texto, true);
		texto = espacioMilesRegex(texto, true);
		container.innerHTML = texto;
	}
}
function insertarImagen(config) {
	const { container, params, variables, versions, vt } = config;
	const { src, display, height, width, col, colsm, colmd, offsetsm, offsetmd, errFrec, feed } = params;
	var source;
	try {
		var vars = vt ? variables : versions;
		var relativePath = src.replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../');
		source = regex(relativePath, vars, vt);
	} catch (e) {
		//console.log(e);
	}
	cargaImagen(source).then(img => {
		if (display === 'alto exacto') {
			img.width = height * img.width / img.height;
			img.height = height;
			container.className = "text-center"
		} else if (display === 'ancho exacto') {
			img.height = width * img.height / img.width;
			img.width = width;
			container.className = "text-center"
		} else if (display === 'alto y ancho exacto') {
			img.width = width;
			img.height = height;
			container.className = "text-center"
		} else {
			img.className = "img-fluid";
			//si errfrec y feed estan seteados es una respuesta este grid se ocupa en el col de la pregunta
			//container.className = (errFrec || feed) ? '' : `col-${col} col-sm-${colsm} offset-sm-${offsetsm} col-md-${colmd} offset-sm-${offsetmd}`;
		}
		container.innerHTML = "";
		container.appendChild(img);
	}).catch(error => {
		var img = document.createElement('img');
		img.src = "/notfound";
		img.alt = "Error al cargar imagen";
		container.appendChild(img);
		//console.log(error);
	});
}
function insertarInput(config) {
	const { container, params, variables, versions, vt } = config,
		{ tipoInput, maxLength, inputSize, placeholder, anchoInput, clasesInput,
			value1, value2, value3, value4, inputType, id, colmd, colsm, col } = params
	var vars = vt ? variables : versions;
	if (container) {
		switch (inputType) {
			case 'input':
				if (tipoInput === 'comparacion' && container.tagName === 'DIV') {
					container.style.display = 'flex'
					container.style.height = '100%'
				}
				container.innerHTML = `<input id=${id} type="text" name="answer" maxlength="${maxLength}" autocomplete="off" class="inputTexto ${clasesInput}" style="width:${anchoInput};" placeholder="${placeholder}" data-content='${utf8_to_b64(value1)}' data-tipoinput="${tipoInput}"/>`;
				break;
			case 'radio':
				var answers = [{
					respuesta: regexFunctions(regex(value1, vars, vt))
				}];
				if (inputSize > 1) {
					answers[1] = {
						respuesta: regexFunctions(regex(value2, vars, vt))
					}
				}
				if (inputSize > 2) {
					answers[2] = {
						respuesta: regexFunctions(regex(value3, vars, vt))
					}
				}
				if (inputSize > 3) {
					answers[3] = {
						respuesta: regexFunctions(regex(value4, vars, vt))
					}
				}

				container.innerHTML = '';
				container.className = 'row justify-content-center';
				answers = shuffle(answers);
				answers.forEach((m, i) => {
					var lmnt = document.createElement('div');
					lmnt.className = `col-${col} col-sm-${colsm} col-md-${colmd}`;
					lmnt.style.marginBottom = '5px'
					lmnt.innerHTML = `
            <div class="opcionradio">
              <input type="radio" id="radio-${i}" name="answer" value="${m.respuesta}">
              <label for="radio-${i}">${espacioMilesRegex(m.respuesta)}</label>
            </div>`;
					container.appendChild(lmnt);
				});
				break;
		}
	}
}

function insertarInputFraccion(config) {
	const { container, params, variables, versions, vt } = config;
	const { enteroMaxLen, numeradorMaxLen, denominadorMaxLen, validaciones, enteroCorrecta, numeradorCorrecta, denominadorCorrecta } = params
	let vars = vt ? variables : versions
	//console.log(regexFunctions(regex(b64_to_utf8(validaciones), vars, vt)))
	_VALIDACIONES_INPUT_TABLA_ = JSON.parse(regex(b64_to_utf8(validaciones), vars, vt));
	let inputFraccion = `<table class="mx-auto">
	<tbody>
		<tr>
			<td rowspan="2">
				<input type="text" id="input1" name="answer" autocomplete="off" class="input-numerador" maxlength="${enteroMaxLen}" data-content='${JSON.stringify({ correctas: utf8_to_b64(regex(enteroCorrecta, vars, vt)), tipoInput: 'numero' })}' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)" />
			</td>
			<td style="border-bottom: 2px solid black;">
				<input type="text" id="input2" name="answer" autocomplete="off" class="input-num-y-den" maxlength="${numeradorMaxLen}" data-content='${JSON.stringify({ correctas: utf8_to_b64(regex(numeradorCorrecta, vars, vt)), tipoInput: 'numero' })}' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)"/>
			</td>
		</tr>
		<tr>
			<td>
				<input type="text" id="input3" name="answer" autocomplete="off" class="input-num-y-den" maxlength="${denominadorMaxLen}" data-content='${JSON.stringify({ correctas: utf8_to_b64(regex(denominadorCorrecta, vars, vt)), tipoInput: 'numero' })}' onkeypress="cambiaInputNumerico(event)" onkeyup="formatearNumero(event)"/>
			</td>
		</tr>
	</tbody>
</table>`
	container.innerHTML = inputFraccion;
}

function insertarTabla(config) {
	const { container, params, variables, versions, vt } = config,
		{ table, cssclases, encabezado, lineasHorizontales, estiloLineaHorizontal, destacado, estiloFondoTD, anchoCols, tituloTabla, widthTabla } = params,
		vars = vt ? variables : versions;
	var marcasEnTd = destacado !== '' ? String(destacado).split(';') : false;
	function debeMarcarse(tr, td) {
		var encontrado = false;
		marcasEnTd.forEach(function (marca) {
			if (marca[0] == (tr + 1) && marca[2] == (td + 1)) {
				encontrado = true;
				return;
			}
		});
		return encontrado;
	}
	var marcasEnTd2 = lineasHorizontales !== '' ? String(lineasHorizontales).split(';') : [];
	function debeDelinearse(tr) {
		var encontrado = false;
		marcasEnTd2.forEach(function (linea) {
			if (linea == (tr + 1)) {
				encontrado = true;
				return;
			}
		});
		return encontrado;
	}
	let ancho = widthTabla !== '100%' ? `style="width:${widthTabla};border-collapse:collapse;"` : "";
	if (container) {
		let r = `<table class="tabla ${cssclases}" ${ancho}><tbody>`;
		if (anchoCols) {
			var anchoColumnas = String(anchoCols).split(',');
			anchoColumnas.forEach(function (ancho) {
				r += `<col width="${ancho}%"/>`;
			});
		}
		for (var row = 0; row < table.length; row++) {
			if (debeDelinearse(row)) {
				r += `<tr style="border-bottom:${estiloLineaHorizontal};">`;
			} else {
				r += '<tr>';
			}
			for (var col = 0; col < table[row].length; col++) {
				if (destacado === '' && lineasHorizontales === '') {
					r += '<td>';
				} else if (destacado !== '' && lineasHorizontales === '') {
					if (debeMarcarse(row, col)) {
						r += `<td style="background:${estiloFondoTD};">`;
					} else { r += '<td>'; }
				} else if (destacado === '' && lineasHorizontales !== '') {
					r += '<td>';
				} else if (destacado !== '' && lineasHorizontales !== '') {
					if (debeMarcarse(row, col)) {
						r += `<td style="background:${estiloFondoTD};">`;
					} else {
						r += '<td>';
					}
				}
				switch (table[row][col].type) {
					case 'text':
						if (table[row][col].value.tachar) {
							var tachado = regexFunctions(regex(table[row][col].value.tachar, vars, vt)) === 'si' ? `class="strikethrough"` : '';
						} else {
							var tachado = ''
						}
						if (encabezado === 'arriba' && row === 0) {
							r += `<p ${tachado}><b>${espacioMilesRegex(regexFunctions(regex(table[row][col].value.text, vars, vt)))}</b></p>`;
						} else if (encabezado === 'izquierda' && col === 0) {
							r += `<p ${tachado}><b>${espacioMilesRegex(regexFunctions(regex(table[row][col].value.text, vars, vt)))}</b></p>`;
						} else {
							r += `<p ${tachado}>${espacioMilesRegex(regexFunctions(regex(table[row][col].value.text, vars, vt)))}</p>`;
						}
						break;
					case 'image':
						var relativePath = table[row][col].value.url.replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../');
						r += `<img src=${regex(relativePath, vars, vt)} height=${table[row][col].value.height} width=${table[row][col].value.width}/>`;
						break;
					case 'input':
						var { tipoInput, idInput, maxLength, placeholder, anchoInput, correctas } = table[row][col].value;
						r += `<input id=${idInput} type="text" name="answer" maxlength="${maxLength}" autocomplete="off" class="inputTexto" style="width:${anchoInput};" placeholder="${placeholder}" data-content='${utf8_to_b64(correctas)}' data-tipoinput="${tipoInput}"/>`;
						break;
					case 'text-input':
						var { text, tipoInput, idInput, maxLength, placeholder, anchoInput, correctas } = table[row][col].value;
						var p = regex(text, vars, vt);
						var input = `<input id=${idInput} type="text" name="answer" maxlength="${maxLength}" autocomplete="off" class="inputTexto" style="width:${anchoInput};" placeholder="${placeholder}" data-content='${utf8_to_b64(correctas)}' data-tipoinput="${tipoInput}"/>`;
						r += `<p>${p.replace('{input}', input)}</p>`;
						break;
					case 'text-image':
						var p = regex(table[row][col].value.text, vars, vt);
						var relativePath = table[row][col].value.url.replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../');
						var img = `<img src=${regex(relativePath, vars, vt)} height=${table[row][col].value.height} width=${table[row][col].value.width}/>`;
						p = `<p>${p.replace(/\{imagen\}/g, img)}</p>`
						r += regexFunctions(p)
						break;
				}
				r += '</td>';
			}
			r += '</tr>'
		}
		r += '</tbody></table>';
		container.classList.add("table-responsive");
		container.innerHTML = r;
		if (tituloTabla !== '') {
			container.parentElement.querySelectorAll('span').forEach(e => e.parentNode.removeChild(e));
			var titulo = document.createElement('span');
			titulo.innerText = regexFunctions(regex(tituloTabla, vars, vt));
			titulo.style.fontSize = '18px';
			titulo.style.fontWeight = '600';
			titulo.style.color = 'black';
			container.parentNode.insertBefore(titulo, container);
		}
	}
}

function cardinalAOrdinal(numero, genero) {//M o F
	switch (numero) {
		case '1':
			return genero === 'M' ? 'primer' : 'primera';
		case '2':
			return genero === 'M' ? 'segundo' : 'segunda';
		case '3':
			return genero === 'M' ? 'tercer' : 'tercera';
		case '4':
			return genero === 'M' ? 'cuarto' : 'tercera';
		case '5':
			return genero === 'M' ? 'quinto' : 'quinta';
		case '6':
			return genero === 'M' ? 'sexto' : 'sexta';
		case '7':
			return genero === 'M' ? 'séptimo' : 'séptima';
		case '8':
			return genero === 'M' ? 'octavo' : 'octava';
		case '9':
			return genero === 'M' ? 'noveno' : 'novena';
		case '10':
			return genero === 'M' ? 'décimo' : 'décima';
		default:
			return '';
	}
}


function repeticionBidimensional(config) {
	const { container, params, variables, versions, vt } = config;
	//console.log(params);
	const { _separacion, _altoOpciones, _anchoCanvas, _altoCanvas, errFrec, feed } = params;
	let { datos } = params;
	let sepElem = Number(_separacion);
	let altoOpciones = Number(_altoOpciones);
	let anchoCanvas = Number(_anchoCanvas);
	let altoCanvas = Number(_altoCanvas)
	container.height = altoCanvas;
	container.width = anchoCanvas;

	var ctx = container.getContext('2d');
	var vars = vt ? variables : versions;

	datos = datos.map(dato => {//arreglo, imagen, texto
		switch (dato.tipo) {
			case 'arreglo':
				return {
					src: String(regex(dato.src, vars, vt)).replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../'),
					repX: Number(regex(dato.repX, vars, vt)),
					repY: Number(regex(dato.repY, vars, vt)),
					textoEjeX: regex(dato.textoEjeX, vars, vt),
					textoEjeY: regex(dato.textoEjeY, vars, vt),
					opcion: regex(dato.opcion, vars, vt),
					altoImagen: Number(dato.altoImagen),
					anchoImagen: Number(dato.anchoImagen),
					separacion: Number(dato.separacion),
					altoOpcion: Number(dato.altoOpcion),
					tipoOpcion: dato.tipoOpcion,
					colorTextoOpcion: dato.colorTextoOpcion,
					tipo: dato.tipo
				};
			case 'imagen':
				return {
					src: String(regex(dato.src, vars, vt)).replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../'),
					altoImagen: Number(dato.altoImagen),
					separacion: Number(dato.separacion),
					tipo: dato.tipo
				};
			case 'texto':
				return {
					src: String(regex(dato.src, vars, vt)).replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../'),
					nombreFuente: dato.nombreFuente,
					altoTexto: Number(dato.altoTexto),
					texto: regex(dato.texto, vars, vt),
					separacion: Number(dato.separacion),
					tipo: dato.tipo
				};
			default:
				//console.log('defecto');
				break;
		}
	});
	Promise.all(datos.map(arreglo => arreglo.tipo === 'texto' ?
		cargaFuente(arreglo.nombreFuente, arreglo.src) :
		cargaImagen(arreglo.src))
	).then(async function (imagenes) {
		await cargaFuente('Open-Sans-Regular-Font', '../../../../fonts/Quicksand-Medium.ttf');
		var anchoTotal = sepElem, altoRepeticiones = [];
		imagenes.forEach(function (imagen, index) {
			if (datos[index].tipo === 'arreglo') {
				datos[index].imagen = imagen;
				datos[index].anchoImagen = datos[index].altoImagen * imagen.width / imagen.height;
				altoRepeticiones.push(datos[index].altoImagen * datos[index].repY + datos[index].separacion * (datos[index].repY + 1));
				anchoTotal += (datos[index].anchoImagen * datos[index].repX) + (datos[index].separacion * (datos[index].repX + 1)) + sepElem;
			} else if (datos[index].tipo === 'imagen') {
				datos[index].imagen = imagen;
				datos[index].anchoImagen = datos[index].altoImagen * imagen.width / imagen.height;
				anchoTotal += datos[index].anchoImagen + (datos[index].separacion * 2) + sepElem;
			} else {
				ctx.save();
				ctx.font = `${datos[index].altoTexto}px ${datos[index].nombreFuente}`;
				anchoTotal += datos[index].separacion * 2 + ctx.measureText(datos[index].texto).width + sepElem;
				ctx.restore();
			}
		});
		var xInicio = container.width / 2 - anchoTotal / 2;
		var altoRepeticionMaximo = altoRepeticiones.sort().pop();
		var yStartRepeticiones = container.height / 2 - altoRepeticionMaximo / 2;
		return { datos: datos, xInicio, yStartRepeticiones, altoRepeticionMaximo };
	}).then(function (resultado) {
		const { datos, xInicio, yStartRepeticiones, altoRepeticionMaximo } = resultado;
		for (var i = 0, x = xInicio, y = 0; i < datos.length; i++) { //x => inicio de la repeticion, tiene que acumularse --- y => inicio de la repeticion, se setea en cada repeticion 
			const { imagen, altoImagen, anchoImagen, tipo, separacion } = datos[i];
			if (tipo === 'imagen') {
				x += sepElem + separacion;
				y = container.height / 2 - altoImagen / 2;
				ctx.drawImage(imagen, x, y, anchoImagen, altoImagen);
				x += anchoImagen + separacion;
			} else if (tipo === 'arreglo') {
				let altoTextoOpcion = (errFrec || feed) ? 45 : 30;
				let altoTextoLaterales = (errFrec || feed) ? 40 : 18;
				const { repX, repY, textoEjeX, textoEjeY, opcion, altoOpcion, tipoOpcion, colorTextoOpcion } = datos[i];
				var altoTotalRep = altoImagen * repY + separacion * (repY + 1); //alto total de la repeticion
				var anchoTotalRep = anchoImagen * repX + separacion * (repX + 1); //ancho total de la repeticion
				var xStart = x + sepElem + separacion;
				var yStart = yStartRepeticiones;
				if (opcion !== '') {
					if (tipoOpcion === 'texto') {
						mostrarTexto(opcion, xStart + (anchoTotalRep / 2) - separacion, container.height - altoOpciones + (altoOpcion / 2), 'center', altoOpcion, colorTextoOpcion);
					} else {
						let imgOpcionSrc = opcion.replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../');
						let img = new Image();
						img.src = imgOpcionSrc;
						const dibujaImagen = (img, centro, yImg, altoOpcion) => {
							//console.log(img, centro, yImg, altoOpcion);
							let anchoOpcion = img.width * altoOpcion / img.height;
							let xImg = centro - (anchoOpcion / 2);
							ctx.drawImage(img, xImg, yImg, anchoOpcion, altoOpcion);
						};
						let centro = xStart + (anchoTotalRep / 2) - separacion;
						let yImg = container.height - altoOpciones - (altoOpcion / 2) * .85;
						img.onload = () => dibujaImagen(img, centro, yImg, altoOpcion);
					}
				}
				textoEjeX !== '' && mostrarTexto(textoEjeX, xStart + (anchoTotalRep / 2) - separacion, yStart, 'center', altoTextoLaterales, '#000000');
				textoEjeY !== '' && mostrarTexto(textoEjeY, xStart - separacion, yStart + (altoTotalRep / 2), 'right', altoTextoLaterales, '#000000');
				for (var filas = 0, yImagen; filas < repY; filas++) {
					yImagen = yStart + separacion * (filas + 1) + altoImagen * filas;
					for (var cols = 0, xImagen; cols < repX; cols++) {
						xImagen = xStart + separacion * cols + anchoImagen * cols;
						ctx.drawImage(imagen, xImagen, yImagen, anchoImagen, altoImagen);
					}
				}
				x += sepElem + separacion * (repX + 1) + anchoImagen * repX;
			} else {
				const { nombreFuente, altoTexto, separacion, texto } = datos[i];
				ctx.save();
				ctx.font = `${altoTexto}px ${nombreFuente}`;
				ctx.fillStyle = '#F05024';
				ctx.textAlign = 'center';
				var anchoTexto = ctx.measureText(texto).width;
				ctx.fillText(texto, x + sepElem + separacion + anchoTexto / 2, container.height / 2 + altoTexto / 2);
				x += sepElem + separacion * 2 + anchoTexto;
				ctx.restore();
			}
		}

		function mostrarTexto(texto, x, y, aling, fontsize, color) {
			ctx.font = `${fontsize}px Open-Sans-Regular-Font`;
			ctx.textAlign = aling;
			ctx.fillStyle = color ? color : '#000000';
			ctx.fillText(texto, x, y);
		}
	}).catch(function (error) {
		//console.log(error);
	});
}

function multiplicacionPic(config) {
	const { container, params, variables, versions, vt } = config;
	//console.log(params);
	let { datos, _altoCanvas, _anchoCanvas, _repeticiones, _separacion, _sepImgs, _mostrarValores, _separar } = params;
	container.height = Number(_altoCanvas);
	container.width = Number(_anchoCanvas);
	let separacionImg = Number(_sepImgs);
	var ctx = container.getContext('2d');
	var vars = vt ? variables : versions;
	let repgrupos = _mostrarValores === 'si' ? Number(regex(_repeticiones, vars, vt)) + 1 : Number(regex(_repeticiones, vars, vt));
	let separacionElem = Number(_separacion);



	datos = datos.map(function (dato, index) {
		switch (dato.formaRepeticion) {
			case 'izqDer':
				return {
					formaRepeticion: dato.formaRepeticion,
					src: regex(dato.src, vars, vt).replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../'),
					alto: Number(dato.alto),
					cantidad: Number(regex(dato.cantidad, vars, vt)),
					numeroX: Number(dato.numeroX),
					tipoValorFinal: dato.tipoValorFinal,
					valorFinal: dato.valorFinal ? regex(dato.valorFinal, vars, vt) : '',
					altoValorFinal: Number(dato.altoValorFinal),
					colorValorFinal: dato.colorValorFinal
				};
			case 'horVert':
				return {
					formaRepeticion: dato.formaRepeticion,
					src: regex(dato.src, vars, vt).replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../'),
					alto: Number(dato.alto),
					cantidad: Number(regex(dato.cantidad, vars, vt)),
					srcVert: String(regex(dato.srcVert, vars, vt)),
					tipoValorFinal: dato.tipoValorFinal,
					valorFinal: dato.valorFinal ? regex(dato.valorFinal, vars, vt) : '',
					altoValorFinal: Number(dato.altoValorFinal),
					colorValorFinal: dato.colorValorFinal
				};
			case 'diagonal':
				return {
					formaRepeticion: dato.formaRepeticion,
					src: regex(dato.src, vars, vt).replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../'),
					alto: Number(dato.alto),
					cantidad: Number(regex(dato.cantidad, vars, vt)),
					separacionX: Number(dato.separacionX),
					separacionY: Number(dato.separacionY),
					tipoValorFinal: dato.tipoValorFinal,
					valorFinal: dato.valorFinal ? regex(dato.valorFinal, vars, vt) : '',
					altoValorFinal: Number(dato.altoValorFinal),
					colorValorFinal: dato.colorValorFinal
				};
			default:
				//console.log('defecto');
				break;
		}
	});

	Promise.all(datos.map(x => cargaImagen(x.src))).then(function (imagenes) {
		let altoTotal = separacionElem, anchoElementos = [];
		for (let [index, imagen] of imagenes.entries()) {
			const { formaRepeticion, alto, cantidad } = datos[index];
			datos[index].imagen = imagen;
			datos[index].ancho = imagen.width * alto / imagen.height;
			switch (formaRepeticion) {
				case 'izqDer':
					const { numeroX } = datos[index];
					let filas = cantidad % numeroX === 0 ? cantidad / numeroX : Math.floor(cantidad / numeroX) + 1;
					datos[index].altoRepeticion = alto * filas + separacionImg * (filas + 1) + separacionElem;
					datos[index].anchoRepeticion = datos[index].ancho * numeroX + separacionImg * (numeroX + 1) + separacionElem * 2;
					altoTotal += datos[index].altoRepeticion;
					break;
				case 'horVert':
					datos[index].altoRepeticion = cantidad <= 4 ?
						alto + separacionImg * 2 + separacionElem :
						alto + separacionImg * 2 + (cantidad - 4) * datos[index].ancho + (cantidad - 4) * separacionImg + separacionElem;
					datos[index].anchoRepeticion = cantidad > 4 ?
						datos[index].alto + separacionElem * 2 :
						datos[index].ancho * cantidad + separacionImg * (cantidad + 1) + separacionElem * 2;
					altoTotal += datos[index].altoRepeticion;
					break;
				case 'diagonal':
					const { separacionX, separacionY } = datos[index];
					datos[index].altoRepeticion = alto + separacionY * (cantidad - 1) + separacionImg * 2 + separacionElem;
					datos[index].anchoRepeticion = datos[index].ancho + separacionX * (cantidad - 1) + separacionImg * 2 + separacionElem * 2;
					altoTotal += datos[index].altoRepeticion;
					break;
				default:
					//console.log('degault');
					break;
			}
			anchoElementos.push(datos[index].anchoRepeticion);
		}
		return { repeticiones: datos, altoTotal, anchoMaximo: Math.max(...anchoElementos) };
	}).then(async function (datos) {
		const { repeticiones, altoTotal, anchoMaximo } = datos;
		let anchoSeccion = container.width / repgrupos;
		for (var i = 0, centro; i < repgrupos; i++) {
			let yStart = container.height / 2 - altoTotal / 2;
			centro = (i + 1) * anchoSeccion - (anchoSeccion / 2);
			if (_mostrarValores === 'si' && (i + 1) === repgrupos) {
				let centroY = yStart;
				ctx.save();//dibuja llave de agrupacion de pictoriocos
				ctx.beginPath();
				ctx.arc(centro - (anchoMaximo / 2), yStart + separacionImg + separacionElem + 20, 20, 1.5 * Math.PI, 0, false);
				ctx.lineTo(centro - (anchoMaximo / 2) + 20, yStart + (altoTotal / 2) - 20);
				ctx.arc(centro - (anchoMaximo / 2) + 40, yStart + (altoTotal / 2) - 20, 20, Math.PI, .5 * Math.PI, true)
				ctx.arc(centro - (anchoMaximo / 2) + 40, yStart + (altoTotal / 2) + 20, 20, 1.5 * Math.PI, Math.PI, true)
				ctx.lineTo(centro - (anchoMaximo / 2) + 20, yStart + altoTotal - 40);
				ctx.arc(centro - (anchoMaximo / 2), yStart + altoTotal - separacionImg - separacionElem - 20, 20, 0, .5 * Math.PI, false);
				ctx.strokeStyle = "#808080";
				ctx.stroke();
				ctx.restore();//fin llave de agrupacion de pictoriocos
				for (let repeticion of repeticiones) {
					centroY += repeticion.altoRepeticion / 2;
					let xImg, yImg;
					switch (repeticion.tipoValorFinal) {
						case 'texto':
							ctx.save();
							ctx.textAlign = "center";
							ctx.font = repeticion.altoValorFinal + "px Helvetica"
							ctx.fillStyle = repeticion.colorValorFinal;
							let yTexto = centroY + repeticion.altoValorFinal / 2;
							ctx.fillText(repeticion.valorFinal, centro, yTexto);
							ctx.restore();
							break;
						case 'imagen':
							let imagenValor = await cargaImagen(repeticion.valorFinal);
							let anchoImagen = imagenValor.width * repeticion.altoValorFinal / imagenValor.height;
							xImg = centro - (anchoImagen / 2);
							yImg = centroY - (repeticion.altoValorFinal / 2);
							ctx.drawImage(imagenValor, xImg, yImg, anchoImagen, repeticion.altoValorFinal);
							break;
						default:
							//console.log('degault');
							break;
					}
					centroY += repeticion.altoRepeticion / 2;
				}
			} else {
				if (_separar === 'si') {
					let xRect = centro - (anchoMaximo / 2) + separacionElem;
					let yRect = yStart + separacionElem;
					ctx.strokeStyle = "#808080";
					ctx.strokeRect(xRect, yRect, anchoMaximo - (separacionElem * 2), altoTotal - (separacionElem * 2));
				}
				for (let repeticion of repeticiones) {
					let xStart = centro - repeticion.anchoRepeticion / 2;
					switch (repeticion.formaRepeticion) {
						case 'izqDer':
							let fila = 0, columna = 0;
							for (let r = 0, xImg, yImg; r < repeticion.cantidad; r++) {
								xImg = xStart + separacionElem + separacionImg * (fila + 1) + repeticion.ancho * fila;
								yImg = yStart + separacionElem + separacionImg * (columna + 1) + repeticion.alto * columna;
								ctx.drawImage(repeticion.imagen, xImg, yImg, repeticion.ancho, repeticion.alto);
								if (fila + 1 === repeticion.numeroX) {
									fila = 0;
									columna++;
								} else {
									fila++;
								}
								if (r + 1 === repeticion.cantidad) {
									let filas = repeticion.cantidad % repeticion.numeroX === 0 ? repeticion.cantidad / repeticion.numeroX : Math.floor(repeticion.cantidad / repeticion.numeroX) + 1;
									yStart += repeticion.alto * filas + separacionImg * (filas + 1) + separacionElem;
								}
							}
							break;
						case 'horVert':
							let limite = 5;
							let imagen = await cargaImagen(repeticion.srcVert);
							for (let hv = 0, xImg, yImg; hv < repeticion.cantidad; hv++) {
								if (hv < limite) {
									xImg = xStart + separacionElem + separacionImg * (hv + 1) + repeticion.ancho * hv;
									yImg = yStart + separacionElem + separacionImg;
									ctx.drawImage(repeticion.imagen, xImg, yImg, repeticion.ancho, repeticion.alto);
								} else {
									xImg = xStart + separacionElem;
									yImg = yStart + separacionElem + repeticion.alto + separacionImg * (hv - limite + 2) + repeticion.ancho * (hv - limite);
									ctx.drawImage(imagen, xImg, yImg, repeticion.alto, repeticion.ancho);
								}
								if (hv + 1 === repeticion.cantidad) {
									yStart += repeticion.cantidad <= 4 ?
										repeticion.alto + separacionImg * 2 + separacionElem :
										repeticion.alto + separacionImg * 2 + (repeticion.cantidad - 4) * repeticion.ancho + (repeticion.cantidad - 4) * separacionImg + separacionElem;
								}
							}
							break;
						case 'diagonal':
							for (let d = 0, xImg, yImg; d < repeticion.cantidad; d++) {
								xImg = xStart + separacionElem + separacionImg + repeticion.separacionX * d;
								yImg = yStart + separacionElem + separacionImg + repeticion.separacionY * d;
								ctx.drawImage(repeticion.imagen, xImg, yImg, repeticion.ancho, repeticion.alto);
								if (d + 1 === repeticion.cantidad) {
									yStart += repeticion.alto + repeticion.separacionY * (repeticion.cantidad - 1) + separacionImg * 2 + separacionElem;
								}
							}
							break;
						default:
							//console.log('degault');
							break;
					}
				}
			}
		}
	}).catch(function (error) {
		//console.log(error);
	});
}

function abaco(config) {
	const { container, params, variables, versions, vt } = config;
	const { datos, _separacion, _altoCanvas, _anchoCanvas } = params;
	let srcImagenAbaco = "../../../../imagenes_front/abaco/Abaco.svg";
	let srcImagenFicha = "../../../../imagenes_front/abaco/Ficha_Abaco.svg";
	let altoCanvas = Number(_altoCanvas), anchoCanvas = Number(_anchoCanvas), separacion = Number(_separacion);
	container.height = altoCanvas;
	container.width = anchoCanvas;
	let ctx = container.getContext('2d');
	var vars = vt ? variables : versions;

	let datosfn = datos.map(obj => {
		switch (obj.tipo) {
			case 'abaco':
				return {
					tipo: obj.tipo,
					altoImg: Number(obj.altoImg),
					unidad: obj.numComp !== '0' ? Number(regex(obj.numComp, vars, vt)[2]) : Number(regex(obj.unidad, vars, vt)),
					decena: obj.numComp !== '0' ? Number(regex(obj.numComp, vars, vt)[1]) : Number(regex(obj.decena, vars, vt)),
					centena: obj.numComp !== '0' ? Number(regex(obj.numComp, vars, vt)[0]) : Number(regex(obj.centena, vars, vt)),
					numComp: Number(regex(obj.numComp, vars, vt)),
					esAgrupado: obj.esAgrupado === 'si' ? true : false,
					grupos: Number(regex(obj.grupos, vars, vt)),
					agrupar: obj.agrupar === 'si' ? true : false,
					numerosArriba: obj.numerosArriba === 'si' ? true : false,
					agruparCanje: obj.agruparCanje === 'si' ? true : false
				};
			case 'imagen':
				return {
					tipo: obj.tipo,
					src: obj.src,
					altoImg: obj.altoImg,
					texto1: regex(obj.texto1, vars, vt),
					texto2: regex(obj.texto2, vars, vt),
					texto3: regex(obj.texto3, vars, vt),
					texto4: regex(obj.texto4, vars, vt),
					yTexto1: Number(obj.yTexto1),
					yTexto2: Number(obj.yTexto2),
					yTexto3: Number(obj.yTexto3),
					yTexto4: Number(obj.yTexto4),
					altoTexto: Number(obj.altoTexto),
					colorTexto: obj.colorTexto
				};
			case 'texto':
				return {
					tipo: obj.tipo,
					texto1: regex(obj.texto1, vars, vt),
					texto2: regex(obj.texto2, vars, vt),
					texto3: regex(obj.texto3, vars, vt),
					texto4: regex(obj.texto4, vars, vt),
					yTexto1: Number(obj.yTexto1),
					yTexto2: Number(obj.yTexto2),
					yTexto3: Number(obj.yTexto3),
					yTexto4: Number(obj.yTexto4),
					altoTexto: Number(obj.altoTexto),
					colorTexto: obj.colorTexto
				};
		}
	});

	Promise.all([
		cargaImagen(srcImagenAbaco),
		cargaImagen(srcImagenFicha),
		cargaFuente('larkneuethin', 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-4/fonts/LarkeNeueThin.ttf'),
		...datosfn.map(x => x.tipo === 'imagen' ? cargaImagen(x.src) : null)
	]).then(function (imagenes) {
		let imagenAbaco = imagenes[0];
		let imagenFicha = imagenes[1];
		let anchoTotal = 0;
		for (let i = 3; i < imagenes.length; i++) {
			if (datosfn[i - 3].tipo === 'imagen') {
				datosfn[i - 3].imagen = imagenes[i];
				datosfn[i - 3].ancho = Number(datosfn[i - 3].altoImg) * imagenes[i].width / imagenes[i].height;
			} else if (datosfn[i - 3].tipo === 'abaco') {
				datosfn[i - 3].ancho = Number(datosfn[i - 3].altoImg) * imagenAbaco.width / imagenAbaco.height;
			} else {
				ctx.save();
				ctx.font = `${datosfn[i - 3].altoTexto}px larkneuethin`;
				datosfn[i - 3].ancho = Math.max(
					ctx.measureText(datosfn[i - 3].texto1).width,
					ctx.measureText(datosfn[i - 3].texto2).width,
					ctx.measureText(datosfn[i - 3].texto3).width,
					ctx.measureText(datosfn[i - 3].texto4).width
				);
				ctx.restore();
			}
			anchoTotal += datosfn[i - 3].ancho + ((i + 1) === imagenes.length ? 0 : separacion);
		}

		for (let j = 0, centroX, anchoImg, xImg, yImg, anchoAcu = 0; j < datosfn.length; j++) {
			anchoAcu += (j === 0) ? 0 : datosfn[j - 1].ancho;
			centroX = (anchoCanvas / 2 - anchoTotal / 2) + anchoAcu + (datosfn[j].ancho / 2) + (separacion * j)
			switch (datosfn[j].tipo) {
				case 'abaco':
					anchoImg = imagenAbaco.width * datosfn[j].altoImg / imagenAbaco.height;
					xImg = centroX - (anchoImg / 2);
					yImg = altoCanvas / 2 - datosfn[j].altoImg / 2;
					ctx.drawImage(imagenAbaco, xImg, yImg, anchoImg, datosfn[j].altoImg);

					let xCentena = centroX - anchoImg / 2 + anchoImg * .135;
					let xDecena = centroX;
					let xUnidad = centroX + anchoImg / 2 - anchoImg * .135;

					if (datosfn[j].numerosArriba) {
						let yTextoArriba = altoCanvas / 2 - datosfn[j].altoImg / 2 - 5;
						ctx.save();
						ctx.textAlign = 'center';
						ctx.font = `15px larkneuethin`;
						ctx.fillStyle = '#000000';
						ctx.fillText(datosfn[j].unidad, xUnidad, yTextoArriba);
						ctx.fillText(datosfn[j].decena, xDecena, yTextoArriba);
						ctx.fillText(datosfn[j].centena, xCentena, yTextoArriba);
						ctx.restore();
					} else {
						let yInicio = altoCanvas / 2 + datosfn[j].altoImg / 2 - datosfn[j].altoImg * .125;
						let altoImgFicha = datosfn[j].altoImg * .05;
						let anchoImgFicha = imagenFicha.width * altoImgFicha / imagenFicha.height;
						if (datosfn[j].esAgrupado) {
							let espacioFichas = datosfn[j].altoImg - datosfn[j].altoImg * .125
							let altoDiviciones = espacioFichas / datosfn[j].grupos;
							let contadorUnidades = 0, contadorDecenas = 0, yDecimaUnidad = 0, yDecimaCentena = 0;
							for (let grupo = 0, centroGrupo, yStartUnidades, yStartDecenas, yStartCentenas; grupo < datosfn[j].grupos; grupo++) {
								//centroGrupo = yInicio - altoDiviciones - altoDiviciones*grupo + altoDiviciones/2;
								centroGrupo = yImg + altoDiviciones * grupo + altoDiviciones / 2;
								yStartUnidades = centroGrupo - (datosfn[j].unidad * altoImgFicha) / 2;
								yStartDecenas = centroGrupo - (datosfn[j].decena * altoImgFicha) / 2;
								yStartCentenas = centroGrupo - (datosfn[j].centena * altoImgFicha) / 2

								for (let u = 0, yUnidad; u < datosfn[j].unidad; u++) {
									yUnidad = yStartUnidades + altoImgFicha * u;
									ctx.drawImage(imagenFicha, xUnidad - anchoImgFicha / 2, yUnidad, anchoImgFicha, altoImgFicha);
									contadorUnidades++;
									if (contadorUnidades === 10) {
										yDecimaUnidad = yUnidad + altoImgFicha;
									}
								}
								for (let d = 0, yDecena; d < datosfn[j].decena; d++) {
									yDecena = yStartDecenas + altoImgFicha * d;
									ctx.drawImage(imagenFicha, xDecena - anchoImgFicha / 2, yDecena, anchoImgFicha, altoImgFicha);
									contadorDecenas++;
									if (contadorDecenas === 10) {
										yDecimaCentena = yDecena + altoImgFicha;
									}
								}
								for (let c = 0, yCentena; c < datosfn[j].centena; c++) {
									yCentena = yStartCentenas + altoImgFicha * c;
									ctx.drawImage(imagenFicha, xCentena - anchoImgFicha / 2, yCentena, anchoImgFicha, altoImgFicha);
								}

								if (datosfn[j].agrupar) {
									let maxHeight = Math.max((datosfn[j].unidad * altoImgFicha), (datosfn[j].decena * altoImgFicha), (datosfn[j].centena * altoImgFicha))
									ctx.save();
									ctx.strokeStyle = "#ff0000";
									ctx.beginPath();
									ctx.rect(xImg + 5, centroGrupo - maxHeight / 2, anchoImg - 10, maxHeight);
									ctx.stroke();
									ctx.restore();
								}
							}
							if (datosfn[j].agruparCanje) {
								if (datosfn[j].unidad * datosfn[j].grupos >= 10) {
									let yInicio = yImg + (altoDiviciones / 2) - datosfn[j].unidad * (altoImgFicha / 2);
									let yFin = yDecimaUnidad - yInicio;

									ctx.save();
									ctx.strokeStyle = "#ff0000";
									ctx.beginPath();
									ctx.rect(xUnidad - anchoImgFicha / 2 - 5, yInicio, anchoImgFicha + 10, yFin);
									ctx.stroke();

									//dibuja arco por sobre el abaco
									let rArc = (xUnidad - xDecena) / 2;
									let xArc = xDecena + rArc;
									let yArc = yImg + rArc * 0.8;
									ctx.beginPath();
									ctx.arc(xArc, yArc, rArc + 10, 1.25 * Math.PI, 1.75 * Math.PI);
									ctx.stroke();
									//dibuja linea hacia arriba de la flecha
									let difX = Math.cos(0.25 * Math.PI) * rArc + 10 * 0.8;
									let difY = Math.sin(0.25 * Math.PI) * rArc + 10 * 0.8;
									let xPuntoInicial = xArc - difX;
									let yPuntoInicial = yArc - difY;
									ctx.beginPath();
									ctx.moveTo(xPuntoInicial, yPuntoInicial);
									ctx.lineTo(xPuntoInicial + 10, yPuntoInicial);
									ctx.stroke();
									//dibuja linea hacia la derecha de la flecha
									ctx.beginPath();
									ctx.moveTo(xPuntoInicial, yPuntoInicial);
									ctx.lineTo(xPuntoInicial, yPuntoInicial - 10);
									ctx.stroke();
									ctx.restore();

									ctx.drawImage(imagenFicha, xArc - anchoImgFicha / 2, yImg - (rArc * 0.8) - altoImgFicha, anchoImgFicha, altoImgFicha);
								}
								if (datosfn[j].decena * datosfn[j].grupos >= 10) {
									let yInicio = yImg + (altoDiviciones / 2) - datosfn[j].decena * (altoImgFicha / 2);
									let yFin = yDecimaCentena - yInicio;

									ctx.save();
									ctx.strokeStyle = "#ff0000";
									ctx.beginPath();
									ctx.rect(xDecena - anchoImgFicha / 2 - 5, yInicio, anchoImgFicha + 10, yFin);
									ctx.stroke();

									let rArc = (xDecena - xCentena) / 2;
									let xArc = xCentena + rArc;
									let yArc = yImg + rArc * 0.8;
									ctx.beginPath();
									ctx.arc(xArc, yArc, rArc + 10, 1.25 * Math.PI, 1.75 * Math.PI);
									ctx.stroke();

									let difX = Math.cos(0.25 * Math.PI) * rArc + 10 * 0.8;
									let difY = Math.sin(0.25 * Math.PI) * rArc + 10 * 0.8;
									let xPuntoInicial = xArc - difX;
									let yPuntoInicial = yArc - difY;
									ctx.beginPath();
									ctx.moveTo(xPuntoInicial, yPuntoInicial);
									ctx.lineTo(xPuntoInicial + 10, yPuntoInicial);
									ctx.stroke();

									ctx.beginPath();
									ctx.moveTo(xPuntoInicial, yPuntoInicial);
									ctx.lineTo(xPuntoInicial, yPuntoInicial - 10);
									ctx.stroke();
									ctx.restore();

									ctx.drawImage(imagenFicha, xArc - anchoImgFicha / 2, yImg - (rArc * 0.8) - altoImgFicha, anchoImgFicha, altoImgFicha);
								}
							}

						} else {
							for (let u = 0, yUnidad; u < datosfn[j].unidad; u++) {
								yUnidad = yInicio - altoImgFicha - altoImgFicha * u;
								ctx.drawImage(imagenFicha, xUnidad - anchoImgFicha / 2, yUnidad, anchoImgFicha, altoImgFicha);
							}
							for (let d = 0, yDecena; d < datosfn[j].decena; d++) {
								yDecena = yInicio - altoImgFicha - altoImgFicha * d;
								ctx.drawImage(imagenFicha, xDecena - anchoImgFicha / 2, yDecena, anchoImgFicha, altoImgFicha);
							}
							for (let c = 0, yCentena; c < datosfn[j].centena; c++) {
								yCentena = yInicio - altoImgFicha - altoImgFicha * c;
								ctx.drawImage(imagenFicha, xCentena - anchoImgFicha / 2, yCentena, anchoImgFicha, altoImgFicha);
							}
							if (datosfn[j].agruparCanje) {
								let yUltimaUnidad = yInicio - datosfn[j].unidad * altoImgFicha;
								let yUltimaDecena = yInicio - datosfn[j].decena * altoImgFicha;
								if (datosfn[j].unidad >= 10) {
									//dibuja rectangulo de agrupacion de 10
									ctx.save();
									ctx.strokeStyle = "#ff0000";
									ctx.beginPath();
									ctx.rect(xUnidad - anchoImgFicha / 2 - 5, yUltimaUnidad, anchoImgFicha + 10, altoImgFicha * 10);
									ctx.stroke();
									//dibuja arco por sobre el abaco
									let rArc = (xUnidad - xDecena) / 2;
									let xArc = xDecena + rArc;
									let yArc = yImg + rArc * 0.8;
									ctx.beginPath();
									ctx.arc(xArc, yArc, rArc + 10, 1.25 * Math.PI, 1.75 * Math.PI);
									ctx.stroke();
									//dibuja linea hacia arriba de la flecha
									let difX = Math.cos(0.25 * Math.PI) * rArc + 10 * 0.8;
									let difY = Math.sin(0.25 * Math.PI) * rArc + 10 * 0.8;
									let xPuntoInicial = xArc - difX;
									let yPuntoInicial = yArc - difY;
									ctx.beginPath();
									ctx.moveTo(xPuntoInicial, yPuntoInicial);
									ctx.lineTo(xPuntoInicial + 10, yPuntoInicial);
									ctx.stroke();
									//dibuja linea hacia la derecha de la flecha
									ctx.beginPath();
									ctx.moveTo(xPuntoInicial, yPuntoInicial);
									ctx.lineTo(xPuntoInicial, yPuntoInicial - 10);
									ctx.stroke();
									ctx.restore();

									ctx.drawImage(imagenFicha, xArc - anchoImgFicha / 2, yImg - (rArc * 0.8) - altoImgFicha, anchoImgFicha, altoImgFicha);
								}
								if (datosfn[j].decena >= 10) {
									if (datosfn[j].unidad >= 10) {
										ctx.save();
										ctx.strokeStyle = "#ff0000";
										ctx.beginPath();
										ctx.rect(xDecena - anchoImgFicha / 2 - 5, yUltimaDecena, anchoImgFicha + 10, altoImgFicha * 10);
										ctx.stroke();

										let rArc = (xDecena - xCentena) / 2;
										let xArc = xCentena + rArc;
										let yArc = yImg + rArc * 0.8;
										ctx.beginPath();
										ctx.arc(xArc, yArc, rArc + 10, 1.25 * Math.PI, 1.75 * Math.PI);
										ctx.stroke();

										let difX = Math.cos(0.25 * Math.PI) * rArc + 10 * 0.8;
										let difY = Math.sin(0.25 * Math.PI) * rArc + 10 * 0.8;
										let xPuntoInicial = xArc - difX;
										let yPuntoInicial = yArc - difY;
										ctx.beginPath();
										ctx.moveTo(xPuntoInicial, yPuntoInicial);
										ctx.lineTo(xPuntoInicial + 10, yPuntoInicial);
										ctx.stroke();

										ctx.beginPath();
										ctx.moveTo(xPuntoInicial, yPuntoInicial);
										ctx.lineTo(xPuntoInicial, yPuntoInicial - 10);
										ctx.stroke();
										ctx.restore();

										ctx.drawImage(imagenFicha, xArc - anchoImgFicha / 2, yImg - (rArc * 0.8) - altoImgFicha, anchoImgFicha, altoImgFicha);
									}
								}
							}
						}
					}
					break;
				case 'imagen':
					anchoImg = datosfn[j].imagen.width * datosfn[j].altoImg / datosfn[j].imagen.height;
					xImg = centroX - (anchoImg / 2);
					yImg = altoCanvas / 2 - datosfn[j].altoImg / 2;
					ctx.drawImage(datosfn[j].imagen, xImg, yImg, anchoImg, datosfn[j].altoImg);
					ctx.save();
					ctx.textAlign = 'center';
					ctx.font = `${datosfn[j].altoTexto}px larkneuethin`;
					ctx.fillStyle = datosfn[j].colorTexto;
					if (datosfn[j].texto1) {
						ctx.fillText(datosfn[j].texto1, centroX, datosfn[j].yTexto1);
					}
					if (datosfn[j].texto2) {
						ctx.fillText(datosfn[j].texto2, centroX, datosfn[j].yTexto2);
					}
					if (datosfn[j].texto3) {
						ctx.fillText(datosfn[j].texto3, centroX, datosfn[j].yTexto3);
					}
					if (datosfn[j].texto4) {
						ctx.fillText(datosfn[j].texto4, centroX, datosfn[j].yTexto4);
					}
					ctx.save();
					break;
				case 'texto':
					ctx.save();
					ctx.textAlign = 'center';
					ctx.font = `${datosfn[j].altoTexto}px larkneuethin`;
					ctx.fillStyle = datosfn[j].colorTexto;
					if (datosfn[j].texto1) {
						ctx.fillText(datosfn[j].texto1, centroX, datosfn[j].yTexto1);
					}
					if (datosfn[j].texto2) {
						ctx.fillText(datosfn[j].texto2, centroX, datosfn[j].yTexto2);
					}
					if (datosfn[j].texto3) {
						ctx.fillText(datosfn[j].texto3, centroX, datosfn[j].yTexto3);
					}
					if (datosfn[j].texto4) {
						ctx.fillText(datosfn[j].texto4, centroX, datosfn[j].yTexto4);
					}
					ctx.save();
					break;
				default:
					//console.log('default');
					break;
			}
		}
	}).catch(function (error) {
		//console.log(error);
	});
}

async function multiplicacionElem(config) {
	await cargaFuente('Open-Sans-Reg', '../../../../fonts/Quicksand-Medium.ttf');
	const { container, params, variables, versions, vt } = config;
	container.style.border = "1px solid #000"
	//console.log(container);
	var vars = vt ? variables : versions;

	let { datos, _separacion, _altoCanvas, _anchoCanvas, _mostrarValores } = params;
	_separacion = Number(_separacion);
	_altoCanvas = Number(_altoCanvas);
	_anchoCanvas = Number(_anchoCanvas);
	_mostrarValores = _mostrarValores === 'si' ? true : false;
	container.width = _anchoCanvas;
	container.height = _altoCanvas;
	var ctx = container.getContext('2d');
	let altoDiviciones = _altoCanvas / datos.length;

	async function getObject(dato) {
		switch (dato.tipo) {
			case 'repeticion':
				return {
					tipo: dato.tipo,
					srcImgPrinc: dato.srcImgPrinc,
					imagenPrinc: await cargaImagen(regex(dato.srcImgPrinc.replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../'), vars, vt)),
					altoImgPrinc: Number(dato.altoImgPrinc),
					cantidadPrinc: Number(regex(dato.cantidadPrinc, vars, vt)),
					srcImgSec: dato.srcImgSec,
					imagenSec: dato.srcImgSec ? await cargaImagen(regex(dato.srcImgSec.replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../'), vars, vt)) : null,
					altoImgSec: Number(dato.altoImgSec),
					cantidadSec: Number(regex(dato.cantidadSec, vars, vt)),
					valorFinal: dato.valorFinal.tipoVF === 'texto' ? {
						tipoVF: dato.valorFinal.tipoVF,
						textoVF: regex(dato.valorFinal.textoVF, vars, vt),
						altoTextoVF: dato.valorFinal.altoTextoVF,
						colorTextoVF: dato.valorFinal.colorTextoVF
					} : {
							tipoVF: dato.valorFinal.tipoVF,
							srcImgVF: dato.valorFinal.srcImgVF,
							imgVF: await cargaImagen(regex(dato.valorFinal.srcImgVF.replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../'), vars, vt)),
							altoImgVF: Number(dato.valorFinal.altoImgVF)
						}
				};
			case 'seccion':
				return {
					tipo: dato.tipo,
					llave: dato.llave === 'si' ? true : false,
					colorLLave: dato.colorLLave,
					texto: dato.texto,
					altoTexto: dato.altoTexto,
					colorTexto: dato.colorTexto
				};
		}
	}
	Promise.all(datos.map(x => getObject(x))).then(reps => {
		let divs, yCentro, divicionesRepeticiones = [];
		reps.forEach((dato, index) => {
			yCentro = altoDiviciones * index + altoDiviciones / 2;
			switch (dato.tipo) {
				case 'repeticion':
					divs = dato.cantidadPrinc + (_mostrarValores ? 1 : 0);
					let anchoDiviciones = _anchoCanvas / divs;
					let anchoImgPrinc = dato.altoImgPrinc * dato.imagenPrinc.width / dato.imagenPrinc.height;
					divicionesRepeticiones.push(anchoDiviciones);
					for (let i = 0, xCentro, xImg, yImg; i < divs; i++) {
						xCentro = anchoDiviciones * i + anchoDiviciones / 2;
						if (i + 1 === divs && _mostrarValores) {
							if (dato.valorFinal.tipoVF === 'texto') {
								ctx.save();
								ctx.fillStyle = dato.valorFinal.colorTextoVF;
								ctx.font = `${dato.valorFinal.altoTextoVF}px Open-Sans-Reg`;
								ctx.textAlign = "center";
								ctx.fillText(dato.valorFinal.textoVF, xCentro, yCentro + dato.valorFinal.altoTextoVF / 2);
								ctx.restore();
							} else if (dato.valorFinal.tipoVF === 'imagen') {
								let anchoImgVF = dato.valorFinal.altoImgVF * dato.valorFinal.imgVF.width / dato.valorFinal.imgVF.height;
								xImg = xCentro - anchoImgVF / 2;
								yImg = yCentro - dato.valorFinal.altoImgVF / 2;
								ctx.drawImage(dato.valorFinal.imgVF, xImg, yImg, anchoImgVF, dato.valorFinal.altoImgVF);
							}
						} else {
							xImg = xCentro - anchoImgPrinc / 2;
							yImg = yCentro - dato.altoImgPrinc / 2;
							ctx.drawImage(dato.imagenPrinc, xImg, yImg, anchoImgPrinc, dato.altoImgPrinc);
						}
					}
					break;
				case 'seccion':
					let anchoDivMaximo = Math.min(...divicionesRepeticiones);
					let anchoImagenUltimaRep = (reps[index - 1].altoImgPrinc * reps[index - 1].imagenPrinc.width / reps[index - 1].imagenPrinc.height) / 2;
					let xInicio = anchoDivMaximo / 2 - anchoImagenUltimaRep;
					let xFin = _anchoCanvas - anchoDivMaximo / 2 - (_mostrarValores ? anchoDivMaximo : 0) + anchoImagenUltimaRep;
					let xMitad = (xInicio + xFin) / 2;
					if (dato.llave) {
						let radio = 10;
						let yTramo = yCentro - altoDiviciones / 2;
						let yTramoInicio = yTramo - radio;
						let yTramoFin = yTramo + radio;
						ctx.save();
						ctx.strokeStyle = dato.colorLLave;
						ctx.lineWidth = 1;
						ctx.lineJoin = 'round';
						ctx.beginPath();

						ctx.arc(xInicio + radio, yTramoInicio, radio, -Math.PI, -1.5 * Math.PI, true)

						ctx.lineTo(xMitad - radio, yTramo);

						ctx.arc(xMitad - radio, yTramoFin, radio, -0.5 * Math.PI, 0, false);
						ctx.arc(xMitad + radio, yTramoFin, radio, -Math.PI, -0.5 * Math.PI, false);

						ctx.lineTo(xFin - radio, yTramo);

						ctx.arc(xFin - radio, yTramoInicio, radio, -1.5 * Math.PI, 0, true);
						ctx.stroke();
					}
					if (dato.texto) {
						ctx.save();
						ctx.fillStyle = dato.colorTexto;
						ctx.textAlign = "center";
						ctx.font = `${dato.altoTexto}px Open-Sans-Reg`;
						ctx.fillText(dato.texto, xMitad, yCentro);
						ctx.restore();
					}

					break;
			}
		});
	}).catch(x => {
		//console.log(x) 
	});


}

async function repeticionPicV2(config) {
	const { container, params, variables, versions, vt } = config;
	const { datos, _titulo, _separacion, _separaciones, _altoRepeticiones, _anchoCanvas,
		_mostrarVP1, _mostrarVP2, _mostrarRes, _altoVP1, _altoVP2, _altoRes, _res,
		_flechaRes, _flechaVP1, _flechaVP2, _srcFlecha, _altoImgFlecha,
		_altoImgSignoMas, _srcImgSignoMas, _signoMasVP1, _signoMasVP2 } = params
	await cargaFuente('Open-Sans-Reg', '../../../../fonts/Quicksand-Medium.ttf');
	let vars = vt ? variables : versions;
	let titulo = regexFunctions(regex(_titulo, vars, vt)), //titulo arriba de la repeticion
		separacion = Number(_separacion), //separaciones entre cada repeticion de elementos
		altoRepeticiones = Number(_altoRepeticiones), //alto que usaran solo las repeticiones
		anchoCanvas = Number(_anchoCanvas), //ancho del canvas

		mostrarVP1 = _mostrarVP1 === 'si' ? true : false, //decide si se muestra o no el VP1
		altoVP1 = mostrarVP1 ? Number(_altoVP1) : 0, //alto que usara el VP1 si se muestra
		mostrarFlechaVP1 = _flechaVP1 === 'si' ? true : false,
		mostrarSignoMasVP1 = _signoMasVP1 === 'si' ? true : false,

		mostrarVP2 = _mostrarVP2 === 'si' ? true : false, //decide si se muestra o no el VP2
		mostrarFlechaVP2 = _flechaVP2 === 'si' ? true : false,
		altoVP2 = mostrarVP2 ? Number(_altoVP2) : 0, //alto que usara el VP2 si se muestra
		mostrarSignoMasVP2 = _signoMasVP2 === 'si' ? true : false,

		mostrarRes = _mostrarRes === 'si' ? true : false, //decide si se muestra o no el resultado
		mostrarFlechaRes = _flechaRes === 'si' ? true : false,
		altoRes = mostrarRes ? Number(_altoRes) : 0, //alto que usara el resultado si se muestra

		res = mostrarRes ? { //datos del resultado final para posicionar en el canvas si es que se muestra
			tipo: _res.tipo,
			texto: _res.tipo === 'texto' ? regexFunctions(regex(_res.texto, vars, vt)) : undefined,
			altoTexto: _res.tipo === 'texto' ? Number(_res.altoTexto) : undefined,
			colorTexto: _res.tipo === 'texto' ? _res.colorTexto : undefined,
			srcImg: _res.tipo === 'imagen' ? await cargaImagen(regexFunctions(regex(_res.srcImg.replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../'), vars, vt))) : undefined,
			altoImg: _res.tipo === 'imagen' ? Number(_res.altoImg) : undefined
		} : null,
		//datos de la flecha
		srcFlecha = _srcFlecha.replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../'),
		altoImgFlecha = Number(_altoImgFlecha),
		imgFlecha = (mostrarFlechaVP1 || mostrarFlechaVP2 || mostrarFlechaRes) ? await cargaImagen(srcFlecha) : null,
		anchoImgFlecha = (mostrarFlechaVP1 || mostrarFlechaVP2 || mostrarFlechaRes) ? imgFlecha.width * altoImgFlecha / imgFlecha.height : 0,
		//datos del signo
		srcImgSignoMas = _srcImgSignoMas.replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../'),
		altoImgSignoMas = Number(_altoImgSignoMas),
		imgSignoMas = (mostrarSignoMasVP1 || mostrarSignoMasVP2) ? await cargaImagen(srcImgSignoMas) : null,
		anchoImgSignoMas = (mostrarSignoMasVP1 || mostrarSignoMasVP2) ? imgSignoMas.width * altoImgSignoMas / imgSignoMas.height : 0,

		separaciones = _separaciones.trim().length > 0 ? _separaciones.split(';').map(x => x.split('-')).map(x => ({ inicio: Number(x[0]), fin: Number(x[1]) })) : undefined;

	//console.log(_res, res)
	container.height = altoRepeticiones + altoVP1 + altoVP2 + altoRes;
	container.width = anchoCanvas;
	let ctx = container.getContext('2d');


	async function getObject(dato) {
		let srcImgVP1 = '', srcImgVP2 = '';
		switch (dato.tipo) {
			case 'repeticion':
				let srcImgRepSrc = regexFunctions(regex(dato.srcImg, vars, vt)).replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../');
				srcImgVP1 = mostrarVP1 ? dato.vp1.tipo === 'imagen' ? await regexFunctions(regex(dato.vp1.srcImg, vars, vt)).replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../') : null : null;
				srcImgVP2 = mostrarVP2 ? dato.vp2.tipo === 'imagen' ? await regexFunctions(regex(dato.vp2.srcImg, vars, vt)).replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../') : null : null;
				return {
					tipo: dato.tipo,
					srcImg: srcImgRepSrc,
					altoImg: Number(dato.altoImg),
					img: await cargaImagen(srcImgRepSrc),
					cantidadRepeticiones: Number(regexFunctions(regex(dato.cantidadRepeticiones, vars, vt))),
					formaRepeticiones: dato.formaRepeticiones,
					sepX: regexFunctions(regex(dato.sepX, vars, vt)).split(',').map(x => Number(x)),
					sepY: dato.sepY.split(',').map(x => Number(x)),
					vp1: mostrarVP1 ? dato.vp1.tipo === 'texto' ? { // si el valor posicional 1 es texto
						tipo: dato.vp1.tipo,
						texto: regexFunctions(regex(dato.vp1.texto, vars, vt)),
						altoTexto: Number(dato.vp1.altoTexto),
						colorTexto: dato.vp1.colorTexto
					} : { // si el valor posicional 1 es imagen
							tipo: dato.vp1.tipo,
							srcImg: srcImgVP1,
							img: await cargaImagen(srcImgVP1),
							altoImg: Number(dato.vp1.altoImg)
						} : undefined,
					vp2: mostrarVP2 ? dato.vp2.tipo === 'texto' ? { // si el valor posicional 2 es texto
						tipo: dato.vp2.tipo,
						texto: regexFunctions(regex(dato.vp2.texto, vars, vt)),
						altoTexto: Number(dato.vp2.altoTexto),
						colorTexto: dato.vp2.colorTexto
					} : { // si el valor posicional 2 es texto
							tipo: dato.vp2.tipo,
							srcImg: srcImgVP2,
							img: await cargaImagen(srcImgVP2),
							altoImg: Number(dato.vp2.altoImg)
						} : undefined
				}
			case 'texto':
				srcImgVP1 = mostrarVP1 ? dato.vp1.tipo === 'imagen' ? await regexFunctions(regex(dato.vp1.srcImg, vars, vt)).replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../') : null : null;
				srcImgVP2 = mostrarVP2 ? dato.vp2.tipo === 'imagen' ? await regexFunctions(regex(dato.vp2.srcImg, vars, vt)).replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../') : null : null;
				return {
					tipo: dato.tipo,
					texto: regexFunctions(regex(dato.texto, vars, vt)),
					altoTexto: Number(dato.altoTexto),
					colorTexto: dato.colorTexto,
					vp1: mostrarVP1 ? dato.vp1.tipo === 'texto' ? { // si el valor posicional 1 es texto
						tipo: dato.vp1.tipo,
						texto: regexFunctions(regex(dato.vp1.texto)),
						altoTexto: Number(dato.vp1.altoTexto),
						colorTexto: dato.vp1.colorTexto
					} : { // si el valor posicional 1 es imagen
							tipo: dato.vp1.tipo,
							srcImg: srcImgVP1,
							img: await cargaImagen(srcImgVP1),
							altoImg: Number(dato.vp1.altoImg)
						} : undefined,
					vp2: mostrarVP2 ? dato.vp2.tipo === 'texto' ? { // si el valor posicional 2 es texto
						tipo: dato.vp2.tipo,
						texto: regexFunctions(regex(dato.vp2.texto)),
						altoTexto: Number(dato.vp2.altoTexto),
						colorTexto: dato.vp2.colorTexto
					} : { // si el valor posicional 2 es texto
							tipo: dato.vp2.tipo,
							srcImg: srcImgVP2,
							img: await cargaImagen(srcImgVP2),
							altoImg: Number(dato.vp2.altoImg)
						} : undefined
				}
		}
	}

	function calculaDimencionesRepeticion(formaRepeticiones, altoImg, anchoImg, sepX, sepY, cantidadRepeticiones) {
		switch (formaRepeticiones) {
			case 'diagonal/apilado':
				if (cantidadRepeticiones > 5) {
					return {
						ancho: anchoImg + (sepX[0] * 5) + anchoImg + ((cantidadRepeticiones - 6) * sepX[0]),
						alto: altoImg + (sepY[0] * 4)
					};
				} else {
					return {
						ancho: anchoImg + ((cantidadRepeticiones - 1) * sepX[0]),
						alto: altoImg + ((cantidadRepeticiones - 1) * sepY[0])
					};
				}
			case 'diagonal':
				return {
					ancho: anchoImg + (sepX[0] > 0 ? cantidadRepeticiones * anchoImg : 0) + ((cantidadRepeticiones - 1) * sepX[0]),
					alto: altoImg + (sepY[0] > 0 ? cantidadRepeticiones * altoImg : 0) + ((cantidadRepeticiones - 1) * sepY[0])
				};
			case 'dado':
				if (cantidadRepeticiones === 0) {
					return {
						ancho: 0,
						alto: 0
					}
				} else if (cantidadRepeticiones === 1) {
					return {
						ancho: anchoImg,
						alto: altoImg
					};
				} else if (cantidadRepeticiones === 2 || cantidadRepeticiones === 4) {
					return {
						ancho: anchoImg * 2 + sepX[0],
						alto: altoImg * 2 + sepY[0]
					};
				} else if (cantidadRepeticiones === 3 || cantidadRepeticiones === 5 || cantidadRepeticiones > 6) {
					return {
						ancho: anchoImg * 3 + sepX[0] * 2,
						alto: altoImg * 3 + sepY[0] * 2
					};
				} else if (cantidadRepeticiones === 6) {
					return {
						ancho: anchoImg * 2 + sepX[0],
						alto: altoImg * 3 + sepY[0] * 2
					};
				}
			case 'izq/der':
				return {
					ancho: sepX[1] > cantidadRepeticiones ? cantidadRepeticiones * anchoImg + (cantidadRepeticiones - 1) * sepX[0] : sepX[1] * anchoImg + (sepX[1] - 1) * sepX[0],
					alto: Math.ceil(cantidadRepeticiones / sepX[1]) * altoImg + (Math.ceil(cantidadRepeticiones / sepX[1]) - 1) * sepY[0]
				};
			default:
				return {
					ancho: 0,
					alto: 0
				};
		}
	}

	let elementos = await Promise.all([
		...datos.filter(function (x) {
			if (x.tipo === 'texto') {
				return true;
			} else if (x.tipo === 'repeticion') {
				return Number(regexFunctions(regex(x.cantidadRepeticiones, vars, vt))) > 0
			}
		}).map(x => getObject(x)),
		mostrarRes ? res : null
	]);
	let anchoTotal = separacion, posicicionesInicio = [];
	for (let i = 0; i < elementos.length; i++) {
		if (elementos[i]) {
			switch (elementos[i].tipo) {
				case 'repeticion':
					var { img, altoImg, formaRepeticiones, sepX, sepY, cantidadRepeticiones } = elementos[i];
					elementos[i].anchoImg = altoImg * img.width / img.height;
					elementos[i].dimenciones = calculaDimencionesRepeticion(formaRepeticiones, altoImg, elementos[i].anchoImg, sepX, sepY, cantidadRepeticiones);
					anchoTotal += elementos[i].dimenciones.ancho + separacion;
					break;
				case 'imagen':
					var { srcImg, altoImg } = elementos[i];
					elementos[i].anchoImg = altoImg * srcImg.width / srcImg.height;
					//si es imagen es el resultado, entonces no se suma al ancho total de la repeticion
					break;
				case 'texto':
					var { texto, altoTexto } = elementos[i];
					ctx.save();
					ctx.font = `${altoTexto}px Open-Sans-Reg`;
					elementos[i].anchoTexto = ctx.measureText(texto).width;
					ctx.restore();
					anchoTotal += (i + 1) === elementos.length ? 0 : elementos[i].anchoTexto + separacion;
					break;
			}
			if (mostrarVP1 && !((i + 1) === elementos.length)) {
				if (elementos[i].vp1.tipo === 'texto') {
					var { texto, altoTexto } = elementos[i].vp1;
					ctx.save();
					ctx.font = `${altoTexto}px Open-Sans-Reg`;
					elementos[i].vp1.anchoTexto = ctx.measureText(texto).width;
					ctx.restore();
				} else {
					var { img, altoImg } = elementos[i].vp1;
					elementos[i].vp1.anchoImg = altoImg * img.width / img.height;
				}
			}
			if (mostrarVP2 && !((i + 1) === elementos.length)) {
				if (elementos[i].vp2.tipo === 'texto') {
					var { texto, altoTexto } = elementos[i].vp1;
					ctx.save();
					ctx.font = `${altoTexto}px Open-Sans-Reg`;
					elementos[i].vp2.anchoTexto = ctx.measureText(texto).width;
					ctx.restore();
				} else {
					var { img, altoImg } = elementos[i].vp2;
					elementos[i].vp2.anchoImg = altoImg * img.width / img.height;
				}
			}
		}
	}
	let xInicio = (anchoCanvas / 2) - (anchoTotal / 2) + separacion,
		xCentro = 0,
		yCentroRepeticiones = altoRepeticiones / 2,
		yCentroVP1 = altoRepeticiones + altoVP1 / 2,
		yCentroVP2 = altoRepeticiones + altoVP1 + altoVP2 / 2,
		yCentroRes = altoRepeticiones + altoVP1 + altoVP2 + altoRes / 2,
		datosResultado = elementos.pop();

	if (mostrarRes && elementos.length > 1) {
		let { tipo, texto, altoTexto, colorTexto, srcImg, altoImg } = datosResultado
		let primerCentro = xInicio + elementos[0].dimenciones.ancho / 2
		let ultimoCentro = xInicio + anchoTotal - (elementos[elementos.length - 1].tipo === 'repeticion' ?
			elementos[elementos.length - 1].dimenciones.ancho / 2 :
			elementos[elementos.length - 1].anchoTexto / 2) - separacion * 2
		let centroRespuesta = primerCentro + ((ultimoCentro - primerCentro) / 2)
		if (tipo == 'texto') {
			ctx.save();
			ctx.font = `${altoTexto}px Open-Sans-Reg`;
			ctx.fillStyle = colorTexto;
			ctx.textAlign = 'center';
			ctx.fillText(texto, centroRespuesta, yCentroRes + altoTexto / 2);
			ctx.restore();
		} else {
			let anchoImg = altoImg * srcImg.width / srcImg.height;
			//console.log({ yRes: yCentroRes-altoImg/2, yCentroRes, altoImg, datosResultado });
			ctx.drawImage(srcImg, anchoCanvas / 2 - anchoImg / 2, yCentroRes - altoImg / 2, anchoImg, altoImg);
		}
		if (mostrarFlechaRes) {
			ctx.drawImage(imgFlecha, centroRespuesta - anchoImgFlecha / 2, yCentroRes - altoRes / 2 - altoImgFlecha / 2, anchoImgFlecha, altoImgFlecha)
		}
	}

	elementos.forEach(function (elemento, index) {
		let anchoElemento = 0
		switch (elemento.tipo) {
			case 'repeticion':
				let { formaRepeticiones, img, altoImg, anchoImg, cantidadRepeticiones, sepX, sepY, dimenciones } = elemento;
				posicicionesInicio.push({ xInicio, anchoTotal: dimenciones.ancho, altoTotal: dimenciones.alto });
				xCentro = xInicio + dimenciones.ancho / 2;
				dibujaRepeticion(formaRepeticiones, img, altoImg, anchoImg, cantidadRepeticiones, sepX, sepY, dimenciones, xCentro, yCentroRepeticiones);
				xInicio += dimenciones.ancho + separacion;
				anchoElemento = dimenciones.ancho
				break;
			case 'texto':
				let { texto, altoTexto, colorTexto, anchoTexto } = elemento;
				posicicionesInicio.push({ xInicio, anchoTotal: anchoTexto, altoTotal: altoTexto });
				xCentro = xInicio + anchoTexto / 2;
				ctx.save();
				ctx.font = `${altoTexto}px Open-Sans-Reg`;
				ctx.fillStyle = colorTexto;
				ctx.textAlign = 'center';
				ctx.fillText(texto, xCentro, yCentroRepeticiones + altoTexto / 2);
				ctx.restore();
				xInicio += anchoTexto + separacion;
				anchoElemento = anchoTexto
				break;
		}
		if (mostrarVP1) {
			if (elemento.vp1.tipo === 'texto') {
				let { texto, altoTexto, colorTexto } = elemento.vp1;
				ctx.save();
				ctx.font = `${altoTexto}px Open-Sans-Reg`;
				ctx.fillStyle = colorTexto;
				ctx.textAlign = 'center';
				ctx.fillText(texto, xCentro, yCentroVP1 + altoTexto / 2);
				ctx.restore();
			} else {
				let { img, altoImg, anchoImg, } = elemento.vp1;
				ctx.drawImage(img, xCentro - anchoImg / 2, yCentroVP1 - altoImg / 2, anchoImg, altoImg);
			}
			if (mostrarFlechaVP1) {
				ctx.drawImage(imgFlecha, xCentro - anchoImgFlecha / 2, yCentroVP1 - altoVP1 / 2 - altoImgFlecha / 2, anchoImgFlecha, altoImgFlecha)
			}
			if (mostrarSignoMasVP1 && (index + 1) < elementos.length) {
				let siguienteCentro = xCentro + anchoElemento / 2 + (elementos[index + 1].tipo === 'repeticion' ?
					elementos[index + 1].dimenciones.ancho / 2 :
					elementos[index + 1].anchoTexto / 2) + separacion
				let xImgSignoMas = xCentro + (siguienteCentro - xCentro) / 2 - anchoImgSignoMas / 2
				let yImgSignoMas = yCentroVP1 - altoImgSignoMas / 2;
				ctx.drawImage(imgSignoMas, xImgSignoMas, yImgSignoMas, anchoImgSignoMas, altoImgSignoMas)
			}
		}
		if (mostrarVP2) {
			if (elemento.vp2.tipo === 'texto') {
				let { texto, altoTexto, colorTexto } = elemento.vp2;
				ctx.save();
				ctx.font = `${altoTexto}px Open-Sans-Reg`;
				ctx.fillStyle = colorTexto;
				ctx.textAlign = 'center';
				ctx.fillText(texto, xCentro, yCentroVP2 + altoTexto / 2);
				ctx.restore();
			} else {
				let { img, altoImg, anchoImg } = elemento.vp2;
				ctx.drawImage(img, xCentro - anchoImg / 2, yCentroVP2 - altoImg / 2, anchoImg, altoImg);
			}
			if (mostrarFlechaVP2) {
				ctx.drawImage(imgFlecha, xCentro - anchoImgFlecha / 2, yCentroVP2 - altoVP2 / 2 - altoImgFlecha / 2, anchoImgFlecha, altoImgFlecha)
			}
			if (mostrarSignoMasVP2 && (index + 1) < elementos.length) {
				let siguienteCentro = xCentro + anchoElemento / 2 + (elementos[index + 1].tipo === 'repeticion' ?
					elementos[index + 1].dimenciones.ancho / 2 :
					elementos[index + 1].anchoTexto / 2) + separacion
				let xImgSignoMas = xCentro + (siguienteCentro - xCentro) / 2 - anchoImgSignoMas / 2
				let yImgSignoMas = yCentroVP2 - altoImgSignoMas / 2;
				ctx.drawImage(imgSignoMas, xImgSignoMas, yImgSignoMas, anchoImgSignoMas, altoImgSignoMas)
			}
		}
	});

	function dibujaRepeticion(formaRepeticiones, img, altoImg, anchoImg, cantidadRepeticiones, sepX, sepY, dimenciones, xCentro, yCentroRepeticiones) {
		switch (formaRepeticiones) {
			case 'diagonal/apilado':
				for (let i = 0, x, y; i < cantidadRepeticiones; i++) {
					if (i <= 4) {
						x = xCentro - (dimenciones.ancho / 2) + (i * sepX[0]);
						y = yCentroRepeticiones - (dimenciones.alto / 2) + (i * sepY[0]);
					} else {
						x = xCentro - (dimenciones.ancho / 2) + anchoImg + (i * sepX[0]);
						y = yCentroRepeticiones - (dimenciones.alto / 2) + ((i - 5) * sepY[0]);
					}
					ctx.drawImage(img, x, y, anchoImg, altoImg);
				}
				break;
			case 'diagonal':
				for (let i = 0, x, y; i < cantidadRepeticiones; i++) {
					x = xCentro - (dimenciones.ancho / 2) + (sepX[0] > 0 ? i * anchoImg : 0) + (i * sepX[0]);
					y = yCentroRepeticiones - (dimenciones.alto / 2) + (sepY[0] > 0 ? i * altoImg : 0) + (i * sepY[0]);
					ctx.drawImage(img, x, y, anchoImg, altoImg);
				}
				break;
			case 'izq/der':
				for (let i = 0, posX = 1, posY, x, y; i < cantidadRepeticiones; i++) {
					posY = Math.floor(i / sepX[1]);
					x = xCentro - (dimenciones.ancho / 2) + anchoImg * (posX - 1) + sepX[0] * (posX - 1);
					y = yCentroRepeticiones - (dimenciones.alto / 2) + altoImg * posY + sepY[0] * posY;
					ctx.drawImage(img, x, y, anchoImg, altoImg);
					if (posX === sepX[1]) {
						posX = 1;
					} else {
						posX++;
					}
				}
				break;
			case 'dado':
				switch (cantidadRepeticiones) {
					case 1:
						poneImagenEnPosicionDado9(5, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						break;
					case 2:
						poneImagenEnPosicionDado4(4, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado4(1, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						break;
					case 3:
						poneImagenEnPosicionDado9(9, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(5, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(1, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						break;
					case 4:
						poneImagenEnPosicionDado4(4, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado4(2, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado4(3, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado4(1, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						break;
					case 5:
						poneImagenEnPosicionDado9(9, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(7, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(5, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(3, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(1, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						break;
					case 6:
						poneImagenEnPosicionDado6(6, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado6(5, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado6(4, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado6(3, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado6(2, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado6(1, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						break;
					case 7:
						poneImagenEnPosicionDado9(9, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(7, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(6, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(5, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(4, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(3, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(1, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						break;
					case 8:
						poneImagenEnPosicionDado9(9, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(8, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(7, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(6, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(4, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(3, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(2, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(1, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						break;
					case 9:
						poneImagenEnPosicionDado9(9, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(8, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(7, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(6, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(5, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(4, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(3, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(2, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						poneImagenEnPosicionDado9(1, img, anchoImg, altoImg, xCentro, yCentroRepeticiones, sepX[0], sepY[0])
						break;
				}
				function poneImagenEnPosicionDado9(numero, img, anchoImg, altoImg, xCentro, yCentro, sepX, sepY) {
					let x, y;
					if (numero == 1 || numero == 4 || numero == 7) {
						x = xCentro - (anchoImg * 1.5) - sepX
					} else if (numero == 2 || numero == 5 || numero == 8) {
						x = xCentro - (anchoImg / 2)
					} else {
						x = xCentro + (anchoImg / 2) + sepX
					}
					if (numero == 1 || numero == 2 || numero == 3) {
						y = yCentro - (altoImg * 1.5) - sepY
					} else if (numero == 4 || numero == 5 || numero == 6) {
						y = yCentro - (altoImg / 2)
					} else {
						y = yCentro + (altoImg / 2) + sepY
					}
					ctx.drawImage(img, x, y, anchoImg, altoImg);
				}
				function poneImagenEnPosicionDado6(numero, img, anchoImg, altoImg, xCentro, yCentro, sepX, sepY) {
					let x, y;
					if (numero == 1 || numero == 3 || numero == 5) {
						x = xCentro - (sepX / 2) - anchoImg
					} else {
						x = xCentro + (sepX / 2)
					}
					if (numero == 1 || numero == 2) {
						y = yCentro - (altoImg * 1.5) - sepY
					} else if (numero == 3 || numero == 4) {
						y = yCentro - (altoImg / 2)
					} else {
						y = yCentro + (altoImg / 2) + sepY
					}
					ctx.drawImage(img, x, y, anchoImg, altoImg);
				}
				function poneImagenEnPosicionDado4(numero, img, anchoImg, altoImg, xCentro, yCentro, sepX, sepY) {
					let x, y;
					if (numero == 1 || numero == 3) {
						x = xCentro - (sepX / 2) - anchoImg
					} else {
						x = xCentro + (sepX / 2)
					}
					if (numero == 1 || numero == 2) {
						y = yCentro - (sepY / 2) - altoImg
					} else {
						y = yCentro + (sepY / 2)
					}
					ctx.drawImage(img, x, y, anchoImg, altoImg);
				}
				break;
			default:
				//console.log('insoportado');
				break;
		}
	}

	if (titulo !== '') { // dibuja titulo
		container.parentElement.querySelectorAll('span').forEach(e => e.parentNode.removeChild(e));
		let tituloObj = document.createElement('span');
		tituloObj.innerText = regexFunctions(regex(titulo, vars, vt));
		tituloObj.style.fontSize = '18px';
		tituloObj.style.fontWeight = '600';
		tituloObj.style.color = 'black';
		container.parentNode.insertBefore(tituloObj, container);
	}

	if (separaciones) { // dibuja separaciones
		let heightRect = Math.max(...posicicionesInicio.map(x => x.altoTotal)) + (separacion / 2)
		let yRect = yCentroRepeticiones - heightRect / 2
		separaciones.forEach(function (agrupacion) {
			let xRect = posicicionesInicio[agrupacion.inicio - 1].xInicio - (separacion / 4);
			let widthRect = posicicionesInicio[agrupacion.fin - 1].xInicio + posicicionesInicio[agrupacion.fin - 1].anchoTotal - (separacion * 3 / 4) + separacion - xRect;
			ctx.save();
			ctx.strokeStyle = '#808080';
			ctx.strokeRect(xRect, yRect, widthRect, heightRect);
			ctx.restore();
		});
	}
}

async function recta(config, tipo) {
	const { container, params, variables, versions, vt } = config
	container.innerHTML = '' //quitar linea en funcionalidad de app.js
	//container.style.border = '1px solid #000'
	let vars = vt ? variables : versions

	let { altoRecta, anchoRecta,
		grosorRecta, grosorMarcas, colorRecta, largoFlechas, largoMarcas, fontSize, colorFuente, //diseño recta numerica
		formato, valorInicialRecta, valorFinalRecta, valorEscalaRecta, divicionesRecta, //valores para pintar recta
		marcas, extremos, valores, valorInicioMostrar, valorFinalMostrar,
		mostrarSubescala, divicionesSubescala, posicionesSubescala, tramosSubescala,
		mostrarLupa, anchoSubescala, formatoSubescala,
		tipoInicioTramoLupa, inicioTramoLupaNumero, inicioTramoLupaEntero, inicioTramoLupaNumerador, inicioTramoLupaDenominador,
		tipoFinTramoLupa, finTramoLupaNumero, finTramoLupaEntero, finTramoLupaNumerador, finTramoLupaDenominador,
		arcosSubescala, segmetosSubescala, imagenesSubescala, puntosSubescala,
		valoresEspecificos, //valores a mostrar en recta
		imagenes, //aqui se agregan las imagenes de la recta
		tramos,//datos de tramos
		arcos, //datos de arcos
		textos, //datos de texto
		puntos,
		encerrarValores } = params //puntos de la recta para marcar
	//reemplaza valores para calcular datos de recta
	valorInicialRecta = Number(regexFunctions(regex(valorInicialRecta, vars, vt)))
	divicionesRecta = Number(regexFunctions(regex(divicionesRecta, vars, vt)))
	valorFinalRecta = valorFinalRecta ?
		Number(regexFunctions(regex(valorFinalRecta, vars, vt))) :
		valorInicialRecta + Number(regexFunctions(regex(valorEscalaRecta, vars, vt))) * divicionesRecta
	valorEscalaRecta = valorEscalaRecta ?
		Number(regexFunctions(regex(valorEscalaRecta, vars, vt))) :
		(valorFinalRecta - valorInicialRecta) / divicionesRecta
	//valores para mostrar en recta numerica
	valoresEspecificos = valoresEspecificos ? await Promise.all(valoresEspecificos.map(x => x.tipo == 'numero' ? num(x) : frac(x))) : []
	//subdiviciones de recta numerica
	divicionesSubescala = Number(regexFunctions(regex(divicionesSubescala, vars, vt)))
	//puntos de la recta para marcar
	puntos = puntos.length > 0 ? regexFunctions(regex(puntos, vars, vt)).split(';').map(x => x.split(',')).map(x => ({
		posicion: valorRectaACoordenadaX(Number(x[0])),
		color: x[1]
	})) : []
	//valores para ecerrar en recta numerica
	encerrarValores = encerrarValores.length > 0 ? regexFunctions(regex(encerrarValores, vars, vt)).split(';').map(x => x.split(',')).map(x => ({
		posicion: valorRectaACoordenadaX(Number(x[0])),
		ancho: Number(x[1]),
		alto: Number(x[2]),
		color: x[3]
	})) : []
	//imagenes para mostrar en recta numerica
	imagenes = imagenes ? await Promise.all(imagenes.map(x => getImagenObj(x))) : []
	//arcos para mostrar en la recta numerica
	arcos = arcos ? arcos.map(x => getArcoObj(x)) : []
	//texto para mostrar en la recta numerica
	textos = textos ? textos.map(x => getTextoObj(x)) : []
	//tramos para mostrar en la recta
	tramos = tramos ? tramos.map(x => getTramoObj(x)) : []
	//imagenes de miniescala
	imagenesSubescala = imagenesSubescala ? await Promise.all(imagenesSubescala.map(x => getImagenObj(x))) : []
	//parsea los textos y los numeros reemplazando variables y funciones
	grosorRecta = Number(grosorRecta)
	grosorMarcas = Number(grosorMarcas)
	largoFlechas = Number(largoFlechas)
	largoMarcas = Number(largoMarcas)
	fontSize = Number(fontSize)
	anchoSubescala = Number(anchoSubescala)
	valorInicioMostrar = Number(Number(regexFunctions(regex(valorInicioMostrar, vars, vt))).toFixed(10))
	valorFinalMostrar = Number(Number(regexFunctions(regex(valorFinalMostrar, vars, vt))).toFixed(10))
	mostrarLupa = mostrarLupa === 'si' ? true : false
	//setea valores de dimensiones de recta
	container.setAttributeNS(null, 'height', Number(altoRecta) + (mostrarLupa ? Number(altoRecta) : 0))
	container.setAttributeNS(null, 'width', anchoRecta)
	container.setAttributeNS(null, 'viewBox', `0 0 ${anchoRecta} ${Number(altoRecta) + (mostrarLupa ? Number(altoRecta) : 0)}`)
	let _centroYRecta = altoRecta / 2 - grosorRecta / 2,
		_anchoSeparaciones = anchoRecta / (divicionesRecta + 2),
		_posicionesEnRecta = []
	//importa fuente opensans para ser utilizada en los elementos de texto
	let defs = crearElemento('defs', {})
	let styles = document.createElement('style')
	styles.innerHTML = '@font-face{font-family:"Open-Sans-Reg";src:url("../../../../fonts/Quicksand-Medium.ttf");}'
	defs.appendChild(styles)
	container.appendChild(defs)
	//dibuja recta numerica (linea base y flechas)
	container.appendChild(crearElemento('rect', { //dibuja linea principal
		x: 0,
		y: _centroYRecta,
		width: anchoRecta,
		height: grosorRecta,
		fill: colorRecta,
		rx: 2,
		ry: 2
	}))
	container.appendChild(crearElemento('rect', { //dibuja flecha inicial
		x: grosorRecta / 2,
		y: _centroYRecta,
		width: largoFlechas,
		height: grosorRecta,
		fill: colorRecta,
		transform: `rotate(30 ${0},${_centroYRecta})`,
		rx: 2,
		ry: 2
	}))
	container.appendChild(crearElemento('rect', { //dibuja flecha inicial
		x: 0,
		y: _centroYRecta,
		width: largoFlechas,
		height: grosorRecta,
		fill: colorRecta,
		transform: `rotate(-30 ${0},${_centroYRecta})`,
		rx: 2,
		ry: 2
	}))
	container.appendChild(crearElemento('rect', { //dibuja flecha final
		x: anchoRecta - largoFlechas,
		y: _centroYRecta,
		width: largoFlechas,
		height: grosorRecta,
		fill: colorRecta,
		transform: `rotate(30 ${anchoRecta},${_centroYRecta})`,
		rx: 2,
		ry: 2
	}))
	container.appendChild(crearElemento('rect', { //dibuja flecha final
		x: anchoRecta - largoFlechas - grosorRecta / 2,
		y: _centroYRecta,
		width: largoFlechas,
		height: grosorRecta,
		fill: colorRecta,
		transform: `rotate(-30 ${anchoRecta},${_centroYRecta})`,
		rx: 2,
		ry: 2
	}))
	//calcula los valores a posicionar en la recta numerica y sus posiciones en el eje x
	_posicionesEnRecta = await Promise.all([{
		numero: valorInicialRecta,
		posicion: _anchoSeparaciones - grosorMarcas / 2
	}]
		.concat(Array(divicionesRecta)
			.fill()
			.map((x, index) => ({
				numero: Number((valorInicialRecta + valorEscalaRecta * (index + 1)).toFixed(10)),
				posicion: _anchoSeparaciones + _anchoSeparaciones * (index + 1) - grosorMarcas / 2
			}))))
	//dibuja marcas y numeros en recta numerica 
	////console.log({ _posicionesEnRecta, valoresEspecificos, imagenes })
	_posicionesEnRecta.forEach(({ numero, posicion }, index) => {
		//dibuja las marcas por si solas
		if ((index == 0 || index == divicionesRecta) || marcas === 'todas') {
			dibujarMarca(posicion)
		}
		//dibuja el numero asociado a la marca
		if (index == 0 && (extremos == 'ambos' || extremos == 'inicial')) { // dibuja primer valor
			dibujaValorDeMarca(numero, posicion, index)
		} else if (index == divicionesRecta && (extremos == 'ambos' || extremos == 'final')) { //dibuja ultimo valor
			dibujaValorDeMarca(numero, posicion, index)
		}
		if (index != 0 && index != divicionesRecta && valores === 'todos') { //dibuja todos los valores de recta
			dibujaValorDeMarca(numero, posicion, index)
		}
	})

	if (mostrarSubescala === 'si') {
		let symbol = crearElementoSymbol(`${container.id}-subescala`, _anchoSeparaciones, largoMarcas / 2)
		let subseparacion = _anchoSeparaciones / divicionesSubescala
		for (let i = 0; i < divicionesSubescala - 1; i++) {
			symbol.appendChild(crearElemento('rect', {
				x: subseparacion * (i + 1),
				y: 0,
				width: grosorMarcas,
				height: largoMarcas / 2,
				fill: colorRecta
			}))
		}
		defs.appendChild(symbol)
		if (posicionesSubescala === 'todas') {
			_posicionesEnRecta.slice(0, _posicionesEnRecta.length - 1).forEach(x => {
				container.appendChild(crearReferenciaAElemento(`${container.id}-subescala`, {
					x: x.posicion,
					y: altoRecta / 2 - largoMarcas / 4
				}))
			})
		} else if (posicionesSubescala === 'entre') {
			tramosSubescala = tramosSubescala.split(';').map(x => x.split('-')).map(x => ({
				inicio: Number(regexFunctions(regex(x[0], vars, vt))),
				fin: Number(regexFunctions(regex(x[1], vars, vt)))
			}))
			_posicionesEnRecta.forEach(posiciones => {
				for (let j = 0; j < tramosSubescala.length; j++) {
					if (posiciones.numero >= tramosSubescala[j].inicio && posiciones.numero < tramosSubescala[j].fin) {
						container.appendChild(crearReferenciaAElemento(`${container.id}-subescala`, {
							x: posiciones.posicion,
							y: altoRecta / 2 - largoMarcas / 4
						}))
					}
				}
			})
		}
	}

	if (puntos && puntos.length > 0) {
		puntos.forEach(punto => {
			container.appendChild(crearElemento('circle', {
				cx: punto.posicion,
				cy: altoRecta / 2,
				r: grosorRecta + grosorRecta / 2,
				fill: punto.color,
				stroke: colorRecta,
				strokeWidth: grosorRecta / 2
			}))
		})
	}

	valoresEspecificos.forEach(valor => {
		if (valor.tipo == 'numero') {
			let { numero, posicion, ubicacion } = valor
			dibujaNumeroEnPosicion(numero, posicion, ubicacion)
			dibujarMarca(posicion)
		} else {
			let { entero, numerador, denominador, posicion, ubicacion } = valor
			dibujaFraccionEnPosicion(entero, numerador, denominador, posicion, ubicacion)
			dibujarMarca(posicion)
		}
	})

	imagenes.forEach(img => {
		let widthImg = img.height * img.imagen.width / img.imagen.height
		img.posiciones.forEach(posicionEnRecta => {
			let posicionX = valorRectaACoordenadaX(posicionEnRecta)
			if (img.marcar) {
				container.appendChild(crearElemento('rect', { //dibuja marca
					x: posicionX - grosorMarcas / 2,
					y: altoRecta / 2 - largoMarcas / 2,
					width: grosorMarcas,
					height: largoMarcas,
					fill: colorRecta,
					rx: 2,
					ry: 2
				}))
			}
			container.appendChild(crearElementoDeImagen(img.srcImg, {
				x: posicionX - widthImg / 2,
				y: img.posicion == 'arriba' ? altoRecta / 2 - largoMarcas / 2 - img.separacion - img.height : altoRecta / 2 + largoMarcas / 2 + img.separacion,
				height: img.height
			}))
		})
	})
	//dibuja solo los valores entre las variables valorInicioMostrar y valorFinalMostrar
	if (marcas == 'ninguna' && valores == 'entre') {
		let valoresAMarcar = _posicionesEnRecta.filter(x => x.numero >= valorInicioMostrar && x.numero <= valorFinalMostrar)
		valoresAMarcar.forEach(({ numero, posicion }) => {
			dibujarMarca(posicion)
			dibujaValorDeMarca(numero, posicion, _posicionesEnRecta.map(x => x.numero).indexOf(numero))
		})
	}
	//dibuja tramo de recta numerica
	if (tramos.length > 0) {
		tramos.forEach(tramo => {
			let inicioX = valorRectaACoordenadaX(tramo.inicio)
			let finX = valorRectaACoordenadaX(tramo.final)
			let centro = (finX - inicioX) / 2 + inicioX
			let inicioY = altoRecta / 2 - largoMarcas / 2 - tramo.alto
			let radio = 10

			switch (tramo.tipo) {
				case 'llave':
					container.appendChild(crearElemento('path', {
						d: `M ${inicioX} ${inicioY}
							A ${radio} ${radio} 0 0 1 ${inicioX + radio} ${inicioY - radio}
							H ${centro - radio}
							A ${radio} ${radio} 0 0 0 ${centro} ${inicioY - radio * 2}
							A ${radio} ${radio} 0 0 0 ${centro + radio} ${inicioY - radio}
							H ${finX - radio}
							A ${radio} ${radio} 0 0 1 ${finX} ${inicioY}`,
						fill: 'none',
						stroke: tramo.color,
						strokeWidth: grosorMarcas
					}))
					break
				case 'punto-punto':
					container.appendChild(crearElemento('circle', {
						cx: inicioX,
						cy: altoRecta / 2,
						r: grosorRecta + 2,
						fill: tramo.color,
						stroke: colorRecta,
						strokeWidth: grosorRecta / 2
					}))
					container.appendChild(crearElemento('circle', {
						cx: finX,
						cy: altoRecta / 2,
						r: grosorRecta + 2,
						fill: tramo.color,
						stroke: colorRecta,
						strokeWidth: grosorRecta / 2
					}))
					container.appendChild(crearElemento('rect', {
						x: inicioX,
						y: altoRecta / 2 - grosorRecta / 2,
						width: finX - inicioX,
						height: grosorRecta,
						fill: tramo.color
					}))
					break
				case 'tramo':
					let inicioLineaExtremoY = tramo.alto + largoMarcas / 4
					let finLineaExtremoY = tramo.alto - largoMarcas / 4
					container.appendChild(crearElemento('line', {
						x1: inicioX,
						y1: inicioLineaExtremoY,
						x2: inicioX,
						y2: finLineaExtremoY,
						stroke: tramo.color,
						strokeWidth: grosorMarcas
					}))
					container.appendChild(crearElemento('line', {
						x1: finX,
						y1: inicioLineaExtremoY,
						x2: finX,
						y2: finLineaExtremoY,
						stroke: tramo.color,
						strokeWidth: grosorMarcas
					}))
					container.appendChild(crearElemento('line', {
						x1: inicioX,
						y1: tramo.alto,
						x2: finX,
						y2: tramo.alto,
						stroke: tramo.color,
						strokeWidth: grosorMarcas
					}))
					break
				default:
					//console.log('no se puede agregar este tipo de tramo :c')
					break
			}
		})
	}

	arcos.forEach(arco => {
		if (arco.saltos) {
			let puntosDeArcos = _posicionesEnRecta.filter(x => x.numero >= arco.inicio && x.numero <= arco.fin)
			puntosDeArcos.forEach(({ posicion }, index) => {
				if (index + 1 == puntosDeArcos.length) {
					return
				}
				let x = posicion + _anchoSeparaciones / 2
				let y = altoRecta / 2
				let radio = _anchoSeparaciones / 2
				container.appendChild(crearElemento('path', {
					d: createArcWithAngles(x, y, radio, 45, 135),
					fill: 'none',
					stroke: arco.color,
					strokeWidth: grosorMarcas
				}))
				if (arco.direccion == 'derecha') {
					let puntaFlecha = polarToCartesian(x, y, radio, 135)
					container.appendChild(crearElemento('path', {
						d: `M ${puntaFlecha.x} ${puntaFlecha.y}
							L ${puntaFlecha.x} ${puntaFlecha.y - 5}
							L ${puntaFlecha.x - 5} ${puntaFlecha.y}
							L ${puntaFlecha.x} ${puntaFlecha.y} Z`,
						fill: arco.color,
						stroke: arco.color
					}))
				} else {
					let puntaFlecha = polarToCartesian(x, y, radio, 45)
					container.appendChild(crearElemento('path', {
						d: `M ${puntaFlecha.x} ${puntaFlecha.y}
							L ${puntaFlecha.x} ${puntaFlecha.y - 5}
							L ${puntaFlecha.x + 5} ${puntaFlecha.y}
							L ${puntaFlecha.x} ${puntaFlecha.y} Z`,
						fill: arco.color,
						stroke: arco.color
					}))
				}
				if (arco.mostrarValorTramo) {
					container.appendChild(crearElementoDeTexto({
						x: posicion + _anchoSeparaciones / 2,
						y: altoRecta / 2 - _anchoSeparaciones / 2 - 5,
						fontSize: fontSize,
						textAnchor: 'middle',
						fill: colorFuente,
						style: 'font-family:Open-Sans-Reg;'
					}, valorEscalaRecta))
				}
			})
		} else {
			let inicioArco = valorRectaACoordenadaX(arco.inicio)
			let finArco = valorRectaACoordenadaX(arco.fin)
			let mitad = (finArco - inicioArco) / 2 + inicioArco
			let yArco = altoRecta / 2 - largoMarcas / 2 - 10
			container.appendChild(crearElemento('path', {
				d: `M ${inicioArco} ${yArco}
					A 22 2 0 0 1 ${finArco} ${yArco}`,
				fill: 'none',
				stroke: arco.color,
				strokeWidth: grosorMarcas
			}))
			if (arco.direccion == 'derecha') {
				let puntaFlecha = {
					x: finArco,
					y: yArco
				}
				container.appendChild(crearElemento('path', {
					d: `M ${puntaFlecha.x} ${puntaFlecha.y}
						L ${puntaFlecha.x} ${puntaFlecha.y - 5}
						L ${puntaFlecha.x - 5} ${puntaFlecha.y}
						L ${puntaFlecha.x} ${puntaFlecha.y} Z`,
					fill: arco.color,
					stroke: arco.color
				}))
			} else {
				let puntaFlecha = {
					x: inicioArco,
					y: yArco
				}
				container.appendChild(crearElemento('path', {
					d: `M ${puntaFlecha.x} ${puntaFlecha.y}
						L ${puntaFlecha.x} ${puntaFlecha.y - 5}
						L ${puntaFlecha.x + 5} ${puntaFlecha.y}
						L ${puntaFlecha.x} ${puntaFlecha.y} Z`,
					fill: arco.color,
					stroke: arco.color
				}))
			}
			if (arco.mostrarValorTramo) {
				let diferencia = arco.fin - arco.inicio
				container.appendChild(crearElementoDeTexto({
					x: mitad,
					y: altoRecta / 2 - _anchoSeparaciones * 0.7,
					fontSize: fontSize,
					textAnchor: 'middle',
					fill: colorFuente,
					style: 'font-family:Open-Sans-Reg;'
				}, diferencia.toString().replace('.', ',')))
			}
		}
	})
	//pone todos los textos de la recta
	textos.forEach(({ texto, valorCentro, posicionY }) => {
		container.appendChild(crearElementoDeTexto({
			x: valorCentro,
			y: posicionY,
			fontSize: fontSize,
			textAnchor: 'middle',
			fill: colorFuente,
			style: 'font-family:Open-Sans-Reg;'
		}, texto))
	})

	if (encerrarValores && encerrarValores.length > 0) {
		encerrarValores.forEach(encerrarValor => {
			container.appendChild(crearElemento('rect', {
				x: encerrarValor.posicion - encerrarValor.ancho / 2,
				y: altoRecta / 2 - encerrarValor.alto / 2,
				width: encerrarValor.ancho,
				height: encerrarValor.alto,
				stroke: encerrarValor.color,
				strokeWidth: '2',
				fill: 'none'
			}))
		})
	}

	if (mostrarLupa) {
		let imglupa = await cargaImagen('../../../../imagenes_front/lupas/Lupa_izq.svg')
		let anchoImagen = _anchoSeparaciones * 2.2
		let altoImagen = imglupa.height * anchoImagen / imglupa.width
		let inicioTramoLupa, finTramoLupa
		if (tipoInicioTramoLupa === 'numero') {
			inicioTramoLupa = Number(regexFunctions(regex(inicioTramoLupaNumero, vars, vt)))
		} else {
			inicioTramoLupa = Number(regexFunctions(regex(inicioTramoLupaEntero, vars, vt))) +
				Number(regexFunctions(regex(inicioTramoLupaNumerador, vars, vt))) / Number(regexFunctions(regex(inicioTramoLupaDenominador, vars, vt)))
		}
		if (tipoFinTramoLupa === 'numero') {
			finTramoLupa = Number(regexFunctions(regex(finTramoLupaNumero, vars, vt)))
		} else {
			finTramoLupa = Number(regexFunctions(regex(finTramoLupaEntero, vars, vt))) +
				Number(regexFunctions(regex(finTramoLupaNumerador, vars, vt))) / Number(regexFunctions(regex(finTramoLupaDenominador, vars, vt)))
		}
		let inicioLupa = valorRectaACoordenadaX(inicioTramoLupa)
		let finLupa = valorRectaACoordenadaX(finTramoLupa)
		let centroMiniEscala = Number(_centroYRecta) + Number(altoRecta)
		let xInicialMiniEscala = anchoRecta / 2 - anchoSubescala / 2
		let xFinalMiniEscala = anchoRecta / 2 + anchoSubescala / 2
		container.appendChild(crearElementoDeImagen('../../../../imagenes_front/lupas/Lupa_izq.svg', {
			x: inicioLupa - anchoImagen * 0.1,
			y: _centroYRecta - altoImagen * 0.33,
			width: _anchoSeparaciones * 2.2
		}))
		//dibuja recta
		container.appendChild(crearElemento('rect', { //dibuja linea principal
			x: xInicialMiniEscala,
			y: centroMiniEscala,
			width: anchoSubescala,
			height: grosorRecta,
			fill: colorRecta,
			rx: 2,
			ry: 2
		}))
		container.appendChild(crearElemento('rect', { //dibuja flecha inicial
			x: xInicialMiniEscala + grosorRecta / 2,
			y: centroMiniEscala,
			width: largoFlechas,
			height: grosorRecta,
			fill: colorRecta,
			transform: `rotate(30 ${xInicialMiniEscala},${centroMiniEscala})`,
			rx: 2,
			ry: 2
		}))
		container.appendChild(crearElemento('rect', { //dibuja flecha inicial
			x: xInicialMiniEscala,
			y: centroMiniEscala,
			width: largoFlechas,
			height: grosorRecta,
			fill: colorRecta,
			transform: `rotate(-30 ${xInicialMiniEscala},${centroMiniEscala})`,
			rx: 2,
			ry: 2
		}))
		container.appendChild(crearElemento('rect', { //dibuja flecha final
			x: xFinalMiniEscala - largoFlechas,
			y: centroMiniEscala,
			width: largoFlechas,
			height: grosorRecta,
			fill: colorRecta,
			transform: `rotate(30 ${xFinalMiniEscala},${centroMiniEscala})`,
			rx: 2,
			ry: 2
		}))
		container.appendChild(crearElemento('rect', { //dibuja flecha final
			x: xFinalMiniEscala - largoFlechas - grosorRecta / 2,
			y: centroMiniEscala,
			width: largoFlechas,
			height: grosorRecta,
			fill: colorRecta,
			transform: `rotate(-30 ${xFinalMiniEscala},${centroMiniEscala})`,
			rx: 2,
			ry: 2
		}))

		let _anchoTramoMiniEscala = anchoSubescala / (divicionesSubescala + 2)
		let _valorMiniEscala = (finTramoLupa - inicioTramoLupa) / divicionesSubescala
		let _yMarcaRecta = centroMiniEscala - largoMarcas / 2 + grosorRecta / 2
		let diferenciaInicioFin = Number(Number(finTramoLupa - inicioTramoLupa).toFixed(10))
		let puntosMiniEscala = []
		let escalaMiniEscala = valorEscalaRecta / divicionesSubescala
		const datosMiniEscala = {
			anchoSubescala: anchoSubescala,
			valorInicioSubescala: inicioTramoLupa,
			valorFinalSubescala: finTramoLupa,
			valorEscalaSubescala: _valorMiniEscala
		}
		//dibuja lineas representativas de acercamiento
		container.appendChild(crearElemento('line', { //dibuja flecha final
			x1: inicioLupa,
			y1: _centroYRecta + grosorMarcas / 2,
			x2: xInicialMiniEscala + _anchoTramoMiniEscala,
			y2: centroMiniEscala - largoFlechas,
			stroke: 'black',
			strokeWidth: 2
		}))
		container.appendChild(crearElemento('line', { //dibuja flecha final
			x1: finLupa,
			y1: _centroYRecta + grosorMarcas / 2,
			x2: xFinalMiniEscala - _anchoTramoMiniEscala,
			y2: centroMiniEscala - largoFlechas,
			stroke: 'black',
			strokeWidth: 2
		}))
		//dibujado de marcas
		for (let i = 0; i < divicionesSubescala + 1; i++) {
			if (i === 0) {
				puntosMiniEscala.push({
					numero: inicioTramoLupa,
					posicion: xInicialMiniEscala + _anchoTramoMiniEscala * (i + 1)
				})
			} else if (i + 1 === divicionesSubescala + 1) {
				puntosMiniEscala.push({
					numero: finTramoLupa,
					posicion: xInicialMiniEscala + _anchoTramoMiniEscala * (i + 1)
				})
			} else {
				puntosMiniEscala.push({
					numero: Number(Number(inicioTramoLupa + (i * _valorMiniEscala)).toFixed(10)),
					posicion: xInicialMiniEscala + _anchoTramoMiniEscala * (i + 1)
				})
			}
			container.appendChild(crearElemento('rect', {
				x: xInicialMiniEscala + _anchoTramoMiniEscala * (i + 1),
				y: _yMarcaRecta,
				width: grosorMarcas,
				height: largoMarcas,
				fill: colorRecta,
				rx: 2,
				ry: 2
			}))
		}
		//dibuja valores mini escala
		puntosMiniEscala.forEach((valor, index) => {
			if (index === 0) { //si es el primero
				if (tipoInicioTramoLupa === 'numero') {
					container.appendChild(crearElementoDeTexto({
						x: valor.posicion + grosorMarcas / 2,
						y: centroMiniEscala + largoMarcas / 2 + fontSize,
						fontSize: fontSize,
						textAnchor: 'middle',
						fill: colorFuente,
						style: 'font-family:Open-Sans-Reg;'
					}, inicioTramoLupaNumero.toString().replace('.', ',')))
				} else {
					container.appendChild(crearElementoDeTexto({
						x: valor.posicion + grosorMarcas / 2,
						y: centroMiniEscala + largoMarcas / 2 + fontSize,
						fontSize: fontSize,
						textAnchor: 'middle',
						fill: colorFuente,
						style: 'font-family:Open-Sans-Reg;'
					}, inicioTramoLupaNumerador))
					container.appendChild(crearElemento('line', {
						x1: valor.posicion + grosorMarcas / 2 - 10,
						y1: centroMiniEscala + largoMarcas / 2 + fontSize + 3,
						x2: valor.posicion + grosorMarcas / 2 + 10,
						y2: centroMiniEscala + largoMarcas / 2 + fontSize + 3,
						stroke: colorRecta,
						strokeWidth: 2
					}))
					container.appendChild(crearElementoDeTexto({
						x: valor.posicion + grosorMarcas / 2,
						y: centroMiniEscala + largoMarcas / 2 + fontSize * 2,
						fontSize: fontSize,
						textAnchor: 'middle',
						fill: colorFuente,
						style: 'font-family:Open-Sans-Reg;'
					}, inicioTramoLupaDenominador))
				}
			} else if (index + 1 === puntosMiniEscala.length) { //si es el último
				if (tipoFinTramoLupa === 'numero') {
					container.appendChild(crearElementoDeTexto({
						x: valor.posicion + grosorMarcas / 2,
						y: centroMiniEscala + largoMarcas / 2 + fontSize,
						fontSize: fontSize,
						textAnchor: 'middle',
						fill: colorFuente,
						style: 'font-family:Open-Sans-Reg;'
					}, finTramoLupaNumero.toString().replace('.', ',')))
				} else {
					container.appendChild(crearElementoDeTexto({
						x: valor.posicion + grosorMarcas / 2,
						y: centroMiniEscala + largoMarcas / 2 + fontSize,
						fontSize: fontSize,
						textAnchor: 'middle',
						fill: colorFuente,
						style: 'font-family:Open-Sans-Reg;'
					}, finTramoLupaNumerador))
					container.appendChild(crearElemento('line', {
						x1: valor.posicion + grosorMarcas / 2 - 10,
						y1: centroMiniEscala + largoMarcas / 2 + fontSize + 3,
						x2: valor.posicion + grosorMarcas / 2 + 10,
						y2: centroMiniEscala + largoMarcas / 2 + fontSize + 3,
						stroke: colorRecta,
						strokeWidth: 2
					}))
					container.appendChild(crearElementoDeTexto({
						x: valor.posicion + grosorMarcas / 2,
						y: centroMiniEscala + largoMarcas / 2 + fontSize * 2,
						fontSize: fontSize,
						textAnchor: 'middle',
						fill: colorFuente,
						style: 'font-family:Open-Sans-Reg;'
					}, finTramoLupaDenominador))
				}
			} else if (Number.isInteger(valor.numero) || formatoSubescala == 'numero') {
				container.appendChild(crearElementoDeTexto({
					x: valor.posicion + grosorMarcas / 2,
					y: centroMiniEscala + largoMarcas / 2 + fontSize,
					fontSize: fontSize,
					textAnchor: 'middle',
					fill: colorFuente,
					style: 'font-family:Open-Sans-Reg;'
				}, valor.numero.toString().replace('.', ',')))
			} else if (formatoSubescala == 'fraccion') {
				/*si la diferencia entre la primera y la segunda marca es 1 y 
				el formato se debe pintar como fraccion y 
				el valor esta dentro de los valores de la recta*/
				container.appendChild(crearElementoDeTexto({
					x: valor.posicion + grosorMarcas / 2,
					y: centroMiniEscala + largoMarcas / 2 + fontSize,
					fontSize: fontSize,
					textAnchor: 'middle',
					fill: colorFuente,
					style: 'font-family:Open-Sans-Reg;'
				}, diferenciaInicioFin === 1 ? index : inicioTramoLupa * 100 + index))
				container.appendChild(crearElemento('line', {
					x1: diferenciaInicioFin === 1 ? valor.posicion + grosorMarcas / 2 - 10 : valor.posicion + grosorMarcas / 2 - 15,
					y1: centroMiniEscala + largoMarcas / 2 + fontSize + 3,
					x2: diferenciaInicioFin === 1 ? valor.posicion + grosorMarcas / 2 + 10 : valor.posicion + grosorMarcas / 2 + 15,
					y2: centroMiniEscala + largoMarcas / 2 + fontSize + 3,
					stroke: colorRecta,
					strokeWidth: 2
				}))
				container.appendChild(crearElementoDeTexto({
					x: valor.posicion + grosorMarcas / 2,
					y: centroMiniEscala + largoMarcas / 2 + fontSize * 2,
					fontSize: fontSize,
					textAnchor: 'middle',
					fill: colorFuente,
					style: 'font-family:Open-Sans-Reg;'
				}, diferenciaInicioFin === 1 ? divicionesSubescala : divicionesSubescala * 10))
			}
		})

		arcosSubescala && arcosSubescala.map(x => ({
			inicio: Number(regexFunctions(regex(x.inicio, vars, vt))),
			fin: Number(regexFunctions(regex(x.fin, vars, vt))),
			direccion: x.direccion,
			color: '#8B1013',
			saltos: x.saltos == 'si' ? true : false,
			mostrarValorTramo: x.mostrarValorTramo == 'si' ? true : false
		})).forEach(arco => {
			if (arco.saltos) {
				let puntosDeArcos = puntosMiniEscala.filter(x => x.numero >= arco.inicio && x.numero <= arco.fin)
				puntosDeArcos.forEach(({ posicion }, index) => {
					if (index + 1 == puntosDeArcos.length) {
						return
					}
					let x = posicion + _anchoTramoMiniEscala / 2
					let y = centroMiniEscala
					let radio = _anchoTramoMiniEscala / 2
					container.appendChild(crearElemento('path', {
						d: createArcWithAngles(x, y, radio, 45, 135),
						fill: 'none',
						stroke: arco.color,
						strokeWidth: grosorMarcas
					}))
					if (arco.direccion == 'derecha') {
						let puntaFlecha = polarToCartesian(x, y, radio, 135)
						container.appendChild(crearElemento('path', {
							d: `M ${puntaFlecha.x} ${puntaFlecha.y}
								L ${puntaFlecha.x} ${puntaFlecha.y - 5}
								L ${puntaFlecha.x - 5} ${puntaFlecha.y}
								L ${puntaFlecha.x} ${puntaFlecha.y} Z`,
							fill: arco.color,
							stroke: arco.color
						}))
					} else {
						let puntaFlecha = polarToCartesian(x, y, radio, 45)
						container.appendChild(crearElemento('path', {
							d: `M ${puntaFlecha.x} ${puntaFlecha.y}
								L ${puntaFlecha.x} ${puntaFlecha.y - 5}
								L ${puntaFlecha.x + 5} ${puntaFlecha.y}
								L ${puntaFlecha.x} ${puntaFlecha.y} Z`,
							fill: arco.color,
							stroke: arco.color
						}))
					}
					if (arco.mostrarValorTramo) {
						container.appendChild(crearElementoDeTexto({
							x: posicion + _anchoTramoMiniEscala / 2,
							y: y - _anchoTramoMiniEscala / 2 - 5,
							fontSize: fontSize,
							textAnchor: 'middle',
							fill: colorFuente,
							style: 'font-family:Open-Sans-Reg;'
						}, escalaMiniEscala.toString().replace('.', ',')))
					}
				})
			} else {
				let inicioArco = valorSubescalaACoordenadaX(arco.inicio, datosMiniEscala)
				let finArco = valorSubescalaACoordenadaX(arco.fin, datosMiniEscala)
				let mitad = (finArco - inicioArco) / 2 + inicioArco
				let yArco = centroMiniEscala - largoMarcas / 2 - 5
				container.appendChild(crearElemento('path', {
					d: `M ${inicioArco} ${yArco}
						A 22 2 0 0 1 ${finArco} ${yArco}`,
					fill: 'none',
					stroke: arco.color,
					strokeWidth: grosorMarcas
				}))
				if (arco.direccion == 'derecha') {
					let puntaFlecha = {
						x: finArco,
						y: yArco
					}
					container.appendChild(crearElemento('path', {
						d: `M ${puntaFlecha.x} ${puntaFlecha.y}
							L ${puntaFlecha.x} ${puntaFlecha.y - 5}
							L ${puntaFlecha.x - 5} ${puntaFlecha.y}
							L ${puntaFlecha.x} ${puntaFlecha.y} Z`,
						fill: arco.color,
						stroke: arco.color
					}))
				} else {
					let puntaFlecha = {
						x: inicioArco,
						y: yArco
					}
					container.appendChild(crearElemento('path', {
						d: `M ${puntaFlecha.x} ${puntaFlecha.y}
							L ${puntaFlecha.x} ${puntaFlecha.y - 5}
							L ${puntaFlecha.x + 5} ${puntaFlecha.y}
							L ${puntaFlecha.x} ${puntaFlecha.y} Z`,
						fill: arco.color,
						stroke: arco.color
					}))
				}
				if (arco.mostrarValorTramo) {
					let diferencia = Number(Number(arco.fin - arco.inicio).toFixed(10))
					container.appendChild(crearElementoDeTexto({
						x: mitad,
						y: centroMiniEscala - _anchoTramoMiniEscala * 0.7,
						fontSize: fontSize,
						textAnchor: 'middle',
						fill: colorFuente,
						style: 'font-family:Open-Sans-Reg;'
					}, diferencia.toString().replace('.', ',')))
				}
			}
		})

		segmetosSubescala && segmetosSubescala.map(x => ({
			tipo: x.tipo,
			inicio: Number(Number(regexFunctions(regex(x.inicio, vars, vt))).toFixed(10)),
			final: Number(Number(regexFunctions(regex(x.final, vars, vt))).toFixed(10)),
			alto: x.alto ? Number(x.alto) : 0,
			color: x.color
		})).forEach(tramo => {
			let inicioX = valorSubescalaACoordenadaX(tramo.inicio, datosMiniEscala)
			let finX = valorSubescalaACoordenadaX(tramo.final, datosMiniEscala)

			switch (tramo.tipo) {
				case 'punto-punto':
					container.appendChild(crearElemento('circle', {
						cx: inicioX,
						cy: centroMiniEscala + grosorRecta / 2,
						r: grosorRecta + 2,
						fill: tramo.color,
						stroke: colorRecta,
						strokeWidth: grosorRecta / 2
					}))
					container.appendChild(crearElemento('circle', {
						cx: finX,
						cy: centroMiniEscala + grosorRecta / 2,
						r: grosorRecta + 2,
						fill: tramo.color,
						stroke: colorRecta,
						strokeWidth: grosorRecta / 2
					}))
					container.appendChild(crearElemento('rect', {
						x: inicioX,
						y: centroMiniEscala,
						width: finX - inicioX,
						height: grosorRecta,
						fill: tramo.color
					}))
					break
				case 'tramo':
					let inicioLineaExtremoY = tramo.alto + largoMarcas / 4
					let finLineaExtremoY = tramo.alto - largoMarcas / 4
					container.appendChild(crearElemento('line', {
						x1: inicioX,
						y1: inicioLineaExtremoY,
						x2: inicioX,
						y2: finLineaExtremoY,
						stroke: tramo.color,
						strokeWidth: grosorMarcas
					}))
					container.appendChild(crearElemento('line', {
						x1: finX,
						y1: inicioLineaExtremoY,
						x2: finX,
						y2: finLineaExtremoY,
						stroke: tramo.color,
						strokeWidth: grosorMarcas
					}))
					container.appendChild(crearElemento('line', {
						x1: inicioX,
						y1: tramo.alto,
						x2: finX,
						y2: tramo.alto,
						stroke: tramo.color,
						strokeWidth: grosorMarcas
					}))
					break
				default:
					//console.log('no se puede agregar este tipo de tramo :c')
					break
			}
		})

		imagenesSubescala.map(img => {
			let widthImg = img.height * img.imagen.width / img.imagen.height
			img.posiciones.forEach(posicionEnRecta => {
				let posicionX = valorSubescalaACoordenadaX(posicionEnRecta, datosMiniEscala)
				if (img.marcar) {
					container.appendChild(crearElemento('rect', { //dibuja marca
						x: posicionX,
						y: centroMiniEscala - largoMarcas / 2 + grosorRecta / 2,
						width: grosorMarcas,
						height: largoMarcas,
						fill: colorRecta,
						rx: 2,
						ry: 2
					}))
				}
				container.appendChild(crearElementoDeImagen(img.srcImg, {
					x: posicionX - widthImg / 2,
					y: img.posicion == 'arriba' ? centroMiniEscala - largoMarcas / 2 - img.separacion - img.height : centroMiniEscala + largoMarcas / 2 + img.separacion,
					height: img.height
				}))
			})
		})

		//puntos subescala
		puntosSubescala = puntosSubescala.length > 0 ? regexFunctions(regex(puntosSubescala, vars, vt)).split(';').map(x => x.split(',')).map(x => ({
			posicion: valorSubescalaACoordenadaX(Number(x[0]), datosMiniEscala),
			color: x[1]
		})) : []
		puntosSubescala.forEach(punto => {
			container.appendChild(crearElemento('circle', {
				cx: punto.posicion,
				cy: centroMiniEscala + grosorRecta / 2,
				r: grosorRecta + grosorRecta / 2,
				fill: punto.color,
				stroke: colorRecta,
				strokeWidth: grosorRecta / 2
			}))
		})
	}

	function polarToCartesian(centerX, centerY, radius, angleInDegrees) { // 0 grados = 9 hrs
		let angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;

		return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		}
	}

	function createArcWithAngles(x, y, radius, startAngle, endAngle) {

		let start = polarToCartesian(x, y, radius, endAngle)
		let end = polarToCartesian(x, y, radius, startAngle)

		let arcSweep = endAngle - startAngle <= 180 ? '0' : '1'

		let d = [
			'M', start.x, start.y,
			'A', radius, radius, 0, arcSweep, 0, end.x, end.y
			//'L', x,y,
			//'L', start.x, start.y
		].join(' ')

		return d
	}

	function valorRectaACoordenadaX(valorRecta) {
		let valorReal = valorRecta + valorEscalaRecta - valorInicialRecta
		let valorInicioMenosEscala = valorInicialRecta - valorEscalaRecta
		let valorFinalMasEscala = valorFinalRecta + valorEscalaRecta
		let largoRecta = valorFinalMasEscala - valorInicioMenosEscala
		return anchoRecta * valorReal / largoRecta
	}

	/*datos = {
		anchoSubescala: Number,
		valorInicioSubescala: Number,
		valorFinalSubescala: Number,
		valorEscalaSubescala: Number
	}*/
	function valorSubescalaACoordenadaX(valorSubescala, datos) {
		let valorReal = valorSubescala + datos.valorEscalaSubescala - datos.valorInicioSubescala
		let valorInicioMenosEscala = datos.valorInicioSubescala - datos.valorEscalaSubescala
		let valorFinalMasEscala = datos.valorFinalSubescala + datos.valorEscalaSubescala
		let largoRecta = valorFinalMasEscala - valorInicioMenosEscala
		let puntoInicio = anchoRecta / 2 - datos.anchoSubescala / 2
		return puntoInicio + Number(grosorMarcas) / 2 + datos.anchoSubescala * valorReal / largoRecta
	}

	async function getImagenObj(img) {
		let src = regexFunctions(regex(img.srcImg, vars, vt))
		src = src.replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../')
		return {
			srcImg: src,
			imagen: await cargaImagen(src),
			height: Number(img.height),
			posicion: img.posicion,
			separacion: Number(img.separacion),
			marcar: img.marcar === 'si' ? true : false,
			posiciones: String(img.posiciones).split(',')
				.map(x => regexFunctions(regex(x, vars, vt)))
				.map(x => Number(Number(x).toFixed(10)))
		}
	}

	function getArcoObj(arco) {
		return {
			inicio: Number(regexFunctions(regex(arco.inicio, vars, vt))),
			fin: Number(regexFunctions(regex(arco.fin, vars, vt))),
			direccion: arco.direccion,
			color: arco.color,
			saltos: arco.saltos == 'si' ? true : false,
			mostrarValorTramo: arco.mostrarValorTramo == 'si' ? true : false
		}
	}

	function getTextoObj(texto) {
		return {
			texto: regexFunctions(regex(texto.texto, vars, vt)),
			valorCentro: valorRectaACoordenadaX(Number(regexFunctions(regex(texto.valorCentro, vars, vt)))),
			posicionY: texto.posicionY
		}
	}

	function getTramoObj(tramo) {
		return {
			tipo: tramo.tipo,
			inicio: Number(Number(regexFunctions(regex(tramo.inicio, vars, vt))).toFixed(10)),
			final: Number(Number(regexFunctions(regex(tramo.final, vars, vt))).toFixed(10)),
			alto: tramo.alto ? Number(tramo.alto) : 0,
			color: tramo.color
		}
	}

	function dibujarMarca(posicion) {
		container.appendChild(crearElemento('rect', { //dibuja marca
			x: posicion,
			y: altoRecta / 2 - largoMarcas / 2,
			width: grosorMarcas,
			height: largoMarcas,
			fill: colorRecta,
			rx: 2,
			ry: 2
		}))
	}

	function dibujaValorDeMarca(numero, posicion, index) { //pone los numeros o fracciones debajo de la marca de la recta
		if (Number.isInteger(numero)) {
			dibujaNumeroEnPosicion(numero, posicion, 'abajo')
		} else if (formato == 'numero') {
			//va a pintar el valor como numero, ya sea decimal o no, con todos sus decimales
			dibujaNumeroEnPosicion(numero, posicion, 'abajo')
		} else if (((valorFinalRecta - valorInicialRecta) == 1) && formato == 'fraccion' && index >= 0) {
			/*si la diferencia entre la primera y la segunda marca es 1 y 
			el formato se debe pintar como fraccion y 
			el valor esta dentro de los valores de la recta*/
			dibujaFraccionEnPosicion(Math.floor(numero), index, divicionesRecta, posicion, 'abajo')
		}
	}

	function dibujaNumeroEnPosicion(numero, posicion, ubicacion) {
		//console.log({numero, posicion, ubicacion})
		container.appendChild(crearElementoDeTexto({
			x: posicion + grosorMarcas / 2,
			y: ubicacion == 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize : altoRecta / 2 - largoMarcas / 2 - 4,
			fontSize: fontSize,
			textAnchor: 'middle',
			fill: colorFuente,
			style: 'font-family:Open-Sans-Reg;'
		}, numero.toString().replace('.', ',')))
	}

	function frac({ tipo, entero, numerador, denominador, ubicacion }) {
		entero = Number(regexFunctions(regex(entero, vars, vt)))
		numerador = Number(regexFunctions(regex(numerador, vars, vt)))
		denominador = Number(regexFunctions(regex(denominador, vars, vt)))
		let valor = Number(entero + numerador / denominador)
		let posicion = valorRectaACoordenadaX(valor)

		return { entero, numerador, denominador, valor, posicion, ubicacion, tipo }
	}

	function num({ tipo, valor, ubicacion }) {
		let numero = Number(regexFunctions(regex(valor, vars, vt)))
		let posicion = valorRectaACoordenadaX(numero)
		return { numero, posicion, ubicacion, tipo }
	}

	function dibujaFraccionEnPosicion(entero, numerador, denominador, posicion, ubicacion) {
		if (entero > 0) {
			container.appendChild(crearElementoDeTexto({
				x: posicion + grosorMarcas / 2 - 10,
				y: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize * 1.5 : altoRecta / 2 - largoMarcas / 2 - fontSize / 2 - 2,
				fontSize: fontSize + 2,
				textAnchor: 'middle',
				fill: colorFuente,
				style: 'font-family:Open-Sans-Reg;'
			}, entero))
			container.appendChild(crearElementoDeTexto({
				x: posicion + grosorMarcas / 2 + 10,
				y: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize : altoRecta / 2 - largoMarcas / 2 - fontSize - 2,
				fontSize: fontSize,
				textAnchor: 'middle',
				fill: colorFuente,
				style: 'font-family:Open-Sans-Reg;'
			}, numerador))
			container.appendChild(crearElemento('line', {
				x1: posicion + grosorMarcas / 2,
				y1: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize + 3 : altoRecta / 2 - largoMarcas / 2 - fontSize + 1,
				x2: posicion + grosorMarcas / 2 + 20,
				y2: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize + 3 : altoRecta / 2 - largoMarcas / 2 - fontSize + 1,
				stroke: colorRecta,
				strokeWidth: 2
			}))
			container.appendChild(crearElementoDeTexto({
				x: posicion + grosorMarcas / 2 + 10,
				y: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize * 2 : altoRecta / 2 - largoMarcas / 2 - 2,
				fontSize: fontSize,
				textAnchor: 'middle',
				fill: colorFuente,
				style: 'font-family:Open-Sans-Reg;'
			}, denominador))
		} else {
			container.appendChild(crearElementoDeTexto({
				x: posicion + grosorMarcas / 2,
				y: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize : altoRecta / 2 - largoMarcas / 2 - fontSize - 2,
				fontSize: fontSize,
				textAnchor: 'middle',
				fill: colorFuente,
				style: 'font-family:Open-Sans-Reg;'
			}, numerador))
			container.appendChild(crearElemento('line', {
				x1: posicion + grosorMarcas / 2 - 10,
				y1: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize + 3 : altoRecta / 2 - largoMarcas / 2 - fontSize + 1,
				x2: posicion + grosorMarcas / 2 + 10,
				y2: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize + 3 : altoRecta / 2 - largoMarcas / 2 - fontSize + 1,
				stroke: colorRecta,
				strokeWidth: 2
			}))
			container.appendChild(crearElementoDeTexto({
				x: posicion + grosorMarcas / 2,
				y: ubicacion === 'abajo' ? altoRecta / 2 + largoMarcas / 2 + fontSize * 2 : altoRecta / 2 - largoMarcas / 2 - 2,
				fontSize: fontSize,
				textAnchor: 'middle',
				fill: colorFuente,
				style: 'font-family:Open-Sans-Reg;'
			}, denominador))
		}
	}

	function crearElementoDeImagen(src, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'image')
		element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	function crearElemento(nombre, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', nombre)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	function crearElementoDeTexto(atributos, texto) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'text')
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		let textNode = document.createTextNode(texto)
		element.appendChild(textNode)
		return element
	}

	function crearElementoSymbol(id, width, height) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'symbol')
		element.setAttributeNS(null, 'id', id)
		element.setAttributeNS(null, 'width', width)
		element.setAttributeNS(null, 'height', height)
		element.setAttributeNS(null, 'viewBox', `0 0 ${width} ${height}`)
		return element
	}

	function crearReferenciaAElemento(id, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'use')
		element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${id}`)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	if (window.innerWidth <= 576) {
		container.setAttributeNS(null, 'height', Number(altoRecta) + 50)
		container.style.borderRadius = '5px'
		container.style.background = '#CACCCA'
		if (tipo == 'g') {
			svgGlosa.push(container)
		} else {
			svgPanZoom(container, {
				zoomEnabled: true,
				minZomm: 1,
				maxZoom: 2,
				customEventsHandler: eventsHandler,
				beforePan: beforePan
			})
		}
	}
}

var eventsHandler = {
	haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel'],
	init: function (options) {
		var instance = options.instance
			, initialScale = 1
			, pannedX = 0
			, pannedY = 0

		// Init Hammer
		// Listen only for pointer and touch events
		this.hammer = Hammer(options.svgElement, {
			inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
		})

		// Enable pinch
		this.hammer.get('pinch').set({ enable: true })

		// Handle double tap
		this.hammer.on('doubletap', function (ev) {
			instance.zoomIn()
		})

		// Handle pan
		this.hammer.on('panstart panmove', function (ev) {
			// On pan start reset panned variables
			if (ev.type === 'panstart') {
				pannedX = 0
				pannedY = 0
			}

			// Pan only the difference
			instance.panBy({ x: ev.deltaX - pannedX, y: ev.deltaY - pannedY })
			pannedX = ev.deltaX
			pannedY = ev.deltaY
		})

		// Handle pinch
		this.hammer.on('pinchstart pinchmove', function (ev) {
			// On pinch start remember initial zoom
			if (ev.type === 'pinchstart') {
				initialScale = instance.getZoom()
				instance.zoomAtPoint(initialScale * ev.scale, { x: ev.center.x, y: ev.center.y })
			}

			instance.zoomAtPoint(initialScale * ev.scale, { x: ev.center.x, y: ev.center.y })
		})

		// Prevent moving the page on some devices when panning over SVG
		options.svgElement.addEventListener('touchmove', function (e) { e.preventDefault(); });
	},
	destroy: function () {
		this.hammer.destroy()
	}
}

function beforePan(oldPan, newPan) {
	var stopHorizontal = false,
		stopVertical = false,
		gutterWidth = 50,
		gutterHeight = 50,
		sizes = this.getSizes(),
		leftLimit = -((sizes.viewBox.x + sizes.viewBox.width) * sizes.realZoom) + gutterWidth,
		rightLimit = sizes.width - gutterWidth - (sizes.viewBox.x * sizes.realZoom),
		topLimit = -((sizes.viewBox.y + sizes.viewBox.height) * sizes.realZoom) + gutterHeight,
		bottomLimit = sizes.height - gutterHeight - (sizes.viewBox.y * sizes.realZoom)
	customPan = {}
	customPan.x = Math.max(leftLimit, Math.min(rightLimit, newPan.x))
	customPan.y = Math.max(topLimit, Math.min(bottomLimit, newPan.y))
	return customPan
}

function tabPos(config) {
    const { container, params, variables, versions, vt } = config
    container.innerHTML = ''
    let vars = vt ? variables : versions
    let {
        tipoTabla,
        pisoTabla,
        detallePisos,
        conOperacion,
        tachar,
        detalleCanje,
        imagenesParaPosiciones,
        valoresPosicionales,
        mostrarVF,
        formaVF,
        VF,
        destacar,
        lineas
    } = params

    let urlImagenesPosicionalesBloques = [{
        posicion: 'U',
        url: 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-3/imagenes_front/bloques_multibase/cubito#.svg'
    },{
        posicion: 'D',
        url: 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-3/imagenes_front/bloques_multibase/barra#.svg'
    },{
        posicion: 'C',
        url: 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-3/imagenes_front/bloques_multibase/placa#.svg'
    },{
        posicion: 'UM',
        url: 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-3/imagenes_front/bloques_multibase/cubo#.svg'
    },{
        posicion: 'd',
        url: 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-3/imagenes_front/bloques_multibase/cubo_decimo_#.svg'
    },{
        posicion: 'c',
        url: 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-3/imagenes_front/bloques_multibase/cubo_centesimo_#.svg'
    }]

    let urlImagenesPosicionalesMonedasYBilletes = [{
        posicion: 'U',
        url: 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-3/imagenes_front/tablas_posicionales/1_#.svg'
    },{
        posicion: 'D',
        url: 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-3/imagenes_front/tablas_posicionales/10_#.svg'
    },{
        posicion: 'C',
        url: 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-3/imagenes_front/tablas_posicionales/100_#.svg'
    }, {
        posicion: 'UM',
        url: 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-3/imagenes_front/tablas_posicionales/1000_#.svg'
    }]

    let urlImgsFichasLila = 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-3/imagenes_front/pelotas_repeticiones/lila#.svg'

    let urlImgsFichasCalipso = 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-3/imagenes_front/pelotas_repeticiones/calipso#.svg'

    let urlImgsFichasAzul = 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-3/imagenes_front/pelotas_repeticiones/azul#.svg'
    
    let urlImgFlecha = 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-3/imagenes_front/flechas/flecha_abajo.svg'

    let urlImgLlave = 'https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-5/imagenes_front/llaves/Llave_Horizontal.svg'
    
    let encabezados = ['CMi','DMi','UMi','CM','DM','UM','C','D','U','d','c','m']

    let titulos = tipoTabla.split(/[\s,]/g)
    let indiceDecimal = titulos.findIndex(x => x.match(/[d,c,m]/g))
    conOperacion = conOperacion === 'si' ? true : false
    pisoTabla = Number(pisoTabla)
    detallePisos = detallePisos ? detallePisos.map(x => getDetallePiso(x)) : []
    valoresPosicionales = valoresPosicionales ? valoresPosicionales.map(x => getDetalleValorPosicional(x)) : []
    mostrarVF = mostrarVF === 'si' ? true : false
    VF = regexFunctions(regex(VF))
    let celdasDestacadas = destacar ? 
        regexFunctions(regex(destacar, vars, vt)).split(';').map(x => x.split(',')).map(x => ({ 
            col: x[0],
            filaI: Number(x[1]),
            filaF: Number(x[2]),
            color: x[3]
        })) : []
    lineas = lineas ? lineas.split(';').map(x => ({ fila: x[0], inicio: x[2], fin: x[4] })) : []

    container.classList.add('tabPos', 'img-fluid')
    container.style.width = (titulos.length * 100) + 'px'
    let filasTabla = pisoTabla + 1 + valoresPosicionales.length
    let primerSignoMas

    for(let indexFila = 0; indexFila < filasTabla; indexFila++) {
        let fila = document.createElement('div')
        primerSignoMas = true
        fila.classList.add('tabPos-fila')
        //casillas para titulo
        titulos.forEach((titulo, indexColumna) => {
            let celda = document.createElement('div')
            celda.classList.add('tabPos-celda')
            agregaElementoACelda(celda, indexFila, indexColumna, titulo)
            marcarCasilla(celda, indexFila, titulo)
            dibujarLinea(celda, indexFila, indexColumna)
            dibujarImagen(celda, indexFila, titulo)
            fila.appendChild(celda)
        })
        container.appendChild(fila)
    }

    if(mostrarVF) {
        let vpDibujado = false
        let fila = document.createElement('div')
        fila.classList.add('tabPos-fila')
        titulos.forEach(titulo => {
            if(encabezados.indexOf(titulo) > -1 && !vpDibujado) {
                let celda = document.createElement('div')
                celda.classList.add('tabPos-celda')
                if(formaVF === 'flecha') {
                    let imgFlecha = document.createElement('img')
                    imgFlecha.src = urlImgFlecha
                    imgFlecha.classList.add('tabPos-imgFlecha')
                    celda.appendChild(imgFlecha)
                    celda.style.flexDirection = 'column'
                    celda.style.flexGrow = titulos.filter(x => encabezados.includes(x)).length
                }
                if(formaVF === 'llave') {
                    let imgLlave = document.createElement('img')
                    imgLlave.src = urlImgLlave
                    imgLlave.classList.add('tabPos-imgLLave')
                    celda.appendChild(imgLlave)
                    celda.style.flexDirection = 'column'
                    celda.style.flexGrow = titulos.filter(x => encabezados.includes(x)).length
                }
                if(VF) {
                    celda.classList.add('tabPos-celda_texto')
                    let numero = document.createElement('p')
                    numero.innerHTML = VF
                    celda.appendChild(numero)
                }
                vpDibujado = true
                fila.appendChild(celda)
            } else if(encabezados.indexOf(titulo) === -1) {
                let celda = document.createElement('div')
                celda.classList.add('tabPos-celda')
                fila.appendChild(celda)
            }
        })
        container.appendChild(fila)
    }

    function getDetallePiso(x) {
        let numeroCompleto = x.numeroCompleto === 'si' ? true : false
        let detalle = {}
        if(numeroCompleto) {
            let numero = regexFunctions(regex(x.detalle, vars, vt)).toString().replace('.','').split('')
            titulos.forEach((posicion, index) => {
                detalle[posicion] = numero[index]
            })
        } else {
            Object.keys(x.detalle).forEach(posicion => {
                detalle[posicion] = regexFunctions(regex(x.detalle[posicion], vars, vt))
            })
        }
        return {
            tipo: x.tipo,
            detalle
        }
    }

    function agregaElementoACelda(celda, fila, indexColumna, nombreColumna) {
        if(fila === 0) {
            if(encabezados.indexOf(nombreColumna) > -1) {
                let titulo = document.createElement('h6')
                celda.classList.add('tabPos-celda_encabezado')
                titulo.innerHTML = nombreColumna
                celda.appendChild(titulo)
                //testea si es la primera columna del encabezado de la tabla para corregir bordes
                if(titulos[indexColumna-1]) {
                    if(encabezados.indexOf(titulos[indexColumna-1]) === -1) {
                        celda.classList.add('tabPos-celda_encabezadofirst')
                    }
                } else {
                    celda.classList.add('tabPos-celda_encabezadofirst')
                }
                //testea si es la ultima columna del encabezado de la tabla para corregir bordes
                if(titulos[indexColumna+1]) {
                    if(encabezados.indexOf(titulos[indexColumna+1]) === -1) {
                        celda.classList.add('tabPos-celda_encabezadolast')
                    }
                } else {
                    celda.classList.add('tabPos-celda_encabezadolast')
                }
            } else if(!nombreColumna.match(/w\d{1,}/g)) {
                let texto = document.createElement('p')
                celda.classList.add('tabPos-celda_textoencabezado')
                texto.innerHTML = nombreColumna
                celda.appendChild(texto)
            }
            return
        } else if(fila <= pisoTabla) {
            let detallePiso = detallePisos[fila-1]
            let detalleCelda = detallePiso.detalle[nombreColumna]
            if(encabezados.indexOf(nombreColumna) > -1 && fila < pisoTabla) {
                celda.classList.add('tabPos-celda_cuerpo')
                //testea si es la primera columna del cuerpo de la tabla para corregir bordes
                if(titulos[indexColumna-1]) {
                    if(encabezados.indexOf(titulos[indexColumna-1]) === -1) {
                        celda.classList.add('tabPos-celda_cuerpofirst')
                    }
                } else {
                    celda.classList.add('tabPos-celda_cuerpofirst')
                }
                //testea si es la ultima columna del cuerpo de la tabla para corregir bordes
                if(titulos[indexColumna+1]) {
                    if(encabezados.indexOf(titulos[indexColumna+1]) === -1) {
                        celda.classList.add('tabPos-celda_cuerpolast')
                    }
                } else {
                    celda.classList.add('tabPos-celda_cuerpolast')
                }
            } else if (encabezados.indexOf(nombreColumna) > -1 && fila == pisoTabla) {
                celda.classList.add('tabPos-celda_cuerpo')
                //testea si es la primera columna del cuerpo de la tabla para corregir bordes
                if(titulos[indexColumna-1]) {
                    if(encabezados.indexOf(titulos[indexColumna-1]) === -1) {
                        celda.classList.add('tabPos-celda_cuerpofirstcol')
                    }
                } else {
                    celda.classList.add('tabPos-celda_cuerpofirstcol')
                }
                //testea si es la ultima columna del cuerpo de la tabla para corregir bordes
                if(titulos[indexColumna+1]) {
                    if(encabezados.indexOf(titulos[indexColumna+1]) === -1) {
                        celda.classList.add('tabPos-celda_cuerpolastcol')
                    }
                } else {
                    celda.classList.add('tabPos-celda_cuerpolastcol')
                }
            }
            if(indexColumna === indiceDecimal) {
                celda.classList.add('tabPos-celda_coma')
            }
            if(!detalleCelda) {
                return
            }
            if(detalleCelda === '0' && detallePiso.tipo !== 'numero') {
                return
            }
            
            
            switch(detallePiso.tipo) {
                case 'numero':
                    let reserva
                    if(conOperacion && fila === 1) {
                        celda.classList.add('tabPos-celda_operacion')
                        reserva = detalleCanje[nombreColumna] ? regexFunctions(regex(detalleCanje[nombreColumna], vars, vt)) : ''
                        if(reserva) {
                            let numeroArriba = document.createElement('span')
                            numeroArriba.innerHTML = reserva
                            celda.appendChild(numeroArriba)
                        }
                    } else {
                        celda.classList.add('tabPos-celda_texto')
                    }
                    let numero = document.createElement('p')
                    numero.innerHTML = detalleCelda
                    celda.appendChild(numero)
                    if(tachar === 'si' && fila === 1 && encabezados.indexOf(nombreColumna) > -1 && reserva) {
                        numero.classList.add('tabPos-celda_textotachado')
                    }
                    break
                case 'bloques':
                    let imgBloque = document.createElement('img')
                    imgBloque.src = urlImagenesPosicionalesBloques.find(x => x.posicion === nombreColumna).url.replace('#', detalleCelda)
                    imgBloque.classList.add(`tabPos-bloques_${nombreColumna}`, 'tabPos-img')
                    celda.appendChild(imgBloque)
                    break
                case 'monedas y billetes':
                    let imgMyB = document.createElement('img')
                    imgMyB.src = urlImagenesPosicionalesMonedasYBilletes.find(x => x.posicion === nombreColumna).url.replace('#', detalleCelda)
                    imgMyB.classList.add(`tabPos-monedabillete_${nombreColumna}`, 'tabPos-img')
                    celda.appendChild(imgMyB)
                    break
                case 'fichas calipso':
                    let imgFichaCalipso = document.createElement('img')
                    imgFichaCalipso.src = urlImgsFichasCalipso.replace('#', detalleCelda)
                    imgFichaCalipso.classList.add('tabPos-ficha', 'tabPos-img')
                    celda.appendChild(imgFichaCalipso)
                    break
                case 'fichas lila':
                    let imgFichaLila = document.createElement('img')
                    imgFichaLila.src = urlImgsFichasLila.replace('#', detalleCelda)
                    imgFichaLila.classList.add('tabPos-ficha', 'tabPos-img')
                    celda.appendChild(imgFichaLila)
                    break
                case 'fichas azul':
                    let imgFichaAzul = document.createElement('img')
                    imgFichaAzul.src = urlImgsFichasAzul.replace('#', detalleCelda)
                    imgFichaAzul.classList.add('tabPos-ficha', 'tabPos-img')
                    celda.appendChild(imgFichaAzul)
                    break
                default:
                    break
            }
        } else if((fila-pisoTabla-1) < valoresPosicionales.length) {
            let vp = valoresPosicionales[fila-pisoTabla-1]
            if(vp.mostrarFlecha && encabezados.indexOf(nombreColumna) > -1) {
                let imgFlecha = document.createElement('img')
                imgFlecha.src = urlImgFlecha
                imgFlecha.classList.add('tabPos-imgFlecha')
                celda.appendChild(imgFlecha)
                celda.style.flexDirection = 'column'
            }
            if(vp.detalle[nombreColumna]) {
                celda.classList.add('tabPos-celda_texto')
                let numero = document.createElement('p')
                numero.innerHTML = vp.detalle[nombreColumna]
                celda.appendChild(numero)
            }
            if(vp.mostrarSignoMas && encabezados.indexOf(nombreColumna) > -1) {
                if(!primerSignoMas) {
                    celda.classList.add('tabPos-celda_signoMas')
                } else {
                    primerSignoMas = false
                }
                
            }
        }
    }

    function marcarCasilla(casilla, fila, columna) {
        let celda = celdasDestacadas.find(x => x.col === columna)
        if(celda) {
            if(celda.filaI <= (fila+1) && celda.filaF >= (fila+1)) {
                casilla.style.backgroundColor = celda.color
            }
        }
    }

    function dibujarLinea(celda, fila, columna) {
        let conBorde = lineas.find(x => x.fila == (fila+1))
        if(conBorde) {
            if(conBorde.inicio <= (columna+1) && conBorde.fin >= (columna+1)) {
                celda.style.borderBottom = '3px solid #1F8EBE'
            }
        }
    }

    function dibujarImagen(celda, fila, titulo) {
        let conImagen = imagenesParaPosiciones ? imagenesParaPosiciones.find(x => x.piso == (fila+1)) : []
        if(conImagen) {
            if(conImagen.posicion === titulo) {
                let imagen = document.createElement('img')
                imagen.src = conImagen.src
                imagen.width = conImagen.ancho
                imagen.classList.add('tabPos-img')
                celda.appendChild(imagen)
            }
        }
    }

    
    function getDetalleValorPosicional(valorPosicional) {
        let detalle = {}
        Object.keys(valorPosicional.detalle).forEach(x => {
            detalle[x] = regexFunctions(regex(valorPosicional.detalle[x], vars, vt))
        })
        return {
            mostrarFlecha: valorPosicional.mostrarFlecha === 'si' ? true : false,
            mostrarSignoMas: valorPosicional.mostrarSignoMas === 'si' ? true : false,
            detalle
        }
    }
}

async function formadorGrupos(config) {
    const { container, params, variables, versions, vt } = config
    let { 
        altoViewPort,anchoViewPort,bordeViewPort,
        altoGrupos,anchoGrupos,bordeGrupos,
        conFlecha,flecha,
        grupos,
        imagenes
    } = params
    let vars = vt ? variables : versions
    //conversion de variables numericas
    altoViewPort = Number(altoViewPort)
    anchoViewPort = Number(anchoViewPort)
    altoGrupos = Number(altoGrupos)
    anchoGrupos = Number(anchoGrupos)
    bordeGrupos = bordeGrupos.split(',')
    conFlecha = conFlecha === 'si' ? true : false
    flecha = flecha.replace('%20', '-')
    //dimensiones del svg y estilos
    container.setAttributeNS(null, 'height', altoViewPort)
	container.setAttributeNS(null, 'width', anchoViewPort)
    container.setAttributeNS(null, 'viewBox', `0 0 ${anchoViewPort} ${altoViewPort}`)
    //defs y lector de datos
    let defs = crearElemento('defs', {})
	let styles = document.createElement('style')
	styles.innerHTML = '@font-face{font-family:"Quicksand-Medium";src:url("../../../../fonts/Quicksand-Medium.ttf");}'
    defs.appendChild(styles)
    //definicion de constantes
    const anchoDiviciones = anchoViewPort / grupos.length
    const marginTop = 20
    const margenDivisores = 10
    const sepReps = 5
    //lee los datos
    imagenes = imagenes ? await Promise.all(imagenes.map(i =>  agregaImagen(i))) : []
    grupos = grupos ? grupos.map(x => getData(x)) : []
    container.appendChild(defs)
    //console.log(grupos)
    //dibuja grupos
    grupos.forEach((grupo, index) => {
        let centro = anchoDiviciones/2 + index * anchoDiviciones
        let xDividendo = centro-anchoGrupos/2
        if(grupo.titulo.length>0) {
            container.appendChild(crearElementoDeTexto({
                x: centro,
                y: marginTop-5,
                fontSize: 20,
                textAnchor: 'middle',
                fill: '#363026',
                style: 'font-family:Quicksand-Medium;'
            }, grupo.titulo))
        }

        if(grupo.texto) {
            container.appendChild(crearElementoDeTexto({
                x: centro,
                y: grupo.yTexto,
                fontSize: grupo.altoTexto,
                textAnchor: 'middle',
                fill: ' #363026',
                style: 'font-family:Quicksand-Medium;'
            }, grupo.texto))
        }

        container.appendChild(crearElemento('rect',{
            x: xDividendo,
            y: marginTop,
            width: anchoGrupos,
            height: altoGrupos,
            fill: 'none',
            stroke: bordeGrupos[1],
            strokeWidth: bordeGrupos[0],
            rx: '10',
            ry: '10'
        }))

        if(conFlecha && (index+1 != grupos.length)) {
            let imagen = imagenes.find(x => x.id === flecha)
            container.appendChild(crearReferenciaAElemento(flecha, {
                x: anchoDiviciones * (index+1)-imagen.width/2,
                y: marginTop+altoGrupos/2-imagen.height/2
            }))
        }
        let arrayGrupo = grupo.tipo === 'suma' ? grupo.total : grupo.repDividendos
        if(arrayGrupo.length > 0) {
            let centroYDividendo = marginTop + altoGrupos/2
            let altoTotalRep = arrayGrupo.reduce((total, rep) => total + rep.altoTotal, 0)
            altoTotalRep = altoTotalRep+(arrayGrupo.length-1)*10
            let inicioRepeticion = centroYDividendo - altoTotalRep/2

            arrayGrupo.forEach((repeticion, indiceRep) => {
                switch(repeticion.formaRep) {
                    case 'izq/der':
                        for(let i = 0, acum = 0; i < repeticion.cantidad; i++) {
                            let xRepeticion= centro - repeticion.anchoTotal/2 + acum * sepReps + repeticion.anchoImagen * acum
                            let yRepeticion = inicioRepeticion + Math.floor(i/repeticion.limite) * repeticion.altoImagen + Math.floor(i/repeticion.limite) * sepReps
                            container.appendChild(crearReferenciaAElemento(repeticion.imagen, {
                                x: xRepeticion,
                                y: yRepeticion
                            }))
                            if(acum === repeticion.limite-1) {
                                acum = 0
                            } else {
                                acum++
                            }
                        }
                        break
                    case 'rectangular':
                        for(let v = 0, yImg; v < repeticion.vertical; v++) {
                            yImg = inicioRepeticion + v * repeticion.altoImagen + v * sepReps
                            for(let h = 0, xImg; h < repeticion.horizontal; h++) {
                                xImg = centro - repeticion.anchoTotal/2 + h * repeticion.anchoImagen + h * sepReps
                                container.appendChild(crearReferenciaAElemento(repeticion.imagen, {
                                    x: xImg,
                                    y: yImg
                                }))
                            }
                        }
                        break
                    default:
                        console.log('esto no es bueno :c')
                        break
                }
                inicioRepeticion+=repeticion.altoTotal+(indiceRep+1)*10
            })
        }

        switch(grupo.tipo) {
            case 'division':
                if(grupo.divisor > 0) {
                    let anchoTotalDivisores = grupo.divisor * grupo.anchoDivisores + margenDivisores * (grupo.divisor-1)
                    let divicionAnchoDividendo = anchoGrupos / (grupo.divisor+1)
                    let altoTotalRepDivisores = grupo.repDivisores.reduce((total, rep) => total + rep.altoTotal, 0)
                    altoTotalRepDivisores = altoTotalRepDivisores + (grupo.repDivisores.length-1)*10
                    let anchoMaximoRepDivisores = Math.max(...grupo.repDivisores.map(x => x.anchoTotal))
                    for(let i = 0; i < grupo.divisor; i++) {
                        let xDivisor = centro-anchoTotalDivisores/2+i*grupo.anchoDivisores+i*margenDivisores
                        let yDivisor = marginTop*2+altoGrupos
                        if(grupo.textoDividendo) {
                            container.appendChild(crearElementoDeTexto({
                                x: xDivisor + grupo.anchoDivisores/2,
                                y: grupo.yTextoDividendo,
                                fontSize: grupo.altoTextoDividendo,
                                textAnchor: 'middle',
                                fill: ' #363026',
                                style: 'font-family:Quicksand-Medium;'
                            }, grupo.textoDividendo))
                        }
                        container.appendChild(crearElemento('rect', {
                            x: xDivisor,
                            y: yDivisor,
                            width: grupo.anchoDivisores,
                            height: grupo.altoDivisores,
                            fill: (i === 0 && grupo.marcarPrimero) ? 'yellow' : 'none',
                            stroke: grupo.bordeDivisores[1],
                            strokeWidth: grupo.bordeDivisores[0],
                            rx: '10',
                            ry: '10'
                        }))
                        container.appendChild(crearElemento('line', {
                            x1: xDivisor+grupo.anchoDivisores/2,
                            y1: yDivisor,
                            x2: xDividendo+divicionAnchoDividendo*(i+1),
                            y2: marginTop+altoGrupos,
                            stroke: grupo.bordeDivisores[1],
                            strokeWidth: grupo.bordeDivisores[0]
                        }))
                        if(grupo.repDivisores.length > 0) {
                            if(i === 0) {
                                let symbol = crearElementoSymbol(`${container.id}-divisor-grupo-${index}`, anchoMaximoRepDivisores, altoTotalRepDivisores)
                                let inicio = 0
                                grupo.repDivisores.forEach((repDivisor, indiceRepDiv) => {
                                    if(repDivisor.formaRep === 'izq/der') {
                                        for(let i = 0, acum = 0; i < repDivisor.cantidad; i++) {
                                            let xRepDivisor = anchoMaximoRepDivisores/2 - repDivisor.anchoTotal/2 + acum * sepReps + repDivisor.anchoImagen * acum
                                            let yRepDivisor = inicio + Math.floor(i/repDivisor.limite) * repDivisor.altoImagen + Math.floor(i/repDivisor.limite) * sepReps
                                            
                                            symbol.appendChild(crearReferenciaAElemento(repDivisor.imagen, {
                                                x: xRepDivisor,
                                                y: yRepDivisor
                                            }))
                    
                                            if(acum === repDivisor.limite-1) {
                                                acum = 0
                                            } else {
                                                acum++
                                            }
                                        }
                                        inicio+=repDivisor.altoTotal+(indiceRepDiv+1)*10
                                    } else {
                                        for(let v = 0, yImg; v < repDivisor.vertical; v++) {
                                            yImg = inicio + v * repDivisor.altoImagen + v * sepReps
                                            for(let h = 0, xImg; h < repDivisor.horizontal; h++) {
                                                xImg = anchoMaximoRepDivisores/2 - repDivisor.anchoTotal/2 + h * repDivisor.anchoImagen + h * sepReps
                                                symbol.appendChild(crearReferenciaAElemento(repDivisor.imagen, {
                                                    x: xImg,
                                                    y: yImg
                                                }))
                    
                                            }
                                        }
                                        inicio+=repDivisor.altoTotal+(indiceRepDiv+1)*10
                                    }
                                })
                                defs.appendChild(symbol)
                                container.appendChild(crearReferenciaAElemento(`${container.id}-divisor-grupo-${index}`, {
                                    x: xDivisor + grupo.anchoDivisores/2 - anchoMaximoRepDivisores/2,
                                    y: yDivisor + grupo.altoDivisores/2 - altoTotalRepDivisores/2
                                }))
                            } else {
                                container.appendChild(crearReferenciaAElemento(`${container.id}-divisor-grupo-${index}`, {
                                    x: xDivisor + grupo.anchoDivisores/2 - anchoMaximoRepDivisores/2,
                                    y: yDivisor + grupo.altoDivisores/2 - altoTotalRepDivisores/2
                                }))
                            }
                        }
                    }
                }
                break
            case 'suma':
                if(grupo.descomposiciones.length > 0) {
                    let anchoTotalSuma = grupo.descomposiciones.reduce((total, rep) => total + rep.ancho, 0) + margenDivisores * (grupo.descomposiciones.length-1)
                    let divicionAnchoDescomposicion = anchoGrupos / (grupo.descomposiciones.length+1)
                    let xinicio = centro-anchoTotalSuma/2
                    grupo.descomposiciones.forEach((descomposicion, indexDesc) => {
                        let xDescomposicion = xinicio
                        let yDescomposicion = marginTop*2+altoGrupos
                        container.appendChild(crearElemento('rect', {
                            x: xDescomposicion,
                            y: yDescomposicion,
                            width: descomposicion.ancho,
                            height: descomposicion.alto,
                            fill: 'none',
                            stroke: descomposicion.borde[1],
                            strokeWidth: descomposicion.borde[0],
                            rx: '10',
                            ry: '10'
                        }))
                        container.appendChild(crearElemento('line', {
                            x1: xDescomposicion+descomposicion.ancho/2,
                            y1: yDescomposicion,
                            x2: xDividendo+divicionAnchoDescomposicion*(indexDesc+1),
                            y2: marginTop+altoGrupos,
                            stroke: descomposicion.borde[1],
                            strokeWidth: descomposicion.borde[0]
                        }))
                        if(descomposicion.texto) {
                            container.appendChild(crearElementoDeTexto({
                                x: xDescomposicion+descomposicion.ancho/2,
                                y: descomposicion.yTexto,
                                fontSize: descomposicion.altoTexto,
                                textAnchor: 'middle',
                                fill: '#363026',
                                style: 'font-family:Quicksand-Medium;'
                            }, descomposicion.texto))
                        }
                        let altoTotalRepDesc = descomposicion.repeticiones.reduce((total, rep) => total + rep.altoTotal, 0)
                        altoTotalRepDesc = altoTotalRepDesc + (descomposicion.repeticiones.length-1)*10
                        let inicio = yDescomposicion + descomposicion.alto/2 - altoTotalRepDesc/2
                        descomposicion.repeticiones.forEach((repDesc, indexRep) => {
                            if(repDesc.formaRep === 'izq/der') {
                                for(let i = 0, acum = 0; i < repDesc.cantidad; i++) {
                                    let xRepDivisor = xDescomposicion+descomposicion.ancho/2-repDesc.anchoTotal/2 + acum * sepReps + repDesc.anchoImagen * acum
                                    let yRepDivisor = inicio + Math.floor(i/repDesc.limite) * repDesc.altoImagen + Math.floor(i/repDesc.limite) * sepReps
                                    
                                    container.appendChild(crearReferenciaAElemento(repDesc.imagen, {
                                        x: xRepDivisor,
                                        y: yRepDivisor
                                    }))
            
                                    if(acum === repDesc.limite-1) {
                                        acum = 0
                                    } else {
                                        acum++
                                    }
                                }
                            } else {
                                for(let v = 0, yImg; v < repDesc.vertical; v++) {
                                    yImg = inicio + v * repDesc.altoImagen + v * sepReps
                                    for(let h = 0, xImg; h < repDesc.horizontal; h++) {
                                        xImg = xDescomposicion+descomposicion.ancho/2- repDesc.anchoTotal/2 + h * repDesc.anchoImagen + h * sepReps
                                        container.appendChild(crearReferenciaAElemento(repDesc.imagen, {
                                            x: xImg,
                                            y: yImg
                                        }))
                                    }
                                }
                                
                            }
                            inicio+=repDesc.altoTotal+(indexRep+1)*10
                        })
                        xinicio += descomposicion.ancho + margenDivisores
                    })
                }
                break
            default:
                console.log('esto es muy malo :c')
                break
        }
    })

    function getData(obj) {
        switch(obj.tipo) {
            case 'division':
                return {
                    tipo: obj.tipo,
                    divisor: Number(regexFunctions(regex(obj.divisor, vars, vt))),
                    marcarPrimero: obj.marcarPrimero === 'si' ? true : false,
                    titulo: regexFunctions(regex(obj.titulo, vars, vt)),
                    texto: regexFunctions(regex(obj.texto, vars, vt)),
                    yTexto: obj.yTexto,
                    altoTexto: obj.altoTexto,
                    textoDividendo: regexFunctions(regex(obj.textoDividendo, vars, vt)),
                    yTextoDividendo: obj.yTextoDividendo,
                    altoTextoDividendo: obj.altoTextoDividendo,
                    altoDivisores: Number(obj.altoDivisores),
                    anchoDivisores: Number(obj.anchoDivisores),
                    bordeDivisores: obj.bordeDivisores.split(','),
                    repDividendos: obj.repDividendos ? obj.repDividendos.map(x => {
                        let imagen = imagenes.find(q => q.id === x.imagen)
                        let anchoTotal, altoTotal
                        if(x.formaRep === 'izq/der') {
                            let cantidad = Number(regexFunctions(regex(x.cantidad,vars,vt)))
                            let limite = Number(regexFunctions(regex(x.limite, vars, vt)))
                            anchoTotal = cantidad < limite ?
                                imagen.width * cantidad + sepReps * (cantidad-1) :
                                imagen.width * limite + sepReps * (limite-1)
                            altoTotal = Math.ceil(cantidad/limite) * imagen.height + (Math.ceil(cantidad/limite)-1) * sepReps
                            return {
                                formaRep: x.formaRep,
                                imagen: x.imagen,
                                cantidad,
                                limite,
                                altoTotal,
                                anchoTotal,
                                altoImagen: imagen.height,
                                anchoImagen: imagen.width
                            }
                        } else {
                            let horizontal = Number(regexFunctions(regex(x.horizontal,vars,vt)))
                            let vertical = Number(regexFunctions(regex(x.vertical, vars, vt)))
                            anchoTotal = horizontal * imagen.width + (horizontal-1) * sepReps
                            altoTotal = vertical * imagen.height + (vertical-1) * sepReps
                            return {
                                formaRep: x.formaRep,
                                imagen: x.imagen,
                                horizontal,
                                vertical,
                                altoTotal,
                                anchoTotal,
                                altoImagen: imagen.height,
                                anchoImagen: imagen.width
                            }
                        }
                    }) : [],
                    repDivisores: obj.repDivisores ? obj.repDivisores.map(x => {
                        let imagen = imagenes.find(q => q.id === x.imagen)
                        let anchoTotal, altoTotal
                        if(x.formaRep === 'izq/der') {
                            let cantidad = Number(regexFunctions(regex(x.cantidad,vars,vt)))
                            let limite = Number(regexFunctions(regex(x.limite, vars, vt)))
                            anchoTotal = cantidad < limite ?
                                imagen.width * cantidad + sepReps * (cantidad-1) :
                                imagen.width * limite + sepReps * (limite-1)
                            altoTotal = Math.ceil(cantidad/limite) * imagen.height + (Math.ceil(cantidad/limite)-1) * sepReps
                            return {
                                formaRep: x.formaRep,
                                imagen: x.imagen,
                                cantidad,
                                limite,
                                altoTotal,
                                anchoTotal,
                                altoImagen: imagen.height,
                                anchoImagen: imagen.width
                            }
                        } else {
                            let horizontal = Number(regexFunctions(regex(x.horizontal,vars,vt)))
                            let vertical = Number(regexFunctions(regex(x.vertical, vars, vt)))
                            anchoTotal = horizontal * imagen.width + (horizontal-1) * sepReps
                            altoTotal = vertical * imagen.height + (vertical-1) * sepReps
                            return {
                                formaRep: x.formaRep,
                                imagen: x.imagen,
                                horizontal,
                                vertical,
                                altoTotal,
                                anchoTotal,
                                altoImagen: imagen.height,
                                anchoImagen: imagen.width
                            }
                        }
                    }) : []
                }
            case 'suma':
                return {
                    tipo: obj.tipo,
                    titulo: regexFunctions(regex(obj.titulo, vars, vt)),
                    texto: regexFunctions(regex(obj.texto, vars, vt)),
                    yTexto: obj.yTexto,
                    altoTexto: obj.altoTexto,
                    total: obj.total ? obj.total.map(x => {
                        let imagen = imagenes.find(q => q.id === x.imagen)
                        let anchoTotal, altoTotal
                        if(x.formaRep === 'izq/der') {
                            let cantidad = Number(regexFunctions(regex(x.cantidad,vars,vt)))
                            let limite = Number(regexFunctions(regex(x.limite, vars, vt)))
                            anchoTotal = cantidad < limite ?
                                imagen.width * cantidad + sepReps * (cantidad-1) :
                                imagen.width * limite + sepReps * (limite-1)
                            altoTotal = Math.ceil(cantidad/limite) * imagen.height + (Math.ceil(cantidad/limite)-1) * sepReps
                            return {
                                formaRep: x.formaRep,
                                imagen: x.imagen,
                                cantidad,
                                limite,
                                altoTotal,
                                anchoTotal,
                                altoImagen: imagen.height,
                                anchoImagen: imagen.width
                            }
                        } else {
                            let horizontal = Number(regexFunctions(regex(x.horizontal,vars,vt)))
                            let vertical = Number(regexFunctions(regex(x.vertical, vars, vt)))
                            anchoTotal = horizontal * imagen.width + (horizontal-1) * sepReps
                            altoTotal = vertical * imagen.height + (vertical-1) * sepReps
                            return {
                                formaRep: x.formaRep,
                                imagen: x.imagen,
                                horizontal,
                                vertical,
                                altoTotal,
                                anchoTotal,
                                altoImagen: imagen.height,
                                anchoImagen: imagen.width
                            }
                        }
                    }) : [],
                    descomposiciones: obj.descomposiciones ? obj.descomposiciones.map(x => {
                        return {
                            alto: Number(x.alto),
                            ancho: Number(x.ancho),
                            texto: regexFunctions(regex(x.texto, vars, vt)),
                            yTexto: x.yTexto,
                            altoTexto: x.altoTexto,
                            borde: x.borde.split(','),
                            repeticiones: x.repeticiones ? x.repeticiones.map(y => {
                                let imagen = imagenes.find(q => q.id === y.imagen)
                                let anchoTotal, altoTotal
                                if(y.formaRep === 'izq/der') {
                                    let cantidad = Number(regexFunctions(regex(y.cantidad,vars,vt)))
                                    let limite = Number(regexFunctions(regex(y.limite, vars, vt)))
                                    anchoTotal = cantidad < limite ?
                                        imagen.width * cantidad + sepReps * (cantidad-1) :
                                        imagen.width * limite + sepReps * (limite-1)
                                    altoTotal = Math.ceil(cantidad/limite) * imagen.height + (Math.ceil(cantidad/limite)-1) * sepReps
                                    return {
                                        formaRep: y.formaRep,
                                        imagen: y.imagen,
                                        cantidad,
                                        limite,
                                        altoTotal,
                                        anchoTotal,
                                        altoImagen: imagen.height,
                                        anchoImagen: imagen.width
                                    }
                                } else {
                                    let horizontal = Number(regexFunctions(regex(y.horizontal,vars,vt)))
                                    let vertical = Number(regexFunctions(regex(y.vertical, vars, vt)))
                                    anchoTotal = horizontal * imagen.width + (horizontal-1) * sepReps
                                    altoTotal = vertical * imagen.height + (vertical-1) * sepReps
                                    return {
                                        formaRep: y.formaRep,
                                        imagen: y.imagen,
                                        horizontal,
                                        vertical,
                                        altoTotal,
                                        anchoTotal,
                                        altoImagen: imagen.height,
                                        anchoImagen: imagen.width
                                    }
                                }
                            }) : []
                        }
                    }) : []
                }
        }
    }

    async function agregaImagen(img) {
        let src = convertirARutaRelativa(regexFunctions(regex(img.src, vars, vt)))
        let imgCargada = await cargaImagen(src)
        let height = Number(img.height)
        let width = height * imgCargada.width / imgCargada.height
        let id = src.split('/').pop().replace('.svg', '').replace('%20','-')
        defs.appendChild(crearElementoDeImagen(src,{id,height,width}))
        return {id,src,height,width}
    }

    function crearElementoDeImagen(src, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'image')
		element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src)
		for (let p in atributos) {
            element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
                return '-' + m.toLowerCase()
            }), atributos[p])
		}
		return element
    }
    
    function crearReferenciaAElemento(id, atributos) {
        let element = document.createElementNS('http://www.w3.org/2000/svg', 'use')
        element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${id}`)
        for (let p in atributos) {
            element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
                return '-' + m.toLowerCase()
            }), atributos[p])
        }
        return element
    }

	function crearElemento(nombre, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', nombre)
		for (let p in atributos) {
		  element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
			return '-' + m.toLowerCase()
		  }), atributos[p])
		}
		return element
	}

	function crearElementoDeTexto(atributos, texto) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'text')
		for (let p in atributos) {
		  element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
			return '-' + m.toLowerCase()
		  }), atributos[p])
		}
		let textNode = document.createTextNode(texto)
		element.appendChild(textNode)
		return element
    }
    
    function crearElementoSymbol(id, width, height) {
        let element = document.createElementNS('http://www.w3.org/2000/svg', 'symbol')
        element.setAttributeNS(null,'id', id)
        element.setAttributeNS(null,'width', width)
        element.setAttributeNS(null,'height', height)
        element.setAttributeNS(null,'viewBox', `0 0 ${width} ${height}`)
        return element
    }
}

async function sucesiones(config) {  
    const { container, params, variables, versions, vt } = config
    container.innerHTML = ''
    let vars = vt ? variables : versions
    let { 
        alto,ancho,grosorGrilla,colorGrilla,radioBorde,colorFondo,colorUnion,
        filas,columnas,inicio,patron,patronAbaj,ocultarYReemplazar,
        secuencias, flechas, llaves, imagenes, flechasMagicas
    } = params
    //conversion de variables
    let defs = crearElemento('defs', {})
	let styles = document.createElement('style')
	styles.innerHTML = '@font-face{font-family:"Quicksand-Medium";src:url("https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-3/fonts/Quicksand-Medium.ttf");}'
    defs.appendChild(styles)
    imagenes = imagenes ? await Promise.all(imagenes.map(x => getImagen(x))) : []
    container.appendChild(defs)

    alto = Number(alto)
    ancho = Number(ancho)
    filas = Number(regexFunctions(regex(filas, vars, vt)))
    columnas = Number(regexFunctions(regex(columnas, vars, vt)))
    inicio = Number(regexFunctions(regex(inicio, vars, vt)))
    patron = Number(regexFunctions(regex(patron, vars, vt)))
    patronAbaj = patronAbaj ? Number(regexFunctions(regex(patronAbaj, vars, vt))) : null
    grosorGrilla = Number(grosorGrilla)
    let terminosTotales = filas * columnas
    let fin = patronAbaj ? inicio + (patron * columnas) + (patronAbaj * filas) : inicio + (patron * (terminosTotales-1))
    let altoTotal = alto * (filas+2)
    let anchoTotal = ancho * (columnas+2)
    let diferenciaGrosor = grosorGrilla/2
    secuencias = secuencias ? secuencias.map(x => obtenerSecuencia(x)) : []
    flechas = flechas ? flechas.map(x => obtenerFlecha(x)) : []
    llaves = llaves ? llaves.map(x => obtenerLLave(x)) : []
    ocultarYReemplazar = ocultarYReemplazar ? obtenerReemplazos(ocultarYReemplazar) : []
    flechasMagicas = flechasMagicas ? flechasMagicas.map(x => getFlechasMagicas(x))  : []


    let altoSvg = altoTotal + (llaves.length > 0 ? 30 : 0)
    // diseño de la sucesion
    container.setAttributeNS(null, 'height', altoSvg)
	container.setAttributeNS(null, 'width', anchoTotal)
    container.setAttributeNS(null, 'viewBox', `0 0 ${anchoTotal} ${altoSvg}`)

    container.appendChild(crearElemento('rect', {
        x: ancho,
        y: alto,
        height: altoTotal - alto*2,
        width: anchoTotal - ancho*2,
        stroke: colorGrilla,
        strokeWidth: grosorGrilla,
        fill: colorFondo,
        rx: radioBorde,
        ry: radioBorde
    }))
    //dibuja las lineas de la tabla
    let grilla = crearElemento('g', {
        id: 'tabla',
        stroke: colorGrilla,
        strokeWidth: grosorGrilla
    })
    for(let colIterator = 0; colIterator < columnas-1; colIterator++) {
        grilla.appendChild(crearElemento('line', {
            x1: ancho+ancho*(colIterator+1)+diferenciaGrosor,
            y1: alto,
            x2: ancho+ancho*(colIterator+1)+diferenciaGrosor,
            y2: altoTotal-alto
        }))
    }
    for(let rowIterator = 0; rowIterator < filas-1; rowIterator++) {
        grilla.appendChild(crearElemento('line', {
            x1: ancho,
            y1: alto+alto*(rowIterator+1)+diferenciaGrosor,
            x2: anchoTotal-ancho,
            y2: alto+alto*(rowIterator+1)+diferenciaGrosor
        }))
    }
    container.appendChild(grilla)

    //dibuja numeros
    let numeros = crearElemento('g', {
        id:'numeros',
        fontSize: 20,
        textAnchor: 'middle',
        fill: '#363026'
    })
    let numerosSecuencia = []
    for(let iteradorNumero = 0, filaActual = 0, columnaActual = 0, valor = inicio; iteradorNumero < terminosTotales; iteradorNumero++) {
        if(iteradorNumero === 0) {
            dibujaNumero(valor, filaActual, columnaActual)
        } else {
            valor = (patronAbaj && columnaActual === 0 && filaActual > 0) ? inicio + (filaActual * patronAbaj) : valor + patron
            dibujaNumero(valor, filaActual, columnaActual)
        }
        for(let flecha of flechas) {
            let index = flecha.arreglo.indexOf(valor)
            if(index === 0) {
                flecha.filaValorAnterior = filaActual
                flecha.columnaValorAnterior = columnaActual
            } else if (index > 0) {
                if(flecha.filaValorAnterior == filaActual) { // no hay salto de fila
                    let xInicial = flecha.columnaValorAnterior * ancho + ancho * 1.5 + 5
                    let yInicial = flecha.filaValorAnterior * alto + alto * 1.5 - 12
                    let xFinal = columnaActual * ancho + ancho * 1.5 - 5
                    let yFinal = filaActual * alto + alto * 1.5 - 12
                    let puntoMedioX = xInicial + (xFinal - xInicial) /2
                    container.appendChild(crearElemento('path', {
                        d: `M ${xInicial} ${yInicial} C ${xInicial} ${yInicial}, ${puntoMedioX} ${yInicial - 25} , ${xFinal} ${yFinal}`,
                        stroke: flecha.color,
                        strokeWidth: '2',
                        fill: 'transparent'
                    }))
                    if(flecha.texto) {
                        numeros.appendChild(crearElementoDeTexto({
                            x: puntoMedioX,
                            y: yInicial - 13,
                            style: 'font-family:Quicksand-Medium;',
                            fontSize: 15,
                            textAnchor: 'middle',
                            fill: flecha.colorTexto
                        },  flecha.texto))
                    }
                    if(flecha.direccion === 'derecha') {
                        let pendiente = Math.atan((yFinal - yInicial + 25) / (xFinal - puntoMedioX))*180/Math.PI
                        let punta1Flecha = polarToCartesian(xFinal, yFinal, 8, pendiente+30)
                        let punta2Flecha = polarToCartesian(xFinal, yFinal, 8, pendiente-30)
                        container.appendChild(crearElemento('path', {
                            d: `M ${punta1Flecha.x} ${punta1Flecha.y } L ${xFinal} ${yFinal} L ${punta2Flecha.x} ${punta2Flecha.y}`,
                            stroke: flecha.color,
                            strokeWidth: '2',
                            fill: 'none'
                        }))
                    } else {
                        let pendiente = Math.atan((yInicial - 25 - yFinal) / (puntoMedioX - xInicial))*180/Math.PI
                        let punta1Flecha = polarToCartesian(xInicial, yInicial, 8, pendiente+210)
                        let punta2Flecha = polarToCartesian(xInicial, yInicial, 8, pendiente-210)
                        container.appendChild(crearElemento('path', {
                            d: `M ${punta1Flecha.x} ${punta1Flecha.y } L ${xInicial} ${yFinal} L ${punta2Flecha.x} ${punta2Flecha.y}`,
                            stroke: flecha.color,
                            strokeWidth: '2',
                            fill: 'none'
                        }))
                    }
                    
                } else { // hay salto de fila :c
                    let xInicial1 = flecha.columnaValorAnterior * ancho + ancho * 1.5 + 5
                    let yFlecha1 = flecha.filaValorAnterior * alto + alto * 1.5 - 12
                    let diferenciaEnColumnas = ((columnas-1) - flecha.columnaValorAnterior)+columnaActual+1
                    let xFinal1 = (flecha.columnaValorAnterior + diferenciaEnColumnas) * ancho + ancho * 1.5 - 5
                    let puntoMedioX1 = xInicial1 + (xFinal1 - xInicial1)/2
                    container.appendChild(crearElemento('path', {
                        d: `M ${xInicial1} ${yFlecha1} C ${xInicial1} ${yFlecha1}, ${puntoMedioX1} ${yFlecha1 - 25} , ${xFinal1} ${yFlecha1}`,
                        stroke: flecha.color,
                        strokeWidth: '2',
                        fill: 'transparent'
                    }))
                    let xInicial2 = (columnaActual - diferenciaEnColumnas) * ancho + ancho * 1.5 + 5
                    let yFlecha2 = filaActual * alto + alto * 1.5 - 12
                    let xFinal2 = columnaActual * ancho + ancho * 1.5 - 5
                    let puntoMedioX2 = xInicial2 + (xFinal2 - xInicial2)/2
                    container.appendChild(crearElemento('path', {
                        d: `M ${xInicial2} ${yFlecha2} C ${xInicial2} ${yFlecha2}, ${puntoMedioX2} ${yFlecha2 - 25} , ${xFinal2} ${yFlecha2}`,
                        stroke: flecha.color,
                        strokeWidth: '2',
                        fill: 'transparent'
                    }))

                    if(flecha.direccion === 'derecha') {
                        let pendiente = Math.atan((yFlecha2 - yFlecha2 + 25) / (xFinal2 - puntoMedioX2))*180/Math.PI
                        let punta1Flecha = polarToCartesian(xFinal2, yFlecha2, 8, pendiente+30)
                        let punta2Flecha = polarToCartesian(xFinal2, yFlecha2, 8, pendiente-30)
                        container.appendChild(crearElemento('path', {
                            d: `M ${punta1Flecha.x} ${punta1Flecha.y} L ${xFinal2} ${yFlecha2} L ${punta2Flecha.x} ${punta2Flecha.y}`,
                            stroke: flecha.color,
                            strokeWidth: '2',
                            fill: 'none'
                        }))
                    } else {
                        let pendiente = Math.atan((yFlecha1 - yFlecha1 + 25) / (xInicial1 - puntoMedioX1))*180/Math.PI
                        let punta1Flecha = polarToCartesian(xInicial1, yFlecha1, 8, pendiente+210)
                        let punta2Flecha = polarToCartesian(xInicial1, yFlecha1, 8, pendiente-210)
                        container.appendChild(crearElemento('path', {
                            d: `M ${punta1Flecha.x} ${punta1Flecha.y} L ${xInicial1} ${yFlecha1} L ${punta2Flecha.x} ${punta2Flecha.y}`,
                            stroke: flecha.color,
                            strokeWidth: '2',
                            fill: 'none'
                        }))
                    }
                    if(flecha.texto) {
                        numeros.appendChild(crearElementoDeTexto({
                            x: flecha.direccion === 'derecha' ? ancho - 10 : anchoTotal-ancho+10,
                            y: flecha.direccion === 'derecha' ? yFlecha2 - 13 : yFlecha1 - 13,
                            style: 'font-family:Quicksand-Medium;',
                            fontSize: 15,
                            textAnchor: 'middle',
                            fill: flecha.colorTexto
                        },  flecha.texto))
                    }
                }
                flecha.filaValorAnterior = filaActual
                flecha.columnaValorAnterior = columnaActual
            }
        }
        
        if(columnaActual == columnas-1) {
            columnaActual = 0
            filaActual++
        } else {
            columnaActual++
        }
        
    }
    console.log(numerosSecuencia)
    container.appendChild(numeros)

    flechasMagicas.forEach(flecha => {
        flecha.puntos.forEach(punto => {
            let inicio = numerosSecuencia.find(x => x.valor === punto.inicio)
            let fin = numerosSecuencia.find(x => x.valor === punto.fin)
            let direccion, x1, y1, x2, y2
            if(inicio.x === fin.x) { //direccion arriba o abajo
                direccion = inicio.y > fin.y ? 'arriba' : 'abajo'
                if(flecha.tipo === 'curva') {
                    x1 = inicio.x + (ancho/2 * punto.variacion) + 5 * punto.variacion
                    x2 = inicio.x + (ancho/2 * punto.variacion) + 5 * punto.variacion
                    y1 = inicio.y + (direccion === 'arriba' ? - 5 : 5)
                    y2 = fin.y + (direccion === 'arriba' ? 5 : -5)
                    dibujaFlechaArqueada(x1, y1, x2, y2, direccion, punto.variacion, flecha.colorFlecha, punto.texto, flecha.colorTexto)
                } else {
                    x1 = inicio.x
                    x2 = inicio.x
                    y1 = inicio.y + (direccion === 'arriba' ? - 15 : 15)
                    y2 = fin.y + (direccion === 'arriba' ? 15 : -15)
                    dibujarFlecha(x1, y1, x2, y2, direccion, flecha.colorFlecha)
                }
            } else if (inicio.y === fin.y) {//direccion izquierda o derecha
                direccion = inicio.x > fin.x ? 'izquierda' : 'derecha'
                if(flecha.tipo === 'curva') {
                    x1 = inicio.x + (direccion === 'derecha' ? 5 : -5)
                    x2 = fin.x + (direccion === 'derecha' ? -5 : 5)
                    y1 = inicio.y + (alto/2 * punto.variacion) + 5 * punto.variacion
                    y2 = fin.y + (alto/2 * punto.variacion) + 5 * punto.variacion
                    dibujaFlechaArqueada(x1, y1, x2, y2, direccion, punto.variacion, flecha.colorFlecha, punto.texto, flecha.colorTexto)
                } else {
                    x1 = inicio.x + (direccion === 'derecha' ? 15 : -15)
                    x2 = fin.x + (direccion === 'derecha' ? -15 : 15)
                    y1 = inicio.y
                    y2 = inicio.y
                    dibujarFlecha(x1, y1, x2, y2, direccion, flecha.colorFlecha)
                }
            }
        })
    })

    //dibuja llaves al final de secuencia
    llaves.forEach(llave => {
        let inicioX = ancho + ancho * (llave.colInicio - 1) + grosorGrilla/2
        let finX = ancho + ancho * llave.colFin + grosorGrilla/2
        let centro = (finX - inicioX) / 2 + inicioX
        let inicioY = altoTotal - alto + 10
        let radio = 10
        container.appendChild(crearElemento('path',{
            d: `M ${inicioX} ${inicioY}
                A ${radio} ${radio} 0 0 0 ${inicioX+radio} ${inicioY+radio}
                H ${centro-radio}
                A ${radio} ${radio} 0 0 1 ${centro} ${inicioY+radio*2}
                A ${radio} ${radio} 0 0 1 ${centro+radio} ${inicioY+radio}
                H ${finX-radio}
                A ${radio} ${radio} 0 0 0 ${finX} ${inicioY}`,
            fill: 'none',
            stroke: llave.color,
            strokeWidth: 2
        }))
        if(llave.texto) {
            container.appendChild(crearElementoDeTexto({
                fontSize: 20,
                textAnchor: 'middle',
                fill: llave.colorTexto,
                style: 'font-family:Quicksand-Medium;',
                x: centro,
                y: inicioY+radio*2+20
            }, llave.texto))
        }
    })

    function dibujaFlechaArqueada(x1, y1, x2, y2, direccion, variacion, colorFlecha, texto, colorTexto) {
        let horizontal = y1 === y2 ? true : false
        let puntoMedio = horizontal ? x1 + (x2 - x1) / 2 : y1 + (y2 - y1) / 2
        let puntoExterno = horizontal ? y1 + (30 * variacion) : x1 + (30 * variacion)
		container.appendChild(crearElemento('path', {
			d: `M ${x1} ${y1} C ${x1} ${y1}, ${horizontal ? puntoMedio : puntoExterno} ${horizontal ? puntoExterno : puntoMedio}, ${x2} ${y2}`,
			stroke: colorFlecha,
			strokeWidth: '2',
			fill: 'transparent'
		}))
		if(direccion === 'abajo') {
			let pendiente = Math.atan((y2 - puntoMedio) / (x2 - puntoExterno))*180/Math.PI
			let punta1Flecha = polarToCartesian(x2, y2, 8, pendiente - (variacion > 0 ? 140 : 40))
			let punta2Flecha = polarToCartesian(x2, y2, 8, pendiente + (variacion > 0 ? 140 : 40))
			container.appendChild(crearElemento('path', {
				d: `M ${punta1Flecha.x} ${punta1Flecha.y } L ${x2} ${y2} L ${punta2Flecha.x} ${punta2Flecha.y}`,
				stroke: colorFlecha,
				strokeWidth: '2',
				fill: 'none'
			}))
		} else if (direccion === 'arriba') {
            let pendiente = Math.atan((y1 - puntoMedio) / (x1 - puntoExterno))*180/Math.PI
			let punta1Flecha = polarToCartesian(x2, y2, 8, -pendiente - (variacion > 0 ? 140 : 40))
			let punta2Flecha = polarToCartesian(x2, y2, 8, -pendiente + (variacion > 0 ? 140 : 40))
			container.appendChild(crearElemento('path', {
				d: `M ${punta1Flecha.x} ${punta1Flecha.y } L ${x2} ${y2} L ${punta2Flecha.x} ${punta2Flecha.y}`,
				stroke: colorFlecha,
				strokeWidth: '2',
				fill: 'none'
			}))
        } else if (direccion === 'derecha') {
            let pendiente = Math.atan((y1 - puntoExterno) / (x1 - puntoMedio))*180/Math.PI
            let punta1Flecha = polarToCartesian(x2, y2, 8, -pendiente - 40)
			let punta2Flecha = polarToCartesian(x2, y2, 8, -pendiente + 40)
			container.appendChild(crearElemento('path', {
				d: `M ${punta1Flecha.x} ${punta1Flecha.y } L ${x2} ${y2} L ${punta2Flecha.x} ${punta2Flecha.y}`,
				stroke: colorFlecha,
				strokeWidth: '2',
				fill: 'none'
			}))
        } else if (direccion === 'izquierda') { //izquierda
            let pendiente = Math.atan((y2 - puntoExterno) / (x2 - puntoMedio))*180/Math.PI
            let punta1Flecha = polarToCartesian(x2, y2, 8, pendiente - 140)
			let punta2Flecha = polarToCartesian(x2, y2, 8, pendiente + 140)
			container.appendChild(crearElemento('path', {
				d: `M ${punta1Flecha.x} ${punta1Flecha.y } L ${x2} ${y2} L ${punta2Flecha.x} ${punta2Flecha.y}`,
				stroke: colorFlecha,
				strokeWidth: '2',
				fill: 'none'
			}))
        }
        if(texto) {
            container.appendChild(crearElementoDeTexto({
                x: horizontal ? puntoMedio + (5 * variacion) : puntoExterno + (5 * variacion),
                y: horizontal ? puntoExterno + 8 : puntoMedio + 8,
                fontSize: 20,
                textAnchor: 'middle',
                fill: colorTexto,
                style: 'font-family:Quicksand-Medium;'
            }, texto))
        }
    }
    
    function dibujarFlecha(x1, y1, x2, y2, direccion, colorFlecha) {
        let linea1x, linea1y, linea2x, linea2y
        if (direccion === 'abajo') {
            linea1x = x2 - 7
            linea1y = y2 - 10
            linea2x = x2 + 7
            linea2y = y2 - 10
        } else if (direccion === 'arriba') {
            linea1x = x2 - 7
            linea1y = y2 + 10
            linea2x = x2 + 7
            linea2y = y2 + 10
        } else if (direccion === 'derecha') {
            linea1x = x2 - 10
            linea1y = y2 - 7
            linea2x = x2 - 10
            linea2y = y2 + 7
        } else if (direccion === 'izquierda') {
            linea1x = x2 + 10
            linea1y = y2 - 7
            linea2x = x2 + 10
            linea2y = y2 + 7
        }
        container.appendChild(crearElemento('path', {
            d: `M ${x1} ${y1} L ${x2} ${y2} 
                M ${linea1x} ${linea1y} L ${x2} ${y2} L ${linea2x} ${linea2y}`,
            stroke: colorFlecha,
            strokeWidth: '3',
            strokeLinecap: 'round',
            fill: 'none',
        }))
    }

    function getFlechasMagicas(flecha) {
        return {
            puntos: flecha.tipo === 'curva' ? regexFunctions(regex(flecha.puntos, vars, vt)).split(';').map(x => ({
                inicio: Number(x.split(',')[0]),
                fin: Number(x.split(',')[1]),
                variacion: Number(x.split(',')[2]),
                texto: x.split(',')[3]
            })) : regexFunctions(regex(flecha.puntos, vars, vt)).split(';').map(x => ({
                inicio: Number(x.split(',')[0]),
                fin: Number(x.split(',')[1])
            })),
            tipo: flecha.tipo,
            colorFlecha: flecha.colorFlecha,
            colorTexto: flecha.colorTexto
        }
    }

    function dibujaNumero(valor, fila, columna) {
        let match = 0, color
        for(let secuencia of secuencias) {
            if(secuencia.arreglo[valor]) {
                color = secuencia.arreglo[valor]
                match++
            }
        }
        if(match > 0) {
            color = match === 1 ? color : colorUnion
            let modificacorX, modificadorY, modificadorWidth = 0, modificadorHeight = 0
            if(columna === 0) {
                modificacorX = diferenciaGrosor
            } else {
                modificacorX = grosorGrilla
            }
            if(fila === 0) {
                modificadorY = diferenciaGrosor
            } else {
                modificadorY = grosorGrilla
            }
            if(columna === (columnas-1)) {
                modificadorWidth = diferenciaGrosor
            }
            if(fila === (filas-1)) {
                modificadorHeight = diferenciaGrosor
            }
            container.appendChild(crearElemento('rect', {
                x: ancho + ancho * columna + modificacorX,
                y: alto + fila * alto + modificadorY,
                width: ancho - modificacorX - modificadorWidth,
                height: alto - modificadorY - modificadorHeight,
                fill: color,
                rx: radioBorde,
                ry: radioBorde
            }))
        }
        imagenes.forEach(imagen => {
            let indexImagen = imagen.posiciones.indexOf(valor)
            if(indexImagen >= 0) {
                container.appendChild(crearReferenciaAElemento(imagen.id, {
                    x: ancho * 1.5 + columna * ancho - imagen.ancho/2,
                    y: alto * 1.5 + fila * alto - imagen.alto/2
                }))
            }
        })
        let index = ocultarYReemplazar.map(x => x.numero).indexOf(valor)
        numerosSecuencia.push({ 
            x: columna * ancho + ancho * 1.5,
            y: fila * alto + alto * 1.5,
            valor 
        })
        if(index >= 0 ) {
            numeros.appendChild(crearElementoDeTexto({
                x: ancho + columna * ancho + (ancho/2),
                y: alto + fila * alto + (alto/2) + 8,
                style: 'font-family:Quicksand-Medium;'
            }, ocultarYReemplazar[index].reemplazo || '' ))
        } else {
            numeros.appendChild(crearElementoDeTexto({
                x: ancho + columna * ancho + (ancho/2),
                y: alto + fila * alto + (alto/2) + 8,
                style: 'font-family:Quicksand-Medium;'
            }, valor.toString()))
        }
        
    }

    function obtenerSecuencia(secuencia) {
        let inicio = Number(regexFunctions(regex(secuencia.inicio, vars, vt)))
        let patron = Number(regexFunctions(regex(secuencia.patron, vars, vt)))
        let terminos = secuencia.terminos === 'todos' ? 'todos' : Number(regexFunctions(regex(secuencia.terminos, vars, vt)))
        let arreglo = {}
        if(terminos === 'todos') {
            let numero = inicio
            while(numero <= fin) {
                arreglo[numero.toString()] = secuencia.color
                numero+=patron
            }
        } else {
            for(let i = 0, numero = inicio; i < terminos; i++) {
                arreglo[numero.toString()] = secuencia.color
                numero+=patron
            }
        }
        return {
            inicio,
            patron,
            terminos,
            arreglo,
            color: secuencia.color
        }
    }

    function obtenerFlecha(flecha) {
        let inicio = Number(regexFunctions(regex(flecha.inicio, vars, vt)))
        let patron = Number(regexFunctions(regex(flecha.patron, vars, vt)))
        let terminos = flecha.terminos === 'todos' ? 'todos' : Number(regexFunctions(regex(flecha.terminos, vars, vt)))
        let texto = regexFunctions(regex(flecha.texto, vars, vt))
        let arreglo = []
        arreglo.push(inicio)
        if(terminos === 'todos') {
            let numero = inicio
            while(numero <= fin) {
                numero+=patron
                arreglo.push(numero)
            }
        } else {
            for(let i = 0, numero = inicio; i < terminos; i++) {
                numero+=patron
                arreglo.push(numero)
            }
        }
        return {
            inicio,
            patron,
            terminos,
            arreglo,
            direccion: flecha.direccion,
            color: flecha.color,
            texto,
            colorTexto: flecha.colorTexto
        }
    }

    function obtenerReemplazos(valor) {
        if(valor.length > 0) {
            let valoresReemplazados = regexFunctions(regex(ocultarYReemplazar, vars, vt))
            let splitPuntoYComa = valoresReemplazados.split(';')
            let splitComa = splitPuntoYComa.map(x => ({
                numero: Number(x.split(',')[0]),
                reemplazo: x.split(',')[1]
            }))
            return splitComa
        } else {
            return []
        }
    }

    function obtenerLLave(llave) {
        return {
            colInicio: Number(regexFunctions(regex(llave.colInicio, vars, vt))),
            colFin: Number(regexFunctions(regex(llave.colFin, vars, vt))),
            color: llave.color,
            texto: regexFunctions(regex(llave.texto, vars, vt)),
            colorTexto: llave.colorTexto
        }
    }

    async function getImagen(imagen) {
		let src = regexFunctions(regex(imagen.src, vars, vt)).replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../')
        let imagenCargada = await cargaImagen(src)
        let alto = Number(imagen.alto)
        let ancho = alto * imagenCargada.width / imagenCargada.height
        let id = container.id + '-' + src.split('/').pop().replace('.svg','').replace(/%20/g,'-')
        defs.appendChild(crearElementoDeImagen(src,{id,height:alto,width:ancho}))
        let posiciones = regexFunctions(regex(imagen.posiciones, vars, vt)).split(',').map(x => Number(x))
		return {
			id,
            src,
            alto,
            ancho,
            posiciones
        }
    }

    function polarToCartesian(centerX, centerY, radius, angleInDegrees) { // 0 grados = 9 hrs
		let angleInRadians = (angleInDegrees-180) * Math.PI / 180.0;
		
		return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		}
	}
    
	function crearElemento(nombre, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', nombre)
		for (let p in atributos) {
		  element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
			return '-' + m.toLowerCase()
		  }), atributos[p])
		}
		return element
	}

	function crearElementoDeTexto(atributos, texto) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'text')
		for (let p in atributos) {
		  element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
			return '-' + m.toLowerCase()
		  }), atributos[p])
		}
		let textNode = document.createTextNode(texto)
		element.appendChild(textNode)
		return element
    }

    function crearElementoDeImagen(src, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'image')
		element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	function crearReferenciaAElemento(id, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'use')
		element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${id}`)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}
}

async function tablaSecuencia(config) {
	const { container, params, variables, versions, vt } = config
	let vars = vt ? variables : versions
	let {
		tipo,
		alto,
		ancho,
		altoEncabezado,
		altoPie,
		colorTabla,
		imagenes,
		terminos,
		flechas
	} = params
	container.innerHTML = ''
	let defs = crearElemento('defs', {})
	let styles = document.createElement('style')
	styles.innerHTML = '@font-face{font-family:"Quicksand";src:url("../../../../fonts/Quicksand-Medium.ttf");}'
	defs.appendChild(styles)

	altoEncabezado = Number(altoEncabezado)
	altoPie = Number(altoPie)

	imagenes = imagenes ? await Promise.all(imagenes.map(i => agregaImagen(i))) : []

	terminos = terminos ? terminos.map(x => obtenerTermino(x)) : []

	flechas = flechas ? flechas.map(x => obtenerFlecha(x)) : []

	let separacionElementos = 20
	alto = Number(alto)
	ancho = Number(ancho)
	let altoTotal = alto
	let anchoTotal = ancho * terminos.length

	container.setAttributeNS(null, 'height', altoTotal)
	container.setAttributeNS(null, 'width', anchoTotal)
	container.setAttributeNS(null, 'viewBox', `0 0 ${anchoTotal} ${altoTotal}`)

	container.appendChild(defs)

	if (tipo === 'tabla') {
		container.appendChild(crearElemento('rect', {
			x: 1,
			y: 1,
			height: altoTotal - altoPie - 2,
			width: anchoTotal - 2,
			fill: 'none',
			stroke: colorTabla,
			strokeWidth: '2'
		}))

		container.appendChild(crearElemento('line', {
			x1: 0,
			y1: altoEncabezado,
			x2: anchoTotal,
			y2: altoEncabezado,
			stroke: colorTabla,
			strokeWidth: '2'
		}))

		for (let i = 0; i < terminos.length - 1; i++) {
			container.appendChild(crearElemento('line', {
				x1: (i + 1) * ancho,
				y1: 0,
				x2: (i + 1) * ancho,
				y2: altoTotal - altoPie,
				stroke: colorTabla,
				strokeWidth: '2'
			}))
		}
	} else {
		for (let i = 0; i < terminos.length; i++) {
			container.appendChild(crearElemento('rect', {
				x: i * ancho + separacionElementos / 2 + 1,
				y: altoEncabezado,
				width: ancho - separacionElementos,
				height: alto - altoEncabezado - altoPie - 2,
				fill: 'none',
				stroke: colorTabla,
				strokeWidth: '2',
				rx: '5',
				ry: '5'
			}))
		}
	}

	terminos.forEach((termino, index) => {
		//agrega titulo al termino
		container.appendChild(crearElementoDeTexto({
			x: index * ancho + ancho / 2,
			y: altoEncabezado / 2 + 10,
			fontSize: 20,
			textAnchor: 'middle',
			fill: '#363026',
			style: 'font-family:Quicksand;'
		}, termino.titulo))
		//calculos previos
		let altoTotalRepeticion = termino.repeticiones.filter(x => x.formaRepeticion !== 'texto').reduce((total, rep) => total + rep.altoTotal, 0)
		altoTotalRepeticion += separacionElementos * (termino.repeticiones.filter(x => x.formaRepeticion !== 'texto').length - 1)
		let centroColumna = index * ancho + ancho / 2
		let yStart = altoEncabezado + (alto - altoEncabezado - altoPie) / 2 - altoTotalRepeticion / 2
		//repeticion de imagenes
		termino.repeticiones.forEach((repeticion, indexRepeticion) => {
			switch (repeticion.formaRepeticion) {
				case 'izq/der':
					repeticionIzqDer(repeticion, centroColumna, yStart)
					break
				case 'diagonal':
					repeticionDiagonal(repeticion, centroColumna, yStart)
					break
				case 'rectangular':
					repeticionRectangular(repeticion, centroColumna, yStart)
					break
				case 'texto':
					container.appendChild(crearElementoDeTexto({
						x: centroColumna,
						y: repeticion.posicionY,
						fontSize: repeticion.alto,
						textAnchor: 'middle',
						fill: repeticion.color,
						style: 'font-family:Quicksand;'
					}, repeticion.texto))
					break
				default:
					console.log('no soportado')
					break
			}
			yStart += repeticion.formaRepeticion !== 'texto' ?
				repeticion.altoTotal + separacionElementos : 0
		})
	})

	flechas.forEach(flecha => {
		const { inicio, fin, colorFlecha, texto, colorTexto, direccion } = flecha
		let yFlecha = alto - altoPie + 5
		let puntoMedioX = inicio + (fin - inicio) / 2
		let yPuntoAltoFlecha = yFlecha + altoPie / 2
		container.appendChild(crearElemento('path', {
			d: `M ${inicio} ${yFlecha} C ${inicio} ${yFlecha}, ${puntoMedioX} ${yPuntoAltoFlecha} , ${fin} ${yFlecha}`,
			stroke: colorFlecha,
			strokeWidth: '2',
			fill: 'transparent'
		}))

		if (texto) {
			container.appendChild(crearElementoDeTexto({
				x: puntoMedioX,
				y: yPuntoAltoFlecha + 10,
				fontSize: 20,
				textAnchor: 'middle',
				fill: colorTexto,
				style: 'font-family:Quicksand;'
			}, texto))
		}

		if (direccion === 'derecha') {
			let pendiente = Math.atan((yPuntoAltoFlecha - yFlecha) / (puntoMedioX - fin)) * 180 / Math.PI
			let punta1Flecha = polarToCartesian(fin, yFlecha, 8, pendiente + 30)
			let punta2Flecha = polarToCartesian(fin, yFlecha, 8, pendiente - 30)
			container.appendChild(crearElemento('path', {
				d: `M ${punta1Flecha.x} ${punta1Flecha.y} L ${fin} ${yFlecha} L ${punta2Flecha.x} ${punta2Flecha.y}`,
				stroke: colorFlecha,
				strokeWidth: '2',
				fill: 'none'
			}))
		} else {
			let pendiente = Math.atan((yPuntoAltoFlecha - yFlecha) / (puntoMedioX - inicio)) * 180 / Math.PI
			let punta1Flecha = polarToCartesian(inicio, yFlecha, 8, pendiente + 210)
			let punta2Flecha = polarToCartesian(inicio, yFlecha, 8, pendiente - 210)
			container.appendChild(crearElemento('path', {
				d: `M ${punta1Flecha.x} ${punta1Flecha.y} L ${inicio} ${yFlecha} L ${punta2Flecha.x} ${punta2Flecha.y}`,
				stroke: colorFlecha,
				strokeWidth: '2',
				fill: 'none'
			}))
		}
	})

	function repeticionIzqDer(repeticion, centroHorizontal, inicioRepeticionVertical) {
		const { anchoTotal, limiteHorizontal, separacionX, separacionY, imagen, cantidad } = repeticion
		for (let i = 0, acum = 0; i < cantidad; i++) {
			let xRepeticion = centroHorizontal - anchoTotal / 2 + acum * separacionX + imagen.width * acum
			let yRepeticion = inicioRepeticionVertical + Math.floor(i / limiteHorizontal) * imagen.height + Math.floor(i / limiteHorizontal) * separacionY
			container.appendChild(crearReferenciaAElemento(imagen.id, {
				x: xRepeticion,
				y: yRepeticion
			}))
			if (acum === limiteHorizontal - 1) {
				acum = 0
			} else {
				acum++
			}
		}
	}

	function repeticionDiagonal(repeticion, centroHorizontal, inicioRepeticionVertical) {
		const { imagen, cantidad, separacionX, separacionY, anchoTotal } = repeticion
		for (let i = 0; i < cantidad; i++) {
			let xRepeticion = centroHorizontal - anchoTotal / 2 + i * separacionX
			let yRepeticion = inicioRepeticionVertical + i * separacionY
			container.appendChild(crearReferenciaAElemento(imagen.id, {
				x: xRepeticion,
				y: yRepeticion
			}))
		}
	}

	function repeticionRectangular(repeticion, centroHorizontal, inicioRepeticionVertical) {
		const { imagen, separacionX, separacionY, repeticionesX, repeticionesY, anchoTotal } = repeticion
		for (let v = 0, yRepeticion; v < repeticionesY; v++) {
			yRepeticion = inicioRepeticionVertical + v * imagen.height + v * separacionY
			for (let h = 0, xRepeticion; h < repeticionesX; h++) {
				xRepeticion = centroHorizontal - anchoTotal / 2 + h * imagen.width + h * separacionX
				container.appendChild(crearReferenciaAElemento(imagen.id, {
					x: xRepeticion,
					y: yRepeticion
				}))
			}
		}
	}

	async function agregaImagen(img) {
		let src = regexFunctions(regex(img.src, vars, vt))
		src = src.replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../')
		let imgCargada = await cargaImagen(src)
		let height = Number(img.alto)
		let width = height * imgCargada.width / imgCargada.height
		let id = src.split('/').pop().replace('.svg', '').replace(/%20/g, '-')
		defs.appendChild(crearElementoDeImagen(src, { id: `${container.id}-${id}`, height, width }))
		return { id: `${container.id}-${id}`, src, height, width }
	}

	function obtenerTermino(termino) {
		return {
			titulo: regexFunctions(regex(termino.titulo, vars, vt)),
			repeticiones: termino.repeticiones ? termino.repeticiones.filter(x => {
				console.log(x.formaRepeticion)
				switch (x.formaRepeticion) {
					case 'izq/der':
						return Number(regexFunctions(regex(x.cantidad, vars, vt))) > 0
					case 'rectangular':
						return Number(regexFunctions(regex(x.repeticionesX, vars, vt))) > 0 && Number(regexFunctions(regex(x.repeticionesY, vars, vt))) > 0
					case 'diagonal':
						return Number(regexFunctions(regex(x.cantidad, vars, vt))) > 0
					case 'texto':
						return true
					default:
						return false
				}
			}).map(x => {
				let idImagen = x.imagen ? regexFunctions(regex(x.imagen, vars, vt)) : ''
				let imagen = x.formaRepeticion !== 'texto' ? imagenes.find(z => z.id === `${container.id}-${idImagen}`) : null
				let anchoTotal, altoTotal, cantidad, separacionX, separacionY, repeticionesX, repeticionesY, limiteHorizontal
				switch (x.formaRepeticion) {
					case 'izq/der':
						cantidad = Number(regexFunctions(regex(x.cantidad, vars, vt)))
						separacionX = Number(x.separacionX)
						separacionY = Number(x.separacionY)
						limiteHorizontal = Number(regexFunctions(regex(x.limiteHorizontal, vars, vt)))
						anchoTotal = cantidad < limiteHorizontal ?
							cantidad * imagen.width + (cantidad - 1) * separacionX :
							limiteHorizontal * imagen.width + (limiteHorizontal - 1) * separacionX
						altoTotal = Math.ceil(cantidad / limiteHorizontal) * imagen.height + (Math.ceil(cantidad / limiteHorizontal) - 1) * separacionY
						return {
							imagen,
							formaRepeticion: x.formaRepeticion,
							cantidad,
							separacionX,
							separacionY,
							limiteHorizontal,
							anchoTotal,
							altoTotal
						}
					case 'diagonal':
						cantidad = Number(regexFunctions(regex(x.cantidad, vars, vt)))
						separacionX = Number(x.separacionX)
						separacionY = Number(x.separacionY)
						anchoTotal = imagen.width + (cantidad - 1) * separacionX
						altoTotal = imagen.height + (cantidad - 1) * separacionY
						return {
							imagen,
							formaRepeticion: x.formaRepeticion,
							cantidad,
							separacionX,
							separacionY,
							anchoTotal,
							altoTotal
						}
					case 'rectangular':
						repeticionesX = Number(regexFunctions(regex(x.repeticionesX, vars, vt)))
						repeticionesY = Number(regexFunctions(regex(x.repeticionesY, vars, vt)))
						separacionX = Number(x.separacionX)
						separacionY = Number(x.separacionY)
						anchoTotal = imagen.width * repeticionesX + separacionX * (repeticionesX - 1)
						altoTotal = imagen.height * repeticionesY + separacionY * (repeticionesY - 1)
						return {
							imagen,
							formaRepeticion: x.formaRepeticion,
							separacionX,
							separacionY,
							repeticionesX,
							repeticionesY,
							anchoTotal,
							altoTotal
						}
					case 'texto':
						return {
							texto: regexFunctions(regex(x.texto, vars, vt)),
							formaRepeticion: x.formaRepeticion,
							color: x.color,
							alto: Number(x.alto),
							posicionY: Number(x.posicionY)
						}
				}
			}) : []
		}
	}

	function obtenerFlecha(flecha) {
		return {
			inicio: Number(flecha.inicio) * ancho - (ancho / 3) * 1,
			fin: Number(flecha.fin) * ancho - (ancho / 3) * 2,
			colorFlecha: flecha.colorFlecha,
			direccion: flecha.direccion,
			texto: regexFunctions(regex(flecha.texto, vars, vt)),
			colorTexto: flecha.colorTexto
		}
	}

	function polarToCartesian(centerX, centerY, radius, angleInDegrees) { // 0 grados = 9 hrs
		let angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;

		return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		}
	}

	function crearElementoDeImagen(src, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'image')
		element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	function crearElemento(nombre, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', nombre)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	function crearElementoDeTexto(atributos, texto) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'text')
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		let textNode = document.createTextNode(texto)
		element.appendChild(textNode)
		return element
	}

	function crearReferenciaAElemento(id, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'use')
		element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${id}`)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}
}

async function diagramaBarra (config){
    const { container, params, variables, versions, vt } = config;
    //container.innerHTML = ''
    //container.style.border = '1px solid #000'
    let {
        alto,
        ancho,
        separacionEntreBarras,
        colorBordes,
        grosorBordes,
        barras,
        marcas,
        operaciones,
        textos,
        imagenes
    } = params
    //trata de variables
    let vars = vt ? variables : versions
    let altoSVG = Number(alto)
    let anchoSVG = Number(ancho)
    separacionEntreBarras = Number(separacionEntreBarras)
    let altoBarra = 50
    let fontSize = 18
    grosorBordes = Number(grosorBordes)
    let anchoBarra = anchoSVG * 0.95

    //estructura basica
    let defs = crearElemento('defs', {})
	let styles = document.createElement('style')
	styles.innerHTML = '@font-face{font-family:"Quicksand";src:url("../../../../fonts/Quicksand-Medium.ttf");}'
    defs.appendChild(styles)
    container.appendChild(defs)

    //tamano de la imagen
    container.setAttributeNS(null, 'height', altoSVG)
	container.setAttributeNS(null, 'width', anchoSVG)
    container.setAttributeNS(null, 'viewBox', `0 0 ${anchoSVG} ${altoSVG}`)
    
    imagenes = imagenes ? await Promise.all(imagenes.map(x => getImagen(x))) : []
    textos = textos ? textos.map(x => getTexto(x)) : []
    operaciones = operaciones ? operaciones.map(x => getOperacion(x)) : []
    marcas = marcas ? marcas.map(x => getMarca(x)) : []
    barras = barras ? barras.map((x,i) => getBarra(x,i+1)) : []
    let yInicioBarras = altoSVG/2 - (barras.length*altoBarra)/2 - (((barras.length-1)*separacionEntreBarras)/2) - (barras.filter(x => x.conOperacion).length*altoBarra)/2 - (((barras.filter(x => x.conOperacion).length)*separacionEntreBarras)/2)

    let posicionDivisiones = []

    barras.forEach((barra, indexBarra) => {
        let yEsquinaSuperiorIzquierdaDivision = yInicioBarras + (indexBarra * altoBarra) + (indexBarra * separacionEntreBarras) +
            (barra.conOperacion ? altoBarra + separacionEntreBarras : 0) + barras.slice(0, indexBarra).filter(x => x.conOperacion).length * (altoBarra + separacionEntreBarras)
        let grupoBarra = crearElemento('g', {
            id: `${container.id}-barra-${indexBarra+1}`,
            stroke: colorBordes,
            strokeWidth: grosorBordes
        })
        posicionDivisiones[indexBarra] = []
        let { divisiones, divisionesPunteadas } = barra.detalle
        switch(barra.tipo) {
            case 'equitativa':
                let { color, dividendo } = barra.detalle
                if(divisiones) {
                    let anchoDivisionBarra = anchoBarra / divisiones
                    if(divisiones > 0) {
                        for(let indexDivision = 0; indexDivision < divisiones; indexDivision++) {
                            let xEsquinaSuperiorIzquierdaDivision = anchoSVG/2 - anchoBarra/2 + indexDivision * anchoDivisionBarra
                            let delinear = {
                                arriba: divisionesPunteadas.indexOf(indexDivision+1)>-1,
                                abajo: divisionesPunteadas.indexOf(indexDivision+1)>-1,
                                izquierda: divisionesPunteadas.indexOf(indexDivision+1)>-1 && indexDivision == 0,
                                derecha: divisionesPunteadas.indexOf(indexDivision+1)>-1 && (indexDivision+1 == divisiones),
                            }
                            posicionDivisiones[indexBarra][indexDivision] = {
                                inicio: xEsquinaSuperiorIzquierdaDivision,
                                fin: xEsquinaSuperiorIzquierdaDivision+anchoDivisionBarra
                            }
                            dibujaDivisionBarra(grupoBarra, xEsquinaSuperiorIzquierdaDivision, yEsquinaSuperiorIzquierdaDivision, anchoDivisionBarra, delinear, indexBarra, indexDivision, color.length > 1 ? color[indexDivision] : color[0])
                        }
                    } else {
                        grupoBarra.appendChild(crearElemento('rect', {
                            x: anchoSVG/2 - anchoBarra/2,
                            y: yEsquinaSuperiorIzquierdaDivision,
                            width: anchoBarra,
                            height: altoBarra,
                            fill: color[0]
                        }))
                        posicionDivisiones[indexBarra][0] = {
                            inicio: anchoSVG/2 - anchoBarra/2,
                            fin: anchoSVG/2 - anchoBarra/2 + anchoBarra
                        }
                    }
                    container.appendChild(grupoBarra)
                } else if (dividendo) {
                    let cociente = barra.total / dividendo
                    if(Number.isInteger(cociente)) {
                        let anchoDivisionBarra = anchoBarra / cociente
                        for(let indexDivision = 0; indexDivision < cociente; indexDivision++) {
                            let xEsquinaSuperiorIzquierdaDivision = anchoSVG/2 - anchoBarra/2 + indexDivision * anchoDivisionBarra
                            let delinear = {
                                arriba: divisionesPunteadas.indexOf(indexDivision+1)>-1,
                                abajo: divisionesPunteadas.indexOf(indexDivision+1)>-1,
                                izquierda: divisionesPunteadas.indexOf(indexDivision+1)>-1 && indexDivision == 0,
                                derecha: divisionesPunteadas.indexOf(indexDivision+1)>-1 && (indexDivision+1 == cociente),
                            }
                            posicionDivisiones[indexBarra][indexDivision] = {
                                inicio: xEsquinaSuperiorIzquierdaDivision,
                                fin: xEsquinaSuperiorIzquierdaDivision+anchoDivisionBarra
                            }
                            dibujaDivisionBarra(grupoBarra, xEsquinaSuperiorIzquierdaDivision, yEsquinaSuperiorIzquierdaDivision, anchoDivisionBarra, delinear, indexBarra, indexDivision, color.length > 1 ? color[indexDivision] : color[0])
                        }
                    } else {
                        divisiones = Math.trunc(cociente)
                        let valorTotalDivisiones = divisiones * dividendo
                        let anchoTotalDivisiones = valorTotalDivisiones * anchoBarra / barra.total
                        let anchoDivisionBarra = anchoTotalDivisiones / divisiones
                        for(let indexDivision = 0; indexDivision < divisiones; indexDivision++) {
                            let xEsquinaSuperiorIzquierdaDivision = anchoSVG/2 - anchoBarra/2 + indexDivision * anchoDivisionBarra
                            let delinear = {
                                arriba: divisionesPunteadas.indexOf(indexDivision+1)>-1,
                                abajo: divisionesPunteadas.indexOf(indexDivision+1)>-1,
                                izquierda: divisionesPunteadas.indexOf(indexDivision+1)>-1 && indexDivision == 0,
                                derecha: divisionesPunteadas.indexOf(indexDivision+1)>-1 && (indexDivision+1 == divisiones),
                            }
                            posicionDivisiones[indexBarra][indexDivision] = {
                                inicio: xEsquinaSuperiorIzquierdaDivision,
                                fin: xEsquinaSuperiorIzquierdaDivision+anchoDivisionBarra
                            }
                            dibujaDivisionBarra(grupoBarra, xEsquinaSuperiorIzquierdaDivision, yEsquinaSuperiorIzquierdaDivision, anchoDivisionBarra, delinear, indexBarra, indexDivision, color.length > 1 ? color[indexDivision] : color[0])
                        }
                        let resto = barra.total % dividendo
                        let anchoTotalResto = resto * anchoBarra / barra.total
                        let xEsquinaSuperiorIzquierdaDivision = anchoSVG/2 - anchoBarra/2 + divisiones * anchoDivisionBarra
                        let delinear = {
                            arriba: divisionesPunteadas.indexOf(divisiones+1)>-1,
                            abajo: divisionesPunteadas.indexOf(divisiones+1)>-1,
                            izquierda: false,
                            derecha: divisionesPunteadas.indexOf(divisiones+1)>-1,
                        }
                        posicionDivisiones[indexBarra][divisiones] = {
                            inicio: xEsquinaSuperiorIzquierdaDivision,
                            fin: xEsquinaSuperiorIzquierdaDivision+anchoTotalResto
                        }
                        dibujaDivisionBarra(grupoBarra, xEsquinaSuperiorIzquierdaDivision, yEsquinaSuperiorIzquierdaDivision, anchoTotalResto, delinear, indexBarra, divisiones+1, color.length > 1 ? color[divisiones] : color[0])
                    }
                    container.appendChild(grupoBarra)
                }
                break
            case 'proporcional':
                let acum = anchoSVG/2 - anchoBarra/2
                divisiones.forEach((division, indexDivision) => {
                    let anchoDivisionBarra = division.cantidad * anchoBarra / barra.total
                    let delinear = {
                        arriba: divisionesPunteadas.indexOf(indexDivision+1)>-1,
                        abajo: divisionesPunteadas.indexOf(indexDivision+1)>-1,
                        izquierda: divisionesPunteadas.indexOf(indexDivision+1)>-1 && indexDivision == 0,
                        derecha: divisionesPunteadas.indexOf(indexDivision+1)>-1 && (indexDivision+1 == divisiones.length),
                    }
                    posicionDivisiones[indexBarra][indexDivision] = {
                        inicio: acum,
                        fin: acum+anchoDivisionBarra
                    }
                    dibujaDivisionBarra(grupoBarra, acum, yEsquinaSuperiorIzquierdaDivision, anchoDivisionBarra, delinear, indexBarra, indexDivision, division.color)
                    acum += anchoDivisionBarra
                })
                container.appendChild(grupoBarra)
                break
        }
    })

    marcas.forEach(marca => {
        let { tipo,barra,division,posicion,divisionesEspecificas,color,valor } = marca
        let conOperacion = barras[barra-1].conOperacion
        switch(division) {
            case 'barra completa':
                let inicioX = anchoSVG/2 - anchoBarra/2
                let finX = anchoSVG/2 + anchoBarra/2
                let centro = (finX - inicioX) / 2 + inicioX
                let inicioY = posicion === 'arriba' ?
                    yInicioBarras + (barra-1) * altoBarra + (barra-1) * separacionEntreBarras - 5 + (conOperacion ? altoBarra + separacionEntreBarras : 0) + barras.slice(0, barra-1).filter(x => x.conOperacion).length * (altoBarra + separacionEntreBarras) :
                    yInicioBarras + barra * altoBarra + (barra-1) * separacionEntreBarras + 5 + (conOperacion ? altoBarra + separacionEntreBarras : 0) + barras.slice(0, barra-1).filter(x => x.conOperacion).length * (altoBarra + separacionEntreBarras)
                tipo === 'llave' ? 
                    dibujarLlave(inicioX, finX, centro, inicioY, posicion, color, valor[0]) :
                    dibujarTramo(inicioX, finX, centro, inicioY, posicion, color, valor[0])
                break
            case 'todas':
                posicionDivisiones[barra-1].forEach((div, indexDiv) => {
                    let inicioX = div.inicio
                    let finX = div.fin
                    let centro = (finX - inicioX) / 2 + inicioX
                    let inicioY = posicion === 'arriba' ?
                        yInicioBarras + (barra-1) * altoBarra + (barra-1) * separacionEntreBarras - 5 + (conOperacion ? altoBarra + separacionEntreBarras : 0) + barras.slice(0, barra-1).filter(x => x.conOperacion).length * (altoBarra + separacionEntreBarras) :
                        yInicioBarras + barra * altoBarra + (barra-1) * separacionEntreBarras + 5 + (conOperacion ? altoBarra + separacionEntreBarras : 0) + barras.slice(0, barra-1).filter(x => x.conOperacion).length * (altoBarra + separacionEntreBarras)
                    tipo === 'llave' ? 
                        dibujarLlave(inicioX, finX, centro, inicioY, posicion, color, valor.length > 1 ? valor[indexDiv] : valor[0]) :
                        dibujarTramo(inicioX, finX, centro, inicioY, posicion, color, valor.length > 1 ? valor[indexDiv] : valor[0])
                })
                break
            case 'especificas':
                divisionesEspecificas.forEach((divEsp, indexDivEsp) => {
                    if(divEsp.tipo === 'tramo') {
                        let inicioX = posicionDivisiones[barra-1][divEsp.divisionInicio-1].inicio
                        let finX = posicionDivisiones[barra-1][divEsp.divisionFin-1].fin
                        let centro = (finX - inicioX) / 2 + inicioX
                        let inicioY = posicion === 'arriba' ?
                            yInicioBarras + (barra-1) * altoBarra + (barra-1) * separacionEntreBarras - 5 + (conOperacion ? altoBarra + separacionEntreBarras : 0) + barras.slice(0, barra-1).filter(x => x.conOperacion).length * (altoBarra + separacionEntreBarras):
                            yInicioBarras + barra * altoBarra + (barra-1) * separacionEntreBarras + 5 + (conOperacion ? altoBarra + separacionEntreBarras : 0) + barras.slice(0, barra-1).filter(x => x.conOperacion).length * (altoBarra + separacionEntreBarras)
                        tipo === 'llave' ?
                            dibujarLlave(inicioX, finX, centro, inicioY, posicion, color, valor.length > 1 ? valor[indexDivEsp] : valor[0]) :
                            dibujarTramo(inicioX, finX, centro, inicioY, posicion, color, valor.length > 1 ? valor[indexDivEsp] : valor[0])
                    } else {
                        let inicioX = posicionDivisiones[barra-1][divEsp.division-1].inicio
                        let finX = posicionDivisiones[barra-1][divEsp.division-1].fin
                        let centro = (finX - inicioX) / 2 + inicioX
                        let inicioY = posicion === 'arriba' ?
                            yInicioBarras + (barra-1) * altoBarra + (barra-1) * separacionEntreBarras - 5 + (conOperacion ? altoBarra + separacionEntreBarras : 0) + barras.slice(0, barra-1).filter(x => x.conOperacion).length * (altoBarra + separacionEntreBarras):
                            yInicioBarras + barra * altoBarra + (barra-1) * separacionEntreBarras + 5 + (conOperacion ? altoBarra + separacionEntreBarras : 0) + barras.slice(0, barra-1).filter(x => x.conOperacion).length * (altoBarra + separacionEntreBarras)
                        tipo === 'llave' ?
                            dibujarLlave(inicioX, finX, centro, inicioY, posicion, color, valor.length > 1 ? valor[indexDivEsp] : valor[0]) :
                            dibujarTramo(inicioX, finX, centro, inicioY, posicion, color, valor.length > 1 ? valor[indexDivEsp] : valor[0])
                    }
                })
                break
        }
    })

    operaciones.forEach(operacion => {
        let { barra, division, color, marca, valor, colorMarca } = operacion
        let inicioX = posicionDivisiones[barra-1][division-1].inicio
        let finX = posicionDivisiones[barra-1][division-1].fin
        let centro = (finX - inicioX) / 2 + inicioX
        let anchoDivisionBarra = finX - inicioX
        let inicioY = yInicioBarras + (barra-1) * altoBarra + (barra-1) * separacionEntreBarras - 5
        container.appendChild(crearElemento('rect', {
            x: inicioX,
            y: inicioY,
            width: anchoDivisionBarra,
            height: altoBarra,
            stroke: '#DFD9D0',
            strokeWidth: '3',
            fill: color
        }))
        if(marca === 'llave') {
            dibujarLlave(inicioX, finX, centro, inicioY-5, 'arriba', colorMarca, valor)
        } else if (marca === 'tramo') {
            dibujarTramo(inicioX, finX, centro, inicioY-5, 'arriba', colorMarca, valor)
        }
    })

    imagenes.forEach(imagen => {
        let { id,ubicacion,alto,ancho,posicion,separacion,barra,division,x,y } = imagen
        if(ubicacion === 'exacta') {
            for(let i = 0; i < x.length; i++) {
                container.appendChild(crearReferenciaAElemento(id, {
                    x: x[i]-ancho/2,
                    y: y[i]-alto/2
                }))
            }
        } else {
            let barrasConOperacionAnterior = barras.slice(0, barra-1).filter(x => x.conOperacion).length
            let conOperacion = barras[barra-1].conOperacion
            let yBarra = yInicioBarras + (barra-1) * altoBarra + (barra-1) * separacionEntreBarras + (conOperacion ? altoBarra + separacionEntreBarras : 0) + barrasConOperacionAnterior * (altoBarra + separacionEntreBarras)
            division.forEach(div => {
                if(div.tipo === 'tramo') {
                    posicionDivisiones[barra-1].slice(div.divisionInicio-1, div.divisionFin-div.divisionInicio+1).forEach(pos => {
                        let inicioX = pos.inicio
                        let finX = pos.fin
                        let centro = (finX - inicioX) / 2 + inicioX
                        let xImg = centro - ancho/2
                        let yImg
                        if(posicion === 'arriba') {
                            yImg = yBarra - alto - separacion
                        } else if(posicion === 'abajo') {
                            yImg = yBarra + altoBarra + separacion
                        } else { //centro
                            yImg = yBarra + altoBarra/2 - alto/2
                        }
                        container.appendChild(crearReferenciaAElemento(id, {
                            x: xImg,
                            y: yImg
                        }))
                    })
                } else {
                    let inicioX = posicionDivisiones[barra-1][div.division-1].inicio
                    let finX = posicionDivisiones[barra-1][div.division-1].fin
                    let centro = (finX - inicioX) / 2 + inicioX
                    let xImg = centro - ancho/2
                    let yImg
                    if(posicion === 'arriba') {
                        yImg = yBarra - alto - separacion
                    } else if(posicion === 'abajo') {
                        yImg = yBarra + altoBarra + separacion
                    } else { //centro
                        yImg = yBarra + altoBarra/2 - alto/2
                    }
                    container.appendChild(crearReferenciaAElemento(id, {
                        x: xImg,
                        y: yImg
                    }))
                }
            })
        }
    })

    textos.forEach(texto => {
        let { texto: txt,alto,ubicacion,posicion,separacion,barra,division,x,y } = texto
        if(ubicacion === 'exacta') {
            for(let i = 0; i < x.length; i++) {
                container.appendChild(crearElementoDeTexto({
                    x: x,
                    y: y-fontSize/2,
                    fontSize,
                    textAnchor: 'middle',
                    fill: '#363026',
                    style: 'font-family:Quicksand;'
                }, txt))
            }
        } else {
            let barrasConOperacionAnterior = barras.slice(0, barra-1).filter(x => x.conOperacion).length
            let conOperacion = barras[barra-1].conOperacion
            let yBarra = yInicioBarras + (barra-1) * altoBarra + (barra-1) * separacionEntreBarras + (conOperacion ? altoBarra + separacionEntreBarras : 0) + barrasConOperacionAnterior * (altoBarra + separacionEntreBarras)
            division.forEach(div => {
                if(div.tipo === 'tramo') {
                    posicionDivisiones[barra-1].slice(div.divisionInicio-1, div.divisionFin-div.divisionInicio+1).forEach(pos => {
                        let inicioX = pos.inicio
                        let finX = pos.fin
                        let centro = (finX - inicioX) / 2 + inicioX
                        let yTexto
                        if(posicion === 'arriba') {
                            yTexto = yBarra - separacion
                        } else if(posicion === 'abajo') {
                            yTexto = yBarra + altoBarra + separacion + alto
                        } else { //centro
                            yTexto = yBarra + altoBarra/2 + alto/2
                        }
                        container.appendChild(crearElementoDeTexto({
                            x: centro,
                            y: yTexto,
                            fontSize: alto,
                            textAnchor: 'middle',
                            fill: '#363026',
                            style: 'font-family:Quicksand;'
                        }, txt))
                    })
                } else {
                    let inicioX = posicionDivisiones[barra-1][div.division-1].inicio
                    let finX = posicionDivisiones[barra-1][div.division-1].fin
                    let centro = (finX - inicioX) / 2 + inicioX
                    let yTexto
                    if(posicion === 'arriba') {
                        yTexto = yBarra - separacion
                    } else if(posicion === 'abajo') {
                        yTexto = yBarra + altoBarra + separacion + alto
                    } else { //centro
                        yTexto = yBarra + altoBarra/2 + alto/2
                    }
                    container.appendChild(crearElementoDeTexto({
                        x: centro,
                        y: yTexto,
                        fontSize: alto,
                        textAnchor: 'middle',
                        fill: '#363026',
                        style: 'font-family:Quicksand;'
                    }, txt))
                }
            })
        }
    })

    //funciones -------
    function dibujaDivisionBarra(grupoBarra, xEsqSupIzqBarra, yEsqSupIzqBarra, anchoDivisionBarra, delinear, indexBarra, indexDivision, color) {
        grupoBarra.appendChild(crearElemento('line', {
            id: `${container.id}-barra${indexBarra+1}-division${indexDivision+1}-arriba`,
            x1: xEsqSupIzqBarra,
            y1: yEsqSupIzqBarra,
            x2: xEsqSupIzqBarra + anchoDivisionBarra,
            y2: yEsqSupIzqBarra,
            strokeDasharray: delinear.arriba ? '4' : ''
        }))
        grupoBarra.appendChild(crearElemento('line', {
            id: `${container.id}-barra${indexBarra+1}-division${indexDivision+1}-derecha`,
            x1: xEsqSupIzqBarra + anchoDivisionBarra,
            y1: yEsqSupIzqBarra - grosorBordes/2,
            x2: xEsqSupIzqBarra + anchoDivisionBarra,
            y2: yEsqSupIzqBarra + altoBarra + grosorBordes/2,
            strokeDasharray: delinear.derecha ? '4' : ''
        }))
        grupoBarra.appendChild(crearElemento('line', {
            id: `${container.id}-barra${indexBarra+1}-division${indexDivision+1}-abajo`,
            x1: xEsqSupIzqBarra + anchoDivisionBarra,
            y1: yEsqSupIzqBarra + altoBarra,
            x2: xEsqSupIzqBarra,
            y2: yEsqSupIzqBarra + altoBarra,
            strokeDasharray: delinear.abajo ? '4' : ''
        }))
        indexDivision === 0 && grupoBarra.appendChild(crearElemento('line', {
            id: `${container.id}-barra${indexBarra+1}-division${indexDivision+1}-izquierda`,
            x1: xEsqSupIzqBarra,
            y1: yEsqSupIzqBarra + altoBarra + grosorBordes/2,
            x2: xEsqSupIzqBarra,
            y2: yEsqSupIzqBarra - grosorBordes/2,
            strokeDasharray: delinear.izquierda ? '4' : ''
        }))

        if(!delinear.arriba && !delinear.abajo && !delinear.izquierda && !delinear.derecha) {
            grupoBarra.appendChild(crearElemento('rect', {
                id: `${container.id}-barra${indexBarra+1}-division${indexDivision+1}-relleno`,
                x: xEsqSupIzqBarra+grosorBordes/2,
                y: yEsqSupIzqBarra+grosorBordes/2,
                width: anchoDivisionBarra-grosorBordes,
                height: altoBarra-grosorBordes,
                stroke: 'none',
                fill: color
            }))
        }
    }

    function dibujarLlave(inicioX, finX, centro, inicioY, posicion, color, valor) {
        let radio = 10
        let llaveParaArriba = posicion === 'arriba' ? true : false
        let inicioYMasMenosRadio = llaveParaArriba ? inicioY-radio : inicioY+radio
        container.appendChild(crearElemento('path',{
            d: `M ${inicioX} ${inicioY}
                A ${radio} ${radio} 0 0 ${llaveParaArriba ? '1' : '0'} ${inicioX+radio} ${inicioYMasMenosRadio}
                H ${centro-radio}
                A ${radio} ${radio} 0 0 ${llaveParaArriba ? '0' : '1'} ${centro} ${inicioY + (llaveParaArriba ? radio*-2 : radio*2)}
                A ${radio} ${radio} 0 0 ${llaveParaArriba ? '0' : '1'} ${centro+radio} ${inicioYMasMenosRadio}
                H ${finX-radio}
                A ${radio} ${radio} 0 0 ${llaveParaArriba ? '1' : '0'} ${finX} ${inicioY}`,
            fill: 'none',
            stroke: color,
            strokeWidth: '3'
        }))
        if(valor) {
            container.appendChild(crearElementoDeTexto({
                x: centro,
                y: inicioY + (llaveParaArriba ? (5+radio*2)*-1 : 8+fontSize+radio),
                fontSize,
                textAnchor: 'middle',
                fill: '#363026',
                style: 'font-family:Quicksand;'
            }, valor))
        }
    }

    function dibujarTramo(inicioX, finX, centro, inicioY, posicion, color, valor) {
        let largolinea = 10
        let finY = posicion === 'arriba' ? inicioY-largolinea : inicioY+largolinea
        let altoLinea = posicion === 'arriba' ? inicioY-largolinea/2 : inicioY+largolinea/2
        container.appendChild(crearElemento('line', {
            x1: inicioX,
            y1: inicioY,
            x2: inicioX,
            y2: finY,
            stroke: color,
            strokeWidth: '3'
        }))
        container.appendChild(crearElemento('line', {
            x1: finX,
            y1: inicioY,
            x2: finX,
            y2: finY,
            stroke: color,
            strokeWidth: '3'
        }))
        container.appendChild(crearElemento('line', {
            x1: inicioX,
            y1: altoLinea,
            x2: finX,
            y2: altoLinea,
            stroke: color,
            strokeWidth: '3'
        }))
        if(valor) {
            container.appendChild(crearElementoDeTexto({
                x: centro,
                y: inicioY + (posicion === 'arriba' ? (largolinea*2)*-1 : fontSize+largolinea),
                fontSize,
                textAnchor: 'middle',
                fill: '#363026',
                style: 'font-family:Quicksand;'
            }, valor))
        }
    }

    function getBarra(barra, numero) {
        return {
            total: Number(regexFunctions(regex(barra.total, vars, vt))),
            tipo: barra.tipo,
            detalle: barra.tipo === "equitativa" ? {
                color: regexFunctions(regex(barra.detalle.color, vars, vt)).split(','),
                dividendo: barra.detalle.dividendo ? Number(regexFunctions(regex(barra.detalle.dividendo, vars, vt))) : null,
                divisiones: barra.detalle.divisiones ? Number(regexFunctions(regex(barra.detalle.divisiones, vars, vt))) : null,
                divisionesPunteadas: barra.detalle.divisionesPunteadas ? regexFunctions(regex(barra.detalle.divisionesPunteadas, vars, vt)).split(',').map(x => Number(x)) : []
            } : {
                divisiones: regexFunctions(regex(barra.detalle.divisiones, vars, vt)).split(';').map(x => ({ cantidad: Number(x.split(',')[0]), color: x.split(',')[1] })),
                divisionesPunteadas: barra.detalle.divisionesPunteadas ? regexFunctions(regex(barra.detalle.divisionesPunteadas, vars, vt)).split(',').map(x => Number(x)) : []
            },
            conOperacion: operaciones.filter(x => numero === x.barra).length > 0
        }
    }

    function getMarca(marca) {
        return {
            tipo: marca.tipo,
			barra: Number(marca.barra),
			division: marca.division,
			posicion: marca.posicion,
            divisionesEspecificas: marca.divisionesEspecificas ? 
                regexFunctions(regex(marca.divisionesEspecificas, vars, vt))
                .split(',')
                .map(x => { 
                    return x.indexOf('-') > -1 ? {
                        tipo: 'tramo',
                        divisionInicio: Number(x.split('-')[0]), 
                        divisionFin: Number(x.split('-')[1])
                    } : {
                        tipo: 'especifica',
                        division: Number(x)
                    }
                }) : null,
			color: marca.color,
			valor: regexFunctions(regex(marca.valor, vars, vt)).split(',')
        }
    }

    function getOperacion(operacion) {
        return {
            barra: Number(operacion.barra),
            division: regexFunctions(regex(operacion.division, vars, vt)).split(',').map(x => Number(x)),
            color: operacion.color,
            marca: operacion.marca,
            colorMarca: operacion.colorMarca,
			valor:  regexFunctions(regex(operacion.valor, vars, vt))
        }
    }

    async function getImagen(imagen) {
        let src = regexFunctions(regex(imagen.src, vars, vt)).replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../')
        let imagenCargada = await cargaImagen(src)
        let alto = Number(imagen.alto)
        let ancho = alto * imagenCargada.width / imagenCargada.height
        let id = container.id + '-' + src.split('/').pop().replace('.svg','').replace(/%20/g,'-')
        defs.appendChild(crearElementoDeImagen(src,{id,height:alto,width:ancho}))
        return { 
            id, 
            src, 
            alto, 
            ancho, 
            ubicacion:imagen.ubicacion, 
            posicion:imagen.posicion,
            separacion:Number(imagen.separacion),
            barra:Number(imagen.barra),
            division:regexFunctions(regex(imagen.division, vars, vt)).split(',').map(x => { 
                return x.indexOf('-') > -1 ? {
                    tipo: 'tramo',
                    divisionInicio: Number(x.split('-')[0]), 
                    divisionFin: Number(x.split('-')[1])
                } : {
                    tipo: 'especifica',
                    division: Number(x)
                }
            }),
            x:regexFunctions(regex(imagen.x, vars, vt)).split(',').map(x => Number(x)),
            y:regexFunctions(regex(imagen.y, vars, vt)).split(',').map(x => Number(x))
        }
    }

    function getTexto(texto) {
        return {
            texto: regexFunctions(regex(texto.texto, vars, vt)),
            alto: Number(texto.alto),
            ubicacion: texto.ubicacion,
            posicion: texto.posicion,
            separacion: Number(texto.separacion),
            barra: Number(texto.barra),
            division: regexFunctions(regex(texto.division, vars, vt)).split(',').map(x => {
                return x.indexOf('-') > -1 ? {
                    tipo: 'tramo',
                    divisionInicio: Number(x.split('-')[0]),
                    divisionFin: Number(x.split('-')[1])
                } : {
                    tipo: 'especifica',
                    division: Number(x)
                }
            }),
            x:regexFunctions(regex(texto.x, vars, vt)).split(',').map(x => Number(x)),
            y:regexFunctions(regex(texto.y, vars, vt)).split(',').map(x => Number(x))
        }
    }

    function crearElementoDeImagen(src, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'image')
		element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src)
		for (let p in atributos) {
            element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
                return '-' + m.toLowerCase()
            }), atributos[p])
		}
		return element
    }
    
    function crearReferenciaAElemento(id, atributos) {
        let element = document.createElementNS('http://www.w3.org/2000/svg', 'use')
        element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${id}`)
        for (let p in atributos) {
            element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
                return '-' + m.toLowerCase()
            }), atributos[p])
        }
        return element
    }

	function crearElemento(nombre, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', nombre)
		for (let p in atributos) {
		  element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
			return '-' + m.toLowerCase()
		  }), atributos[p])
		}
		return element
	}

	function crearElementoDeTexto(atributos, texto) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'text')
		for (let p in atributos) {
		  element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
			return '-' + m.toLowerCase()
		  }), atributos[p])
		}
		let textNode = document.createTextNode(texto)
		element.appendChild(textNode)
		return element
    }
}

async function patrones(config) {
	const { container, params, variables, versions, vt } = config;
	//container.innerHTML = ''
	//container.style.border = '1px solid #000'
	let {
		altoSVG,
		anchoSVG,
		altoCuadro,
		anchoCuadro,
		imagenes,
		patron,
		llaves,
		flechas,
		despliegue, //simple,tabla termino,tabla patron,recuadro termino, recuadro patron
		altoEncabezado,
		textoTermino,
		posTextoTermino,
		repeticiones,
		terminosMarcados,
		ocultarTerminos,
		separacionimagenes,
		separacionpatrones,
		separador,
		altoSeparador
	} = params
	//defs para imagenes y fuentes
	let defs = crearElemento('defs', {})
	let styles = document.createElement('style')
	styles.innerHTML = '@font-face{font-family:"Quicksand";src:url("../../../../fonts/Quicksand-Medium.ttf");}'
	defs.appendChild(styles)
	container.appendChild(defs)
	//trata de variables
	altoSVG = Number(altoSVG)
	anchoSVG = Number(anchoSVG)
	altoCuadro = Number(altoCuadro)
	anchoCuadro = Number(anchoCuadro)
	separacionimagenes = Number(separacionimagenes)
	separacionpatrones = Number(separacionpatrones)
	altoEncabezado = Number(altoEncabezado)
	let vars = vt ? variables : versions
	imagenes = imagenes ? await Promise.all(imagenes.map(x => getImagen(x))) : []
	patron = patron ? patron.map(x => getPatron(x)) : []
	llaves = llaves ? llaves.map(x => getLLave(x)) : []
	flechas = flechas ? flechas.map(x => getFlecha(x)) : []
	separador = regexFunctions(regex(separador, vars, vt))
	terminosMarcados = terminosMarcados ? 
		regexFunctions(regex(terminosMarcados, vars, vt)).split(';').map(x => ({ numTerm: Number(x.split(',')[0]), color: x.split(',')[1] })) : []
	ocultarTerminos = ocultarTerminos ?
		regexFunctions(regex(ocultarTerminos, vars, vt)).split(';').map(x => Number(x)) : []
	repeticiones = Number(regexFunctions(regex(repeticiones, vars, vt)))
	//define tamaño del canvas
	container.setAttribute('height', altoSVG)
	container.setAttribute('width', anchoSVG)
	container.setAttribute('viewBox', `0 0 ${anchoSVG} ${altoSVG}`)

	let anchoPatron = 
		(patron.length-1) * separacionimagenes + 
		patron.length * anchoCuadro
	let anchoPatrones = anchoPatron * repeticiones + (repeticiones-1) * separacionpatrones
	let xInicio = anchoSVG/2-anchoPatrones/2
	let altoTotalTabla = altoCuadro + separacionimagenes + altoEncabezado
	let centro = (despliegue === 'tabla patron' || despliegue === 'tabla termino') ? 
		altoSVG/2-altoTotalTabla/2+altoEncabezado+altoCuadro/2+separacionimagenes/2 :
		altoSVG/2
	let numeroTermino = 1
	let posicionesTerminos = []
	let posicionesPatrones = []
	for(let i = 0; i < repeticiones; i++) {
		posicionesPatrones.push({
			inicio: xInicio - (despliegue.indexOf('tabla') > -1 ? separacionimagenes/2 : 0),
			fin: xInicio + anchoPatron + (despliegue.indexOf('tabla') > -1 ? separacionimagenes/2 : 0)
		})
		if(despliegue === 'tabla patron') {
			container.appendChild(crearElemento('rect', {
				x: xInicio - separacionimagenes/2,
				y: altoSVG/2-altoTotalTabla/2,
				width: anchoPatron + separacionimagenes,
				height: altoTotalTabla,
				stroke: '#1F8EBE',
				strokeWidth: '2',
				fill: 'none'
			}))
			container.appendChild(crearElemento('line', {
				x1: xInicio - separacionimagenes/2 - 1.5,
				y1: altoSVG/2-altoTotalTabla/2 + altoEncabezado,
				x2: xInicio + anchoPatron + separacionimagenes - 4,
				y2: altoSVG/2-altoTotalTabla/2 + altoEncabezado,
				strokeWidth: '2',
				stroke: '#1F8EBE'
			}))
		} else if (despliegue === 'recuadro patron') {
			container.appendChild(crearElemento('rect', {
				x: xInicio - separacionimagenes/2,
				y: altoSVG/2-altoCuadro/2-separacionimagenes/2,
				width: anchoPatron + separacionimagenes,
				height: altoCuadro + separacionimagenes,
				rx: '15',
				ry: '15',
				stroke: '#1F8EBE',
				strokeWidth: '2',
				fill: 'none'
			}))
		}
		patron.forEach((termino, indexPatron) => {
			let esMarcado = terminosMarcados.find(x => x.numTerm === numeroTermino)
			if(despliegue === 'tabla termino') {
				container.appendChild(crearElemento('rect', {
					id: `${container.id}-termino-${numeroTermino}`,
					x: xInicio - separacionimagenes/2,
					y: altoSVG/2-altoTotalTabla/2,
					width: anchoCuadro + separacionimagenes,
					height: altoTotalTabla,
					stroke: '#1F8EBE',
					strokeWidth: '2',
					fill: esMarcado ? esMarcado.color : 'none'
				}))
				container.appendChild(crearElemento('line', {
					x1: xInicio - separacionimagenes/2 - 1.5,
					y1: altoSVG/2-altoTotalTabla/2 + altoEncabezado,
					x2: xInicio + anchoCuadro + separacionimagenes - 4,
					y2: altoSVG/2-altoTotalTabla/2 + altoEncabezado,
					strokeWidth: '2',
					stroke: '#1F8EBE'
				}))
			} else if (despliegue === 'recuadro termino') {
				container.appendChild(crearElemento('rect', {
					id: `${container.id}-termino-${numeroTermino}`,
					x: xInicio,
					y: altoSVG/2-altoCuadro/2,
					width: anchoCuadro,
					height: altoCuadro,
					rx: '15',
					ry: '15',
					stroke: '#1F8EBE',
					strokeWidth: '2',
					fill: esMarcado ? esMarcado.color : 'none'
				}))
			} else if (despliegue === 'simple' || despliegue === 'tabla patron' || despliegue === 'recuadro patron') {
				container.appendChild(crearElemento('rect', {
					id: `${container.id}-termino-${numeroTermino}`,
					x: xInicio - separacionimagenes/3,
					y: centro-altoCuadro/2-separacionimagenes/3,
					width: anchoCuadro + separacionimagenes*2/3,
					height: altoCuadro + separacionimagenes*2/3,
					rx: '15',
					ry: '15',
					stroke: 'none',
					fill: esMarcado ? esMarcado.color : 'none'
				}))
			}
			if(separador && !((indexPatron+1 === patron.length) && i+1 === repeticiones)) {
				container.appendChild(crearElementoDeTexto({
					x: xInicio + anchoCuadro + separacionimagenes/2,
					y: altoSeparador,
					fontSize: 20,
					textAnchor: 'middle',
					fill: '#363026',
					style: 'font-family:Quicksand;'
				}, separador))
			}
			if(textoTermino) {
				container.appendChild(crearElementoDeTexto({
					x: xInicio + anchoCuadro/2,
					y: (despliegue === 'tabla patron' || despliegue === 'tabla termino') ? 
						altoSVG/2 - altoTotalTabla/2 + altoEncabezado/2 + 10 :
						posTextoTermino === 'arriba' ? centro - altoCuadro / 2 - 10 : centro + altoCuadro/2 + 27 ,
					fontSize: 20,
					textAnchor: 'middle',
					fill: '#363026',
					style: 'font-family:Quicksand;'
				}, textoTermino.replace('#', numeroTermino)))
			}
			if(termino.texto) {
				container.appendChild(crearElementoDeTexto({
					x: xInicio + anchoCuadro/2,
					y: termino.yTexto,
					fontSize: termino.altoTexto,
					textAnchor: 'middle',
					fill: '#363026',
					style: 'font-family:Quicksand;'
				}, termino.texto.replace('#', numeroTermino)))
			} else if(termino.conrepeticion) {
				let separacionRepeticiones = 10
				let altoTotalRepeticion = termino.repeticiones.reduce((total, rep) => total + rep.altoTotal, 0) + separacionRepeticiones * (termino.repeticiones.length-1)
				let centroTermino = xInicio + anchoCuadro/2
				let yStart = centro - altoTotalRepeticion/2
				let g = crearElemento('g', {
					id: `${container.id}-imagen-${numeroTermino}`
				})
				termino.repeticiones.forEach(repeticion => {
					switch(repeticion.formaRepeticion) {
						case 'izq/der':
							repeticionIzqDer(g, repeticion, centroTermino, yStart)
							break
						case 'diagonal':
							repeticionDiagonal(g, repeticion, centroTermino, yStart)
							break
						case 'rectangular':
							repeticionRectangular(g, repeticion, centroTermino, yStart)
							break
						default:
							console.log('no soportado')
							break
					}
					yStart += repeticion.altoTotal + separacionRepeticiones
				})
				container.appendChild(g)
			} else {
				container.appendChild(crearReferenciaAElemento(termino.idImagen, {
					id: `${container.id}-imagen-${numeroTermino}`,
					x: xInicio + anchoCuadro/2 - termino.anchoImagen/2,
					y: centro-termino.altoImagen/2,
					transform: `rotate(${termino.rotacion} ${xInicio+anchoCuadro/2} ${centro})`
				}))
			}
			posicionesTerminos.push({
				inicio: xInicio - (despliegue.indexOf('tabla') > -1 ? separacionimagenes/2 : 0),
				fin: xInicio + anchoCuadro + (despliegue.indexOf('tabla') > -1 ? separacionimagenes/2 : 0),
				centro: xInicio + anchoCuadro/2
			})
			numeroTermino++
			xInicio += anchoCuadro + (indexPatron+1 === patron.length ? separacionpatrones : separacionimagenes )
		})
	}
	//terminos ocultados
	ocultarTerminos.forEach(termino => {
		let termlmnt = document.querySelector(`#${container.id}-imagen-${termino}`)
		if(termlmnt) {
			termlmnt.parentNode.removeChild(termlmnt)
		}
	})

	llaves.forEach(llave => {
		let inicioY = (despliegue === 'tabla patron' || despliegue === 'tabla termino') ? 
			llave.posicion === 'arriba' ? altoSVG/2 - altoTotalTabla / 2 - llave.separacion : altoSVG/2 + altoTotalTabla / 2 + llave.separacion :
			llave.posicion === 'arriba' ? centro - altoCuadro / 2 - llave.separacion : centro + altoCuadro/2 + llave.separacion
		switch(llave.tipo) {
			case 'patrones':
				posicionesPatrones.forEach((posPatron, indexPatron) => {
					let texto = llave.texto ? llave.texto.replace('#', indexPatron+1) : ''
					dibujarLlave(posPatron.inicio, posPatron.fin, inicioY, llave.posicion, llave.color, texto)
				})
				break
			case 'terminos':
				posicionesTerminos.forEach((posTermino, indexTermino) => {
					let texto = llave.texto ? llave.texto.replace('#', indexTermino+1) : ''
					dibujarLlave(posTermino.inicio, posTermino.fin, inicioY, llave.posicion, llave.color, texto)
				})
				break
			case 'term especificos':
				llave.especifico.forEach(espe => {
					if(espe.tipo === 'tramo') {
						let inicio = posicionesTerminos[espe.inicio-1].inicio
						let fin = posicionesTerminos[espe.fin-1].fin
						dibujarLlave(inicio, fin, inicioY, llave.posicion, llave.color, llave.texto)
					} else {
						let inicio = posicionesTerminos[espe.termino-1].inicio
						let fin = posicionesTerminos[espe.termino-1].fin
						let texto = llave.texto ? llave.texto.replace('#', espe.termino) : ''
						dibujarLlave(inicio, fin, inicioY, llave.posicion, llave.color, texto)
					}
				})
				break
		}
	})

	flechas.forEach(flecha => {
		let yFlecha = (despliegue === 'tabla patron' || despliegue === 'tabla termino') ? 
			flecha.posicion === 'arriba' ? altoSVG/2 - altoTotalTabla / 2 - flecha.separacion : altoSVG/2 + altoTotalTabla / 2 + flecha.separacion :
			flecha.posicion === 'arriba' ? centro - altoCuadro / 2 - flecha.separacion : centro + altoCuadro/2 + flecha.separacion
		let yPuntoAltoFlecha = flecha.posicion === 'arriba' ? yFlecha - 25 : yFlecha + 25
		switch(flecha.tipo) {
			case 'terminos':
				posicionesTerminos.forEach((termino, indexTermino) => {
					if(indexTermino+1===posicionesTerminos.length){
						return
					}
					let inicio = termino.centro + 10
					let fin = posicionesTerminos[indexTermino+1].centro - 10
					dibujarFlecha(inicio, fin, yFlecha, yPuntoAltoFlecha, flecha.posicion, flecha.direccion, flecha.color, flecha.texto)
				})
				break
			case 'term especificos':
				flecha.especifico.forEach(espe => {
					let inicio = posicionesTerminos[espe.inicio-1].centro + 10
					let fin = posicionesTerminos[espe.fin-1].centro - 10
					dibujarFlecha(inicio, fin, yFlecha, yPuntoAltoFlecha, flecha.posicion, flecha.direccion, flecha.color, flecha.texto)
				})
				break
		}
	})

	function dibujarLlave(inicioX, finX, inicioY, posicion, color, valor) {
		let fontSize = 20
		let centro = (finX - inicioX) / 2 + inicioX
        let radio = 10
        let llaveParaArriba = posicion === 'arriba' ? true : false
        let inicioYMasMenosRadio = llaveParaArriba ? inicioY-radio : inicioY+radio
        container.appendChild(crearElemento('path',{
            d: `M ${inicioX} ${inicioY}
                A ${radio} ${radio} 0 0 ${llaveParaArriba ? '1' : '0'} ${inicioX+radio} ${inicioYMasMenosRadio}
                H ${centro-radio}
                A ${radio} ${radio} 0 0 ${llaveParaArriba ? '0' : '1'} ${centro} ${inicioY + (llaveParaArriba ? radio*-2 : radio*2)}
                A ${radio} ${radio} 0 0 ${llaveParaArriba ? '0' : '1'} ${centro+radio} ${inicioYMasMenosRadio}
                H ${finX-radio}
                A ${radio} ${radio} 0 0 ${llaveParaArriba ? '1' : '0'} ${finX} ${inicioY}`,
            fill: 'none',
            stroke: color,
            strokeWidth: '2'
        }))
        if(valor) {
            container.appendChild(crearElementoDeTexto({
                x: centro,
                y: inicioY + (llaveParaArriba ? (5+radio*2)*-1 : 8+fontSize+radio),
                fontSize,
                textAnchor: 'middle',
                fill: '#363026',
                style: 'font-family:Quicksand;'
            }, valor))
        }
	}

	function dibujarFlecha(inicio, fin, yFlecha, yPuntoAltoFlecha, posicion, direccion, color, texto) {
		let puntoMedioX = inicio + (fin - inicio) /2
		container.appendChild(crearElemento('path', {
			d: `M ${inicio} ${yFlecha} C ${inicio} ${yFlecha}, ${puntoMedioX} ${yPuntoAltoFlecha} , ${fin} ${yFlecha}`,
			stroke: color,
			strokeWidth: '2',
			fill: 'transparent'
		}))
		if(texto) {
			container.appendChild(crearElementoDeTexto({
				x: puntoMedioX,
				y: yPuntoAltoFlecha + (posicion === 'arriba' ? 10 : 5),
				fontSize: 20,
				textAnchor: 'middle',
				fill: '#363026',
				style: 'font-family:Quicksand;'
			}, texto))
		}
		if(direccion === 'derecha') {
			let pendiente = Math.atan((yPuntoAltoFlecha - yFlecha) / (puntoMedioX - fin))*180/Math.PI
			let punta1Flecha = polarToCartesian(fin, yFlecha, 8, pendiente+30)
			let punta2Flecha = polarToCartesian(fin, yFlecha, 8, pendiente-30)
			container.appendChild(crearElemento('path', {
				d: `M ${punta1Flecha.x} ${punta1Flecha.y } L ${fin} ${yFlecha} L ${punta2Flecha.x} ${punta2Flecha.y}`,
				stroke: color,
				strokeWidth: '2',
				fill: 'none'
			}))
		} else {
			let pendiente = Math.atan((yPuntoAltoFlecha - yFlecha) / (puntoMedioX - inicio))*180/Math.PI
			let punta1Flecha = polarToCartesian(inicio, yFlecha, 8, pendiente+210)
			let punta2Flecha = polarToCartesian(inicio, yFlecha, 8, pendiente-210)
			container.appendChild(crearElemento('path', {
				d: `M ${punta1Flecha.x} ${punta1Flecha.y } L ${inicio} ${yFlecha} L ${punta2Flecha.x} ${punta2Flecha.y}`,
				stroke: color,
				strokeWidth: '2',
				fill: 'none'
			}))
		}
	}
	
	function polarToCartesian(centerX, centerY, radius, angleInDegrees) { // 0 grados = 9 hrs
		let angleInRadians = (angleInDegrees-180) * Math.PI / 180.0;
		
		return {
			x: centerX + (radius * Math.cos(angleInRadians)),
			y: centerY + (radius * Math.sin(angleInRadians))
		}
	}

	async function getImagen(imagen) {
		let src = regexFunctions(regex(imagen.src, vars, vt)).replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../')
        let imagenCargada = await cargaImagen(src)
        let alto = Number(imagen.alto)
        let ancho = alto * imagenCargada.width / imagenCargada.height
        let id = container.id + '-' + src.split('/').pop().replace('.svg','').replace(/%20/g,'-')
		defs.appendChild(crearElementoDeImagen(src,{id,height:alto,width:ancho}))
		return {
			id, 
            src, 
            alto, 
            ancho
		}
	}

	function repeticionIzqDer(grupo, repeticion, centroHorizontal, inicioRepeticionVertical) {
		const { anchoTotal, limite, separacionX, separacionY, imagen, cantidad } = repeticion
		for(let i = 0, acum = 0; i < cantidad; i++) {
			let xRepeticion = centroHorizontal - anchoTotal/2 + acum * separacionX + imagen.ancho * acum
			let yRepeticion = inicioRepeticionVertical + Math.floor(i/limite) * imagen.alto + Math.floor(i/limite) * separacionY
			grupo.appendChild(crearReferenciaAElemento(imagen.id, {
				x: xRepeticion,
				y: yRepeticion
			}))
			if(acum === limite-1) {
				acum = 0
			} else {
				acum++
			}
		}
	}

	function repeticionDiagonal(grupo, repeticion, centroHorizontal, inicioRepeticionVertical) {
		const { imagen, cantidad, separacionX, separacionY, anchoTotal } = repeticion
		for(let i = 0; i < cantidad; i++) {
			let xRepeticion = centroHorizontal - anchoTotal/2 + i * separacionX
			let yRepeticion = inicioRepeticionVertical + i * separacionY
			grupo.appendChild(crearReferenciaAElemento(imagen.id, {
				x: xRepeticion,
				y: yRepeticion
			}))
		}
	}

	function repeticionRectangular(grupo, repeticion, centroHorizontal, inicioRepeticionVertical) {
		const { imagen, separacionX, separacionY, repeticionX, repeticionY, anchoTotal } = repeticion
		for(let v = 0, yRepeticion; v < repeticionY; v++) {
			yRepeticion = inicioRepeticionVertical + v * imagen.alto + v * separacionY
			for(let h = 0, xRepeticion; h < repeticionX; h++) {
				xRepeticion = centroHorizontal - anchoTotal/2 + h * imagen.ancho + h * separacionX
				grupo.appendChild(crearReferenciaAElemento(imagen.id, {
					x: xRepeticion,
					y: yRepeticion
				}))
			}
		}
	}

	function getPatron(termino) {
		if(termino.conrepeticion === 'si') {
			return {
				conrepeticion: true,
				repeticiones: termino.repeticiones.map(x => {
					let nombreImagen = regex(x.imagen, vars, vt)
					let idImagen = `${container.id}-${nombreImagen}`
					let imagen = x.imagen !== 'Seleccione' ? imagenes.find(img => img.id === idImagen) : null
					let anchoTotal, altoTotal, cantidad, separacionX, separacionY, repeticionX, repeticionY, limite
					switch(x.formaRepeticion) {
						case 'izq/der':
							cantidad = Number(regexFunctions(regex(x.cantidad, vars, vt)))
							separacionX = Number(x.separacionX)
							separacionY = Number(x.separacionY)
							limite = Number(regexFunctions(regex(x.limite, vars, vt)))
							anchoTotal = cantidad < limite ?
								cantidad * imagen.ancho + (cantidad-1) * separacionX : 
								limite * imagen.ancho + (limite-1) * separacionX
							altoTotal =  Math.ceil(cantidad/limite) * imagen.alto + (Math.ceil(cantidad/limite)-1) * separacionY
							return {
								imagen,
								formaRepeticion:x.formaRepeticion,
								cantidad,
								separacionX,
								separacionY,
								limite,
								anchoTotal,
								altoTotal
							}
						case 'diagonal':
							cantidad = Number(regexFunctions(regex(x.cantidad, vars, vt)))
							separacionX = Number(x.separacionX)
							separacionY = Number(x.separacionY)
							anchoTotal = imagen.ancho + (cantidad-1) * separacionX
							altoTotal = imagen.alto + (cantidad-1) * separacionY
							return {
								imagen,
								formaRepeticion:x.formaRepeticion,
								cantidad,
								separacionX,
								separacionY,
								anchoTotal,
								altoTotal
							}
						case 'rectangular':
							repeticionX = Number(regexFunctions(regex(x.repeticionX, vars, vt)))
							repeticionY = Number(regexFunctions(regex(x.repeticionY, vars, vt)))
							separacionX = Number(x.separacionX)
							separacionY = Number(x.separacionY)
							anchoTotal = imagen.ancho * repeticionX + separacionX * (repeticionX-1)
							altoTotal = imagen.alto * repeticionY + separacionY * (repeticionY-1)
							return {
								imagen,
								formaRepeticion:x.formaRepeticion,
								separacionX,
								separacionY,
								repeticionX,
								repeticionY,
								anchoTotal,
								altoTotal
							}
					}
				})
			}
		} else {
			let nombreImagen = regex(termino.imagen, vars, vt)
			let idImagen = `${container.id}-${nombreImagen}`
			let imagen = termino.imagen !== 'Seleccione' ? imagenes.find(img => img.id === idImagen) : null
			return {
				conrepeticion: false,
				imagen: nombreImagen,
				idImagen,
				altoImagen: termino.imagen !== 'Seleccione' ? imagen.alto : 0,
				anchoImagen: termino.imagen !== 'Seleccione' ? imagen.ancho : 0,
				rotacion: regexFunctions(regex(termino.rotacion, vars, vt)),
				texto: termino.texto ? regexFunctions(regex(termino.texto, vars, vt)) : null,
				altoTexto: Number(termino.altoTexto),
				yTexto: Number(termino.yTexto)
			}
		}
		
	}

	function getLLave(llave) {
		return {
			tipo: llave.tipo,
			color: llave.color,
			especifico: (llave.tipo === 'term especificos' && llave.especifico) ? regexFunctions(regex(llave.especifico, vars, vt)).split(',').map(x => {
				if(x.indexOf('-') > -1) {
					return {
						tipo: 'tramo',
						inicio: x.split('-')[0],
						fin: x.split('-')[1]
					}
				} else {
					return {
						tipo: 'especifico',
						termino: x
					}
				}
			}) : null,
			separacion: Number(llave.separacion),
			posicion: llave.posicion,
			texto: llave.texto ? regexFunctions(regex(llave.texto, vars, vt)) : null
		}
	}

	function getFlecha(flecha) {
		return {
			tipo: flecha.tipo,
			color: flecha.color,
			especifico: (flecha.tipo === 'term especificos' && flecha.especifico) ? 
				regexFunctions(regex(flecha.especifico, vars, vt)).split(',').map(x => ({
					inicio: x.split('-')[0],
					fin: x.split('-')[1]
				})) : null,
			separacion: Number(flecha.separacion),
			posicion: flecha.posicion,
			direccion: flecha.direccion,
			texto: flecha.texto ? regexFunctions(regex(flecha.texto, vars, vt)) : null
		}
	}

	function crearElementoDeImagen(src, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'image')
		element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	function crearReferenciaAElemento(id, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'use')
		element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${id}`)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	function crearElemento(nombre, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', nombre)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	function crearElementoDeTexto(atributos, texto) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'text')
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		let textNode = document.createTextNode(texto)
		element.appendChild(textNode)
		return element
	}
}

async function tarjeta(config){
    const { container, params, variables, versions, vt } = config
	//container.innerHTML = ''
	//container.style.border = '1px solid #000'
    let tarjetaFrontal = await cargaImagen('../../../../imagenes_front/cartas/cartavacia.svg')
    let {
		alto,
        ancho,
        altoTarjeta,
        randomizar,
        imagenes,
        cartas,
        separacioncartas,
        orden
    } = params
    //trata de variables
    let vars = vt ? variables : versions
    alto = Number(alto)
	ancho = Number(ancho)
    altoTarjeta = Number(altoTarjeta)
    randomizar = randomizar === 'si' ? true : false
    let anchoTarjeta = altoTarjeta * tarjetaFrontal.width / tarjetaFrontal.height
	//defs para imagenes y fuentes
	let defs = crearElemento('defs', {})
	let styles = document.createElement('style')
	styles.innerHTML = '@font-face{font-family:"Quicksand";src:url("../../../../fonts/Quicksand-Medium.ttf")}'
    defs.appendChild(styles)
    defs.appendChild(crearElementoDeImagen('../../../../imagenes_front/cartas/cartavacia.svg', {
        id: 'cartavacia',
        height: altoTarjeta,
        width: anchoTarjeta
    }))
    defs.appendChild(crearElementoDeImagen('../../../../imagenes_front/cartas/reversocarta.svg', {
        id: 'reversocarta',
        height: altoTarjeta,
        width: anchoTarjeta
    }))
    container.appendChild(defs)

    imagenes = imagenes ? await Promise.all(imagenes.map(x => getImagen(x))) : []
    cartas = cartas ? cartas.map(x => getcartas(x)) : []
    let posicionesCartas = cartas.map(carta => ({ x: carta.x, y: carta.y, rotacion: carta.rotacion }))
    if(randomizar) {
        cartas = cartas.sort(() => .5 - Math.random())
    } 
    let anchoTotal = anchoTarjeta * cartas.length + separacioncartas * (cartas.length - 1)
	//define tamaño del canvas
	container.setAttribute('height', alto)
	container.setAttribute('width', ancho)
    container.setAttribute('viewBox', `0 0 ${ancho} ${alto}`)

    cartas.forEach((carta, indexCarta) => {
        let xTarjeta = ancho /2 - anchoTotal / 2 + indexCarta * separacioncartas + indexCarta * anchoTarjeta
        let yTarjeta = alto / 2 - altoTarjeta / 2
        let g = crearElemento('g', {
            id: `${container.id}-carta-${indexCarta}`
        })
        if(orden === 'desordenado') {
            g.setAttributeNS(null, 'transform', `rotate(${posicionesCartas[indexCarta].rotacion} ${xTarjeta+anchoTarjeta/2} ${yTarjeta+altoTarjeta/2}) translate(${posicionesCartas[indexCarta].x} ${posicionesCartas[indexCarta].y})`)
        }
        switch(carta.tipo) {
            case 'adaptativamente':
                if (carta.idImagen) {
                    g.appendChild(crearReferenciaAElemento(carta.idImagen, {
                        x: xTarjeta+anchoTarjeta/2-carta.anchoImagen/2,
                        y: alto/2-carta.altoImagen/2
                    }))
                }
                g.appendChild(crearElemento('rect', {//agrega rectangulo para poner fondo de color
                    x: xTarjeta+1,
                    y: yTarjeta+1,
                    width: anchoTarjeta-2,
                    height: altoTarjeta-2,
                    rx: '5',
                    ry: '5',
                    stroke: 'none',
                    fill: carta.colorFondo
                }))
                g.appendChild(crearReferenciaAElemento('cartavacia', {//agrega imagen de carta
                    x: xTarjeta,
                    y: yTarjeta
                }))
                if (carta.idImagen) {
                    g.appendChild(crearReferenciaAElemento(carta.idImagen, {
                        x: xTarjeta+anchoTarjeta/2-carta.anchoImagen/2,
                        y: alto/2-carta.altoImagen/2
                    }))
                }
                if (carta.conrepeticion && carta.repeticiones.length > 0) {
                    let altoTotalRepeticiones = carta.repeticiones.reduce((total, rep) => total + rep.altoTotal, 0)
                    altoTotalRepeticiones = altoTotalRepeticiones+(carta.repeticiones.length-1)*10
                    let yStart = alto / 2 - altoTotalRepeticiones / 2
                    carta.repeticiones.forEach(repeticion => {
                        switch(repeticion.formaRepeticion) {
                            case 'izq/der':
                                repeticionIzqDer(g, repeticion, xTarjeta+anchoTarjeta/2, yStart)
                                break
                            case 'diagonal':
                                repeticionDiagonal(g, repeticion, xTarjeta+anchoTarjeta/2, yStart)
                                break
                            case 'rectangular':
                                repeticionRectangular(g, repeticion, xTarjeta+anchoTarjeta/2, yStart)
                                break
                            default:
                                console.log('no soportado')
                                break
                        }
                        yStart += repeticion.altoTotal + 10
                    })
                }
                break
            case 'naipe ingles':
                g.appendChild(crearElemento('rect', {//agrega rectangulo para poner fondo de color
                    x: xTarjeta+1,
                    y: yTarjeta+1,
                    width: anchoTarjeta-2,
                    height: altoTarjeta-2,
                    rx: '5',
                    ry: '5',
                    stroke: 'none',
                    fill: carta.colorFondo
                }))
                g.appendChild(crearElementoDeImagen(`../../../../imagenes_front/cartas/${carta.pinta}_${carta.numero}.svg`, {
                    id: `${tarjeta.pinta}_${tarjeta.numero}`,
                    x: xTarjeta,
                    y: yTarjeta,
                    height: altoTarjeta,
                    width: anchoTarjeta
                }))
                break
            case 'borde':
                g.appendChild(crearElemento('rect', {//agrega rectangulo para poner fondo de color
                    x: xTarjeta + carta.grosorBorde/2,
                    y: yTarjeta + carta.grosorBorde/2,
                    width: anchoTarjeta - carta.grosorBorde,
                    height: altoTarjeta - carta.grosorBorde,
                    rx: '5',
                    ry: '5',
                    stroke: carta.colorBorde,
                    fill: carta.colorFondo,
                    strokeWidth: carta.grosorBorde
                }))
                if(carta.idImagen) {
                    g.appendChild(crearReferenciaAElemento(carta.idImagen, {
                        x: xTarjeta+anchoTarjeta/2-carta.anchoImagen/2,
                        y: alto/2-carta.altoImagen/2
                    }))
                }
                if (carta.conrepeticion && carta.repeticiones.length > 0) {
                    let altoTotalRepeticiones = carta.repeticiones.reduce((total, rep) => total + rep.altoTotal, 0)
                    altoTotalRepeticiones = altoTotalRepeticiones+(carta.repeticiones.length-1)*10
                    let yStart = alto / 2 - altoTotalRepeticiones / 2
                    carta.repeticiones.forEach(repeticion => {
                        switch(repeticion.formaRepeticion) {
                            case 'izq/der':
                                repeticionIzqDer(g, repeticion, xTarjeta+anchoTarjeta/2, yStart)
                                break
                            case 'diagonal':
                                repeticionDiagonal(g, repeticion, xTarjeta+anchoTarjeta/2, yStart)
                                break
                            case 'rectangular':
                                repeticionRectangular(g, repeticion, xTarjeta+anchoTarjeta/2, yStart)
                                break
                            default:
                                console.log('no soportado')
                                break
                        }
                        yStart += repeticion.altoTotal + 10
                    })
                }
                break
            case 'invertida':
                g.appendChild(crearReferenciaAElemento('reversocarta', {
                    x: xTarjeta,
                    y: yTarjeta
                }))
                break
        }
        if(carta.texto) {
            let textolmnt = crearElementoDeTexto({
                x: xTarjeta+anchoTarjeta/2,
                y: carta.yTexto,
                fontSize: carta.altoFuente,
                textAnchor: 'middle',
                fill: carta.colorTexto,
                style: 'font-family:Quicksand;'
            }, carta.texto)
            if(carta.texto === '6' || carta.texto === '9') {
                textolmnt.setAttributeNS(null, 'text-decoration', 'underline')
            }
            g.appendChild(textolmnt)
        }
        container.appendChild(g)
    })
    
    function getcartas(carta) {
        let nombreImagen = regex(carta.imagen, vars, vt)
        let idImagen = carta.imagen !== 'Seleccione' ? `${container.id}-${nombreImagen}` : null
        let imagen = carta.imagen !== 'Seleccione' ? imagenes.find(img => img.id === idImagen) : null
        return {
            imagen: nombreImagen,
            idImagen,
            altoImagen: carta.imagen !== 'Seleccione' ? imagen.alto : 0,
            anchoImagen: carta.imagen !== 'Seleccione' ? imagen.ancho : 0,
            tipo: carta.tipo,
            colorBorde: carta.colorBorde,
            grosorBorde: Number(carta.grosorBorde),
            frontal: carta.frontal === 'si' ? true : false,
            texto: carta.texto ? regexFunctions(regex(carta.texto, vars, vt)) : '',
            colorTexto: carta.colorTexto,
            altoFuente: Number(carta.altoFuente),
            yTexto: Number(carta.yTexto),
            pinta: carta.pinta ? regexFunctions(regex(carta.pinta, vars, vt)) : '',
            numero: carta.numero ? regexFunctions(regex(carta.numero, vars, vt)) : '',
            colorFondo: carta.colorFondo,
            conrepeticion: carta.conrepeticion === 'si' ? true : false,
            repeticiones: (carta.repeticiones && carta.conrepeticion === 'si') ? carta.repeticiones.map((x, indexRepeticion) => {
                let nombreImagen = regex(x.imagen, vars, vt)
                let idImagen = `${container.id}-${nombreImagen}`
                let imagen = x.imagen !== 'Seleccione' ? imagenes.find(img => img.id === idImagen) : null
                let anchoTotal, altoTotal, cantidad, separacionX, separacionY, repeticionX, repeticionY, limite
                switch(x.formaRepeticion) {
                        case 'izq/der':
                            cantidad = Number(regexFunctions(regex(x.cantidad, vars, vt)))
                            separacionX = Number(x.separacionX)
                            separacionY = Number(x.separacionY)
                            limite = Number(regexFunctions(regex(x.limite, vars, vt)))
                            anchoTotal = cantidad < limite ?
                                cantidad * imagen.ancho + (cantidad-1) * separacionX : 
                                limite * imagen.ancho + (limite-1) * separacionX
                            altoTotal =  Math.ceil(cantidad/limite) * imagen.alto + (Math.ceil(cantidad/limite)-1) * separacionY
                            return {
                                imagen,
                                formaRepeticion:x.formaRepeticion,
                                cantidad,
                                separacionX,
                                separacionY,
                                limite,
                                anchoTotal,
                                altoTotal
                            }
                        case 'diagonal':
                            cantidad = Number(regexFunctions(regex(x.cantidad, vars, vt)))
                            separacionX = Number(x.separacionX)
                            separacionY = Number(x.separacionY)
                            anchoTotal = imagen.ancho + (cantidad-1) * separacionX
                            altoTotal = imagen.alto + (cantidad-1) * separacionY
                            return {
                                imagen,
                                formaRepeticion:x.formaRepeticion,
                                cantidad,
                                separacionX,
                                separacionY,
                                anchoTotal,
                                altoTotal
                            }
                        case 'rectangular':
                            repeticionX = Number(regexFunctions(regex(x.repeticionX, vars, vt)))
                            repeticionY = Number(regexFunctions(regex(x.repeticionY, vars, vt)))
                            separacionX = Number(x.separacionX)
                            separacionY = Number(x.separacionY)
                            anchoTotal = imagen.ancho * repeticionX + separacionX * (repeticionX-1)
                            altoTotal = imagen.alto * repeticionY + separacionY * (repeticionY-1)
                            return {
                                imagen,
                                formaRepeticion:x.formaRepeticion,
                                separacionX,
                                separacionY,
                                repeticionX,
                                repeticionY,
                                anchoTotal,
                                altoTotal
                            }
                    }
                }) : [],
            x: Number(carta.x),
            y: Number(carta.y),
            rotacion: Number(carta.rotacion)
        }
    }


    async function getImagen(imagen) {
		let src = regexFunctions(regex(imagen.src, vars, vt)).replace(`https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-${nivelEjercicio}/`, '../../../../')
        let imagenCargada = await cargaImagen(src)
        let alto = Number(imagen.alto)
        let ancho = alto * imagenCargada.width / imagenCargada.height
        let id = container.id + '-' + src.split('/').pop().replace('.svg','').replace(/%20/g,'-')
		defs.appendChild(crearElementoDeImagen(src,{id,height:alto,width:ancho}))
		return {
			id, 
            src, 
            alto, 
            ancho
		}
    }
    
    function repeticionIzqDer(grupo, repeticion, centroHorizontal, inicioRepeticionVertical) {
		const { anchoTotal, limite, separacionX, separacionY, imagen, cantidad } = repeticion
		for(let i = 0, acum = 0; i < cantidad; i++) {
			let xRepeticion = centroHorizontal - anchoTotal/2 + acum * separacionX + imagen.ancho * acum
			let yRepeticion = inicioRepeticionVertical + Math.floor(i/limite) * imagen.alto + Math.floor(i/limite) * separacionY
			grupo.appendChild(crearReferenciaAElemento(imagen.id, {
				x: xRepeticion,
				y: yRepeticion
			}))
			if(acum === limite-1) {
				acum = 0
			} else {
				acum++
			}
		}
	}

	function repeticionDiagonal(grupo, repeticion, centroHorizontal, inicioRepeticionVertical) {
		const { imagen, cantidad, separacionX, separacionY, anchoTotal } = repeticion
		for(let i = 0; i < cantidad; i++) {
			let xRepeticion = centroHorizontal - anchoTotal/2 + i * separacionX
			let yRepeticion = inicioRepeticionVertical + i * separacionY
			grupo.appendChild(crearReferenciaAElemento(imagen.id, {
				x: xRepeticion,
				y: yRepeticion
			}))
		}
	}

	function repeticionRectangular(grupo, repeticion, centroHorizontal, inicioRepeticionVertical) {
		const { imagen, separacionX, separacionY, repeticionX, repeticionY, anchoTotal } = repeticion
		for(let v = 0, yRepeticion; v < repeticionY; v++) {
			yRepeticion = inicioRepeticionVertical + v * imagen.alto + v * separacionY
			for(let h = 0, xRepeticion; h < repeticionX; h++) {
				xRepeticion = centroHorizontal - anchoTotal/2 + h * imagen.ancho + h * separacionX
				grupo.appendChild(crearReferenciaAElemento(imagen.id, {
					x: xRepeticion,
					y: yRepeticion
				}))
			}
		}
	}

    function crearElementoDeImagen(src, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'image')
		element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	function crearReferenciaAElemento(id, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'use')
		element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${id}`)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	function crearElemento(nombre, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', nombre)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
    }
    
    function crearElementoSymbol(viewBox, atributos) {
        let element = document.createElementNS('http://www.w3.org/2000/svg', 'symbol')
        element.setAttributeNS(null, 'viewBox', viewBox)
        for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
        }
        return element
    }

	function crearElementoDeTexto(atributos, texto) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'text')
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		let textNode = document.createTextNode(texto)
		element.appendChild(textNode)
		return element
	}
}

async function balanza(config) {
	const { container, params, variables, versions, vt } = config;
	let {
		altoSVG,
		anchoSVG,
		altoBalanza,
		valorDerecho,
		valorIzquierdo,
		brazoDerecho,
		brazoIzquierdo,
		conBalanza,
		imagenes,
		anchoCuadro,
		altoCuadro,
		altoBolsa,
		textoDerecho,
		textoIzquierdo,
		textoSuperiorIzquierdo,
		textoSuperiorDerecho
	} = params

	let vars = vt ? variables : versions

	container.setAttributeNS(null, 'height', altoSVG)
	container.setAttributeNS(null, 'width', anchoSVG)
	container.setAttributeNS(null, 'viewBox', `0 0 ${anchoSVG} ${altoSVG}`)

	let defs = crearElemento('defs', {})
	let styles = document.createElement('style')
	styles.innerHTML = '@font-face{font-family:"Quicksand";src:url("../../../../fonts/Quicksand-Medium.ttf");}'
	defs.appendChild(styles)
	altoBolsa = Number(altoBolsa)
	let imgSrcBolsa = `../../../../imagenes_front/bolsa/Bolsa.svg`
	let imgBolsa = await cargaImagen(imgSrcBolsa)
	let anchoBolsa = altoBolsa * imgBolsa.width / imgBolsa.height
	defs.appendChild(crearElementoDeImagen(imgSrcBolsa, {
		id: `${container.id}-bolsa`,
		height: altoBolsa,
		width: anchoBolsa
	}))
	container.appendChild(defs)
	
	altoSVG = Number(altoSVG)
	anchoSVG = Number(anchoSVG)
	altoBalanza = Number(altoBalanza)
	anchoCuadro = Number(anchoCuadro)
	altoCuadro = Number(altoCuadro)
	textoDerecho = regexFunctions(regex(textoDerecho, vars, vt))
	textoIzquierdo = regexFunctions(regex(textoIzquierdo, vars, vt))
	textoSuperiorIzquierdo = regexFunctions(regex(textoSuperiorIzquierdo, vars, vt))
	textoSuperiorDerecho = regexFunctions(regex(textoSuperiorDerecho, vars, vt))
	conBalanza = conBalanza === 'si' ? true : false
	valorDerecho = Number(regexFunctions(regex(valorDerecho, vars, vt)))
	valorIzquierdo = Number(regexFunctions(regex(valorIzquierdo, vars, vt)))
	imagenes = imagenes ? await Promise.all(imagenes.map(x => getImagen(x))) : []
	brazoDerecho = brazoDerecho ? brazoDerecho.map(x => getOpcion(x)) : []
	brazoIzquierdo = brazoIzquierdo ? brazoIzquierdo.map(x => getOpcion(x)) : []

	let anchoTotalBrazoDerecho = brazoDerecho.reduce((total, rep) => total + rep.anchoTotal, 0)
	let anchoTotalBrazoIzquierdo = brazoIzquierdo.reduce((total, rep) => total + rep.anchoTotal, 0)
	
	let altoMaximoBrazoIzquierdo = Math.max(...brazoIzquierdo.map(x => x.altoTotal))
	let altoMaximoBrazoDerecho = Math.max(...brazoDerecho.map(x => x.altoTotal))
	let estadoBalanza = valorIzquierdo > valorDerecho ? 'Pesada_Izquierda' : valorIzquierdo < valorDerecho ? 'Pesada_Derecha' : 'Equilibrada'

	if(conBalanza) { 
		let imgSrcBalanza = `../../../../imagenes_front/balanzas/Balanza_${estadoBalanza}.svg`
		let imgBalanza = await cargaImagen(imgSrcBalanza)
		let anchoBalanza = altoBalanza * imgBalanza.width / imgBalanza.height
		let xBalanza = anchoSVG/2 - anchoBalanza/2
		let yBalanza = altoSVG - altoBalanza
		container.appendChild(crearElementoDeImagen(imgSrcBalanza, {
			x: xBalanza,
			y: yBalanza,
			width: anchoBalanza,
			height: altoBalanza
		}))

		brazoIzquierdo.length > 0 && creaSymbolDeBrazo(`${container.id}-braIzq`, brazoIzquierdo, anchoTotalBrazoIzquierdo, altoMaximoBrazoIzquierdo)
		brazoDerecho.length > 0 && creaSymbolDeBrazo(`${container.id}-braDer`, brazoDerecho, anchoTotalBrazoDerecho, altoMaximoBrazoDerecho)

		let anchoBrazoBalanza = anchoBalanza * 0.335

		let xCentroBrazoIzquierdo = xBalanza + anchoBrazoBalanza / 2
		let xCentroBrazoDerecho = xBalanza + anchoBalanza - anchoBrazoBalanza / 2
		let yBrazoIzquierdo, yBrazoDerecho, yBrazos

		switch(estadoBalanza) {
			case 'Pesada_Izquierda':
				yBrazoIzquierdo = altoSVG - altoBalanza * 0.60
				yBrazoDerecho = yBalanza
				container.appendChild(crearReferenciaAElemento(`${container.id}-braIzq`, {
					x: xCentroBrazoIzquierdo-anchoTotalBrazoIzquierdo/2,
					y: yBrazoIzquierdo-altoMaximoBrazoIzquierdo,
					width: anchoTotalBrazoIzquierdo,
					height: altoMaximoBrazoIzquierdo
				}))
				container.appendChild(crearReferenciaAElemento(`${container.id}-braDer`, {
					x: xCentroBrazoDerecho-anchoTotalBrazoDerecho/2,
					y: yBrazoDerecho-altoMaximoBrazoDerecho,
					width: anchoTotalBrazoDerecho,
					height: altoMaximoBrazoDerecho
				}))
				
				break
			case 'Pesada_Derecha':
				yBrazoIzquierdo = yBalanza
				yBrazoDerecho = altoSVG - altoBalanza * 0.60
				container.appendChild(crearReferenciaAElemento(`${container.id}-braIzq`, {
					x: xCentroBrazoIzquierdo-anchoTotalBrazoIzquierdo/2,
					y: yBrazoIzquierdo-altoMaximoBrazoIzquierdo,
					width: anchoTotalBrazoIzquierdo,
					height: altoMaximoBrazoIzquierdo
				}))
				container.appendChild(crearReferenciaAElemento(`${container.id}-braDer`, {
					x: xCentroBrazoDerecho-anchoTotalBrazoDerecho/2,
					y: yBrazoDerecho-altoMaximoBrazoDerecho,
					width: anchoTotalBrazoDerecho,
					height: altoMaximoBrazoDerecho
				}))
				break
			case 'Equilibrada':
				yBrazos = altoSVG - altoBalanza * 0.7857
				container.appendChild(crearReferenciaAElemento(`${container.id}-braIzq`, {
					x: xCentroBrazoIzquierdo-anchoTotalBrazoIzquierdo/2,
					y: yBrazos-altoMaximoBrazoIzquierdo,
					width: anchoTotalBrazoIzquierdo,
					height: altoMaximoBrazoIzquierdo
				}))
				container.appendChild(crearReferenciaAElemento(`${container.id}-braDer`, {
					x: xCentroBrazoDerecho-anchoTotalBrazoDerecho/2,
					y: yBrazos-altoMaximoBrazoDerecho,
					width: anchoTotalBrazoDerecho,
					height: altoMaximoBrazoDerecho
				}))
				break
		}
		if(textoDerecho) {
			container.appendChild(crearElementoDeTexto({
				x: xBalanza + anchoBalanza + 5,
				y: estadoBalanza === 'Equilibrada' ? yBrazos : yBrazoDerecho,
				fontSize: '20',
				textAnchor: 'start',
				fill: '#363026',
				style: 'font-family:Quicksand;'
			}, textoDerecho))
		}
		if(textoIzquierdo) {
			container.appendChild(crearElementoDeTexto({
				x: xBalanza - 5,
				y: estadoBalanza === 'Equilibrada' ? yBrazos : yBrazoIzquierdo,
				fontSize: '20',
				textAnchor: 'end',
				fill: '#363026',
				style: 'font-family:Quicksand;'
			}, textoIzquierdo))
		}
		if(textoSuperiorIzquierdo) {
			container.appendChild(crearElementoDeTexto({
				x: xCentroBrazoIzquierdo,
				y: estadoBalanza === 'Equilibrada' ? yBrazos - altoMaximoBrazoIzquierdo - 5 : yBrazoIzquierdo - altoMaximoBrazoIzquierdo - 5,
				fontSize: '20',
				textAnchor: 'middle',
				fill: '#363026',
				style: 'font-family:Quicksand;'
			}, textoSuperiorIzquierdo))
		}
		if(textoSuperiorDerecho) {
			container.appendChild(crearElementoDeTexto({
				x: xCentroBrazoDerecho,
				y: estadoBalanza === 'Equilibrada' ? yBrazos - altoMaximoBrazoDerecho - 5 : yBrazoDerecho - altoMaximoBrazoDerecho - 5,
				fontSize: '20',
				textAnchor: 'middle',
				fill: '#363026',
				style: 'font-family:Quicksand;'
			}, textoSuperiorDerecho))
		}
	} else {
		let anchoTotalSinBalanza = anchoTotalBrazoDerecho + anchoTotalBrazoIzquierdo + 30 * (brazoDerecho.length + brazoIzquierdo.length - 1)
		let xInicio = anchoSVG/2 - anchoTotalSinBalanza/2
		let relaciones = [...brazoIzquierdo, { tipo: 'separador', anchoTotal: 0 } , ...brazoDerecho]
		relaciones.forEach((opcion, indexOpcion) => {
			switch(opcion.tipo) {
				case 'bolsa repeticion':
					container.appendChild(crearReferenciaAElemento(`${container.id}-bolsa`, {
						x: xInicio,
						y: altoSVG/2-altoBolsa/2
					}))
					repeticionIzqDer(container, opcion, xInicio+opcion.anchoTotal/2, altoSVG/2+opcion.altoTotal/2-opcion.separacionBrazo)
					break
				case 'bolsa texto':
					container.appendChild(crearReferenciaAElemento(`${container.id}-bolsa`, {
						x: xInicio,
						y: altoSVG/2-altoBolsa/2
					}))
					container.appendChild(crearElementoDeTexto({
						x: xInicio+opcion.anchoTotal/2,
						y: altoSVG/2+opcion.altoTotal/2-opcion.separacionBrazo,
						fontSize: opcion.alto,
						textAnchor: 'middle',
						fill: opcion.color,
						style: 'font-family:Quicksand;'
					}, opcion.texto))
					break
				case 'repeticion pictorico':
					repeticionIzqDer(container, opcion, xInicio+opcion.anchoTotal/2, altoSVG/2+opcion.altoTotal/2)
					break
				case 'caja texto':
					container.appendChild(crearElemento('rect', {
						x: xInicio+1,
						y: altoSVG/2 - altoCuadro/2,
						width: anchoCuadro,
						height: altoCuadro,
						stroke: opcion.colorCaja,
						strokeWidth: '2',
						fill: 'none'
					}))
					container.appendChild(crearElementoDeTexto({
						x: xInicio+opcion.anchoTotal/2-2,
						y: altoSVG/2 + altoCuadro/2 - opcion.separacionBrazo ,
						fontSize: opcion.alto,
						textAnchor: 'middle',
						fill: opcion.colorTexto,
						style: 'font-family:Quicksand;'
					}, opcion.texto))
					break
				default:
					//no hace nada
					break
			}
			if(opcion.tipo !== 'separador' && relaciones[indexOpcion+1]) {
				if(relaciones[indexOpcion+1].tipo === 'separador') {
					let simboloEquivalencia = estadoBalanza === 'Equilibrada' ? '=' : estadoBalanza === 'Pesada_Derecha' ? '<' : '>'
					container.appendChild(crearElementoDeTexto({
						x: xInicio + opcion.anchoTotal + 15,
						y: altoSVG/2 + 10,
						fontSize: '30',
						textAnchor: 'middle',
						fill: '#1F8EBE',
						style: 'font-family:Quicksand;'
					}, simboloEquivalencia))
				} else {
					container.appendChild(crearElementoDeTexto({
						x: xInicio + opcion.anchoTotal + 15,
						y: altoSVG/2 + 10,
						fontSize: '30',
						textAnchor: 'middle',
						fill: '#1F8EBE',
						style: 'font-family:Quicksand;'
					}, '+'))
				}
				xInicio += opcion.anchoTotal + 30
			}
		})
		if(textoSuperiorIzquierdo) {
			container.appendChild(crearElementoDeTexto({
				x: anchoSVG/2 - anchoTotalSinBalanza/2 + (anchoTotalBrazoIzquierdo + 30 * (brazoIzquierdo.length-1))/2,
				y: altoSVG/2 - altoMaximoBrazoIzquierdo/2 - 5,
				fontSize: '20',
				textAnchor: 'middle',
				fill: '#363026',
				style: 'font-family:Quicksand;'
			}, textoSuperiorIzquierdo))
		}
		if(textoSuperiorDerecho) {
			container.appendChild(crearElementoDeTexto({
				x: anchoSVG/2 - anchoTotalSinBalanza/2 + (anchoTotalBrazoIzquierdo + 30 * (brazoIzquierdo.length-1)) + (anchoTotalBrazoDerecho + 30 * (brazoDerecho.length-1))/2 + 30,
				y: altoSVG/2 - altoMaximoBrazoIzquierdo/2 - 5,
				fontSize: '20',
				textAnchor: 'middle',
				fill: '#363026',
				style: 'font-family:Quicksand;'
			}, textoSuperiorDerecho))
		}
	}

	function creaSymbolDeBrazo(id, brazo, anchoBrazo, altoBrazo) {
		let symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol')
		symbol.setAttributeNS(null,'id', id)
		symbol.setAttributeNS(null,'width', anchoBrazo)
		symbol.setAttributeNS(null,'height', altoBrazo)
		symbol.setAttributeNS(null,'viewBox', `0 0 ${anchoBrazo} ${altoBrazo}`)
		let xInicio = 0
		brazo.forEach(opcion => {
			switch(opcion.tipo) {
				case 'bolsa repeticion':
					symbol.appendChild(crearReferenciaAElemento(`${container.id}-bolsa`, {
						x: xInicio,
						y: altoBrazo - altoBolsa
					}))
					repeticionIzqDer(symbol, opcion, xInicio+opcion.anchoTotal/2, altoBrazo-opcion.separacionBrazo)
					break
				case 'bolsa texto':
					symbol.appendChild(crearReferenciaAElemento(`${container.id}-bolsa`, {
						x: xInicio,
						y: altoBrazo - altoBolsa
					}))
					symbol.appendChild(crearElementoDeTexto({
						x: xInicio+opcion.anchoTotal/2,
						y: altoBrazo-opcion.separacionBrazo,
						fontSize: opcion.alto,
						textAnchor: 'middle',
						fill: opcion.color,
						style: 'font-family:Quicksand;'
					}, opcion.texto))
					break
				case 'repeticion pictorico':
					repeticionIzqDer(symbol, opcion, xInicio+opcion.anchoTotal/2, altoBrazo)
					break
				case 'caja texto':
					symbol.appendChild(crearElemento('rect', {
						x: xInicio+1,
						y: altoBrazo - altoCuadro,
						width: anchoCuadro,
						height: altoCuadro,
						stroke: opcion.colorCaja,
						strokeWidth: '2',
						fill: 'none'
					}))
					symbol.appendChild(crearElementoDeTexto({
						x: xInicio+opcion.anchoTotal/2-2,
						y: altoBrazo-opcion.separacionBrazo,
						fontSize: opcion.alto,
						textAnchor: 'middle',
						fill: opcion.colorTexto,
						style: 'font-family:Quicksand;'
					}, opcion.texto))
					break
			}
			xInicio += opcion.anchoTotal
		})
		defs.appendChild(symbol)
	}

	function repeticionIzqDer(grupo, repeticion, centroHorizontal, inicioRepeticionVertical) {
		const { tipo, anchoTotal, anchoRepeticion, limiteHorizontal, imagen, cantidad, separacionX, separacionY } = repeticion
		let anchoTotalRep = tipo === 'repeticion pictorico' ? anchoTotal : anchoRepeticion
		for(let i = 0, acum = 0; i < cantidad; i++) {
			let xRepeticion = centroHorizontal - anchoTotalRep/2 + (imagen.ancho+separacionX) * acum
			let yRepeticion = inicioRepeticionVertical - imagen.alto - (imagen.alto+separacionY) * Math.floor(i/limiteHorizontal)
			grupo.appendChild(crearReferenciaAElemento(imagen.id, {
				x: xRepeticion,
				y: yRepeticion
			}))
			if(acum === limiteHorizontal-1) {
				acum = 0
			} else {
				acum++
			}
		}
	}	
	
	function getOpcion(opcion) {
		let cantidad,limiteHorizontal,imagen
		switch(opcion.tipo) {
			case 'bolsa repeticion':
				cantidad = Number(regexFunctions(regex(opcion.cantidad, vars, vt)))
				limiteHorizontal = Number(regexFunctions(regex(opcion.limiteHorizontal, vars, vt)))
				imagen = opcion.imagen !== 'Seleccione' ? imagenes.find(x => x.id === `${container.id}-${opcion.imagen}`) : null
				
				return {
					tipo: opcion.tipo,
					imagen,
					cantidad,
					limiteHorizontal,
					separacionX: Number(opcion.separacionX),
					separacionY: Number(opcion.separacionY),
					separacionBrazo: Number(opcion.separacionBrazo),
					anchoRepeticion: cantidad < limiteHorizontal ?
						(imagen.ancho + Number(opcion.separacionX)) * cantidad - Number(opcion.separacionX) : 
						(imagen.ancho + Number(opcion.separacionX)) * limiteHorizontal - Number(opcion.separacionX),
					anchoTotal: anchoBolsa,
					altoTotal: altoBolsa
				}
			case 'bolsa texto':
				return {
					tipo: opcion.tipo,
					texto: regexFunctions(regex(opcion.texto, vars, vt)),
					alto: Number(opcion.alto),
					color: '#363026',
					separacionBrazo: Number(opcion.separacionBrazo),
					anchoTotal: anchoBolsa,
					altoTotal: altoBolsa
				}
			case 'repeticion pictorico':
				cantidad = Number(regexFunctions(regex(opcion.cantidad, vars, vt)))
				limiteHorizontal = Number(regexFunctions(regex(opcion.limiteHorizontal, vars, vt)))
				imagen = opcion.imagen !== 'Seleccione' ? imagenes.find(x => x.id === `${container.id}-${opcion.imagen}`) : null
				
				return {
					tipo: opcion.tipo,
					imagen,
					cantidad,
					limiteHorizontal,
					separacionX: Number(opcion.separacionX),
					separacionY: Number(opcion.separacionY),
					anchoTotal: cantidad < limiteHorizontal ?
						(imagen.ancho + Number(opcion.separacionX)) * cantidad - Number(opcion.separacionX) : 
						(imagen.ancho + Number(opcion.separacionX)) * limiteHorizontal - Number(opcion.separacionX),
					altoTotal: (imagen.alto + Number(opcion.separacionY)) * Math.ceil(cantidad/limiteHorizontal) - Number(opcion.separacionY)
				}
			case 'caja texto':
				return {
					tipo: opcion.tipo,
					texto: regexFunctions(regex(opcion.texto, vars, vt)),
					alto: Number(opcion.alto),
					colorTexto: '#363026',
					separacionBrazo: Number(opcion.separacionBrazo),
					colorCaja: '#1F8EBE',
					anchoTotal: anchoCuadro+4,
					altoTotal: altoCuadro
				}
		}
	}
	
	async function getImagen(imagen) {
		let src =  convertirARutaRelativa(regexFunctions(regex(imagen.src, vars, vt)))
        let imagenCargada = await cargaImagen(src)
        let alto = Number(imagen.alto)
        let ancho = alto * imagenCargada.width / imagenCargada.height
        let id = container.id + '-' + src.split('/').pop().replace('.svg','').replace(/%20/g,'-')
		defs.appendChild(crearElementoDeImagen(src,{id,height:alto,width:ancho}))
		return {
			id, 
            src, 
            alto, 
            ancho
		}
	}

	function crearElementoDeImagen(src, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'image')
		element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	function crearReferenciaAElemento(id, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'use')
		element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${id}`)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	function crearElemento(nombre, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', nombre)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	function crearElementoDeTexto(atributos, texto) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'text')
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		let textNode = document.createTextNode(texto)
		element.appendChild(textNode)
		return element
	}
}

function patronSegmentos(config) {
	const { container, params, variables, versions, vt } = config;
	//container.innerHTML = ''
	//container.style.border = '1px solid #000'
	let {
		altoSVG,
		anchoSVG,
		esFosforo,
		largo,
		grosor,
		dimensionCabeza,
		tipoPatron,
		patron,
		palitos,
		repeticiones,
		separacionPalitos,
		separacionFiguras,
		anguloDiagonal,
		textos
	} = params
	let vars = vt ? variables : versions
	//defs para imagenes y fuentes
	let defs = crearElemento('defs', {})
	let styles = document.createElement('style')
	styles.innerHTML = `
		@font-face{
			font-family:"Quicksand";
			src:url("https://desarrolloadaptatin.blob.core.windows.net/sistemaejercicios/ejercicios/Nivel-3/fonts/Quicksand-Medium.ttf");
		}
		.fosforo {
			stroke:${esFosforo === 'si' ? '#EC9C79' : '#1F8EBE'};
			stroke-width:${grosor};
		}
	`
	defs.appendChild(styles)
	container.appendChild(defs)
	//trata de variables
	altoSVG = Number(altoSVG)
	anchoSVG = Number(anchoSVG)
	patron = patron ? regexFunctions(regex(patron, vars, vt)).split('&') : ''
	largo = Number(largo)
	palitos = palitos ? Number(regexFunctions(regex(palitos, vars, vt))) : 0
	repeticiones = repeticiones ? Number(regexFunctions(regex(repeticiones, vars, vt))) : 0
	anguloDiagonal = Number(anguloDiagonal)
	separacionFiguras = Number(separacionFiguras)
	esFosforo = esFosforo === 'si' ? true : false
	let radioX = dimensionCabeza ? Number(dimensionCabeza.split(',')[0]) : 0
	let radioY = dimensionCabeza ? Number(dimensionCabeza.split(',')[1]) : 0
	let sep = Number(separacionPalitos)
	let palitosArr = []
	let g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
	//define tamaño del canvas
	container.setAttribute('height', altoSVG)
	container.setAttribute('width', anchoSVG)
	container.setAttribute('viewBox', `0 0 ${anchoSVG} ${altoSVG}`)

	if(palitos) {
		dibujaPatronPersonalizado(palitos)
	} else {
		let cantPalitos = patron.length * repeticiones
		dibujaPatronPersonalizado(cantPalitos)
	}
	function dibujaPatronPersonalizado(palitos) {
		let lastX = 0, lastY = 0, sepX = 0, sepY = 0
		for(let i=0, newX, newY, centroX, centroY; i < palitos; i++) {
			let indicePatron = i % patron.length
			let [ movimiento, largoVector, anguloVector, textoVector, movTextoX, movTextoY, alineacionTexto ] = patron[indicePatron].split(',')
			largoVector = largoVector ? Number(largoVector) : largo
			anguloVector = anguloVector ? Number(anguloVector) : anguloDiagonal
			movTextoX = movTextoX ? Number(movTextoX) : 0
			movTextoY = movTextoY ? Number(movTextoY) : 0
			alineacionTexto = alineacionTexto ? alineacionTexto : 'middle'
			switch(movimiento) {
				case 'R':
					lastX += sep
					newX = lastX + largoVector
					newY = lastY
					sepX = sep
					sepY = 0
					centroX = lastX + largoVector/2
					centroY = lastY + movTextoY
					break
				case 'L':
					lastX -= sep
					newX = lastX - largoVector
					newY = lastY
					sepX = -sep
					sepY = 0
					centroX = lastX - largoVector/2
					centroY = lastY + movTextoY
					break
				case 'U':
					lastY -= sep 
					newX = lastX
					newY = lastY - largoVector
					sepX = 0
					sepY = -sep
					centroX = lastX + movTextoX
					centroY = lastY - largoVector/2
					break
				case 'D':
					lastY += sep
					newX = lastX
					newY = lastY + largoVector
					sepX = 0
					sepY = sep
					centroX = lastX + movTextoX
					centroY = lastY + largoVector/2
					break
				case 'RU':
					lastX += sep * Math.cos(anguloVector * Math.PI / 180)
					lastY -= sep * Math.sin(anguloVector * Math.PI / 180)
					newX = lastX + largoVector * Math.cos(anguloVector * Math.PI / 180)
					newY = lastY - largoVector * Math.sin(anguloVector * Math.PI / 180)
					sepX = sep * Math.cos(anguloVector * Math.PI / 180)
					sepY = -sep * Math.sin(anguloVector * Math.PI / 180)
					centroX = lastX + largoVector/2 * Math.cos(anguloVector * Math.PI / 180) + movTextoX
					centroY = lastY - largoVector/2 * Math.sin(anguloVector * Math.PI / 180) + movTextoY
					break
				case 'RD':
					lastX += sep * Math.cos(anguloVector * Math.PI / 180)
					lastY += sep * Math.sin(anguloVector * Math.PI / 180)
					newX = lastX + largoVector * Math.cos(anguloVector * Math.PI / 180)
					newY = lastY + largoVector * Math.sin(anguloVector * Math.PI / 180)
					sepX = sep * Math.cos(anguloVector * Math.PI / 180)
					sepY = sep * Math.sin(anguloVector * Math.PI / 180)
					centroX = lastX + largo/2 * Math.cos(anguloVector * Math.PI / 180) + movTextoX
					centroY = lastY + largo/2 * Math.sin(anguloVector * Math.PI / 180) + movTextoY
					break
				case 'LU':
					lastX -= sep * Math.cos(anguloVector * Math.PI / 180)
					lastY -= sep * Math.sin(anguloVector * Math.PI / 180)
					newX = lastX - largoVector * Math.cos(anguloVector * Math.PI / 180)
					newY = lastY - largoVector * Math.sin(anguloVector * Math.PI / 180)
					sepX = -sep * Math.cos(anguloVector * Math.PI / 180)
					sepY = -sep * Math.sin(anguloVector * Math.PI / 180)
					centroX = lastX - largoVector/2 * Math.cos(anguloVector * Math.PI / 180) + movTextoX
					centroY = lastY - largoVector/2 * Math.sin(anguloVector * Math.PI / 180) + movTextoY
					break
				case 'LD':
					lastX -= sep * Math.cos(anguloVector * Math.PI / 180)
					lastY += sep * Math.sin(anguloVector * Math.PI / 180)
					newX = lastX - largoVector * Math.cos(anguloVector * Math.PI / 180)
					newY = lastY + largoVector * Math.sin(anguloVector * Math.PI / 180)
					sepX = -sep * Math.cos(anguloVector * Math.PI / 180)
					sepY = sep * Math.sin(anguloVector * Math.PI / 180)
					centroX = lastX - largoVector/2 * Math.cos(anguloVector * Math.PI / 180) + movTextoX
					centroY = lastY + largoVector/2 * Math.sin(anguloVector * Math.PI / 180) + movTextoY
					break
				case 'MR':
					lastX += largoVector + sep*2
					break
				case 'ML':
					lastX -= largoVector + sep*2
					break
				case 'MU':
					lastY -= largoVector + sep*2
					break
				case 'MD':
					lastY += largoVector + sep*2
					break
				case 'MRU':
					lastX += (largoVector + sep*2) * Math.cos(anguloVector * Math.PI / 180)
					lastY -= (largoVector + sep*2) * Math.sin(anguloVector * Math.PI / 180)
					break
				case 'MRD':
					lastX += (largoVector + sep*2) * Math.cos(anguloVector * Math.PI / 180)
					lastY += (largoVector + sep*2) * Math.sin(anguloVector * Math.PI / 180)
					break
				case 'MLU':
					lastX -= (largoVector + sep*2) * Math.cos(anguloVector * Math.PI / 180)
					lastY -= (largoVector + sep*2) * Math.sin(anguloVector * Math.PI / 180)
					break
				case 'MLD':
					lastX -= (largoVector + sep*2) * Math.cos(anguloVector * Math.PI / 180)
					lastY += (largoVector + sep*2) * Math.sin(anguloVector * Math.PI / 180)
					break
				case 'T':
					lastX += sep * Math.cos(anguloVector * Math.PI / 180)
					lastY += sep * Math.sin(anguloVector * Math.PI / 180)
					newX = lastX + largoVector * Math.cos(anguloVector * Math.PI / 180)
					newY = lastY + largoVector * Math.sin(anguloVector * Math.PI / 180)
					sepX = sep * Math.cos(anguloVector * Math.PI / 180)
					sepY = sep * Math.sin(anguloVector * Math.PI / 180)
					centroX = lastX + largoVector/2 * Math.cos(anguloVector * Math.PI / 180) + movTextoX
					centroY = lastY + largoVector/2 * Math.sin(anguloVector * Math.PI / 180) + movTextoY
					break
				default:
					console.log('la embarre :c')
					break
			}
			if(patron[indicePatron].startsWith('M')) {
				palitos++
				continue
			}
			dibujaPalito(`${container.id}-palito-${i+1}`,lastX,lastY,newX,newY)
			esFosforo && dibujaCabezaFosforo(lastX,lastY,newX,newY)
			if(textoVector) {
				textoVector = regexFunctions(regex(textoVector, vars, vt)).replace(/#/g, i+1)
				g.appendChild(crearElementoDeTexto({
					x: centroX,
					y: centroY+8,
					fontSize: '18',
					textAnchor: alineacionTexto,
					fill: '#363026',
					style: 'font-family:Quicksand;'
				}, textoVector))
			}
			palitosArr.push({
				id: `${container.id}-palito-${i+1}`,
				x1: lastX,
				y1: lastY,
				x2: newX,
				y2: newY
			})
			if(tipoPatron === 'triangulo' && (indicePatron+1) === patron.length) {
				lastX = newX + separacionFiguras + largo
				lastY = lastY
			} else if (tipoPatron === 'cuadrado separado' && (indicePatron+1) === patron.length) {
				lastX = newX + separacionFiguras + largo
				lastY = lastY
			} else {
				lastX = newX + sepX
				lastY = newY + sepY
			}
		}
		let maxX = Math.max(...palitosArr.map(a => a.x2))
		let minX = Math.min(...palitosArr.map(a => a.x1))
		let maxY = Math.max(...palitosArr.map(a => a.y2))
		let minY = Math.min(...palitosArr.map(a => a.y1))
		g.setAttributeNS(null, 'transform', `translate(${anchoSVG/2-(maxX-minX)/2-minX},${altoSVG/2-(maxY-minY)/2-minY})`)
		container.appendChild(g)
	}

	(textos && textos.length > 0) && textos.forEach(texto => {
		let txt = regexFunctions(regex(texto.texto, vars, vt))
		let y = regexFunctions(regex(texto.y, vars, vt))
		let x = regexFunctions(regex(texto.x, vars, vt))
		container.appendChild(crearElementoDeTexto({
			x,
			y,
			fontSize: texto.alto,
			textAnchor: texto.alineacion,
			fill: '#363026',
			style: 'font-family:Quicksand;'
		}, txt))
	})

	function dibujaPalito(id, x1, y1, x2, y2) {
		g.appendChild(crearElemento('line',{id,x1,y1,x2,y2,class:'fosforo'}))
	}

	function dibujaCabezaFosforo(x1, y1, x2, y2) {
		let angulo
		if(x1 !== x2 && y1 === y2) { // horizontalmente
			angulo = 0
		} else if(x1 === x2 && y1 !== y2) { // vertical
			angulo = 90
		} else if((x1 > x2 && y1 > y2) || (x1 < x2 && y1 < y2)) { // pendiente positiva
			angulo = anguloDiagonal
		} else if(x1 !== x2 && y1 !== y2) { // pendiente negativa
			angulo = -anguloDiagonal
		}
		g.appendChild(crearElemento('ellipse', {
			cx: x2,
			cy: y2,
			rx: radioX,
			ry: radioY,
			transform: `rotate(${angulo} ${x2} ${y2})`,
			fill: '#C51611',
			stroke: 'none'
		}))
	}

	function crearElementoDeImagen(src, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'image')
		element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', src)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	function crearReferenciaAElemento(id, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'use')
		element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${id}`)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	function crearElemento(nombre, atributos) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', nombre)
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		return element
	}

	function crearElementoDeTexto(atributos, texto) {
		let element = document.createElementNS('http://www.w3.org/2000/svg', 'text')
		for (let p in atributos) {
			element.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
				return '-' + m.toLowerCase()
			}), atributos[p])
		}
		let textNode = document.createTextNode(texto)
		element.appendChild(textNode)
		return element
	}
}