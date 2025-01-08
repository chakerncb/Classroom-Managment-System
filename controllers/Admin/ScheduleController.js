const oracle = require('../../config/db');

createSchedule = async (req, res) => {
    const { day_of_week , idm , idtm , groupe , semester , level_name , code_c , start_time , end_time } = req.body;

    try {
        const connection = await oracle();
        // use schedule_id_seq.nextval to get the next value of the sequence
        const result1 = await connection.execute('SELECT schedule_id_seq.nextval FROM dual');
        const schedule_id = result1.rows[0][0];
        const result = await connection.execute('INSERT INTO schedule (SCHEDULE_ID , IDM , IDTM , LEVEL_NAME , CODE_C , START_TIME , END_TIME , DAY_OF_WEEK , SEMESTER , ID_GR) VALUES (:schedule_id , :IDM , :IDTM , :LEVEL_NAME , :CODE_C , TO_TIMESTAMP(:START_TIME, \'HH24:MI:SS\'), TO_TIMESTAMP(:END_TIME, \'HH24:MI:SS\'), :DAY_OF_WEEK , :SEMESTER , :ID_GR)', [schedule_id , idm , idtm , level_name , code_c , start_time , end_time , day_of_week , semester , groupe]); 
        await connection.execute('COMMIT');

        if (result.rowsAffected > 0) {
            res.json({ success: true, message: 'Schedule created successfully' });
        } else {
            res.json({ success: false, message: 'Failed to create schedule' });
        }

        await connection.close();
}
catch (err) {
    console.error(err);
    res.sendStatus(500);
}
}



getSchedules = async (req, res) => {

    try {
        const connection = await oracle();
        const result = await connection.execute('SELECT * FROM schedule');
        if (result.rows.length > 0) {
            const schedules = [];
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

                const Module = moduleResults.rows[0][0];
                const typeModule = typeModuleResults.rows[0][0];
                const groupe = groupeResults.rows[0][0];

                schedules.push({
                    id: result.rows[i][0],
                    module: Module,
                    type: typeModule,
                    groupe: groupe,
                    level_name: result.rows[i][3],
                    code_c: result.rows[i][4],
                    start_time: startTime.toISOString().split('T')[1].split('.')[0],
                    end_time: endTime.toISOString().split('T')[1].split('.')[0],
                    day_of_week: result.rows[i][7],
                    semester: result.rows[i][8]
                });
            }
            res.json({ success: true, schedules });
        } else {
            res.json({ success: false, schedules: [] });
        }
        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}


deleteSchedule = async (req, res) => {
    const { id } = req.body;

    try {
        const connection = await oracle();
        const result = await connection.execute('DELETE FROM schedule WHERE SCHEDULE_ID = :ID', [id]);
        await connection.execute('COMMIT');

        if (result.rowsAffected > 0) {
            res.json({ success: true, message: 'Schedule deleted successfully' });
        } else {
            res.json({ success: false, message: 'Failed to delete schedule' });
        }

        await connection.close();
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

module.exports = {
    createSchedule ,
    getSchedules ,
    deleteSchedule
};





