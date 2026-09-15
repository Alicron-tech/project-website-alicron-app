import {defineField, defineType} from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({name: 'slug', title: 'Path (home, platforms, applications, software, training, engineering, company, contact, privacy)', type: 'slug', validation: (r) => r.required()}),
    defineField({name: 'title', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'metaDescription', type: 'localeText'}),
    defineField({name: 'heroEyebrow', type: 'localeString'}),
    defineField({name: 'heroTitle', type: 'localeString'}),
    defineField({name: 'heroLead', type: 'localeText'}),
    defineField({name: 'heroMedia', type: 'media'}),
    defineField({name: 'heroCtaLabel', type: 'localeString'}),
    defineField({name: 'heroCtaHref', type: 'string'}),
    defineField({name: 'sections', type: 'array', of: [{type: 'section'}]}),
  ],
  preview: {select: {title: 'title.en', subtitle: 'slug.current'}},
})
