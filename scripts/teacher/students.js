
document.addEventListener('DOMContentLoaded', function() {
    getStudents();
});

async function getModules() {
    
}


async function getStudents() {
    const studentsContainer = document.getElementById('students-container');

    try {
        const response = await fetch('/teacher/students/data');
        const data = await response.json();

        console.log(data);
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Create table headers
        const headers = ['ID', 'First Name', 'Last Name', 'Group', 'Attendance'];
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            tr.appendChild(th);
        });
        thead.appendChild(tr);

        // Create table rows
        data.students.forEach(student => {
            const tr = document.createElement('tr');
            Object.values(student).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        studentsContainer.appendChild(table);

    }
    catch (error) {
        console.error(error);
    }

}