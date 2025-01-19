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
   const cardHeader = document.getElementById('card-header');
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

        cardHeader.innerHTML = `<p class="text-primary m-0 fw-bold">${data.fullName}</p>
                          <br>
                          <div class="d-flex align-items-center">
                              <label for="from" class="form-label me-2">From</label>
                              <input type="date" id="from" name="from" class="form-control me-3" required>
                              <label for="to" class="form-label me-2">To</label>
                              <input type="date" id="to" name="to" class="form-control" required>
                              <button class="btn btn-primary ms-3" id="filter">Filter</button>
                          </div>`;

        const from = document.getElementById('from').value = data.fromDate;
        const to = document.getElementById('to').value = data.toDate;

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

