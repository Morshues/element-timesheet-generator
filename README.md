# Element Timesheet Generator
## Installation
```
npm install
```
## Usage

修改`config.json`，修改成自己的資料，以及想產生的timesheet月份

修改完成之後執行：

```
node index.js
```
Or
```
npm start
```

## Data Source
[中華民國政府行政機關辦公日曆表](https://data.gov.tw/dataset/14718 )
(須為Google行事曆專用csv)

將每年的假日資料丟進`resources/`資料夾中，即可正常產生該年的Timesheet

## Known Issues
- 本程式無法自動判斷勞動節的日期，暫時都會將勞動節設為五月一日

## The "Feel-Free" License (FFL)

This piece of software was brewed with a lot of love and a dash of magic. We would like it to spread joy far and wide!

So, feel free to:

1. Use it for any purpose, even commercially.
2. Share it with anyone, anywhere (we encourage you to show off!).
3. Modify it to suit your needs.
4. Add a sprinkle of your own magic to it.

No need to ask us, no need to tell us. Just go forth and create awesomeness!

This software comes with no warranty. We have tested it and it worked for us, but your mileage may vary. Handle with care.

Lastly, while not required, a little credit or a shout out would be appreciated. After all, nothing beats a little applause!

Created with passion, delivered with joy.