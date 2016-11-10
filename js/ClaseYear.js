function Year(anio)
{
    //Variables privadas:
    var aHolidays = []; 
    var intYear = anio;
    var bolFirstDayMonday = false;
    
    //Variables públicas
    this.year = (anio === undefined)?(new Date()).getFullYear():anio;
    
    //Propiedad year que solo aceptará valores entre 1900 y 2199.
    Object.defineProperty(this,"year",
    {
        get: function()
        {
            return intYear;
        },
        
        set: function(valor)
        {
            if(/^(19|2[01])[0-9]{2}$/.test(valor))
            {    
                intYear = valor;
            }
            else
            {
                throw new Error("Debe introducir un valor numérico entre 1900 y 2199 en la propiedad 'year'.");
            } 
        }       
    });
    
    //Propiedad firstDayMonday que solo aceptará valores booleanos.
    Object.defineProperty(this,"firstDayMonday",
    {
        get: function()
        {
            return bolFirstDayMonday;
        },
                       
        set: function(valor)
        {
            if (valor === true || valor === false)
            {
                bolFirstDayMonday = valor;
            }
            else
            {
                throw new Error("El valor introducido para la variable firstDayMonday es inválido");
            }    
        }      
    });
    
    //Getter de la propiedad privada aHolidays, devuelve un duplicado del array.
    this.getHolidays = function()
    {
        if (aHolidays !== null)
        {    
        return aHolidays.slice();
        }
        else
        {
            return null;
        }    
    };
    
    //Setter de la propiedad privada aHolidays.
    this.setHolidays = function(valor)
    {   
        if (arguments.length === 0)
        {
            aHolidays = [];
        }
        else
        {
	    //Almacenmos en un array auxilliar lo valores introducidos como argumento.  
            var datAux = (arguments[0] instanceof Array)?arguments[0].slice():Array.prototype.slice.call(arguments);
            for(var intIndice in datAux)//Comprobamos que los valores introducidos sean del tipo Date y que la fecha corresponda al mismo año que el de la instancia del objeto.
            {
                if (!((datAux[intIndice] instanceof Date) && datAux[intIndice].getFullYear() == this.year))
                    throw new Error ("El argumento"+ datAux[intIndice] + "no es correcto")
            }
            aHolidays = datAux;
        }
    };        
}    

//Método auxiliar que usaremos varias veces en esta clase para hacer los cálculos contando si el primer día es lunes o no.
Year.prototype.getDay=function(fecha)
{
    if (!(fecha instanceof Date && fecha.getFullYear() === this.year))
        throw new Error("Error en argumentos de getDay,debe contener un objeto de tipo Date.");   
    return ((this.firstDayMonday) ? (fecha.getDay()===0 ? 6 : (fecha.getDay()-1)) : (fecha.getDay())); 
};

//Devuelve true si el año es bisiesto.
Year.prototype.isLeap=function()
{
    return ((new Date(this.year,1,29)).getDate()==29);  
};

//Devuelve el número de días que tendrá el año.
Year.prototype.numDays=function()
{   
    return ((this.year).isLeap())?366:365;
};

//Devuelve el número de semana de una fecha.
Year.prototype.getNumWeek=function(fecha)
{
    if (!(fecha instanceof Date && fecha.getFullYear() === this.year))//filtrado del tipo del dato introducido como argumento.
        throw new Error("El argumento introducido en getNumWeek debe ser tipo Date y coincidir su año con el de la instancia de clase");
           
    var datUnoEnero = new Date(fecha.getFullYear(),0,1);
    var intDesfase = this.getDay(datUnoEnero);//hacemos uso de nuestra clase para distinguir según el valor de la variable firstdaymonday 
    var intNumeroSemana = Math.ceil((((fecha - datUnoEnero)/86400000)+intDesfase+1)/7);
  
    return intNumeroSemana;
};

Year.prototype.getWeek=function(numeroSemana)
{
    //Comprueba que el número de semana introducido esté entre 0 y 54.
    if (!/^[0-9]{1}$|^[1234]{1}[0-9]{1}$|^5[01234]{1}$/.test(numeroSemana))
        throw new Error("El argumento introducido en getWeek no es válido");
    
    var intDiasTranscurridos = numeroSemana * 7;
    var datUnoEnero = new Date(this.year,0,1);
    //Cálculo teniendo en cuenta el valor de firstdaymonday haciendo uso de nuestra clase getDay()
    var datActual = new Date(this.year,0,(datUnoEnero.getDate()+intDiasTranscurridos)-(this.getDay(datUnoEnero)));
    var aDiasSemana = [];
    var intMas = 1;
    var datNuevaFecha;
    //Rellena el array con fechas desdel el dia de la semana en que nos encontramos(datActual.getDay()) hasta el ultimo(7).
    //El día de la semana lo usaremos además como índice para añadir las fechas al array y que queden en orden.
    for(var intAux = datActual.getDay(); intAux < 7; intAux++)
    {
        datNuevaFecha = new Date(datActual.getTime() + (intMas*1000*24*60*60)); 
        if(datNuevaFecha.getFullYear() == datActual.getFullYear())//Comprobamos que los años coinciden
        {    
            aDiasSemana[intAux] = (new Date(datNuevaFecha)); 
        }
        else
        {
            aDiasSemana[intAux] = null;
        }    
        intMas++;
    }
    //Rellena el array desde el primer dia de la semana(0) hasta el dia en que nos encontramos(datActual.getDay())
    for(intAux = 0; intAux < datActual.getDay();intAux++)
    {
        if(datNuevaFecha.getFullYear() == datActual.getFullYear())
        {    
            datNuevaFecha = new Date(datActual.getTime() - (intAux*1000*24*60*60));
            aDiasSemana[intAux] = (datNuevaFecha);
        }
        else
        {
            aDiasSemana[intAux] = null;
        }            
    }
    
    //Devolverá un array con objetos tipo Date ordenados de menor a mayor, de la fecha más antigua a la más reciente.
    return aDiasSemana;
};

Year.prototype.getMonthCalendar=function(mes)
{
    if(!(/^([0-9])|(1[01])$/.test(mes)))//Filtrado del valor introducido como argumento
        throw new Error("Argumento en getMonthCalendar erroneo.");
    
    var intI;
    var dat1Month = new Date(this.year,mes,1);
    var datDate = new Date(this.year,mes,1 - this.getDay(dat1Month));
    var datEndMonth = new Date(this.year,mes+1,0);//con dia 0 es el ultimo dia del mes anterior.
    
    //Configuramos los nombre de los días y meses a partir del valor de la variable firstDayMonday.
    var strMonthNames = this.firstDayMonday?["Ene","Feb","Mar","Abr","May","Junio","Julio","Ago","Sept","Oct","Nov","Dic"]:["Jan","Feb","Mar","May","Jun","Jul","Ago","Sept","Oct","Nov","Dec"];
    var strNombreDias = this.firstDayMonday?["Lu","Ma","Mi","Ju","Vi","Sa","Do"]:["Su","Mo","Tu","We","Th","Fr","Sa"];
    
    //Cabecera de la tabla con el nombre del mes,el año, y los dos iconos.
    var strHTML = "<table>"+
                            "<tr class='title'>"+
                                "<th><span class='icon-triangle-left'></span></th>"+
                                "<th colspan='5'>"+strMonthNames[mes]+"  - "+this.year+"</th>"+
                                "<th><span class='icon-triangle-right'></span></th>"+
                            "</tr>";
               
    //Fila con el nombre de los días.                
    strHTML += "<tr>";
    for(intI=0;intI<7;intI++)
    {
       strHTML += "<th class='title' >"+strNombreDias[intI]+"</th>"; 
    }                
    strHTML += "</tr>";                
    
	
    //Devuelve true si las dos fechas introducidas como argumentos son iguales.
    //Usaremos esta función a la hora de rellenar las casillas de los días(para comprobar que la fecha que vamos a introducir es o no la del dia de hoy(para añadir o no 'today' al atributo class del elemento td) 
    //y para comprobar si está contenida en el array con los días de vacaciones)
    function sameDay(a,b) 
    {
        if(!(a instanceof Date && b instanceof Date))
            throw new Error("Los argumentos de la función sameDay deben ser ambos de tipo Date");

        return a.getFullYear() === b.getFullYear()
            && a.getDate() === b.getDate()
            && a.getMonth() === b.getMonth();
    }
	
    //Devuelve true si el array contiene la fecha introducida como argumento.
    //Usaremos esta función a la hora de rellenar las casillas de los días del mes. 
    //Si el array contiene la fecha,se añadirá 'holidays' a la clase del elemento <td>.
    Array.prototype.contains = function(fecha) 
    {        
        var i = this.length;
        while (i--) 
        {
                if (sameDay(this[i],fecha))
                {
                return true;
                }
        }
            return false;
    }
	
    //Bucle que irá añadiendo los días del mes
    while(datDate.getTime()  <=  datEndMonth.getTime())
    {
        strHTML += "<tr>";
        for(intI=1;intI<=7;intI++)
        {
	    //Etiqueta de apertura del elemento td, la dejamos sin cerrar porque vamos a comprobar si le tenemos que añadir o no algún valor al atributo class(today,sunday o holidays) además de 'colHeader' que lo tendrán todos como señalan las indicaciones.
            strHTML += "<td class='colHeader ";
            
            //Si el día que vamos a introducir es domingo le añadimos 'sunday'
            strHTML += this.firstDayMonday ? ((intI == 7)?" sunday":""):((intI == 1)?" sunday":"");
            
            //Si el día que vamos a añadir está en el array con los días festivos, añadimos 'holidays'
            strHTML += this.getHolidays().contains(datDate)?" holidays":"";
            
            //Si el día que vamos a añadir es el día actual, añadirmo 'today'
            strHTML += sameDay(datDate,new Date())?" today":"";
            
            //Cerramos la etiqueta de apertura del elemento
            strHTML += "'>";
            
            //Añadimos el número de día. 
            strHTML += (datDate.getMonth() == mes)?datDate.getDate():"&nbsp;";
            
            //Etiqueta de cierre del elemento
            strHTML += "</td>";
            datDate.setDate(datDate.getDate()+1);
            
        }
        strHTML += "</tr>";
    }   
    strHTML += "</table>";
    
    return strHTML;
};



