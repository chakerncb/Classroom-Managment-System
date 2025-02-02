document.addEventListener('DOMContentLoaded', async () => {
    getClassrooms();
});


async function getClassrooms() {
    const classromsTable = document.getElementById('classroomsTable');
    
    try {
        const response = await fetch('/admin/classrooms/data');
        const result = await response.json();
        if (result.success) {
            classromsTable.innerHTML = '';
            result.classrooms.forEach(classroom => {
                classromsTable.innerHTML += `
                    <tr>
                        <td>${classroom.code}</td>
                        <td>${classroom.type}</td>
                        <td>${classroom.capacity}</td>
                        <td>
                            <a class="text-primary" onclick="editClassroom('${classroom.code}')"><i class="bi bi-pencil-square"></i></a>
                            <a class="text-danger" onclick="deleteClassroom('${classroom.code}')"><i class="bi bi-trash3-fill"></i></a>
                        </td>
                    </tr>
                `;
            });
       
        }
    }
    catch (err) {
        console.error(err);
    }
}


async function deleteClassroom(code) {
    try {
        const response = await fetch('/admin/classrooms/delete' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        });
        const result = await response.json();
        if (result.success) {
            document.querySelector('.message-success').innerText = result.message;
            document.querySelector('.message-success').style.display = 'block';
            document.querySelector('.message-danger').style.display = 'none';
            
            setTimeout(() => {
                document.querySelector('.message-success').style.display = 'none';
            }, 3000);
            getClassrooms();
        } else if (result.message) {
            document.querySelector('.message-danger').innerText = result.message;
            document.querySelector('.message-danger').style.display = 'block';
            setTimeout(() => {
                document.querySelector('.message-danger').style.display = 'none';
            }, 3000);
        }
     
    } catch (err) {
        console.error(err);
    }
}


document.querySelector('form#registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = document.querySelector('form#registrationForm');
    const classroomId = document.getElementById('clssroom_id').value;
    const formData = new FormData(form);

    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    // console.log(codeField);

    if (classroomId === '') {
        try {
            const response = await fetch('/admin/classrooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
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
                getClassrooms();
            } else if (result.message) {
                document.querySelector('.message-danger').innerText = result.message;
                document.querySelector('.message-danger').style.display = 'block';
                setTimeout(() => {
                    document.querySelector('.message-danger').style.display = 'none';
                }, 3000);
            }
        } catch (err) {
            console.error(err);
        }
    } 
    else {
        try {
            const response = await fetch('/admin/classroom/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
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
                getClassrooms();
            } else if (result.message) {
                document.querySelector('.message-danger').innerText = result.message;
                document.querySelector('.message-danger').style.display = 'block';
                setTimeout(() => {
                    document.querySelector('.message-danger').style.display = 'none';
                }, 3000);
            }
        } catch (err) {
            console.error(err);
        }
    }
    form.reset();
});


async function editClassroom(code) {
    document.getElementById("modal-form").style.display = "block";
    const codeField = document.getElementById('clssroom_id');
    const codeElement = document.getElementById('code');
    const typeElement = document.getElementById('type');
    const capacityElement = document.getElementById('capacity');

    document.getElementsByClassName('form-title')[0].innerText = 'Edit Classroom';

    try {
        const response = await fetch('/admin/classroom/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code })
        });
        const result = await response.json();
        if (result.success) {
            codeField.value = result.classroom.code;
            codeElement.value = result.classroom.code;
            typeElement.value = result.classroom.type;
            for (let i = 0; i < typeElement.options.length; i++) {
                if (typeElement.options[i].value === result.classroom.type) {
                    typeElement.selectedIndex = i;
                    break;
                }
            }
            capacityElement.value = result.classroom.capacity;
        }
    } catch (err) {
        console.error(err);
    }
}