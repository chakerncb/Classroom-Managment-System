document.addEventListener('DOMContentLoaded', () => {
    getLevels();
    getClassrooms();
    getGroups();
});

async function getModules(level) {
    const modulesSelect = document.getElementById('module-select');
    modulesSelect.innerHTML = '';
    modulesSelect.innerHTML = '<option value="">Select Module</option>';

    try {
        const response = await fetch('/admin/level/modules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ level })
        });
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

async function getGroups(){

    const groupsSelect = document.getElementById('group-select');
    try {
        const response = await fetch('/admin/students/groupe');
        const data = await response.json();

        data.sort((a, b) => a.id - b.id).forEach(group => {
            const option = document.createElement('option');
            option.value = group.id;
            option.text = group.name;
            groupsSelect.appendChild(option);
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
                getSchedules();
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
    const level = document.getElementById('levelFilter').value;

    try {
        const response = await fetch('/admin/schedules/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ level: level })
        });
        
        const data = await response.json();
        if (data.success) {
              const promoCard = document.getElementById('promo-card');
               promoCard.innerHTML = '';

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

            const dayList = document.createElement('ul');
            dayList.id = day.toLowerCase();
            dayList.className = 'list-group list-group-flush';

            data.schedules.filter(schedule => schedule.day_of_week === day).forEach(schedule => {
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.innerHTML = `
                <div class="btn-group" style="float:right;">
                        <button class="btn btn-sm" onclick="deleteSchedule(${schedule.id})" style="margin-left: 10px;">
                            <i style="color:red;"  class="bi bi-trash"></i>
                        </button>
                    </div>
                    <h6 style="color:black;">${schedule.module} (${schedule.type})</h6>
                    <p>${schedule.start_time} - ${schedule.end_time} (${schedule.code_c}-${schedule.groupe})</p>
                `;
                dayList.appendChild(listItem);
            });

            const addButton = document.createElement('button');
            addButton.style.width = '10%';
            addButton.style.float = 'right';
            addButton.style.align = 'center';
            addButton.style.marginTop = '-5%';
            addButton.className = 'btn ';
            addButton.style.backgroundColor = 'transparent';
            addButton.style.border = 'black';
            addButton.style.color = 'black';
            addButton.style.borderRadius = '50%';
            addButton.onclick = () => openScheduleForm(day);
            const addIcon = document.createElement('i');
            addIcon.className = 'bi bi-plus';
            addButton.appendChild(addIcon);
            dayTitle.appendChild(addButton);
            cardDay.appendChild(dayHeader);


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

function filterModulesByLevel() {
    const level = document.getElementById('levelFilter').value;
    getSchedules(level);
    getModules(level);
}

async function deleteSchedule(id) {
    try {
        const response = await fetch('/admin/schedule/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const result = await response.json();
        if (result.success) {
            document.querySelector('.message-success').innerText = result.message;
            document.querySelector('.message-success').style.display = 'block';
            document.querySelector('.message-danger').style.display = 'none';
            
            setTimeout(() => {
                document.querySelector('.message-success').style.display = 'none';
            }, 3000);
            getSchedules();
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
}

async function getLevels(){
    const levelsSelect = document.getElementById('levelFilter');

    try {
        const responce = await fetch('/admin/levels/data');
        const data = await responce.json();

        data.levels.forEach(level => {
            const option = document.createElement('option');
            option.value = level.id;
            option.text =level.id +' (' + level.name + ')';
            levelsSelect.appendChild(option);
        });

    }
    catch (err) {
        console.error(err);
    }
}

