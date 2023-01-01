import React from "react"

export default function MonthDays(prop) {

    const localDate = prop.date;
    let localDateMonth = localDate.getMonth();
    const currYear = localDate.getFullYear();
    const currMonth = localDate.getMonth();
    const monthsNames = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];

    const [calendarDays, setCalendarDays] = React.useState([]);
    const [dayContent, setDayContent] = React.useState({});

    const namesCountFetch = 4;
    const namesCoountShow = namesCountFetch;


    function renderCalendar() {
        // getDay: numer dnia tygodnia od 0
        // getDate: numer dnia w miesiącu
        const firstDayOfMonth: number = new Date(currYear, currMonth, 1).getDay();
        const firstDayOfMonthNormal: number = firstDayOfMonth == 0 ? 6 : firstDayOfMonth - 1;
        const lastDateOfPrevMonth: number = new Date(currYear, currMonth, 0).getDate();
        const lastDateOfMonth: number = new Date(currYear, currMonth + 1, 0).getDate();
        const lastDayOfMonth: number = new Date(currYear, currMonth + 1, 0).getDay();
        const lastDayOfMonthNormal: number = lastDayOfMonth == 0 ? 6 : lastDayOfMonth - 1;
        let countKey: number = 0;
        let itemDays = [];

        // prev month
        for (let i = firstDayOfMonthNormal; i > 0; i--) {
            itemDays.push(setDayData(lastDateOfPrevMonth - i + 1, new Date(currYear, currMonth - 1, 0).getDate(), false, countKey++))
        }

        // current month
        for (let i = 1; i <= lastDateOfMonth; i++) {
            itemDays.push(setDayData(i, currMonth, true, countKey++, dayContent[i]));
        }

        // next month
        for (let i = lastDayOfMonthNormal; i < 6; i++) {
            itemDays.push(setDayData(i - lastDayOfMonthNormal + 1, new Date(currYear, currMonth + 1, 0).getDate(), false, countKey++))
        }

        setCalendarDays(itemDays)
    }


    const wikiURL = (dayNumber: number, monthName: string) => (
        `https://pl.wikipedia.org/w/api.php?action=query&prop=extracts&origin=*&exsentences=5&titles=${dayNumber}_${monthName}&explaintext=1&&format=json`
    )


    async function fetchNameDayData(i, monthName): Array<string> {
        return fetch(wikiURL(i, monthName))
            .then(res => res.json())
            .then(data => {
                const key = Object.keys(data.query.pages)[0];
                const nameDayData = data.query.pages[key].extract;
                const nameDayDataCleaned = nameDayData.match(/.*(\r?\n|$)/gm);
                let imieniny = undefined;
                imieniny = nameDayDataCleaned?.filter(item => item.includes('Imieniny'))[0];
                imieniny = imieniny.replace('Imieniny obchodzą:', '');
                imieniny = imieniny.replace(/(\r\n|\n|\r| )/gm, "");
                imieniny = imieniny.split(',');
                imieniny = imieniny.slice(0, -1);
                imieniny = imieniny.slice(0, namesCountFetch);

                return imieniny;
            })
            .catch(error => console.log(error.message));
    }


    const setDayData = (day: number, month: string, active: boolean, key: number, nameDayData = []) => {
        const data = nameDayData as Array<string>;
        const names = data.slice(0, namesCoountShow).map(name => <i>{name},</i>);
        const isToday: boolean = (new Date().toLocaleDateString() == new Date(currYear, month, day).toLocaleDateString());
        let className = 'day ';
        className = active ? className.concat('active ') : className.concat('inactive ');
        className = isToday ? className.concat('today') : className;

        return (
            <div className={className} key={key}>
                <div>{day}</div>
                <div className="dayContent">
                    {active && names}
                </div>
            </div>
        )
    }


    const isPolish = () => {
        // const userLanguage = window.navigator.userLanguage || window.navigator.language;
        const userLanguage = navigator.languages
            ? navigator.languages[0]
            : (navigator.language || navigator.userLanguage)
        return userLanguage == 'pl-PL';
    }


    async function setCalendar() {
        console.log(isPolish())
        if (isPolish()) {
            const lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
            const monthName = monthsNames[currMonth];

            // current month
            let d = {}
            for (let i = 1; i <= lastDateOfMonth; i++) {
                fetchNameDayData(i, monthName).then(res => {
                    d[i] = res;
                    let tmp = dayContent;
                    tmp[i] = res
                    setDayContent(tmp)
                    // render calendar after every fetch
                    renderCalendar();
                });
            }
        }
        else {
            renderCalendar();
        }
    }


    React.useEffect(() => {
        setCalendar();
    }, [localDateMonth]);


    return (
        <div className="days">
            {calendarDays}
        </div>
    )
}