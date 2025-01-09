document.addEventListener('DOMContentLoaded', function() {
   getSessions();
});


async function getSessions() {

    const teacherId = document.getElementById('teacherId').value;
    const today = new Date().toISOString().split('T')[0];
    const dayName = new Date(today).toLocaleDateString('en-US', { weekday: 'long' });
    // const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const time = '09:39';
    console.log(dayName);
    console.log(today);
    console.log(time);
    const sessionsContainer = document.getElementById('sessions-container');

    try {
        const response = await fetch(`/teacher/sessions/${teacherId}/${dayName}`);
        const data = await response.json();

        sessionsContainer.innerHTML = `<h4 class="mt-0 mb-4 text-dark op-8 font-weight-bold">
        ${dayName}, ${today}
        </h4>
        <br>
        `;
        const sessionElement = document.createElement('div');
        sessionElement.classList.add('col-lg-4', 'mb-3');
        const sessionList = document.createElement('ul');
        sessionList.classList.add('list-timeline', 'list-timeline-primary');
        data.forEach(session => {
            let sessionItem;
            if (time >= session.startTime && time <= session.end_time) {
                sessionItem = document.createElement('li');
                sessionItem.classList.add('list-timeline-item', 'show', 'p-0', 'pb-3', 'pb-lg-4', 'd-flex', 'flex-wrap', 'flex-column', 'data-toggle="collapse"' ,'data-target="#day-1-item-2');
                sessionItem.innerHTML = `
                <a href="#" style="text-decoration: none;">
                <p class="my-0 text-dark flex-fw text-sm text-uppercase"><span class="text-primary font-weight-bold op-8 infinite animated flash" data-animate="flash" data-animate-infinite="1" data-animate-duration="3.5" style="animation-duration: 3.5s;">Now</span> - ${session.module} (${session.type})</p>
                <p class="my-0 collapse flex-fw text-uppercase text-xs text-dark op-8 show" id="day-1-item-2"> ${session.level} (S${session.semester}) - ${session.groupe} / <span class="text-primary">${session.classroom}</span> </p>
                </a>
            `;
            } else {
                sessionItem = document.createElement('li');
                sessionItem.classList.add('list-timeline-item', 'p-0', 'pb-3', 'pb-lg-4', 'd-flex', 'flex-wrap', 'flex-column');
                sessionItem.innerHTML = `
                <p class="my-0 text-dark flex-fw text-sm text-uppercase">
                    <span class="text-inverse op-8">${session.startTime} / ${session.end_time}</span> - ${session.module} (${session.type})
                </p>               
                <p class="my-0 collapse flex-fw text-uppercase text-xs text-dark op-8 show" id="day-1-item-2"> ${session.level} (S${session.semester}) - ${session.groupe} / <span class="text-secondary">${session.classroom}</span> </p> 

            `;
            }
            sessionList.appendChild(sessionItem);
        });
        sessionElement.appendChild(sessionList);
        sessionsContainer.appendChild(sessionElement);
       
        
  
    }
    catch (err) {
        console.error
    }

    // fetch(`/teacher/sessions/${teacherId}/${dayName}`)
    //     .then(response => response.json())
    //     .then(data => {
    //         data.sessions.forEach(session => {
    //             const sessionElement = document.createElement('div');
    //             sessionElement.classList.add('col-lg-4', 'mb-3');
    //             sessionElement.innerHTML = `
    //                 <h4 class="mt-0 mb-3 text-dark op-8 font-weight-bold">${session.date}</h4>
    //                 <ul class="list-timeline list-timeline-primary">
    //                     ${session.events.map(event => `
    //                         <li class="list-timeline-item p-0 pb-3 pb-lg-4 d-flex flex-wrap flex-column">
    //                             <p class="my-0 text-dark flex-fw text-sm text-uppercase">
    //                                 <span class="text-inverse op-8">${event.time}</span> - ${event.title}
    //                             </p>
    //                         </li>
    //                     `).join('')}
    //                 </ul>
    //             `;
    //             sessionsContainer.appendChild(sessionElement);
    //         });
    //     })
    //     .catch(error => console.error('Error fetching sessions:', error));

}
