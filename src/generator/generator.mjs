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

export async function generate(params) {
    let sheet1 = params.workbook.getWorksheet('Sheet1')
    const monthIndex = params.month - 1
    sheet1.getCell('A3').value = `${params.year} ${MONTH_WORDING[monthIndex]} Time Sheet`
    sheet1.getCell('A6').value = params.chinese_name
    sheet1.getCell('H6').value = params.english_name
    sheet1.getCell('Q6').value = params.supervisor
    sheet1.getCell('H8').value = params.position

    let timeCount = 0
    for (let i = 1, i2 = 13; i <= 31; i++, i2++) {
        let date = new Date(params.year, monthIndex, i, 8)
        sheet1.getCell(`A${i2}`).value = date
        sheet1.getCell(`B${i2}`).value = {
            formula: `WEEKDAY(A${i2})`,
            result: date.getDay(),
        }

        if (params.holidaysMap[`${i}`]) {
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
        if (month === params.month) {
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
}
