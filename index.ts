import puppeteer, { Page } from 'puppeteer';
import { fetchStoreData, fetchQueryData, fetchProductData } from './store';

type products={
  name: string|null;
  price: string|null;
  star: string|null;
  sold: string|null;
}

const autoScroll = async (page: Page)=>{
  await page.evaluate(async ()=>{
    await new Promise((resolve)=>{
      let totalHeight = 0
      const distance = 100 
      const timer = setInterval(()=>{
        const scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance

        if(totalHeight>=scrollHeight-window.innerHeight){
          clearInterval(timer);
          resolve(timer)
        }
      }, 100)
    })
  }
  )
}



const getProductData = async (link: string)=>{
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [`--window-size=1440,800`] 
  })
  try {
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await page.goto(link, {timeout: 60000, waitUntil: 'networkidle2'});
    const results = await page.evaluate(()=>{
      const name= document.querySelector('h1[data-testid="lblPDPDetailProductName"]')?.textContent
      const store= document.querySelector("div[data-testid='pdpShopCredibilityRow']")
      const storeName = store?.querySelector("h2")?.textContent
      const price = document.querySelector('.price')
      const star= document.querySelector('.score') 
      const sold= document.querySelector('div[data-testid="lblPDPDetailProductSoldCounter"]')
      const description= document.querySelector('div[data-testid="lblPDPDescriptionProduk"]')
      return {
        name: name,
        store: storeName,
        price: price?.textContent,
        star: star?.textContent,
        sold: sold?.textContent,
        description:  description?.textContent
      } 
    })
    browser.close()
    return results
  } catch (e) {
    console.log(e)
    browser.close()
  }

}

const getQueryData = async (link:string)=> {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [`--window-size=1440,800`] 
  })
  try {
    const page = await browser.newPage()
    await page.setViewport({
      width: 2500,
      height: 800
    })
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    let counter = 1
    link = `https://www.tokopedia.com/search?st=product&q=${link}`
    let data:products[] = []
    await page.goto(link, {timeout: 60000, waitUntil: 'networkidle2'});
    let productExist = false
    try {
      await page.waitForXPath(`.//div[contains(text(),'Oops, produk nggak ditemukan')]`)
      productExist = false
      browser.close()
      return "Not Found"
    } catch (error) {
      productExist = true
    }
    while(productExist){
      await autoScroll(page)
      await page.waitForXPath(".//div[@data-testid='master-product-card']")
        const productList = await page.evaluate(()=>{
        const productWrapper = document.querySelector("div[data-testid='divSRPContentProducts']")
        if(!productWrapper){
          return []
        }
        const products = productWrapper.querySelectorAll("div[data-testid='master-product-card']")
        const elName = document.querySelectorAll("div[data-testid='spnSRPProdName']")
        const price = document.querySelectorAll("div[data-testid='spnSRPProdPrice']")
        let items: products[] = [] as products[]
        for(let i = 0; i<products.length;i++){
          const span = products[i].querySelectorAll('span')
          items.push({
            name: elName[i].textContent,
            price: price[i].textContent,
            star: span[span.length-3] ? span[span.length-3].innerText: '',
            sold: span[span.length-1] ? span[span.length-1].innerText: ''
          })
        }
        return items
      })
      data = data.concat(productList)
      counter+=1
      await page.goto(link+`&page=${counter}`, {timeout: 60000, waitUntil: 'networkidle0'});
      try {
        await page.waitForXPath(`.//div[contains(text(),'Oops, produk nggak ditemukan')]`)
        productExist = false
        browser.close()
      } catch (error) {
        productExist = true
      }
    }
    browser.close()
    return data
  } catch (e) {
    console.log(e)
    browser.close()
    return e
  }

}


const getStoreData =async (link: string)=>{
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [`--window-size=1440,800`] 
  })
  try {
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    link = link[link.length-1]=="/"?link+"product":link+"/product"
    let data:products[] = []
    await page.goto(link, {timeout: 60000, waitUntil: 'domcontentloaded'});
    let productExist = false
    try {
      await page.waitForXPath(".//div[@data-testid='master-product-card']")
        productExist = true 
    } catch (error) {
      productExist = false
    }
    if(productExist){
      let nextPageBtn = await page.$('a[data-testid="btnShopProductPageNext"]')
      let isFirst = true
      while(nextPageBtn || isFirst){
        await page.waitForXPath(".//div[@data-testid='master-product-card']")
          const productList = await page.evaluate(()=>{
          const products = document.querySelectorAll("div[data-testid='master-product-card']")
          let items: products[] = [] as products[] 
          for(let i = 0; i<products.length;i++){
            const elName = document.querySelectorAll("div[data-testid='linkProductName']") 
            const price = document.querySelectorAll("div[data-testid='linkProductPrice']")
            const span = products[i].querySelectorAll('span')
            items.push({
              name: elName[i].textContent,
              price: price[i].textContent,
              star: span[0] ? span[0].innerText: '',
              sold: span[2] ? span[2].innerText: ''
            })
          }
          return items
        })
        data = data.concat(productList)
        isFirst = false
        await nextPageBtn?.click()
        nextPageBtn = await page.$('a[data-testid="btnShopProductPageNext"]')
      }
    }
    browser.close()
    return data
  } catch (e) {
    browser.close()
  }
}

const main=()=> {
 const stores = fetchStoreData()
 let data:products[] = []
 stores.forEach(async store=>{
    const results = await getStoreData(store.link_shop)
    if(results){
      data.concat(results)
    }
    //result will be send to post request
    console.log(results)
    return results
 })
 
 const queries = fetchQueryData()
 queries.forEach(async q=>{
    const results = await getQueryData(q.name)
    //result will be send to post request
    console.log(results)
    return results
 })
 
 const products = fetchProductData()
 products.forEach(async q=>{
    const results = await getProductData(q.link)
    //result will be send to post request
    console.log(results)
    return results
 })
}

main()



