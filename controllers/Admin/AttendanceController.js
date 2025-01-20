const oracle = require('../../config/db');
const daysTrait = require('../../scripts/DaysTrait')



const getStudents = async (req, res) => {

    let level = 'RTW2';
    const week = daysTrait.thisWeek();
    let fromDate = week.firstDay;
    let toDate = week.lastDay;

    try {
        const connection = await oracle();
        const result = await connection.execute('SELECT * FROM student WHERE LEVELS = :LEVELS' , [level]);


        if (result.rows.length > 0) {
            const students = [];
            for (let i = 0; i < result.rows.length; i++) {

                const TotalSessions = await connection.execute('SELECT COUNT(*) FROM schedule WHERE LEVEL_NAME = :LEVEL_NAME' , [level]);
                const studentPresence = await connection.execute('SELECT COUNT(*) FROM attend WHERE CODE_S = :CODE_S AND S_DATE BETWEEN TO_DATE(:FROMDATE, \'YYYY-MM-DD\') AND TO_DATE(:TODATE, \'YYYY-MM-DD\')' , [result.rows[i][0] , fromDate , toDate]);
                let totalPresence = studentPresence.rows[0][0];
                let totalSessions = TotalSessions.rows[0][0];
                let absence = totalSessions - totalPresence;
                let attendanceRate = 100 * (totalSessions - absence) / totalSessions; 

                students.push({
                    code: result.rows[i][0],
                    fname: result.rows[i][1],
                    lname: result.rows[i][2],
                    level: result.rows[i][3],
                    attendanceRate: attendanceRate.toFixed(1),
                });
            }
            
            res.json(students);
        } else {
            res.json([]);
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }

}


studentAttendance = async (req,res) => {
    let { fromDate , toDate , studentId} = req.body;

    if (!fromDate || !toDate ) {
        let week = daysTrait.thisWeek();
        fromDate = week.firstDay;
        toDate = week.lastDay;
        if (new Date(toDate) > new Date()) {
            toDate = new Date().toISOString().split('T')[0];
        }
    }
    
    try {
    const absences = [];
    let currentDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const connection = await oracle();

    let fullName = '';
    while (currentDate <= endDate) {
        const dayName = daysTrait.getDayName(currentDate);
        const formattedDate = currentDate.toISOString().split('T')[0];
        const Level = await connection.execute('SELECT * FROM student WHERE CODES = :CODES' , [studentId]);
        fullName = Level.rows[0][1] + ' ' + Level.rows[0][2];
        const level = Level.rows[0][3];
        const group = Level.rows[0][5];
        const studentPresence = await connection.execute('SELECT SESSION_ID FROM attend WHERE CODE_S = :CODE_S AND S_DATE = TO_DATE(:S_DATE, \'YYYY-MM-DD\')', [studentId, formattedDate]);
        const TotalSessions = await connection.execute('SELECT * FROM schedule WHERE LEVEL_NAME = :LEVEL_NAME AND DAY_OF_WEEK = :DAY_OF_WEEK' , [level , dayName]);
        const studentPresenceCount = studentPresence.rows.length;
        const TotalSessionsCount = TotalSessions.rows.length;

        let TodaySessions = [];
        for (let i = 0; i < TotalSessionsCount; i++) {
            TodaySessions.push(TotalSessions.rows[i][0]);
        }

        let studentPresenceSessions = [];
        for (let i = 0; i < studentPresenceCount; i++) {
            studentPresenceSessions.push(studentPresence.rows[i][0]);
        }

        // filter the sessions that the student attended

        for (let i = 0; i < studentPresenceCount; i++) {
            const index = TodaySessions.indexOf(studentPresenceSessions[i]);
            if (index > -1) {
                TodaySessions.splice(index, 1);
            }
        }
        
            const sessionCount = {};
            for (const session of TodaySessions) {
                const sessionDetails = await connection.execute('SELECT * FROM schedule WHERE SCHEDULE_ID = :SESSION_ID', [session]);
                if (sessionDetails.rows[0][9] === 0 || sessionDetails.rows[0][9] === group ){
                if (sessionDetails.rows.length > 0) {
                    const module = await connection.execute('SELECT NAME FROM module WHERE IDM = :IDM', [sessionDetails.rows[0][1]]);
                    const moduleName = module.rows[0][0];
                    if (sessionCount[moduleName]) {
                        sessionCount[moduleName]++;
                    } else {
                        sessionCount[moduleName] = 1;
                    }
                }
            }
            }

            for (const [moduleName, count] of Object.entries(sessionCount)) {
                absences.push({
                    date: formattedDate,
                    session: moduleName,
                    count: count,
                    dayName
                });
            }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    // console.log(absences);

    res.json({absences , fullName , fromDate , toDate});
    await connection.close();


    } catch (error) {
        console.log(error);
    }
}



//////////////// Teachers Attendance logic ////////////////////////////


getTeachers = async (req,res) => {

    const week = daysTrait.thisWeek();
    let fromDate = week.firstDay;
    let toDate = week.lastDay;

    try {
        const connection = await oracle();
        const result = await connection.execute('SELECT * FROM teacher');

        if (result.rows.length > 0) {
            const teachers = [];

            for (let i = 0; i < result.rows.length; i++) {
                const teacherId = result.rows[i][0];
                const teacherName = result.rows[i][1] + ' ' + result.rows[i][5];
                let attendance = 0;
                let TotalSessionsCount = 0;

                let currentDate = new Date(fromDate);
                const endDate = new Date(toDate);

                while (currentDate <= endDate) {
                    const formattedDate = currentDate.toISOString().split('T')[0];
                    const dayName = daysTrait.getDayName(currentDate);

                    const TotalSessions = await connection.execute('SELECT SCHEDULE_ID FROM schedule WHERE IDT = :IDT AND DAY_OF_WEEK = :DAY_OF_WEEK', [teacherId, dayName]);
                    TotalSessionsCount += TotalSessions.rows.length;
                    const sessions = TotalSessions.rows;

                    for (let j = 0; j < sessions.length; j++) {
                        const sessionId = sessions[j][0];
                        const teacherPresence = await connection.execute('SELECT * FROM attend WHERE IDT = :IDT AND SESSION_ID = :SESSION_ID AND S_DATE = TO_DATE(:S_DATE, \'YYYY-MM-DD\')', [teacherId, sessionId, formattedDate]);
                        if (teacherPresence.rows.length > 0) {
                            attendance++;
                        }
                    }

                    currentDate.setDate(currentDate.getDate() + 1);
                }

                let absence = TotalSessionsCount - attendance;


                if (attendance > 0) {
                    let attendanceRate = 100 * (TotalSessionsCount - absence) / TotalSessionsCount;

                    teachers.push({
                        id: teacherId,
                        name: teacherName,
                        grade: result.rows[i][2],
                        attendanceRate: attendanceRate.toFixed(1)
                    });

                }
                else {
                    let attendanceRate = 0;
                    teachers.push({
                        id: teacherId,
                        name: teacherName,
                        grade: result.rows[i][2],
                        attendanceRate: attendanceRate.toFixed(1)
                    });
                }

                attendance = 0;
                TotalSessionsCount = 0;
            }
            
            res.json(teachers);
        } else {
            res.json([]);
        }

    }
    catch (error) {
        console.log(error);
    }

}


TeacherAttendance = async (req,res) => {
        const week = daysTrait.thisWeek();
        let fromDate = week.firstDay;
        let toDate = week.lastDay;
    
        try {
            const connection = await oracle();
            const result = await connection.execute('SELECT * FROM teacher');
    
            if (result.rows.length > 0) {
                const teachers = [];
                for (let i = 0; i < result.rows.length; i++) {
                    const teacherId = result.rows[i][0];
                    const teacherName = result.rows[i][1] + ' ' + result.rows[i][2];
                    const attendanceByDay = {};
    
                    let currentDate = new Date(fromDate);
                    const endDate = new Date(toDate);
    
                    while (currentDate <= endDate) {
                        const formattedDate = currentDate.toISOString().split('T')[0];
                        const dayName = daysTrait.getDayName(currentDate);
    
                        const TotalSessions = await connection.execute('SELECT SCHEDULE_ID FROM schedule WHERE IDT = :IDT AND DAY_OF_WEEK = :DAY_OF_WEEK', [teacherId, dayName]);
                        const TotalSessionsCount = TotalSessions.rows.length;
                        const sessions = TotalSessions.rows;
    
                        let attendance = 0;
                        for (let j = 0; j < sessions.length; j++) {
                            const sessionId = sessions[j][0];
                            const teacherPresence = await connection.execute('SELECT * FROM attend WHERE IDT = :IDT AND SESSION_ID = :SESSION_ID AND S_DATE = TO_DATE(:S_DATE, \'YYYY-MM-DD\')', [teacherId, sessionId, formattedDate]);
                            if (teacherPresence.rows.length > 0) {
                                attendance++;
                            }
                        }
    
                        attendanceByDay[formattedDate] = {
                            totalSessions: TotalSessionsCount,
                            attendance: attendance
                        };
    
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
    
                    teachers.push({
                        id: teacherId,
                        name: teacherName,
                        attendanceByDay: attendanceByDay
                    });
                }
                
                res.json(teachers);
            } else {
                res.json([]);
            }
    
        }
        catch (error) {
            console.log(error);
        }
    
    }


module.exports = {
    getStudents,
    studentAttendance,
    getTeachers,
    TeacherAttendance
}