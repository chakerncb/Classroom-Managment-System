document.addEventListener('DOMContentLoaded' , function(){
    getStudents();
    getTeachers();
});

async function getStudents() {
    const Studentstable = document.getElementById('StudentsTable');
    Studentstable.innerHTML = '';

    try {
        const response = await fetch('/admin/attendance/students/data');
        const data = await response.json();

        data.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.code}</td>
                <td>${student.fname}</td>
                <td>${student.lname}</td>
                <td>${student.level}</td>
                <td>${student.attendanceRate}%</td>
                <td>
                    <a class="text-primary" onclick="studentAttendance(${student.code})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 16 16" fill="none">
                    <path d="M10 0L9 1L11.2929 3.29289L6.2929 8.29289L7.70711 9.70711L12.7071 4.7071L15 7L16 6V0H10Z" fill="#000000"/>
                    <path d="M1 2H6V4H3V13H12V10H14V15H1V2Z" fill="#000000"/>
                    </svg>
                    </a>
                </td>
            `;
            Studentstable.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
}

async function studentAttendance(studentId) {
   const card = document.getElementsByClassName('card-body')[0];
   const title = document.getElementById('title');
   card.innerHTML = '';

    try {
        const response = await fetch('/admin/attendance/studentAttendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ studentId })
        });
        const data = await response.json();

        title.value = data.fullName;
        const filterCard = document.getElementById('filter-card');
        filterCard.innerHTML = `
            <label for="from" class="form-label me-2">From</label>
            <input type="date" id="from" name="from" class="form-control me-3" required>
            <label for="to" class="form-label me-2">To</label>
            <input type="date" id="to" name="to" class="form-control" required>
            <input type="hidden" id="studentId" value="${studentId}">
            <button class="btn btn-primary ms-3" id="filter" onclick="filterAttendance()">Filter</button>
        `;

        document.getElementById('from').value = data.fromDate;
        document.getElementById('to').value = data.toDate;

        data.absences.forEach(absence => {
            const row = document.createElement('div');
            row.classList.add('mb-3', 'p-3', 'border', 'rounded', 'bg-light');
            row.innerHTML = `
                <p class="mb-1"><strong>${absence.count} Absence(s)</strong></p>
                <p class="mb-1">${absence.dayName} / ${absence.date}</p>
                <p class="mb-1">${absence.session}</p>
                <hr>
            `;
            card.appendChild(row);
        });

    } catch (error) {
        console.error(error);
    }
}

async function filterAttendance() {
    const card = document.getElementsByClassName('card-body')[0];
    const studentId = document.getElementById('studentId').value;
    card.innerHTML = '';

    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;

    try {

        const response = await fetch('/admin/attendance/studentAttendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ studentId , fromDate: from , toDate: to })
        });
        const data = await response.json();

        document.getElementById('from').value = data.fromDate;
        document.getElementById('to').value = data.toDate;

        data.absences.forEach(absence => {
            const row = document.createElement('div');
            row.classList.add('mb-3', 'p-3', 'border', 'rounded', 'bg-light');
            row.innerHTML = `
                <p class="mb-1"><strong>${absence.count} Absence(s)</strong></p>
                <p class="mb-1">${absence.dayName} / ${absence.date}</p>
                <p class="mb-1">${absence.session}</p>
                <hr>
            `;
            card.appendChild(row);
        });

    } catch (error) {
        console.error(error);
    }

}



////////////////////////////////////////////////////////////////////////////////////

async function getTeachers() {
    const Teacherstable = document.getElementById('TeachersTable');
    Teacherstable.innerHTML = '';

    try {
        const response = await fetch('/admin/attendance/teachers/data');
        const data = await response.json();
        console.log(data);

        data.forEach(teacher => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${teacher.id}</td>
                <td>${teacher.name}</td>
                <td>${teacher.grade}</td>
                <td>${teacher.attendanceRate}%</td>
                <td>
                    <a class="text-primary" onclick="teacherAttendance(${teacher.code})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 16 16" fill="none">
                    <path d="M10 0L9 1L11.2929 3.29289L6.2929 8.29289L7.70711 9.70711L12.7071 4.7071L15 7L16 6V0H10Z" fill="#000000"/>
                    <path d="M1 2H6V4H3V13H12V10H14V15H1V2Z" fill="#000000"/>
                    </svg>
                    </a>
                </td>
            `;
            Teacherstable.appendChild(row);
        });
    }
    catch (error) {
        console.error(error);
    }
}

async function teacherAttendance(teacherId) {
    const card = document.getElementsByClassName('card-body')[0];
    const title = document.getElementById('title');
    card.innerHTML = '';

    try {
        const response = await fetch('/admin/attendance/teacherAttendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ teacherId })
        });
        const data = await response.json();

        title.value = data.fullName;
        const filterCard = document.getElementById('filter-card');
        filterCard.innerHTML = `
            <label for="from" class="form-label me-2">From</label>
            <input type="date" id="from" name="from" class="form-control me-3" required>
            <label for="to" class="form-label me-2">To</label>
            <input type="date" id="to" name="to" class="form-control" required>
            <input type="hidden" id="teacherId" value="${teacherId}">
            <button class="btn btn-primary ms-3" id="filter" onclick="filterTeacherAttendance()">Filter</button>
        `;

        document.getElementById('from').value = data.fromDate;
        document.getElementById('to').value = data.toDate;

        data.absences.forEach(absence => {
            const row = document.createElement('div');
            row.classList.add('mb-3', 'p-3', 'border', 'rounded', 'bg-light');
            row.innerHTML = `
                <p class="mb-1"><strong>${absence.count} Absence(s)</strong></p>
                <p class="mb-1">${absence.dayName} / ${absence.date}</p>
                <p class="mb-1">${absence.session}</p>
                <hr>
            `;
            card.appendChild(row);
        });

    } catch (error) {
        console.error(error);
    }
}