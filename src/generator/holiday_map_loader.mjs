import fs from 'fs'
import ExcelJS from 'exceljs'

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

export async function readHolidays(holidaysFolder, year, month) {
  let holidayMap = {}

  let holidayFiles = getCSVFiles(holidaysFolder)
  for (const file of holidayFiles) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = await workbook.csv.readFile(file)
    let firstRow = worksheet.getRow(1)
    if (!firstRow.cellCount) continue
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return
      if (!Array.isArray(row.values)) return
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