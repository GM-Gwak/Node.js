let puppeteer = require('puppeteer')
const express = require('express')
const wait = (timeToDelay) => new Promise((resolve) => setTimeout(resolve, timeToDelay))
require('dotenv').config({path: 'mysql/.env'})

const mysql = require('./mysql')
const ejs = require('ejs')
const app = express();

app.use(express.static('public'));  //파일을 넣을 수 있습니다.  
app.use('/static', express.static('public'));  

app.set('view engine', 'ejs')

app.use(express.json()) 
app.use(express.urlencoded({extended: true})); 

app.use(express.json({
    limit: '50mb'
}))

app.listen(5000, () => {
    console.log("Server Started port 5000...")
});

app.get('/', function(req, res){
    res.render('index')
});


app.get('/kor', async(req, res) => {
    let browser = await puppeteer.launch({headless: true})
    let page= await browser.newPage()
    
    await mysql.query('truncateKo');

    await page.goto('https://coronaboard.kr/')
    await page.$eval( '#korea-slide > div > div:nth-child(5) > div > button', form => form.click() );
    
    await wait(1000)
    
    await page.$eval( '#bs-select-2-0', form => form.click() );
    await page.$eval( '#bs-select-2-2', form => form.click() );
    await page.$eval( '#bs-select-2-3', form => form.click() );
    await page.$eval( '#bs-select-2-4', form => form.click() );
    //전국 지역별 코로나 현황
    let ehList = await page.$$('#korea-slide > div')
    
    for(let eh of ehList){
        for(i=1;i<=17;i++){
        const region = await eh.$eval(`#kr-table > div tr:nth-child(${i}) > td:nth-child(2)`,function(el){
            return el.innerText + '(시/도)'
        })
        const covid_per = await eh.$eval(`#kr-table > div tr:nth-child(${i}) > td:nth-child(3)`,function(el){
            return el.innerText.split('\n',1) + '명'
        })
        const dead = await eh.$eval(`#kr-table > div tr:nth-child(${i}) > td:nth-child(4)`,function(el){
            return el.innerText.split('\n',1) + '명'
        })
        const iso_off = await eh.$eval(`#kr-table > div tr:nth-child(${i}) > td:nth-child(5)`,function(el){
            return el.innerText.split(' ',1) + '명'
        })
        const recovery_rate = await eh.$eval(`#kr-table >div tr:nth-child(${i}) > td:nth-child(6)`,function(el){
            return el.innerText + '%'
        })
        const total_per = await eh.$eval(`#kr-table > div tr:nth-child(${i}) > td:nth-child(7)`,function(el){
            return el.innerText + '명'
        })
            kor = {
                region:region,
                covid_per:covid_per,
                dead:dead,
                iso_off:iso_off,
                recovery_rate:recovery_rate,
                total_per:total_per
            }
            await mysql.query('covid19koInsert', kor)
        }   
        
    }
  //대한민국 코로나 현황
    const covid19_koList = await mysql.query('covid19koList');
    const kor2 = []
    for(var i=0;i<covid19_koList.length;i++)
    {
        kor2[i] = {
            region: covid19_koList[i].region,
            covid_per: covid19_koList[i].covid_per,
            dead: covid19_koList[i].dead,
            iso_off: covid19_koList[i].iso_off,
            recovery_rate: covid19_koList[i].recovery_rate,
            total_per: covid19_koList[i].total_per
        }
    }
    await page.goto('https://www.seoul.go.kr/coronaV/coronaStatus.do?menu_code=01')
    
    let eh = await page.$('#move-cont1 > div.status.status-2022.status-2022-new.status-202207-new > div.status-korea > div')
    
    const today_per = await eh.$eval(`div.cell.cell1 > div.num.knum5 > p.counter`,function(el){
        return el.innerText + '명'
    })
    const covid_per = await eh.$eval(`div.cell.cell1 > div.num.knum1 > p.counter`,function(el){
        return el.innerText + '명'
    })
    const today_dead = await eh.$eval(`div.cell.cell2 > div.num.knum3 > p.counter`,function(el){
        return el.innerText + '명'
    })
    const covid_dead = await eh.$eval(`div.cell.cell2 > div.num.knum2 > p.counter`,function(el){
        return el.innerText + '명'
    })
        const obj = [{
            today_per:today_per,
            covid_per:covid_per,
            today_dead:today_dead,
            covid_dead:covid_dead
        }]
        
    obj2 = {
        kor2:kor2,
        obj:obj
    }
        
    
    res.render('kor',{data:obj2});
});

////////////////////////////////////////////////////////////

app.get('/seoul', async(req, res) => {
    let browser = await puppeteer.launch({headless: true})
    let page= await browser.newPage()
   
    await mysql.query('truncate');
    await mysql.query('truncateAge');

    await page.goto('https://www.seoul.go.kr/coronaV/coronaStatus.do?menu_code=01')
    //서울 확진자 현황
    
    let ehList = await page.$$('#container > div.layout-inner.layout-sub')

     for(let eh of ehList){
        for(i=1;i<=13;i++){
            let area_1 = await eh.$eval(`tr:nth-child(1) > th:nth-child(${i})`,function(el){
                return el.innerText
            })
            let new_1 = await eh.$eval(`tr:nth-child(3) > td:nth-child(${i})`,function(el){
                return el.innerText + '명'
            })
            let total_1 = await eh.$eval(`tr:nth-child(2) > td:nth-child(${i})`,function(el){
                return el.innerText 
            })
            let area_2 = await eh.$eval(`tr:nth-child(4) > th:nth-child(${i})`,function(el){
                return el.innerText 
            })
            let new_2 = await eh.$eval(`tr:nth-child(6) > td:nth-child(${i})`,function(el){
                return el.innerText + '명'
            })
            let total_2 = await eh.$eval(`tr:nth-child(5) > td:nth-child(${i})`,function(el){
                return el.innerText 
            })
            obj = {
                area_1:area_1,
                new_1:new_1,
                total_1:total_1,
                area_2:area_2,
                new_2:new_2,
                total_2:total_2
            }
            await mysql.query('covid19Insert', obj)
        }
    }
    //서울 확진자 연령대 현황
    for(let eh of ehList){
        for(i=3;i<=10;i++){
            let age = await eh.$eval(`div:nth-child(4) > table > thead > tr > th:nth-child(${i})`,function(el){
                return el.innerText
            })
            let cnt = await eh.$eval(`div:nth-child(4) > table > tbody > tr.odd > td:nth-child(${i})`,function(el){
                return el.innerText 
            })
            let ratio = await eh.$eval(`div:nth-child(4) > table > tbody > tr:nth-child(2) > td:nth-child(${i})`,function(el){
                return el.innerText + '%'
            })
            obj = {
                age:age,
                cnt:cnt,
                ratio:ratio
                
            }
            await mysql.query('covid19ageInsert', obj)
            }
    }
        
    const covid19List = await mysql.query('covid19List');
    const seoul = []
    for(var i=0;i<covid19List.length;i++)
    {
        seoul[i] = {
            area_1: covid19List[i].area_1,
            new_1: covid19List[i].new_1,
            total_1: covid19List[i].total_1,
            area_2: covid19List[i].area_2,
            new_2: covid19List[i].new_2,
            total_2: covid19List[i].total_2,
        }
    }
    const covid19ageList = await mysql.query('covid19ageList');
    const age = []
    for(var i=0;i<covid19ageList.length;i++)
    {
        age[i] = {
            age: covid19ageList[i].age,
            cnt: covid19ageList[i].cnt,
            ratio: covid19ageList[i].ratio,
        }
    }
    
    seoul_age = {
        seoul:seoul,
        age:age
    }
    res.render('seoul',{data:seoul_age});
});

/////////////////////////////////////////////////////////////////

app.get('/vac', async(req, res) => {
    let browser = await puppeteer.launch({headless: true})
    let page= await browser.newPage()
    await mysql.query('truncateVac');

    await page.goto('https://www.seoul.go.kr/coronaV/coronaStatus.do?menu_code=47')
    //서울 백신 접종 현황
    let ehList = await page.$$('div.status.vac-status')
    await page.waitForTimeout(1000)
     for(let eh of ehList){
        for(i=2;i<=5;i++){
            let vac_degree = await eh.$eval(`div.num.num1 > p.counter.row${i} > span`,function(el){
                return el.innerText
            })
            let vac_per = await eh.$eval(`div.num.num4 > p.counter.row${i} > span`,function(el){
                return el.innerText 
             })
            let vac_new = await eh.$eval(`div.num.num3 > p.counter.row${i} > span`,function(el){
                return el.innerText 
            })
            let vac_ratio = await eh.$eval(`div > p.counter.row${i} > span > span`,function(el){
                return el.innerText + '%'
            })
            vac = {
                vac_degree:vac_degree,
                vac_per:vac_per,
                vac_new:vac_new,
                vac_ratio:vac_ratio
            }
            await mysql.query('covid19vacInsert', vac)
        }
    }
    
    const covidvacList = await mysql.query('covid19vacList');
    const vac2 = []
    for(var i=0;i<covidvacList.length;i++)
    {
        
        vac2[i] = {
            vac_degree: covidvacList[i].vac_degree,
            vac_per: covidvacList[i].vac_per,
            vac_new: covidvacList[i].vac_new,
            vac_ratio: covidvacList[i].vac_ratio,
        }
    }
    
    res.render('vac',{data:vac2});
});

///////////////////////////////////////////////////////////

