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
   card.innerHTML = '';

//    console.log(studentId);

    try {
        const response = await fetch('/admin/attendance/studentAttendance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ studentId })
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

