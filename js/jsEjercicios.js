var numeroIntento = 1;
var fechaEntrada = (new Date()).toLocaleTimeString();
var hiddenParent = window.parent.parent.varHidden; //Comunicacón con frame para resolver ejercicio
var hiddenTutorial = window.parent.parent.varTutorial; //Comunicacón con frame por video tutorial
var hiddenSegundoError = window.parent.parent.varSegundoError; //Comunicacón con frame Segundo error
var hiddenCierraFeed = window.parent.parent.cerrarFeedbackHijo; //Comunicacón con frame Segundo error
var hiddenPressConsulta = window.parent.parent.pressConsulta; //Comunicacón con frame Segundo error

function cambio(elemento){
	numeroIntento = $(elemento).val();
}
	
function enviar(check, errFre){
	var idEjercicio = document.body.dataset.id
	var tipoejercicio = document.body.dataset.tipoejercicio
	var fechaTerminoIntento = new Date();
	var vercionEjercicio = window.location.href.substring(window.location.href.search(idEjercicio)+(String(idEjercicio).length+1),window.location.href.search(".html"));
	
	Date.prototype.yyyymmdd = function() {
	  var mm = this.getMonth() + 1; // getMonth() is zero-based
	  var dd = this.getDate();

	  return [this.getFullYear(),
			  (mm>9 ? '' : '0') + mm,
			  (dd>9 ? '' : '0') + dd
			 ].join('-');
	};

	var date = new Date();
	
	/*---captura valores de los elementos-----*/
	var values = "";
	if(tipoejercicio === 'radio') {
		values = "Valor radio= "+ $("input[name=answer]:checked").val();
	} else {
		var inputs = document.querySelectorAll(".contenido input[name='answer']");
		for(var input of inputs) {
			values += 'Valor input= '+input.value+' ';		
				values += 'Valor input= '+input.value+' ';		
			values += 'Valor input= '+input.value+' ';		
		}
	}
	/*---------------------------------------*/
	var envioIntento = JSON.stringify({ 
		"idejercicioversion":vercionEjercicio,
		"correcto":check ? 1 : 0, 
		"estarea":0 , 
		"idtareaiematricula":0 , 
		"tiempoInicio":""+date.yyyymmdd()+" "+fechaEntrada+"", 
		"tiempoRespuesta":""+date.yyyymmdd()+" "+fechaTerminoIntento.toLocaleTimeString()+"", 
		"feedback": check ? 'Respuesta Correcta' : '', 
		"codigoErrorComun" : errFre ? errFre : 0, 
		"respuesta": values,
		"glosa": numeroIntento == 2 ? 
				$('#contenido-glosa').text()
				.replace(/(\s\s)/g, '')
				.replace(/(\\n)|(\\t)/g, '')
				.trim() : null
	});
	console.log({ errFre })
	/*----Comunicacion de frame a página padre----*/
		$(hiddenParent).val(envioIntento).trigger('change');
		$(hiddenParent).val(envioIntento).trigger('click');
	/*--------------------------------------------*/
	numeroIntento++;
}

function cerrarFeed(){//siguiente ejerccio respuesta correctas
	$(hiddenCierraFeed).val(true).trigger('change');
	$(hiddenCierraFeed).val(true).trigger('click');        
}

function pressConsulta(){
	$(hiddenPressConsulta).val("1").trigger('change');
	$(hiddenPressConsulta).val("1").trigger('click');
}
	
function cerrarFeedGlosa(){//siguiente ejercicio respuesta incorrecta por segunda vez
	$(hiddenSegundoError).val(true).trigger('change');
	$(hiddenSegundoError).val(true).trigger('click');
}
	
function sgteGlosa(){
	$("#imagenBotonRespuesta").css("visibility","hidden");	
	$(hiddenTutorial).val(true).trigger('change');
}