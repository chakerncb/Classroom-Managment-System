document.addEventListener('DOMContentLoaded', function() {
   getSessions();
});


async function getSessions() {

    const teacherId = document.getElementById('teacherId').value;
    const today = new Date().toISOString().split('T')[0];
    const dayName = new Date(today).toLocaleDateString('en-US', { weekday: 'long' });
    // const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const time = '08:39';
    const sessionsContainer = document.getElementById('sessions-container');

    try {
        const response = await fetch(`/teacher/sessions/${teacherId}/${dayName}`);
        const data = await response.json();

        sessionsContainer.innerHTML = `<h4 class="mt-0 mb-4 text-dark op-8 font-weight-bold">
        ${dayName}, ${today}
        </h4>
        <br>
        `;
        const sessionElement = document.createElement('div');
        sessionElement.classList.add('col-lg-4', 'mb-3');
        const sessionList = document.createElement('ul');
        sessionList.classList.add('list-timeline', 'list-timeline-primary');
        data.forEach(session => {
            let sessionItem;
            if (time >= session.startTime && time <= session.end_time) {
                sessionItem = document.createElement('li');
                sessionItem.classList.add('list-timeline-item', 'show', 'p-0', 'pb-3', 'pb-lg-4', 'd-flex', 'flex-wrap', 'flex-column', 'data-toggle="collapse"' ,'data-target="#day-1-item-2');
                sessionItem.innerHTML = `
                <a onclick="studentList('${session.id}')" style="text-decoration: none;">
                <b>
                <p class="my-0 text-dark flex-fw text-sm text-uppercase"><span class="text-primary font-weight-bold op-8 infinite animated flash" data-animate="flash" data-animate-infinite="1" data-animate-duration="3.5" style="animation-duration: 3.5s;">Now</span> - ${session.module} (${session.type})</p>
                <p class="my-0 collapse flex-fw text-uppercase text-xs text-dark op-8 show" id="day-1-item-2"> ${session.level} (S${session.semester}) - ${session.groupe} / <span class="text-primary">${session.classroom}</span> </p>
                </b>
                </a>
            `;
            } else {
                sessionItem = document.createElement('li');
                sessionItem.classList.add('list-timeline-item', 'p-0', 'pb-3', 'pb-lg-4', 'd-flex', 'flex-wrap', 'flex-column');
                sessionItem.innerHTML = `
                <p class="my-0 text-dark flex-fw text-sm text-uppercase">
                    <span class="text-inverse op-8">${session.startTime} / ${session.end_time}</span> - ${session.module} (${session.type})
                </p>               
                <p class="my-0 collapse flex-fw text-uppercase text-xs text-dark op-8 show" id="day-1-item-2"> ${session.level} (S${session.semester}) - ${session.groupe} / <span class="text-secondary">${session.classroom}</span> </p> 

            `;
            }
            sessionList.appendChild(sessionItem);
        });
        sessionElement.appendChild(sessionList);
        sessionsContainer.appendChild(sessionElement);
       
        
  
    }
    catch (err) {
        console.error
    }

}


async function studentList(sessionId) {
    console.log(sessionId);
    const sessionsContainer = document.getElementById('sessions-container');
    sessionsContainer.innerHTML = '';
    const cardTitle = document.getElementsByClassName('card-title');
    cardTitle[0].innerHTML = 'Students';

    try {
        const response = await fetch('/teacher/sessions/students' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            
            },
            body: JSON.stringify({ sessionId: sessionId })
        });

        const data = await response.json();

       // make a table of srudents with their information and attendance checkbox and status
         const table = document.createElement('table');
            table.classList.add('table', 'table-striped', 'table-hover', 'table-bordered', 'mt-4');
            table.style.width = '100%';
            table.style.textAlign = 'center';
            table.innerHTML = `
            <thead>
                <tr>
                    <th> </th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Groupe</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
            `;
            data.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td class="p-3"><input type="checkbox" class="form-check-input" id="attendance-${student.id}" ${student.attendance ? 'checked' : ''}></td>
                <td class="p-3">${student.firstName}</td>
                <td class="p-3">${student.lastName}</td>
                <td class="p-3">${student.groupe}</td>
                <td class="p-3"><span class="text-bg-${student.attendance ? 'success' : 'danger'} rounded-pill p-2 text-white">${student.attendance ? 'Present' : 'Absent' }</span></td>
                `;
                table.querySelector('tbody').appendChild(row);
            });

            const submitButton = document.createElement('button');
            submitButton.classList.add('btn', 'btn-primary', 'mt-3');
            submitButton.innerHTML = 'Submit';
            table.querySelector('tbody').appendChild(submitButton);
            submitButton.addEventListener('click', async () => {
                const students = [];
                data.forEach(student => {
                    students.push({
                        id: student.id,
                        attendance: document.getElementById(`attendance-${student.id}`).checked
                    });
                });
                await submitAttendance(students , sessionId);
            });
               

            sessionsContainer.appendChild(table);

    }
    catch (err) {
        console.error(err);
    }
}


async function submitAttendance(students , sessionId) {

    try {
        const response = await fetch('/teacher/sessions/attendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId: sessionId, students: students })
        });

        const result = await response.json();
        if (result.success) {
            document.querySelector('.message-success').innerText = result.message;
            document.querySelector('.message-success').style.display = 'block';
            document.querySelector('.message-danger').style.display = 'none';
            
            setTimeout(() => {
                document.querySelector('.message-success').style.display = 'none';
            }, 3000);
        } else if (result.message) {
            document.querySelector('.message-danger').innerText = result.message;
            document.querySelector('.message-danger').style.display = 'block';
            setTimeout(() => {
                document.querySelector('.message-danger').style.display = 'none';
            }, 3000);
        }   
    }
    catch (err) {
        console.error(err);
    }

}
