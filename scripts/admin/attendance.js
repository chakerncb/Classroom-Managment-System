document.addEventListener('DOMContentLoaded' , function(){
    getStudents();
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
                    <a class="text-primary" onclick="studentAttendance(${student.code})"><i class="bi bi-arrow-bar-right"></i></a>
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
