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
                            <a class="text-primary" onclick="editClassroom(${classroom.code})"><i class="bi bi-pencil-square"></i></a>
                            <a class="text-danger" onclick="deleteClassroom(${classroom.code})"><i class="bi bi-trash3-fill"></i></a>
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
     
    } catch (err) {
        console.error(err);
    }
}


document.querySelector('form#registrationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = document.querySelector('form#registrationForm');
    const codeElement = document.getElementById('code');
    const codeField = codeElement ? codeElement.value : '';
    const formData = new FormData(form);

    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    // console.log(codeField);

    if (codeField === '') {
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
    // else {
    //     try {
    //         const response = await fetch('/admin/classrooms/update', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(data)
    //         });
    //         const result = await response.json();
    //         if (result.success) {
    //             getClassrooms();
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }
    form.reset();
});