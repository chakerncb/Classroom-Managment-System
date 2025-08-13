document.addEventListener('DOMContentLoaded', getClassrooms);

async function getClassrooms() {
    try {
        const response = await fetch('/teacher/classrooms/availability');
        const classrooms = await response.json();
        const container = document.getElementById('classrooms-container');
        const table = document.createElement('table');
        table.className = 'table table-striped';
        table.innerHTML = `
            <thead>
                <tr>
                    <th scope="col">Classroom ID</th>
                    <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        const tbody = table.querySelector('tbody');
        classrooms.forEach(classroom => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${classroom.classroomID}</td>
                <td class="${classroom.available ? 'text-success' : 'text-danger'}">${classroom.available ? 'Available' : 'Not Available'}</td>
            `;
            row.title = classroom.classroomInfo;
            tbody.appendChild(row);
        });
        container.appendChild(table);
    } catch (error) {
        console.error('Error fetching classrooms:', error);
    }
}
