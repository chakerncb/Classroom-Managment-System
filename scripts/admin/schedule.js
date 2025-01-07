document.addEventListener('DOMContentLoaded', () => {
    getModules();
    getClassrooms();
});

async function getModules() {
    const modulesSelect = document.getElementById('module-select');

    try {
        const response = await fetch('/admin/modules/data');
        const data = await response.json();
        
        data.modules.forEach(module => {
            const option = document.createElement('option');
            option.value = module.id;
            option.text = module.name;
            option.onclick = () => {
                getTypes(module.idm);
            }
            modulesSelect.appendChild(option);
        });
    }
    catch (error) {
        console.error(error);
    }
}


document.getElementById('module-select').addEventListener('change', async () => {
    const moduleId = document.getElementById('module-select').value;
    const typesSelect = document.getElementById('type-select');
    const semester = document.getElementById('semester');
    const level = document.getElementById('level');
    typesSelect.innerHTML = '';

    try {
        const response = await fetch('/admin/modules/type/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ moduleId })
        });
        const data = await response.json();

        data.types.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            option.text = type.name;
            typesSelect.appendChild(option);
        });

        semester.value = data.semester;
        level.value = data.level;
    }
    catch (error) {
        console.error(error);
    }
});


async function getClassrooms() {
    const classroomsSelect = document.getElementById('classroom-select');

    try {
        const response = await fetch('/admin/classrooms/data');
        const data = await response.json();

        data.classrooms.forEach(classroom => {
            const option = document.createElement('option');
            option.value = classroom.code;
            option.text = classroom.code + ' (' + classroom.type + ')';
            classroomsSelect.appendChild(option);
        });
    }
    catch (error) {
        console.error(error);
    }
}


