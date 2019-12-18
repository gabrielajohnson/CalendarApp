window.onload = function(){

var notesArray = {};
var arrayman;
var notes = document.getElementById("notes");
var count = 1;
var clearbutton = document.getElementById("cleartasks");
clearbutton.addEventListener("click",cleartasks,false);

if(window.localStorage.getItem("persons")){
  var arrayman = JSON.parse(window.localStorage.getItem("persons"));
    for(var key in arrayman){
      var inputblock =  document.createElement("input");
      inputblock.addEventListener("keyup",changeValue,false);
      inputblock.setAttribute("id", "n" + count);
      inputblock.value = arrayman[key];
      count++;
      notes.append(inputblock);
  } 
}else{
  var notesArray = {"n1":"","n2":"","n3":"","n4":"","n5":""};
     for(var key in notesArray){
      var inputblock =  document.createElement("input");
  inputblock.addEventListener("keyup",changeValue,false);
      inputblock.setAttribute("id", key);
      notes.append(inputblock);
  } 
  localStorage.setItem('persons', JSON.stringify(notesArray));
}




var persons = JSON.parse(localStorage.persons);


function changeValue(){
  persons[this.id] = this.value; 
      
  localStorage.setItem("persons", JSON.stringify(persons));  //put the object back

}


function cleartasks(){
  localStorage.clear();
  var notesInput = notes.getElementsByTagName("input");
  
  for(var i = 0; i < notesInput.length;i++){
    notesInput[i].value = "";
  }
}

var weather = document.getElementById("weather");
var el = document.getElementById("weather").getElementsByClassName("description")[0];

/*Weather*/

var xhr = new XMLHttpRequest();

xhr.open("GET", "https://api.openweathermap.org/data/2.5/weather?lat=40.177780&lon=-74.584290&appid=f73299cc3d3bcb102e545dc126c5fa2c"); 

xhr.send();


//  Add a listener function to respond to the HTTP response
xhr.addEventListener("readystatechange", function(){
    if(this.readyState == 4 && this.status == 200){
        var message = JSON.parse(this.response);
        var temp = Math.round(1.8*(message.main.temp - 273) + 32) + "F&#176;";
        var icon = document.createElement("img");
        icon.setAttribute("src",'http://openweathermap.org/img/wn/' + message.weather[0].icon + '.png');
      var newmessage = message.weather[0].description + '<br>' + "Temperature: " + temp;
      el.innerHTML = newmessage;
      weather.appendChild(icon);
    }
});







//Calendar javascript

var calendar = document.getElementById("calendar_days");
//dropdowns
var monthSelect = document.getElementById("monthselect");
var yearSelect = document.getElementById("yearselect");
var eventModal = document.getElementById("eventModal");
var editEventModal = document.getElementById("editEventModal");
var closeButton = document.getElementById("close");
var editclose = document.getElementById("editclose");
var saveButton = document.getElementById("save");
var saveChanges = document.getElementById("saveChanges");
var eventItem = document.getElementById("eventItem");
var editEventItem = document.getElementById("editEventItem");
var clearStorage = document.getElementById("clear_storage");
var d;
var eventDates = [];
var dayIndexforSave;
var eventsMonthYear;
var editItemListItem;
var lists;
var previousListThis;

var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

var years = [2019,2020,2021,2022,2023];

function detectMobile(){
    lists = document.getElementById("calendar").getElementsByTagName("ul");
    if(screen.width < 450 || document.body.clientWidth < 450){
        
      for(var i = 0; i < lists.length; i++){
           if(lists[i].firstChild){
                lists[i].classList.add("mobileList");
           }
      }
    }else{
        for(var i = 0; i < lists.length; i++){
           if(lists[i].firstChild){
                lists[i].classList.remove("mobileList");
           }
            for(var k = 0; k < lists[i].children.length; k++){
                lists[i].children[k].classList.remove("mobileList");
            }
        }

    }
}


function monthLength (month, year) {
    return new Date(year, month, 0).getDate();
}

function generateTime(month,year){
  var daysInMonth = monthLength(month+1,year);

  var row = document.createElement("tr");
  calendar.append(row);

for(var i = 1; i <= daysInMonth; i++){
    d = new Date(year,month,i);
  
    if(d.getDay() == 0 && i != 1){
      row = document.createElement("tr");
      calendar.append(row);
    } 
  
    if(i == 1){
      for(let i=0; i < d.getDay(); i++){
        let block = document.createElement("td");
        row.append(block);
      }
      addDayBlock(row,i);

    }else{
      addDayBlock(row,i);
    }
  }
  
  addEventsToCalendar();
}

function addDayBlock(newrow,i){
      let block = document.createElement("td");
      let blockNum = document.createTextNode(i);
      let eventBlock = document.createElement("ul");
      let addButton = document.createElement("button");
      addButton.addEventListener("click",addEvent,false);
      addButton.classList.add("addButton");
      addButton.textContent = "+";
      block.append(blockNum);      
      block.append(addButton);
      block.append(eventBlock);
      block.addEventListener("click",addEvent,false);
      newrow.append(block);
}


function populateSelect(poparray,select){
  let newarray = poparray;
  let newselect = select;
  
  for(var i = 0; i < newarray.length; i++) {
    var optionValue = newarray[i];
    var option = document.createElement("option");
    option.value = optionValue;
    option.textContent = optionValue;
    newselect.appendChild(option);
  }
}

function clearMonth(){
  while(calendar.children.length > 0){ 
    calendar.children[0].remove();
  }
}

function selectTime(){
  clearMonth();
  let newMonth = months.indexOf(monthSelect.value);
  let newYear = yearSelect.value;
  generateTime(newMonth,newYear);
  detectMobile();
}


function addEvent(){
  //bubbling and capturing
  if(event.target == this){
      if(this.className == "addButton"){
        dayIndexforSave = this.parentNode.firstChild.data;
      }else{
        dayIndexforSave = this.firstChild.data;
      }
     eventModal.classList.remove("hide");
     monthSelect.setAttribute("disabled", "true");
     yearSelect.setAttribute("disabled", "true");
  }

}

function close(){
  this.parentNode.classList.add("hide");
  monthSelect.removeAttribute("disabled");
  yearSelect.removeAttribute("disabled");
}

function saveEvent(){
  if(window.localStorage.getItem("retrieveEvent")){
  eventDates = JSON.parse(window.localStorage.getItem("retrieveEvent"));  
}

if(eventItem.value){
  
  if(eventDates.length == 0){
    eventDates[0] = {};
    eventDates[0].month = monthSelect.value;
    eventDates[0].year = yearSelect.value; 
    eventDates[0][dayIndexforSave] = [eventItem.value];
    var savedEvent = JSON.stringify(eventDates);
    window.localStorage.setItem("retrieveEvent", savedEvent);
    eventItem.value = "";
    eventModal.classList.add("hide");
    monthSelect.removeAttribute("disabled");
    yearSelect.removeAttribute("disabled");
  }else{
    
    for(var i = 0; i < eventDates.length; i++){
      if(eventDates[i].month == monthSelect.value && eventDates[i].year == yearSelect.value){
         if(eventDates[i][dayIndexforSave]){
        
            eventDates[i][dayIndexforSave].push(eventItem.value);
            break;
         }else{

           eventDates[i][dayIndexforSave] = [eventItem.value];
           break;
          }
     
      }else if(i == eventDates.length-1){
          eventDates[eventDates.length] = {};
          eventDates[eventDates.length-1].month = monthSelect.value;
          eventDates[eventDates.length-1].year = yearSelect.value; 
          eventDates[eventDates.length-1][dayIndexforSave] = [eventItem.value];
          break;
      }
       
      
    }
  }
  
    var savedEvent = JSON.stringify(eventDates);
    window.localStorage.setItem("retrieveEvent", savedEvent);
    addEventToBlock();
    eventItem.value = "";
    detectMobile();
 }

    eventModal.classList.add("hide");
    monthSelect.removeAttribute("disabled");
    yearSelect.removeAttribute("disabled");

}

function addEventToBlock(){
   for(var i = 0; i < eventDates.length; i++){
      if(eventDates[i].month == monthSelect.value && eventDates[i].year == yearSelect.value){
          var eventsMonthYear = eventDates[i];
      }
   }
            
  for(let j = 0; j < calendar.children.length; j++){              
    for(let k = 0; k < calendar.children[j].childNodes.length; k++){
  
      if(calendar.children[j].childNodes[k].firstChild){
            var calendarIndex = calendar.children[j].childNodes[k].firstChild.data;
            
        if(calendarIndex == dayIndexforSave){

          let eventBlock = calendar.children[j].childNodes[k].childNodes[2];
          var listItem = document.createElement("li");
          let attributeIndex = String(dayIndexforSave);
          var deleteButton = document.createElement("div");
          deleteButton.addEventListener("click",deleteEvent,false);
          deleteButton.textContent = "X";
          deleteButton.classList.add("button");
          var editButton = document.createElement("div");   
          editButton.addEventListener("click",openEditEvent,false);
          editButton.innerHTML = "<img src = 'pen.png'/>";
          editButton.classList.add("button");
          var textArrayLength = eventsMonthYear[dayIndexforSave].length-1;
          //listItem.textContent = eventsMonthYear[dayIndexforSave][textArrayLength];
          var textDiv = document.createElement("div");
          //textDiv.textContent =  eventsMonthYear[index][l];
          textDiv.textContent =  eventsMonthYear[dayIndexforSave][textArrayLength];
          listItem.append(textDiv);
          listItem.append(deleteButton);
          listItem.append(editButton);
          eventBlock.addEventListener("click",openEventList,false);
          eventBlock.appendChild(listItem); 

          
        }
       }
    }
                  
  }
  eventModal.classList.add("hide");
  monthSelect.removeAttribute("disabled");
  yearSelect.removeAttribute("disabled");  
}



function addEventsToCalendar(){
  if(window.localStorage.getItem("retrieveEvent")){
       eventDates = JSON.parse(window.localStorage.getItem("retrieveEvent"));
  }
  
  
  for(var i = 0; i < eventDates.length; i++){
    if(eventDates[i].month == monthSelect.value && eventDates[i].year == yearSelect.value){
          eventsMonthYear = eventDates[i];
        for(let j = 0; j < calendar.children.length; j++){              
          for(let k = 0; k < calendar.children[j].childNodes.length; k++){
            if(calendar.children[j].childNodes[k].firstChild){
               var index = calendar.children[j].childNodes[k].firstChild.data;
               var eventBlock = calendar.children[j].childNodes[k].childNodes[2];  
              if( eventsMonthYear[index]){
                  for(var l = 0; l <  eventsMonthYear[index].length; l++){
       

                    var listItem = document.createElement("li");
                    let attributeIndex = String(dayIndexforSave);
                    var deleteButton = document.createElement("div");
                    deleteButton.addEventListener("click",deleteEvent,false);
                    deleteButton.textContent = "X";
                    deleteButton.classList.add("button");
                    var editButton = document.createElement("div");   
                    editButton.addEventListener("click",openEditEvent,false);
                    editButton.innerHTML = "<img src = 'pen.png'/>";
                    editButton.classList.add("button");
                    deleteButton.textContent = "X";
                    var textDiv = document.createElement("div");
                    textDiv.textContent =  eventsMonthYear[index][l];
                    listItem.append(textDiv);
                    listItem.append(deleteButton);
                    listItem.append(editButton);
                    eventBlock.addEventListener("click",openEventList,false);
                    eventBlock.appendChild(listItem); 
                  }
           }
            
          }
        
        }
      
      }
    }
  }
      

 }
  



function deleteEvent(){
  var evt = this;
  var index = this.parentNode.parentNode.parentNode.childNodes[0].data;

  for(var i = 0; i < eventDates.length; i++){
    if(eventDates[i].month == monthSelect.value && eventDates[i].year == yearSelect.value)  {
      var eventMonthYear = eventDates[i];
      var listLength = this.parentNode.parentNode.childNodes.length;
       for(var j = 0; j < listLength; j++){
        
           if(this.parentNode.parentNode.childNodes[j] == this.parentNode){
             if(eventMonthYear[index].length >= 2){

                eventMonthYear[index].splice(j, eventMonthYear[index].length-1);
               break;
             }else{
                delete eventMonthYear[index];
               break;
             }
               
           }
         
       }

    } 
  }

    this.parentNode.remove();

    var savedEvent = JSON.stringify(eventDates);
    window.localStorage.setItem("retrieveEvent", savedEvent);
  
}

function openEditEvent(){
  dayIndexforSave = this.parentNode.parentNode.parentNode.firstChild.data;
  editItemListItem = this;
  editEventModal.classList.remove("hide");
  monthSelect.setAttribute("disabled", "true");
  yearSelect.setAttribute("disabled", "true");
}

function editEvent(){
  var evt = editItemListItem;
  var index = dayIndexforSave;
  for(var i = 0; i < eventDates.length; i++){
    if(eventDates[i].month == monthSelect.value && eventDates[i].year == yearSelect.value)  {
      var eventMonthYear = eventDates[i];
      var listLength = editItemListItem.parentNode.childNodes.length;
       for(var j = 0; j < listLength; j++){
           if(editItemListItem.parentNode.parentNode.childNodes[j] == editItemListItem.parentNode){
               eventMonthYear[index][j] = editEventItem.value;
               break;             
           }
         
       }

    } 
  }

  console.dir(editItemListItem.parentNode.firstChild);
  console.dir(editEventItem.value);
  editItemListItem.parentNode.firstChild.innerText = editEventItem.value;

  var savedEvent = JSON.stringify(eventDates);
  window.localStorage.setItem("retrieveEvent", savedEvent);
  editEventItem.value = "";
  editEventModal.classList.add("hide");
  monthSelect.removeAttribute("disabled");
  yearSelect.removeAttribute("disabled");
}


function openEventList(){
  var marginCounter = 0;
  lists = this.children;
  setTimeout(function() {
   var myObj = this; //some code for creation of complex object like above
   console.log(this); // this works
   console.log(this.children); // this works too
});
  if(event.target == this){

    if(previousListThis){
      for(var k = 0; k < previousListThis.children.length; k++){
        previousListThis.children[k].classList.remove("mobileList");
        previousListThis.children[k].style.marginTop = "";
      }
    }

    if(screen.width < 450 || document.body.clientWidth < 450){
      //console.log(lists[0]);

      for(var i = 0; i < lists.length; i++){
           if(lists[i].firstChild){
                lists[i].classList.add("mobileList");
                lists[i].style.marginTop = marginCounter + "px";
                marginCounter += 18;
           }
      }
    }
      previousListThis = this;
  }


}


window.addEventListener('resize', detectMobile,false);
monthSelect.addEventListener("change",selectTime,false);
yearSelect.addEventListener("change",selectTime,false);
closeButton.addEventListener("click",close,false);
editclose.addEventListener("click",close,false);
saveButton.addEventListener("click",saveEvent,false);
clearStorage.addEventListener("click",function(){localStorage.clear();location.reload();},false);
saveChanges.addEventListener("click",editEvent,false);

populateSelect(months,monthSelect);
populateSelect(years,yearSelect);
generateTime(months.indexOf(monthSelect.value),yearSelect.value);



detectMobile();

}
