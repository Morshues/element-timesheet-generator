import { readFile } from 'fs/promises'
import { init } from './generator/index.mjs'
import { generate } from './generator/generator.mjs'

async function main() {
  const CONFIG = JSON.parse(
    await readFile(
      new URL('../config.json', import.meta.url)
    )
  )
  const outputPath = `Work_Record_${CONFIG.year}_${CONFIG.month}_${CONFIG.english_name}.xlsx`

  const initialedParams = await init(CONFIG)
  await generate(initialedParams)
  await initialedParams.workbook.xlsx.writeFile(outputPath)
}

main()