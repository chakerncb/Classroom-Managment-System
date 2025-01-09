document.addEventListener('DOMContentLoaded', getSchedule);

async function getSchedule() {
    const teacherId = document.getElementById('teacherId').value;
    console.log(teacherId);

    try {
        const response = await fetch(`/teacher/schedule/${teacherId}`);
        const data = await response.json();
        console.log(data);
        populateSchedule(data);
    } catch (error) {
        console.error(error);
    }
}

function populateSchedule(schedule) {
    const tableBody = document.querySelector('.schedule-table-body');
    tableBody.innerHTML = '';

    const timeSlots = [
        '08:00-9:30', '09:30-11:00', '11:00-12:30', '12:30-14:00', '14:00-15:30', '15:30-17:00'
    ];

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

    timeSlots.forEach(timeSlot => {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.className = 'day';
        timeCell.textContent = timeSlot;
        row.appendChild(timeCell);

        days.forEach(day => {
            const cell = document.createElement('td');
            const scheduleItem = schedule.find(item => item.startTime === timeSlot.split('-')[0] && item.day === day);
            if (scheduleItem) {
                cell.className = 'active';
                cell.innerHTML = `
                    <h4>${scheduleItem.level}-S${scheduleItem.semester}</h4>
                    <p>${scheduleItem.classroom}(${scheduleItem.type})</p>
                    <div class="hover">
                        <h4>${scheduleItem.module}</h4>
                        <p>${scheduleItem.startTime} - ${scheduleItem.end_time}</p>
                        <span>${scheduleItem.groupe}</span>
                    </div>
                `;
            }


            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}