const oracle = require('../../config/db');

getSessions = async (req, res) => {
     const teacherId = req.params.teacherId;
    // const dayName = req.params.dayName;
    const dayName = 'Monday';

    try {

       const connection = await oracle();
         const result = await connection.execute('SELECT * FROM schedule WHERE IDT = :IDT AND DAY_OF_WEEK = :DAY_OF_WEEK', [teacherId , dayName]);

         if (result.rows.length > 0) {
            const schedule = [];
            for (let i = 0; i < result.rows.length; i++) {
                const startTime = new Date(result.rows[i][5]);
                startTime.setHours(startTime.getHours() + 1);
                const endTime = new Date(result.rows[i][6]);
                endTime.setHours(endTime.getHours() + 1);

                const [moduleResults, typeModuleResults , groupeResults] = await Promise.all([
                    connection.execute('SELECT NAME FROM module WHERE IDM = :IDM', [result.rows[i][1]]),
                    connection.execute('SELECT NAMET FROM typemodule WHERE IDM = :IDM AND ID = :ID', [result.rows[i][1], result.rows[i][2]]),
                    connection.execute('SELECT NAME FROM groupe WHERE ID_G = :ID_G', [result.rows[i][9]])
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
                    // teacher: result.rows[i][10],
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


module.exports = { getSessions };