module.exports = {
    covid19List: `select * from covid19_seoul`,
    covid19Insert: `insert into covid19_seoul set ?`,
    covid19vacList: `select * from covid19vac`,
    covid19vacInsert: `insert into covid19vac set ?`,
    covid19koList: `select * from covid19_ko`,
    covid19koInsert: `insert into covid19_ko set ?`,
    covid19ageList: `select * from covid19_age`,
    covid19ageInsert: `insert into covid19_age set ?`,
    truncate:`truncate covid19_seoul`,
    truncateVac:`truncate covid19vac`,
    truncateKo:`truncate covid19_ko`,
    truncateAge:`truncate covid19_age`
    
}