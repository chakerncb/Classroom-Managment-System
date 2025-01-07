const ScheduleController = {
    getSchedules: (req, res) => {
        // Logic to fetch schedules from the database
        res.json({ schedules: [] });
    },
    createSchedule: (req, res) => {
        const { idm, idtm, level_name, code_c, start_time, end_time, day_of_week } = req.body;
        // Logic to create a new schedule in the database
        res.json({ success: true });
    }
};

module.exports = ScheduleController;
