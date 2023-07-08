// npm init -y
// npm install puppeteer
// npm install minimistnode hackerranklog.js --url=https://www.hackerrank.com --config=config.json
// 

let fs = require("fs");
const { url } = require("inspector");
let minimist = require("minimist");
let puppeteer = require("puppeteer");
 
let args = minimist(process.argv);
let configJSON = fs.readFileSync(args.config,"utf-8");
let config = JSON.parse(configJSON);

async function run(){
    
let browser = await puppeteer.launch({
    headless: false,
    args:[
        '--start-maximized'
    ],

    defaultViewport:null
});

let pages = await browser.pages();
let page = pages[0];

await page.goto(args.url);

await page.waitForSelector("a[data-event-action='Login']");
await page.click("a[data-event-action='Login']");

await page.waitForSelector("a[href='https://www.hackerrank.com/login']");
await page.click("a[href='https://www.hackerrank.com/login']");

await page.waitForSelector("input[name='username']");
await page.type("input[name='username']" ,config.user,{delay: 70});

await page.waitForSelector("input[name='password']");
await page.type("input[name='password']" , config.password ,{delay: 70});

await page.waitForSelector("button[data-analytics='LoginPassword'");
await page.click("button[data-analytics='LoginPassword'")

await page.waitForSelector("a[data-analytics='NavBarContests']");
await page.click("a[data-analytics='NavBarContests']");

await page.waitForSelector("a[href='/administration/contests/']");
await page.click("a[href='/administration/contests/']");

//find no of pages

await page.waitForSelector("a[data-attr1='Last']");
let numPages = await page.$eval("a[data-attr1='Last']" ,function(atag){
 let totPages = parseInt( atag.getAttribute("data-page"));
 return totPages;
});

// console.log (numPages);
// return;

//move to all pages

for(let i=0; i<numPages;i++){
await handlepage(browser,page);
}
}
 async function handlepage(browser,page){
    
     await page.waitForSelector("a.backbone.block-center");
    let curls = await page.$$eval("a.backbone.block-center", function(atags){
            let urls =[];
    
            for(let i=0;i<atags.length;i++){
                let url =atags[i].getAttribute("href");
                urls.push(url);
            }
     return urls;
     
    });
     for(let i=0;i<curls.length;i++){
         let ctab = await browser.newPage();
         await savemoderators(ctab , args.url + curls[i] , config.moderators);
         await ctab.close();
         await page.waitFor(1000);
     }

 await page.waitFor(1500);
await page.waitForSelector("a[data-attr1='Right']");
await page.click("a[data-attr1='Right']");
 }
 


// async function handleallcontest(){
// await page.waitForSelector("a.backbone.block-center");
// let curls = await page.$$eval("a.backbone.block-center", function(atags){
// let urls =[];
    
// for(let i=0;i<atags.length;i++){
// let url =atags[i].getAttribute("href");
// urls.push(url);
// }
// return urls;
     
// });
// for(let i=0;i<curls.length;i++){
// let ctab = await browser.newPage();
// await savemoderators(ctab , args.url + curls[i] , config.moderators);
// await ctab.close();
// await page.waitFor(1000);
// }
// }
 async function savemoderators(ctab,fullcurls,moderator){

    await ctab.bringToFront();
    await ctab.goto(fullcurls);
    await ctab.waitFor(3000);

    
    await ctab.waitForSelector("li[data-tab='moderators']");
    await ctab.click("li[data-tab='moderators']");

    await ctab.waitForSelector("input#moderator"); 
    await ctab.click("input#moderator");
    await ctab.type("input#moderator",moderator, {delay: 100} );


    await ctab.keyboard.press("Enter");


 }
// await page.waitFor(1000);
// console.log(curls);


run();