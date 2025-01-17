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


const moduleDays = (startDate, endDate , dayOfWeek) => {
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

    return result;
}


const thisWeek= () => {
    const today = new Date();
    let firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    let lastDay = new Date(today.setDate(today.getDate() - today.getDay() + 4));

    firstDay = firstDay.toISOString().split('T')[0];
    lastDay = lastDay.toISOString().split('T')[0];

    return { firstDay, lastDay };
}


module.exports= {
    getDaysBetweenDates ,
    moduleDays,
    thisWeek
}