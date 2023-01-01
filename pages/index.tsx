import Head from 'next/head'
import styles from '../styles/Home.module.css'
import MonthDays from '../components/MonthDays'
import WeekDays from '../components/WeekDays'
import React from 'react'

export default function Home() {

  const dateOptions: { [name: string]: string } = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "numeric",
  }
  const dateOptions_MY: { [name: string]: string } = {
    year: "numeric",
    month: "long",
  }

  const [localDate, setLocalDate] = React.useState(new Date());
  const [currentDate, setCurrentDate] = React.useState('')
  const [currentMonthYear, setCurrentMonthYear] = React.useState('')


  function changeMonth(prop) {
    prop.stopPropagation();
    if (prop.target.id == styles.nextMonth) {
      localDate.setMonth(localDate.getMonth() + 1);
      setLocalDate(localDate);
    }
    else {
      localDate.setMonth(localDate.getMonth() - 1);
      setLocalDate(localDate);
    }
    setCurrentMonthYear(localDate.toLocaleDateString("default", dateOptions_MY));
  }


  React.useEffect(() => {
    setLocalDate(new Date())
    setCurrentMonthYear(localDate.toLocaleDateString("default", dateOptions_MY))
    setCurrentDate(new Date().toLocaleDateString("default", dateOptions))

    setInterval(() => {
      setCurrentDate(new Date().toLocaleDateString("default", dateOptions));
    }, 1000)
  }, [])


  return (
    <>
      <Head>
        <title>Calendar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.main}>
        <p id={styles.currentDate}>{currentDate}</p>
        <div id={styles.calendar}>
          <div className={styles.calenderInfo}>
            <div >
              <i id={styles.prevMonth} onClick={changeMonth} className={"bi bi-caret-left-fill " + styles.changeMonth} />
            </div>
            <p id={styles.currentMonthYear}>{currentMonthYear}</p>
            <div >
              <i id={styles.nextMonth} onClick={changeMonth} className={"bi bi-caret-right-fill " + styles.changeMonth} />
            </div>
          </div>
          <WeekDays />
          {/* <MonthDays date={localDate} isPolish={()=> isPolish()} /> */}
          <MonthDays date={localDate} />
        </div>
      </div>
    </>
  )
}
