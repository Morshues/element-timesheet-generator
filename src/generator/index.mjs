import { generate } from './generator.mjs'
import { readHolidays } from './holiday_map_loader.mjs'
import ExcelJS from 'exceljs'

export async function init(params) {
  params["templatePath"] = './resources/template.xlsx'
  params["holidaysFolder"] = './resources/'

  let holidaysMap = await readHolidays(params.holidaysFolder, params.year, params.month)
  if (Object.keys(holidaysMap).length === 0) {
    console.warn('WARN: No Holiday data, you need to download holidays csv. see README.md')
  }

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(params.templatePath)

  return {
    holidaysMap: holidaysMap,
    workbook: workbook,
    ...params,
  }
}

export const handler = async(event) => {
  const params = JSON.parse(event.body)
  const initialedParams = await init(params)
  await generate(initialedParams)

  const buffer = await initialedParams.workbook.xlsx.writeBuffer()

  console.log(buffer.toString())
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="filename.xlsx"'
    },
    body: buffer.toString('base64'),
    isBase64Encoded: true
  }
}
