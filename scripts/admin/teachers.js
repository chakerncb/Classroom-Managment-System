async function getTeachers() {
    const Teacherstable = document.getElementById('teachersTable');
    document.getElementById('teacher_id').value = '';

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
                <td>
                    <button class="btn btn-danger" onclick="deleteTeacher(${teacher.id})">Delete</button>
                    <button class="btn btn-primary" onclick="editTeacher(${teacher.id})">Edit</button>
                </td>
            `;
            Teacherstable.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
}

document.querySelector('form#registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = document.querySelector('form#registrationForm');
    const idField = document.getElementById('teacher_id').value;
    const formData = new FormData(form);

    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    if (idField === '') {
        try {
            const response = await fetch('/admin/teachers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
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
                getTeachers();
            } else if (result.message) {
                document.querySelector('.message-danger').innerText = result.message;
                document.querySelector('.message-danger').style.display = 'block';
                setTimeout(() => {
                    document.querySelector('.message-danger').style.display = 'none';
                }, 3000);
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            const response = await fetch('/admin/teachers/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
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
                getTeachers();
            } else if (result.message) {
                document.querySelector('.message-danger').innerText = result.message;
                document.querySelector('.message-danger').style.display = 'block';
                setTimeout(() => {
                    document.querySelector('.message-danger').style.display = 'none';
                }, 3000);
            }
        } catch (error) {
            console.log(error);
        }
    }
});

async function deleteTeacher(id) {
   
    document.querySelector('.confirm-alert').style.display = 'flex';
    // document.querySelector('.message-danger').style.display = 'block';
    document.querySelector('.confirm-message').innerText = 'Are you sure you want to delete this teacher?';

    document.querySelector('#confirm-yes').addEventListener('click', async () => {
        document.querySelector('.confirm-alert').style.display = 'none';

    try {

        const response = await fetch('/admin/teachers/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id }),
        });

        const result = await response.json();
        if (result.success) {
            document.querySelector('.message-success').innerText = result.message;
            document.querySelector('.message-success').style.display = 'block';
            document.querySelector('.message-danger').style.display = 'none';
            
            setTimeout(() => {
                document.querySelector('.message-success').style.display = 'none';
            }, 3000);
            getTeachers();
        }
        else if (result.message) {
            // Pass the error message to the EJS template
            document.querySelector('.message-danger').innerText = result.message;
            document.querySelector('.message-danger').style.display = 'block';
            setTimeout(() => {
                document.querySelector('.message-danger').style.display = 'none';
            }, 3000);
        }  
        
    } catch (error) {
        console.log(error);
    
}
    });
    document.querySelector('#confirm-no').addEventListener('click', () => {
        document.querySelector('.confirm-alert').style.display = 'none';
    });
}

async function editTeacher(id) {
    document.querySelector('.form-title').textContent = 'Edit Teacher';    
    document.getElementById('modal-form').style.display = 'block';
    document.getElementById('registrationForm').action = '/admin/teachers/update';

    const response = await fetch('/admin/teachers/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id }),
    });

    const result = await response.json();
    if (result.success) {
        document.getElementById('teacher_id').value = result.teacher.id;
        document.getElementById('teacher_code').value = result.teacher.id;
        document.getElementById('lname').value = result.teacher.lname;
        document.getElementById('fname').value = result.teacher.fname;
        document.getElementById('email').value = result.teacher.email;
        document.getElementById('grade').value = result.teacher.grade;
        document.getElementById('password').value = result.teacher.password;
    }
}


getTeachers();