import {defineField, defineType} from 'sanity'

const langs = [
  {id: 'en', title: 'English'},
  {id: 'es', title: 'Español'},
]

const make = (name: string, title: string, type: 'string' | 'text', rows?: number) =>
  defineType({
    name,
    title,
    type: 'object',
    options: {collapsible: false},
    fields: langs.map((l) =>
      defineField({name: l.id, title: l.title, type, ...(type === 'text' ? {rows: rows ?? 6} : {})}),
    ),
    preview: {select: {title: 'en', subtitle: 'es'}},
  })

export const locale = [
  make('localeString', 'Text (EN / ES)', 'string'),
  make('localeText', 'Paragraphs (EN / ES). Separate paragraphs with a blank line.', 'text', 8),
]
