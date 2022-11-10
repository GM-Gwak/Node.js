let puppeteer = require('puppeteer')

async function parse()
{
    let browser = await puppeteer.launch({headless:false});
    let page = await browser.newPage();
    // page.setViewport({
    //     width: 1920,
    //     height: 1080
    // });
    await page.goto('https://corners.gmarket.co.kr/SuperDeals')
    
    /*품목중 하나만 출력하고 싶다면 $는 한개 */
    let eh = await page.$('li.masonry-brick');
    let title = await eh.$eval('span.title', function(el){
        return el.innerText
    })
    ////////////////////////////////////////////////////////

    let ehList = await page.$$('li.masonry-brick');
    
    for(let eh of ehList){
        let title = await eh.$eval('span.title', function(el){
            return el.innerText
        })
        let price = await eh.$eval('span.price strong', function(el){
            return el.innerText
        })

        console.log(title, price)
    }
    browser.close()
}

parse()