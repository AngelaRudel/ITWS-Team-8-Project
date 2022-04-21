let moCount = 0; //track what month we're on
let clicked = null;
//log of daily habits list (each day has array of habits)
let trackedHabits = localStorage.getItem('trackedHabits') ? JSON.parse(localStorage.getItem('trackedHabits')) : [];  //stores daily entries
//log of what habits we have to track
let habits = localStorage.getItem('habits') ? JSON.parse(localStorage.getItem('habits')) : [];
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'];

const newHabitModal = document.getElementById('newHabitModal');
const newEntryModal = document.getElementById('newEntryModal');
const deleteHabitModal = document.getElementById('deleteHabitModal');
const backDrop = document.getElementById('modalBackDrop');
const calendar = document.getElementById('calendar');
const habitInput = document.getElementById('habitInput');
const habitColor = document.getElementById('habitColor');
const logSelection = document.getElementById('logSelection');
const menuColor = document.getElementsByTagName('option');


//-------------------------------DISPLAY DAY'S ENTRIES-------------------------------------
function displayEntries(date) {
    //determining what date the user clicks on
    clicked = date;

    //finding an event that exists for this day
    const habitsForDay = trackedHabits.filter(h => h.date === clicked);
    console.log(habitsForDay);
    
    if(habitsForDay) {
        for(let i=0; i < habitsForDay.length; i++){
            document.getElementById('habitText').innerText = '';
            const entrydiv = document.createElement('div');
            $(entrydiv).addClass('entry');
            const colorblock = document.createElement('div');
            const entrytext = document.createElement('p');
            $(entrytext).addClass('entrytext');
            $(colorblock).addClass('col');
            $(colorblock).css('background-color', habitsForDay[i].color);
            entrytext.innerText = habitsForDay[i].title;
            
            entrydiv.appendChild(colorblock);
            entrydiv.appendChild(entrytext);

            document.getElementById('entries').appendChild(entrydiv);
            
            $(entrydiv).click(function() {
                $(entrytext).addClass('selectedtext');
                $(entrytext).css('color', 'white');
                $('#deleteButton').click(() => deleteHabit(entrytext.innerText));  
            });

        }
        
        $(deleteHabitModal).css('display', 'block'); 
    } else if(habitsForDay === []) {
        document.getElementById('habitText').innerText = 'No entry yet!';
    }

    $('.closeModal').click(function() { 
        $(deleteHabitModal).css('display', 'none');
        $(backDrop).css('display', 'none');
        document.getElementById('entries').innerHTML = '<p id="habitText"></p>';
    });

    $(backDrop).css('display', 'block');
}

//----------------OPEN ENTRY MODAL-------------------
function openEntryModal(date){
    clicked = date;

    $(newEntryModal).css('display', 'block');
    $(backDrop).css('display', 'block');
}

//----------------------------------LOAD CALENDAR FUNCTION---------------------------------
function loadCal() {
    const date = new Date();

    if(moCount !== 0){
        date.setMonth(new Date().getMonth() + moCount);
    }

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const dateStr = firstDay.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

	const weekday = dateStr.split(', ')[0];

    const paddingDays = weekdays.indexOf(weekday)+1;

    document.getElementById('monthDisplay').innerText = `${date.toLocaleDateString('en-us', {month: 'long'})} ${year}`

    calendar.innerHTML = '';

    for(let i=1; i <= (paddingDays+daysInMonth); i++){
        const sqr = document.createElement('div');
        const dayStr = `${month+1}/${i-paddingDays}/${year}`;
        const crntDate = new Date(year, month, i-paddingDays);

        $(sqr).addClass('day');

        if(i > paddingDays) {
           sqr.innerText = i - paddingDays;
           sqr.innerHTML += "<br>";

           const habitsForDay = trackedHabits.filter(h => h.date === dayStr);

           if(habitsForDay) {
               for(let j=0; j < habitsForDay.length; j++){
                 const habitDiv = document.createElement('div');
                 habitDiv.classList.add('habit');
                 $(habitDiv).css('background-color', habitsForDay[j].color);
                 sqr.appendChild(habitDiv);
               }
           }

           if(i-paddingDays === day && moCount === 0) {
              sqr.id = 'currentDay';
           }


           document.getElementById('dateDisplay').innerText = date.toLocaleDateString('en-us', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
           });

           var timesClicked = 0;
           $(sqr).click(function() {
               timesClicked++;
               document.getElementById('dateDisplay').innerText = crntDate.toLocaleDateString('en-us', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
               });

               if (timesClicked === 1 && ($(sqr).hasClass('selectedDay'))) {
                   displayEntries(dayStr);
               } else if(!($(sqr).hasClass('selectedDay'))) {
                   $('.selectedDay').removeClass('selectedDay');
                   $(sqr).addClass('selectedDay');
                   timesClicked = 0;
               }

               /////////////////////////////////////////////////////////////SDSGHE3IOYHN4WS35UOW'45IBY'ZW;'I4YJR FUCK
               if(day < (i-paddingDays) || moCount > 0){
                   alert("Cannot submit entry for future date.");
               }

               $('#addEntry').click(() => openEntryModal(dayStr));
            });
        } else {
		   $(sqr).addClass('padding');
        }

        calendar.appendChild(sqr);

        
    }
	//$('#dailyview').click(loadDaily);
}


//-------------------------------------CLOSE POP-UP WINDOW---------------------------
function closeModal() {
    $('#newHabitModal').css('display', 'none');
    $('#newEntryModal').css('display', 'none');
    $('#modalBackDrop').css('display', 'none');
    $(deleteHabitModal).css('display', 'none');
    habitInput.value = '';

    $(habitInput).removeClass('error');
    //document.getElementById('logSelection').value = '';
    clicked = null;
    loadCal();
}


//-----------------------------------SAVE NEW HABIT------------------------------------
function newHabit() {
    if(habitInput.value != '') {
        $(habitInput).removeClass('error');
        habits.push({
            title: habitInput.value,
            color: habitColor.value,
        });

        localStorage.setItem('habits', JSON.stringify(habits));

        var opt = document.createElement('option');
        opt.value = habitInput.value;
        opt.innerHTML = habitInput.value;
        logSelection.appendChild(opt);
    } else {
        $(habitInput).addClass('error');
    }

    closeModal();
}

//-----------------------------------------------SAVE ENTRY-------------------------------
function logEntry() {
    var none = document.createElement('p');
    none.innerText = "No habits to track yet!"

    if(habits.length === 0){
        logSelection.replaceWith(none);
    } else {
        var hab = habits.find(h => h.title === logSelection.value);
        none.replaceWith(logSelection);
        trackedHabits.push({
            date: clicked,
            title: logSelection.value,
            color: hab.color,
        });

        localStorage.setItem('trackedHabits', JSON.stringify(trackedHabits));
    }

    closeModal();
}

//-----------------------------------------------DELETE ENTRY-----------------------------
function deleteHabit(hab) {
    trackedHabits = trackedHabits.filter(h => h.title !== hab);
    localStorage.setItem('trackedHabits', JSON.stringify(trackedHabits));
    closeModal();
}

//-------------------------------------------INITIALIZE BUTTONS--------------------------------
function initButtons() {
    $('#dailyview').click(() => loadDaily());
    $('#nextButton').click(function(){
        moCount++;
        loadCal();
    });

    $('#backButton').click(function(){
        moCount--;
        loadCal();
    });

    $('#startHabit').click(() => {
        $(newHabitModal).css('display', 'block');
        $(backDrop).css('display', 'block');
    });

    $('#saveHabitButton').click(() => newHabit());

    $('#saveEntryButton').click(() => logEntry());

    $('.cancelButton').click(() => closeModal());

    $('.closeButton').click(() => closeModal());
}

initButtons();
loadCal();

//----------------------------------------CHANGE TO DAY VIEW-------------------------------------
function loadDaily() {
  $('#calendar').hide();
  $('#weekdays').hide();
  $('#monthDisplay').hide();
  $('#calview').click(function(){
      $('#calendar').show();
      loadCal();
  });
}


//function to toggle between calendar and daily view
function toggleView() {
	if ($( 'a' ).hasClass('inactive')) {
        $('a.inactive').addClass('neutral');
		$('a.inactive').removeClass('inactive');
        $('a.active').addClass('inactive');
        $('a.active').removeClass('active');
        $('a.neutral').addClass('active');
        $('a.neutral').removeClass('neutral');
	}
	else if (!($( 'a' ).hasClass('inactive'))){
		$('a.active').addClass('neutral');
		$('a.active').removeClass('active');
        $('a.inactive').addClass('active');
        $('a.inactive').removeClass('active');
        $('a.neutral').addClass('inactive');
        $('a.neutral').removeClass('neutral');
	}

}