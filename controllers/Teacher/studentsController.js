const oracle = require('../../config/db');

getModules = async (req, res) => {
    const teacherId = req.session.user.id; 

    try {
        const connection = await oracle();
        const result2 = await connection.execute('SELECT * FROM typemodule WHERE IDT = :IDT', [teacherId]); 

        const modules = [];
        for (let i = 0; i < result2.rows.length; i++) {
            const moduleResult = await connection.execute('SELECT * FROM module WHERE IDM = :IDM', [result2.rows[i][1]]);
            modules.push({
                id: moduleResult.rows[0][0],
                name: moduleResult.rows[0][1],
                typeId: result2.rows[i][0],
                type: result2.rows[i][2],

            });
        }

        await connection.close();
        res.json(modules);
    } catch (error) {
        console.error(error);
    }
}

getStudents = async (req, res) => {
    const teacherId = req.session.user.id; 
    const { moduleId, typeId , fromDate , toDate } = req.body;

    try {
        const connection = await oracle();

        const level = await connection.execute('SELECT LEVELM FROM module WHERE IDM = :IDM', [moduleId]);
        const result = await connection.execute('SELECT * FROM student WHERE LEVELS = :LEVELS', [level.rows[0][0]]);

        if (typeId) {

        const sessions = await connection.execute('SELECT SCHEDULE_ID , DAY_OF_WEEK FROM schedule WHERE IDM = :IDM AND IDT = :IDT AND IDTM = :IDTM', [moduleId, teacherId, typeId]);
        const students = [];

        const dayOfWeek = sessions.rows[0][1]; // Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
        const daysCount = getDaysBetweenDates(fromDate, toDate, dayOfWeek);
        console.log(daysCount);

        for (let i = 0; i < result.rows.length; i++) {

            const studentAttendance = await connection.execute('SELECT COUNT(*) FROM attend WHERE CODE_S = :CODE_S AND SESSION_ID = :SESSION_ID AND S_DATE BETWEEN TO_DATE(:FROMDATE, \'YYYY-MM-DD\') AND TO_DATE(:TODATE, \'YYYY-MM-DD\')', [result.rows[i][0], sessions.rows[0][0], fromDate, toDate]);
            students.push({
                id: result.rows[i][0],
                firstName: result.rows[i][1],
                lastName: result.rows[i][2],
                groupe: result.rows[i][5],
                absence: daysCount - studentAttendance.rows[0][0],
                presence: studentAttendance.rows[0][0],
            });
        }

        console.log(students);

    } else {

        console.log('No typeId');

    }



        await connection.close();
        res.json(students);
    }
    catch (error) {
        console.error(error);
    }
}


const getDaysBetweenDates = (startDate, endDate, dayOfWeek) => {
    const daysOfWeek = {
        'Sunday': 0,
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5,
        'Saturday': 6
    };

    const result = [];
    const current = new Date(startDate);
    const targetDay = daysOfWeek[dayOfWeek];

    while (current <= new Date(endDate)) {
        if (current.getDay() === targetDay) {
            result.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
    }

    return result.length;
};

module.exports = { getStudents, getModules };
