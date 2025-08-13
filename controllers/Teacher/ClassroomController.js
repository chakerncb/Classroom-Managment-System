const session = require('express-session');
const oracle = require('../../config/db');

getClassrooms = async (req, res) => {

    const today = new Date();
    const date = today.toISOString().split('T')[0];
    const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const time = today.getHours() + ":" + today.getMinutes();
    // console.log(time);
    // const time = '09:30';


    try {
        const connection = await oracle();
        const result = await connection.execute('SELECT * FROM classroom');

        if (result.rows.length > 0) {
            const classrooms = [];
            
            for (let i = 0; i < result.rows.length; i++) {
                const classroomID = result.rows[i][2];
                const classroomSessions = await connection.execute(
                    'SELECT * FROM schedule WHERE CODE_C = :classroomID AND DAY_OF_WEEK = :dayName AND :time BETWEEN TO_CHAR(START_TIME, \'HH24:MI\') AND TO_CHAR(END_TIME, \'HH24:MI\') ', 
                    { classroomID, dayName, time }
                );
              
                if (classroomSessions.rows.length > 0) { // check if the class reserved in this time of day

                    const sessionID = classroomSessions.rows[0][0];
                    const classroomTaken = await connection.execute('SELECT * FROM attend WHERE SESSION_ID = :SESSION_ID AND S_DATE = TO_DATE(:S_DATE, \'YYYY-MM-DD\')', [sessionID, date]);

                 if (classroomTaken.rows.length > 0 ){ // check if the teacher is in the class

                    const teacher = await connection.execute('SELECT NAME FROM teacher WHERE IDT = :teacherID', [classroomSessions.rows[0][10]]);
                    let startTime = new Date(classroomSessions.rows[0][5]);
                    startTime.setHours(startTime.getHours() + 1);
                    let endTime = new Date(classroomSessions.rows[0][6]);
                    endTime.setHours(endTime.getHours() + 1);

                    startTime = startTime.toISOString().split('T')[1].split(':').slice(0, 2).join(':');
                    endTime = endTime.toISOString().split('T')[1].split(':').slice(0, 2).join(':');

                    const classroom = {
                        classroomID,
                        available: false,
                        classroomInfo: 'this is the classroom is taken by the teacher ' + teacher.rows[0][0] + ' at ' + startTime + ' to ' + endTime,                    
                    }
                    classrooms.push(classroom);
                }
                else {

                   
                let adjustedTime = new Date(classroomSessions.rows[0][5]);
                adjustedTime.setHours(adjustedTime.getHours() + 1);
                adjustedTime.setMinutes(adjustedTime.getMinutes() + 30);
                adjustedTime = adjustedTime.toISOString().split('T')[1].split(':').slice(0, 2).join(':');

                if (time <= adjustedTime) {

                        const classroom = {
                            classroomID,
                            available: false,
                            classroomInfo: 'this classroom is reserved but the teacher is not present'
                        }
                        classrooms.push(classroom);
                    } else {

                        const classroom = {
                            classroomID,
                            available: true,
                            classroomInfo: 'this classroom is available'
                        }
                        classrooms.push(classroom);
                    }



                }


                }
                else {
                    const classroom = {
                        classroomID,
                        available: true,
                        classroomInfo: 'this classroom is available'
                    }
                    classrooms.push(classroom);
                }

            }
            res.json(classrooms);

        } else {
            res.json({ message: 'No classrooms found' });
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}


module.exports = {  
    getClassrooms
}