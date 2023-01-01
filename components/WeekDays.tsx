import React from 'react';
import styles from '../styles/WeekDays.module.css'

export default function WeekDays() {

    const [days, setDays] = React.useState([]);

    function setWeeks() {
        let daysString: string[] = [];
        for (let i = 0; i < 7; i++) {
            // daysString[i] = new Date(Date.UTC(2017, 0, 2 + i)).toLocaleDateString('default', { weekday: 'long' });
            daysString[i] = new Date(2017, 0, 2 + i).toLocaleDateString('default', { weekday: 'long' });
        }
        setDays(daysString.map(day => <p className={styles.weekDay} key={day}>{day}</p>));
    }

    React.useEffect(() => setWeeks(), [])

    return (
        <div className={styles.weekDays}>
            {days}
        </div>
    )

}