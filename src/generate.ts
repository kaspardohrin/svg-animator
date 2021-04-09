import fs from 'fs'

// generate css code per extracted id, this code can be anything you like
const templafy = (x: string, i: number, o: Array<string>): string => {
  // id of the svg path
  const id: string = x.replace(/\s/gm, '\-')

  // basic styling
  const duration: string = '5s'
  const direction: string = 'forwards'
  const animstyle: string = 'ease'

  // have each animation play from index/combined-path-length to index+1/combined-path-length, ceiled, in %
  const start: number = Math.ceil(
    i / o.length * 100
  )
  const end: number = Math.ceil(
    (i + 1) / o.length * 100
  )

  // return css
  return `#${id} { stroke-dasharray: 100; stroke-dashoffset: 100; animation: ${id} ${duration} ${animstyle}; animation-fill-mode: ${direction}; } @keyframes ${id} { ${start}% { stroke-dashoffset: 100; } ${end}% { stroke-dashoffset:0; } 100% { stroke-dashoffset: 0; } }`
}

(() => {
  const svg_path: string = './icon.svg'
  // extract text buffer from svg file
  // NOTE: this value is mutated a lot
  let buffer: string = fs.readFileSync(svg_path, { encoding: 'utf8' })

  // extract id's from svg and add to array
  const list_of_ids: RegExpMatchArray | null = buffer.match(/(?<=<path id\=\")[^\"]*(?<!\")/gm)
  if (!list_of_ids) return console.warn('\nno ids present in svg\n')

  // format ids, as css cant handle ids with whitespace
  list_of_ids?.map(
    (x: string, _: number) => {
      // if ids were previously formatted >> skip
      if (buffer.match(`${x.replace(/\s/gm, '\-')}`)) return
      // replace ids with formatted ids, and add path length 90, which is a relative value
      buffer = buffer.replace(`"${x}" `, `"${x.replace(/\s/gm, '\-')}" pathLength="90" `)
    })

  // create template css per extracted id
  const list_of_templates: Array<string> = list_of_ids.map(
    (x: string, i: number, o: Array<string>) => templafy(x, i, o))

  // join each template and wrap in style tags
  const css: string =
    `<style>
      ${list_of_templates.join('\n')}
    </style>`

  // if style tag exsists >> overwrite | else look for ending svg tag and insert
  buffer =
    (buffer.match(/\<style\>[\s\S]*\<\/style\>/gm))
      ? buffer.replace(/\<style\>[\s\S]*\<\/style\>/gm, `${css}`)
      : buffer.replace(/\s?\<\/svg\>/gm, `${css}\n</svg>`)

  // overwrite input file
  fs.writeFile('icon.svg', buffer, () => { })
})()
