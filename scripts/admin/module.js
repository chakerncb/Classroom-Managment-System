async function getModules () {
    const card = document.querySelector('.card-body');
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
                    <div class="col-md-12">
                        <center> <h4>Semester ${semester}</h4> </center>
                    </div>
                `;
                card.appendChild(semesterRow);

                let i=1;

                semesters[semester].forEach(module => {
                    const moduleRow = document.createElement('div');
                    moduleRow.className = 'col-md-6';
                    moduleRow.innerHTML = `
                        <div class="table-responsive table mt-2" id="dataTable" role="grid" aria-describedby="dataTable_info">
                        <br>
                            <h6><b>${i++}-</b> ${module.name} :</h6>
                          <table class="table my-0" id="dataTable">
                                <thead>
                                    <tr>
                                        <th>id</th>
                                        <th>Type</th>
                                    </tr>
                                </thead>

                                <tbody>
                                ${types.filter(type => type.module_id === module.id).map(type => `   

                                        <tr>
                                            <td>${type.id}</td>
                                            <td>${type.name}</td>
                                        </tr>
                            
                                
                                `).join('')}
                                </tbody>
                          </table>
    
                        </div>
                    `;
                    card.appendChild(moduleRow);
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
}

getModules();