
async function getTeachers() {
    const Teacherstable = document.getElementById('teachersTable');

    try {
        const response = await fetch('/admin/teachers/data');
        const data = await response.json();
        // console.log(data);
        data.forEach(teacher => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${teacher.id}</td>
                <td>${teacher.name}</td>
                <td>${teacher.lname}</td>
                <td>${teacher.grade}</td>
                <td>${teacher.email}</td>
            `;
            Teacherstable.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
}

getTeachers();