const oracle = require('../../config/db');

getStudents = async (req, res) => {
    const teacherId = req.session.user.id; 

    try {
        const connection = await oracle();
        const result = await connection.execute('SELECT * FROM student');
        const students = [];
        const modules = [];
        for (let i = 0; i < result.rows.length; i++) {

            const studentAttendance = await connection.execute('SELECT COUNT(*) FROM attend WHERE CODE_S = :CODE_S AND IDT = :IDT', [result.rows[i][0], teacherId]);
            students.push({
                id: result.rows[i][0],
                firstName: result.rows[i][1],
                lastName: result.rows[i][2],
                groupe: result.rows[i][5],
                attendance: studentAttendance.rows[0][0],
            });
        }

        const result2 = await connection.execute('SELECT * FROM typemodule WHERE IDT = :IDT', [teacherId]); 

        for (let i = 0; i < result2.rows.length; i++) {

            const moduleResult = await connection.execute('SELECT * FROM module WHERE IDM = :IDM', [result2.rows[i][1]]);

            modules.push({
                id: moduleResult.rows[0][0],
                name: moduleResult.rows[0][1],
                type: result2.rows[i][2],
            });
        }

        await connection.close();
        console.log(modules);
        res.json({ students, modules });


    }
    catch (error) {
        console.error(error);
    }
}
module.exports = { getStudents };
