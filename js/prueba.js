var oYear =  new Year(2016);
oYear.setHolidays([new Date(2016,1,25),new Date(2016,1,27)]);
oYear.firstDayMonday = false;
document.write(oYear.getMonthCalendar(1));
document.write("<p><b>Vacaciones:</b>"+oYear.getHolidays()+"</p>");
document.write("<p><b>Semana número 5:</b></p>"+
                "&nbsp;&nbsp;"+oYear.getWeek(5)[0]+"</br>"+
                "&nbsp;&nbsp;"+oYear.getWeek(5)[1]+"</br>"+
                "&nbsp;&nbsp;"+oYear.getWeek(5)[2]+"</br>"+
                "&nbsp;&nbsp;"+oYear.getWeek(5)[3]+"</br>"+
                "&nbsp;&nbsp;"+oYear.getWeek(5)[4]+"</br>"+
                "&nbsp;&nbsp;"+oYear.getWeek(5)[5]+"</br>"+
                "&nbsp;&nbsp;"+oYear.getWeek(5)[6]);
document.write("<p>El año "+oYear.year+(oYear.isLeap()?" es bisiesto":"no es bisiesto")+"</p>");


