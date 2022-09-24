# **PTT Crawler**

## **Introduction**
A web crawler module to fetch data from PTT.<br>
To fetch whatever you want from PTT.


> **Detail**

- The app is built with [Puppeteer](https://github.com/puppeteer/puppeteer)

- It will deploy on **【Firebase Function】**.

- Data will store at **【Google Sheet】**.

- Check stored data at:

    - `https://`

## **Features**

:rocket: Fetch PTT articles (爬取PTT的文章)

:rocket: Include Link & Image Links (包含連結以及圖片連結)

:rocket: Can filter out boys or girls in 【Beauty】 board (在表特版可以過濾掉【帥哥】或【正妹】)

## **Future Features**

- [ ] 爬取特定日期的文章
- [x] 爬取今日的文章
- [x] 爬取圖片
- [ ] 爬取內文(目前只能爬取link & image link)
- [ ] 儲存到google sheet
- [ ] 新增node-cron排程
    - [ ] 部屬到server (TBC firebase function)
