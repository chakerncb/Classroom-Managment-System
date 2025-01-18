const oracle = require('../../config/db');
const daysTrait = require('../../scripts/DaysTrait')



const getStudents = async (req, res) => {

    let level = 'RTW2';
    const week = daysTrait.thisWeek();
    const fromDate = week.firstDay;
    const toDate = week.lastDay;

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
                let attendanceRate = 100*(totalSessions - absence) / totalSessions; 

                students.push({
                    code: result.rows[i][0],
                    fname: result.rows[i][1],
                    lname: result.rows[i][2],
                    level: result.rows[i][3],
                    attendanceRate: attendanceRate.toFixed(0),
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
    }
    
    try {
    const absences = [];
    let currentDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const connection = await oracle();

    while (currentDate <= endDate) {
        const dayName = daysTrait.getDayName(currentDate);
        const formattedDate = currentDate.toISOString().split('T')[0];
        const Level = await connection.execute('SELECT LEVELS FROM student WHERE CODES = :CODES' , [studentId]);
        const level = Level.rows[0][0];
        const studentPresence = await connection.execute('SELECT SESSION_ID FROM attend WHERE CODE_S = :CODE_S AND S_DATE = TO_DATE(:S_DATE, \'YYYY-MM-DD\')', [studentId, formattedDate]);
        const TotalSessions = await connection.execute('SELECT * FROM schedule WHERE LEVEL_NAME = :LEVEL_NAME AND DAY_OF_WEEK = :DAY_OF_WEEK' , [level , dayName]);
        const studentPresenceCount = studentPresence.rows.length;
        const TotalSessionsCount = TotalSessions.rows.length;

        console.log(studentPresence.rows);

        if (studentPresenceCount === 0) {
            absences.push({
                date: formattedDate,
                dayName,
                absenceCount: TotalSessionsCount
            });
        }
        else {
            absences.push({
                date: formattedDate,
                dayName,
                absenceCount: TotalSessionsCount - studentPresenceCount
            });
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(absences);

    // res.json(absences);
    // await connection.close();


    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getStudents,
    studentAttendance
}