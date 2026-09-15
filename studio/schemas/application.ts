import {defineField, defineType} from 'sanity'

export const application = defineType({
  name: 'application',
  title: 'Application',
  type: 'document',
  fields: [
    defineField({name: 'slug', type: 'slug', options: {source: 'name.en'}, validation: (r) => r.required()}),
    defineField({name: 'order', type: 'number'}),
    defineField({name: 'name', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'role', title: 'One-line role', type: 'localeString'}),
    defineField({name: 'summary', type: 'localeText'}),
    defineField({name: 'body', type: 'localeText'}),
    defineField({name: 'outcomes', title: 'What the customer gets', type: 'array', of: [{type: 'localeString'}]}),
    defineField({name: 'stats', type: 'array', of: [{type: 'stat'}]}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'media', title: 'Scenario video (or placeholder)', type: 'media'}),
    defineField({name: 'platforms', type: 'array', of: [{type: 'reference', to: [{type: 'platform'}]}]}),
  ],
  orderings: [{title: 'Order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name.en', media: 'image'}},
})
