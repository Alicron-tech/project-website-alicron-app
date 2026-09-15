import {defineField, defineType} from 'sanity'

export const platform = defineType({
  name: 'platform',
  title: 'Platform type',
  type: 'document',
  fields: [
    defineField({name: 'slug', type: 'slug', options: {source: 'name.en'}, validation: (r) => r.required()}),
    defineField({name: 'order', type: 'number'}),
    defineField({name: 'family', title: 'Family', type: 'string', options: {list: ['Multirotor', 'Fixed-wing']}}),
    defineField({name: 'name', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'role', title: 'One-line role', type: 'localeString'}),
    defineField({name: 'summary', type: 'localeText'}),
    defineField({name: 'body', type: 'localeText'}),
    defineField({name: 'status', type: 'localeString', description: 'e.g. "In service" / "In development at the R&D centre"'}),
    defineField({name: 'stats', type: 'array', of: [{type: 'stat'}]}),
    defineField({name: 'specs', title: 'Specification rows', type: 'array', of: [{type: 'object', fields: [defineField({name: 'label', type: 'localeString'}), defineField({name: 'value', type: 'localeString'})], preview: {select: {title: 'label.en', subtitle: 'value.en'}}}]}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'gallery', type: 'array', of: [{type: 'image', options: {hotspot: true}}]}),
    defineField({name: 'applications', type: 'array', of: [{type: 'reference', to: [{type: 'application'}]}]}),
  ],
  orderings: [{title: 'Order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name.en', subtitle: 'family', media: 'image'}},
})
