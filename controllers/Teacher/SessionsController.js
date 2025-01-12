const oracle = require('../../config/db');

getSessions = async (req, res) => {
     const teacherId = req.params.teacherId;


    // FIXME: after testing remove this line and uncomment the line below .
    // const dayName = req.params.dayName;
    const dayName = 'Monday';

    try {

       const connection = await oracle();
         const result = await connection.execute('SELECT * FROM schedule WHERE IDT = :IDT AND DAY_OF_WEEK = :DAY_OF_WEEK', { IDT: teacherId, DAY_OF_WEEK: dayName });

         if (result.rows.length > 0) {
            const schedule = [];
            for (let i = 0; i < result.rows.length; i++) {
                const startTime = new Date(result.rows[i][5]);
                startTime.setHours(startTime.getHours() + 1);
                const endTime = new Date(result.rows[i][6]);
                endTime.setHours(endTime.getHours() + 1);

                const [moduleResults, typeModuleResults , groupeResults] = await Promise.all([
                    connection.execute('SELECT NAME FROM module WHERE IDM = :IDM', { IDM: result.rows[i][1] }),
                    connection.execute('SELECT NAMET FROM typemodule WHERE IDM = :IDM AND ID = :ID', { IDM: result.rows[i][1], ID: result.rows[i][2] }),
                    connection.execute('SELECT NAME FROM groupe WHERE ID_G = :ID_G', { ID_G: result.rows[i][9] })
                ]);

                schedule.push({
                    id: result.rows[i][0],
                    module: moduleResults.rows[0][0],
                    type: typeModuleResults.rows[0][0],
                    level: result.rows[i][3],
                    classroom: result.rows[i][4],
                    startTime: startTime.toISOString().split('T')[1].split(':').slice(0, 2).join(':'),
                    end_time: endTime.toISOString().split('T')[1].split(':').slice(0, 2).join(':'),
                    day: result.rows[i][7],
                    semester: result.rows[i][8],
                    groupe: groupeResults.rows[0][0]
                });
            }
            res.json(schedule);
        } else {
            res.json([]);
        }
        await connection.close();
    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

getSessionStudents = async (req, res) => {
    const {sessionId} = req.body;
    let date = new Date().toISOString().split('T')[0];

    try {
        const connection = await oracle();
        const session = await connection.execute('SELECT * FROM schedule WHERE SCHEDULE_ID = :SCHEDULE_ID', { SCHEDULE_ID: sessionId });
        let result;
        if (session.rows[0][9] != 0) {
             result = await connection.execute('SELECT * FROM student WHERE LEVELS = :LEVELS AND ID_GR = :ID_GR ', { LEVELS: session.rows[0][3], ID_GR: session.rows[0][9] });
        } else {
             result = await connection.execute('SELECT * FROM student WHERE LEVELS = :LEVELS ', { LEVELS: session.rows[0][3] });   
        }
        // console.log(result);    
        
        if (result.rows.length > 0) {
            const students = [];
            for (let i = 0; i < result.rows.length; i++) {

                const groupeResults = await connection.execute('SELECT NAME FROM groupe WHERE ID_G = :ID_G', { ID_G: result.rows[i][5] });
                const attendanceResults = await connection.execute('SELECT * FROM attend WHERE CODE_S = :CODE_S AND S_DATE = TO_DATE(:S_DATE, \'YYYY-MM-DD\') AND SESSION_ID = :SESSION_ID', { CODE_S: result.rows[i][0], S_DATE: date, SESSION_ID: sessionId });

                if (attendanceResults.rows.length > 0) {
                    students.push({
                        id: result.rows[i][0],
                        firstName: result.rows[i][1],
                        lastName: result.rows[i][2],
                        level: result.rows[i][3],
                        groupe: groupeResults.rows[0][0],
                        attendance: true
                    });
                } else {
                students.push({
                    id: result.rows[i][0],
                    firstName: result.rows[i][1],
                    lastName: result.rows[i][2],
                    level: result.rows[i][3],
                    groupe: groupeResults.rows[0][0],
                });
            }
            }
            res.json(students);
        } else {
            res.json([]);
        }


    }
    catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}


storeAttendance = async (req, res) => {
    const { sessionId, students } = req.body;
    let date = new Date().toISOString().split('T')[0];

    console.log(students);
    
    try {
        const connection = await oracle();
      
        const result = await connection.execute('SELECT * FROM schedule WHERE SCHEDULE_ID = :SCHEDULE_ID', { SCHEDULE_ID: sessionId });
      
        const session = {
            S_date : date,
            Code_C : result.rows[0][4],
            IDM : result.rows[0][1],
            IDT : result.rows[0][10],
            IDTM : result.rows[0][2]
        }

        
        for (const student of students) {

            const studentExist = await connection.execute('SELECT * FROM attend WHERE CODE_S = :CODE_S AND S_DATE = TO_DATE(:S_DATE, \'YYYY-MM-DD\') AND SESSION_ID = :SESSION_ID', { CODE_S: student.id, S_DATE: date, SESSION_ID: sessionId });

            if (studentExist.rows.length == 0 && student.attendance == true) {
                await connection.execute('INSERT INTO attend (S_DATE, F_DATE, CODE_C, CODE_S, IDM, IDT, IDTM , SESSION_ID) VALUES (TO_DATE(:S_DATE, \'YYYY-MM-DD\'), TO_DATE(:F_DATE, \'YYYY-MM-DD\'),  :CODE_C, :CODE_S, :IDM, :IDT, :IDTM , :SESSION_ID)', { S_DATE: date, F_DATE: date, CODE_C: session.Code_C, CODE_S: student.id, IDM: session.IDM, IDT: session.IDT, IDTM: session.IDTM , SESSION_ID: sessionId });
            } else if (studentExist.rows.length > 0 && student.attendance == false) {
                await connection.execute('DELETE FROM attend WHERE CODE_S = :CODE_S AND S_DATE = TO_DATE(:S_DATE, \'YYYY-MM-DD\') AND SESSION_ID = :SESSION_ID', { CODE_S: student.id, S_DATE: date, SESSION_ID: sessionId });
            }

        }
        await connection.execute('commit');
        await connection.close();

        res.json({ success : true , message: 'Attendance stored successfully' });
    }
    catch (err) {
        console.error(err);
        res.json({ success : false , message: 'Error storing attendance' });
        res.sendStatus(500);
    }
}



module.exports = { getSessions  , getSessionStudents , storeAttendance };