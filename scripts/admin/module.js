document.addEventListener('DOMContentLoaded', () => {
    getModules();
    getTeachers();
});

async function getModules () {
    const card = document.querySelector('.semesters-card');
    try {
        const response = await fetch('/admin/modules/data');
        const result = await response.json();
        if (result.success) {
            card.innerHTML = '';
            const modules = result.modules;
            const types = result.types;
            const semesters = {};

            modules.forEach(module => {
                if (!semesters[module.semester]) {
                    semesters[module.semester] = [];
                }
                semesters[module.semester].push(module);
            });

            for (const semester in semesters) {
                const semesterRow = document.createElement('div');
                semesterRow.className = 'row';
                semesterRow.innerHTML = `
                    <div class="semester-header col-md-12">
                        <center> <h4>Semester ${semester}</h4> </center>
                    </div>
                    <div class="modules-constainer"></div>
                `;
                card.appendChild(semesterRow);

                let i = 1;

                const modulesCard = document.createElement('div');
                modulesCard.className = 'modules-constainer';
                semesters[semester].forEach(module => {
                    const moduleRow = document.createElement('div');
                    moduleRow.className = 'col-md-6';
                    moduleRow.innerHTML = `
                        <div class="card module-card" style="width: 18rem;">
                            <div class="card-header">
                                <h6><b>${i++}-</b> ${module.name}</h6>
                            </div>
                            <div class="table-responsive table mt-2" id="dataTable" role="grid" aria-describedby="dataTable_info">
                                <table class="table my-0" id="dataTable">
                                    <thead>
                                        <tr>
                                            <th>id</th>
                                            <th>Type</th>
                                            <th>Teacher</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${types.filter(type => type.module_id === module.id).map(type => `
                                            <tr>
                                                <td>${type.id}</td>
                                                <td>${type.name}</td>
                                                <td>${type.teacher}</td>
                                                <td>
                                                    <a class="" onclick="deleteType(${type.id}, ${module.id})"><i class="bi bi-trash3" style="color: red;"></i></a>
                                                </td>
                                            </tr>
                                        `).join('')}
                                        <tr id="addType-${module.id}">
                                            <td colspan="3">
                                                <button class="btn btn-primary" onclick="showTypeForm(${module.id})">Add Type</button>
                                            </td>
                                        </tr>
                                        <tr style="display: none;">
                                            <td colspan="3">
                                                <form id="addTypeForm-${module.id}">
                                                    <div class="form-group">
                                                        <input type="hidden" name="module_id" value="${module.id}">
                                                        <select class="form-control" name="type_id">
                                                            <option value="">Select Type</option>
                                                            <option value="1">Course</option>
                                                            <option value="2">TD</option>
                                                            <option value="3">TP</option>
                                                        </select>
                                                        <br>
                                                        <select class="form-control teacherSelect" name="teacher_id">
                                                            <option value="">Select Teacher</option>
                                                        </select>
                                                        <br>
                                                        <button onclick="addType(${module.id})" class="btn btn-primary mt-2">Add Type</button>
                                                        <button type="button" class="btn btn-danger mt-2" onclick="closeTypeForm(${module.id})">Close</button>
                                                    </div>
                                                </form>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    `;
                    modulesCard.appendChild(moduleRow);
                    card.appendChild(modulesCard);
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
}

function showTypeForm(id) {
    const form = document.querySelector(`#addTypeForm-${id}`);
    const button = document.querySelector(`#addType-${id}`);
    form.parentElement.parentElement.style.display = 'table-row';
    button.style.display = 'none';
}

function closeTypeForm(id) {
    const form = document.querySelector(`#addTypeForm-${id}`);
    const button = document.querySelector(`#addType-${id}`);
    form.parentElement.parentElement.style.display = 'none';
    button.style.display = 'table-row';
}

document.querySelector('form#moduleForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(document.querySelector('#moduleForm'));
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    try {
        const response = await fetch('/admin/modules', {
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
            setTimeout(() => {
                document.querySelector('.message-success').style.display = 'none';
            }, 3000);
            getModules();
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
});

async function getTeachers() {
    try {
        const response = await fetch('/admin/teachers/data');
        const result = await response.json();
        console.log(result);
        const selects = document.querySelectorAll('.teacherSelect');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Select Teacher</option>';
            result.forEach(teacher => {
                const option = document.createElement('option');
                option.value = teacher.id;
                option.innerText = `${teacher.name} ${teacher.lname}`;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.log(error);
    }
}


async function addType(module_id) {
    const form = document.querySelector(`#addTypeForm-${module_id}`);
    const formData = new FormData(form);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    try {
        const response = await fetch('/admin/modules/type', {
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
            setTimeout(() => {
                document.querySelector('.message-success').style.display = 'none';
            }, 3000);
            getModules();
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


async function deleteType(id , module_id) {
    try {
        const response = await fetch('/admin/modules/type/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id , module_id }),
        });

        const result = await response.json();
        if (result.success) {
            document.querySelector('.message-success').innerText = result.message;
            document.querySelector('.message-success').style.display = 'block';
            document.querySelector('.message-danger').style.display = 'none';
            setTimeout(() => {
                document.querySelector('.message-success').style.display = 'none';
            }, 3000);
            getModules();
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