const fs = require('fs')
const ExcelJS = require('exceljs')

const MONTH_WORDING = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'November', 'December']
const START_TIME = new Date(1899, 11, 30, 17)
const END_TIME = new Date(1899, 11, 31, 2)
const WORKDAY_STYLE = {
    type: 'pattern',
    pattern: 'none'
}
const HOLIDAY_STYLE = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFBFBFBF' },
    bgColor: { argb: 'FFBFBFBF' }
}

const CONFIG = require('./config.json')

function getCSVFiles(dir) {
    let files = []
    const fileList = fs.readdirSync(dir)
    for (const file of fileList) {
        const name = `${dir}${file}`
        if (/\.csv$/.test(name)) {
            files.push(name)
        }
    }
    return files
}

async function readHolidays(year, month) {
    let holidayMap = {}

    let holidayFiles = getCSVFiles(CONFIG.holidaysFolder)
    for (const file of holidayFiles) {
        const workbook = new ExcelJS.Workbook()
        const worksheet = await workbook.csv.readFile(file)
        let firstRow = worksheet.getRow(1)
        if (!firstRow.cellCount) continue
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return
            if (row.values[1] !== '補行上班') {
                let data = row.values[2].split('/')
                if (holidayMap[data[0]] == null) {
                    holidayMap[data[0]] = {}
                }
                if (holidayMap[data[0]][data[1]] == null) {
                    holidayMap[data[0]][data[1]] = {}
                }
                holidayMap[data[0]][data[1]][data[2]] = true
            }
        })
    }

    if (holidayMap[`${year}`] == null || holidayMap[`${year}`][`${month}`] == null) {
        return {}
    }
    if (month === 5) { // Labour Day
        holidayMap[`${year}`][`${month}`][1] = true
    }
    return holidayMap[`${year}`][`${month}`]
}

async function main() {
    let holidaysMap = await readHolidays(CONFIG.year, CONFIG.month)
    if (Object.keys(holidaysMap).length === 0) {
        console.warn('WARN: No Holiday data, you need to download holidays csv. see README.md')
    }

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(CONFIG.templatePath)

    let sheet1 = workbook.getWorksheet('Sheet1')
    const monthIndex = CONFIG.month - 1
    sheet1.getCell('A3').value = `${CONFIG.year} ${MONTH_WORDING[monthIndex]} Time Sheet`
    sheet1.getCell('A6').value = CONFIG.chinese_name
    sheet1.getCell('H6').value = CONFIG.english_name
    sheet1.getCell('Q6').value = CONFIG.supervisor
    sheet1.getCell('H8').value = CONFIG.position

    let timeCount = 0
    for (let i = 1, i2 = 13; i <= 31; i++, i2++) {
        let date = new Date(CONFIG.year, monthIndex, i, 8)
        sheet1.getCell(`A${i2}`).value = date
        sheet1.getCell(`B${i2}`).value = {
            formula: `WEEKDAY(A${i2})`,
            result: date.getDay(),
        }

        if (holidaysMap[`${i}`]) {
            for (let c = 67; c <= 88; c++) {
                let cell = sheet1.getCell(`${String.fromCharCode(c)}${i2}`)
                cell.value = null
                cell.style = {
                    ...cell.style,
                    fill: HOLIDAY_STYLE
                }
            }
        } else {
            for (let c = 67; c <= 88; c++) {
                let cell = sheet1.getCell(`${String.fromCharCode(c)}${i2}`)
                cell.value = null
                cell.style = {
                    ...cell.style,
                    fill: WORKDAY_STYLE,
                }
            }
            sheet1.getCell(`C${i2}`).value = START_TIME
            sheet1.getCell(`D${i2}`).value = END_TIME
            sheet1.getCell(`E${i2}`).value = 1
            sheet1.getCell(`F${i2}`).value = 8
            timeCount += 8
        }
    }

    for (let i = 43; i > 40; i--) {
        let dateStr = sheet1.getCell(`A${i}`).value.toDateString()
        let month = new Date(dateStr).getMonth() + 1
        if (month === CONFIG.month) {
            break
        }
        timeCount -= sheet1.getCell(`F${i}`).value
        for (let c = 65; c <= 88; c++) {
            let cell = sheet1.getCell(`${String.fromCharCode(c)}${i}`)
            cell.value = null
            cell.style = {
                ...cell.style,
                fill: { type: 'pattern', pattern: 'none' },
            }
        }
    }

    sheet1.getCell(`F44`).value = {
        formula: 'SUM(F13:F43)',
        result: `${timeCount}`,
    }

    await workbook.xlsx.writeFile(CONFIG.outputPath)
}

main()


