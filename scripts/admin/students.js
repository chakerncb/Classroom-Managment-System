document.addEventListener('DOMContentLoaded' , function(){
    getStudents();
    getGroupe();
    getLevels();
});

async function getStudents() {
    const Studentstable = document.getElementById('StudentsTable');
    Studentstable.innerHTML = '';
    document.getElementById('student_id').value = '';

    try {
        const response = await fetch('/admin/students/data');
        const data = await response.json();

        data.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.code}</td>
                <td>${student.fname}</td>
                <td>${student.lname}</td>
                <td>${student.level}</td>
                <td>${student.speciality}</td>
                <td>${student.groupe}</td>
                <td>
                    <a class="text-primary" onclick="editStudent(${student.code})"><i class="bi bi-pencil-square"></i></a>
                    <a class="text-danger" onclick="deleteStudent(${student.code})"><i class="bi bi-trash3-fill"></i></a>
                </td>
            `;
            Studentstable.appendChild(row);
        });
    } catch (error) {
        console.error(error);
    }
}

async function getGroupe() {
    const groupeSelect = document.getElementById('groupe');
    groupeSelect.innerHTML = '';

            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Select Groupe';
            groupeSelect.appendChild(option);

    try {
        const response = await fetch('/admin/students/groupe');
        const data = await response.json();

        data.forEach(groupe => {
            const option = document.createElement('option');
            option.value = groupe.id;
            option.textContent = groupe.name;
            groupeSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }   
}


async function getLevels() {
    const levelSelect = document.getElementById('level_select');
    levelSelect.innerHTML = '';
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Select Level';
    levelSelect.appendChild(option);

    try {
        const response = await fetch('/admin/students/level');
        const data = await response.json();

        data.forEach(level => {
            const option = document.createElement('option');
            option.value = level.id;
            option.textContent = level.id + ' (' + level.name + ')';
            levelSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

document.querySelector('form#registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = document.querySelector('form#registrationForm');
    const idField = document.getElementById('student_id').value;
    const formData = new FormData(form);

    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    if (idField === '') {

        console.log('add :' ,data);

        try {
            const response = await fetch('/admin/students', {
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
                getStudents();
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

        console.log('update :' ,data);

        try {
            const response = await fetch('/admin/students/update', {
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
                getStudents();
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

async function deleteStudent(id) {
   
    document.querySelector('.confirm-alert').style.display = 'flex';
    // document.querySelector('.message-danger').style.display = 'block';
    document.querySelector('.confirm-message').innerText = 'Are you sure you want to delete this teacher?';

    document.querySelector('#confirm-yes').addEventListener('click', async () => {
        document.querySelector('.confirm-alert').style.display = 'none';

    try {

            const response = await fetch('/admin/students/delete', {
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
                getStudents();
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

async function editStudent(id) {
    document.querySelector('.form-title').textContent = 'Edit Student';    
    document.getElementById('modal-form').style.display = 'block';
    document.getElementById('student_code').readOnly = true;
    // document.getElementById('passwordField').style.display = 'none';
    // document.getElementById('registrationForm').action = '/admin/teachers/update';

    const response = await fetch('/admin/students/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id }),
    });

    const result = await response.json();
    if (result.success) {
        document.getElementById('student_id').value = result.student.code;
        document.getElementById('student_code').value = result.student.code;
        document.getElementById('lname').value = result.student.lname;
        document.getElementById('fname').value = result.student.fname;
        document.getElementById('level').value = result.student.level;
        document.getElementById('speciality').value = result.student.speciality;
        document.getElementById('groupe').value = result.student.groupe;
    }
}