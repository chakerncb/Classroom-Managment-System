document.addEventListener('DOMContentLoaded', () => {
    getModules();
    getClassrooms();
    getSchedules();
});

async function getModules() {
    const modulesSelect = document.getElementById('module-select');

    try {
        const response = await fetch('/admin/modules/data');
        const data = await response.json();
        
        data.modules.forEach(module => {
            const option = document.createElement('option');
            option.value = module.id;
            option.text = module.name;
            option.onclick = () => {
                getTypes(module.idm);
            }
            modulesSelect.appendChild(option);
        });
    }
    catch (error) {
        console.error(error);
    }
}


document.getElementById('module-select').addEventListener('change', async () => {
    const moduleId = document.getElementById('module-select').value;
    const typesSelect = document.getElementById('type-select');
    const semester = document.getElementById('semester');
    const level = document.getElementById('level');
    typesSelect.innerHTML = '';

    try {
        const response = await fetch('/admin/modules/type/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ moduleId })
        });
        const data = await response.json();

        data.types.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            option.text = type.name;
            typesSelect.appendChild(option);
        });

        semester.value = data.semester;
        level.value = data.level;
    }
    catch (error) {
        console.error(error);
    }
});


async function getClassrooms() {
    const classroomsSelect = document.getElementById('classroom-select');

    try {
        const response = await fetch('/admin/classrooms/data');
        const data = await response.json();

        data.classrooms.forEach(classroom => {
            const option = document.createElement('option');
            option.value = classroom.code;
            option.text = classroom.code + ' (' + classroom.type + ')';
            classroomsSelect.appendChild(option);
        });
    }
    catch (error) {
        console.error(error);
    }
}


document.querySelector('form#scheduleForm').addEventListener('submit', async (event) => {
     event.preventDefault();
        const form = document.querySelector('form#scheduleForm');
        const formData = new FormData(document.getElementById('scheduleForm'));
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await fetch('/admin/schedule/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
      
            const result = await response.json();
            if (result.success) {
                document.querySelector('.message-success').innerText = result.message;
                document.querySelector('.message-success').style.display = 'block';
                document.querySelector('.message-danger').style.display = 'none';
                
                form.reset();
                setTimeout(() => {
                    document.querySelector('.message-success').style.display = 'none';
                }, 3000);
                // ();
            } else if (result.message) {
                document.querySelector('.message-danger').innerText = result.message;
                document.querySelector('.message-danger').style.display = 'block';
                setTimeout(() => {
                    document.querySelector('.message-danger').style.display = 'none';
                }, 3000);
            }
        }
        catch (error) {
            console.error(error);
        }
});


async function getSchedules() {

    const promoCard = document.getElementById('promo-card'); 

    try {
        const response = await fetch('/admin/schedules/data');
        const data = await response.json();
        if (data.success) {
            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header py-3 flex-column justify-content-between align-items-center';
            const title = document.createElement('p');
            title.className = 'text-primary m-0 fw-bold';
            title.innerText = 'RTW';
            // const addButton = document.createElement('button');
            // addButton.className = 'btn btn-primary';
            // addButton.style.float = 'right';
            // addButton.innerText = 'Add Schedule';
            // addButton.onclick = () => openScheduleForm();
            cardHeader.appendChild(title);
            // cardHeader.appendChild(addButton);
            promoCard.appendChild(cardHeader);

            const scheduleContainer = document.createElement('div');
            scheduleContainer.className = 'schedule-container row';

            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'];
            days.forEach(day => {
            const cardDay = document.createElement('div');
            cardDay.className = 'card-day shadow';
            const dayHeader = document.createElement('div');
            dayHeader.className = 'card-header py-3';
            dayHeader.onclick = () => toggleDay(day.toLowerCase());
            const dayTitle = document.createElement('h6');
            dayTitle.className = 'text-primary fw-bold m-0';
            dayTitle.innerText = day;
            dayHeader.appendChild(dayTitle);
            cardDay.appendChild(dayHeader);

            const dayList = document.createElement('ul');
            dayList.id = day.toLowerCase();
            dayList.className = 'list-group list-group-flush';

            data.schedules.filter(schedule => schedule.day_of_week === day).forEach(schedule => {
                const listItem = document.createElement('li');
                console.log(schedule);
                listItem.className = 'list-group-item';
                listItem.innerHTML = `<h6 style="color:black;" >${schedule.module} (${schedule.type})<h6>${schedule.start_time} - ${schedule.end_time} (${schedule.code_c}) <br>`;
                dayList.appendChild(listItem);
            });

            const addButton = document.createElement('button');
            addButton.style.width = '100%';
            addButton.style.marginTop = '5px';
            addButton.onclick = () => openScheduleForm(day);
            const addIcon = document.createElement('i');
            addIcon.className = 'bi bi-plus';
            addButton.appendChild(addIcon);
            dayList.appendChild(addButton);

            cardDay.appendChild(dayList);
            scheduleContainer.appendChild(cardDay);
            });

            promoCard.appendChild(scheduleContainer);
        }

        }
        
    catch (error) {
        console.error(error);
    }
}



