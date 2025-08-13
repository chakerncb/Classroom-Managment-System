document.addEventListener('DOMContentLoaded', function() {
    getModules();
    getWeek();
});

function getWeek() {
    const fromDate = document.getElementById('from');
    const toDate = document.getElementById('to');

    const today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    const lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 4));

    fromDate.value = firstDay.toISOString().split('T')[0];
    toDate.value = lastDay.toISOString().split('T')[0];
}

async function getModules() {
    const modulesContainer = document.getElementById('modules-container');

    try {
        const response = await fetch('/teacher/modules/data');
        const modules = await response.json();

        const moduleMap = new Map();

        // Group modules by name
        modules.forEach(module => {
            if (!moduleMap.has(module.name)) {
            moduleMap.set(module.name, []);
            }
            moduleMap.get(module.name).push(module);
        });

        moduleMap.forEach((moduleList, moduleName) => {
            const dropdownContainer = document.createElement('div');
            dropdownContainer.className = 'btn-group dropend';
            dropdownContainer.style.margin = '10px';

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'btn btn-secondary';
            button.textContent = moduleName;

            const dropdownToggle = document.createElement('button');
            dropdownToggle.type = 'button';
            dropdownToggle.className = 'btn btn-secondary dropdown-toggle dropdown-toggle-split';
            dropdownToggle.setAttribute('data-bs-toggle', 'dropdown');
            dropdownToggle.setAttribute('aria-expanded', 'false');

            const dropdownMenu = document.createElement('ul');
            dropdownMenu.className = 'dropdown-menu';

            moduleList.forEach(module => {
            const dropdownItem = document.createElement('li');
            const itemButton = document.createElement('button');
            itemButton.className = 'dropdown-item';
            itemButton.textContent = module.type;
            itemButton.onclick = () => getStudents(module.id , module.typeId);
            button.onclick = () => getStudents(module.id);
            dropdownItem.appendChild(itemButton);
            dropdownMenu.appendChild(dropdownItem);
            });

            dropdownContainer.appendChild(button);
            dropdownContainer.appendChild(dropdownToggle);
            dropdownContainer.appendChild(dropdownMenu);
            modulesContainer.appendChild(dropdownContainer);
        });
        } catch (error) {
        console.error(error);
    }
}

async function getStudents(moduleId , typeId) {
    const studentsContainer = document.getElementById('students-container');
    studentsContainer.innerHTML = ''; 

    let filterButton = document.getElementById('filter');
    filterButton.onclick = () => getStudents(moduleId , typeId);

    const fromDate = document.getElementById('from').value;
    const toDate = document.getElementById('to').value;

    try {
        const response = await fetch('/teacher/students/data' , {
               method: 'POST',
               headers:{
                'Content-Type': 'application/json'
            
            },
            body: JSON.stringify({ moduleId: moduleId , typeId: typeId , fromDate: fromDate , toDate: toDate })

        });
        // console.log(moduleId  , typeId);

        const data = await response.json();

        console.log(data);
        const table = document.createElement('table');
        table.className = 'table table-striped table-bordered';

        const thead = document.createElement('thead');
        thead.className = 'thead-dark';

        const tbody = document.createElement('tbody');

        // Create table headers
        const headers = ['ID', 'First Name', 'Last Name', 'Group', 'Absence', 'Presence'];
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            tr.appendChild(th);
        });
        thead.appendChild(tr);

        // Create table rows
        data.forEach(student => {
            const tr = document.createElement('tr');
            Object.entries(student).forEach(([key, value]) => {
            const td = document.createElement('td');
            td.textContent = value;
            if (key === 'absence') {
                td.style.color = 'red';
            } else if (key === 'presence') {
                td.style.color = 'green';
            }
            tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        studentsContainer.appendChild(table);

    } catch (error) {
        console.error(error);
    }
}