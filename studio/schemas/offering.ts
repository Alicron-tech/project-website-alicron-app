import {defineField, defineType} from 'sanity'

export const offering = defineType({
  name: 'offering',
  title: 'Offering (software, training, engineering)',
  type: 'document',
  fields: [
    defineField({name: 'slug', type: 'slug', options: {source: 'name.en'}, validation: (r) => r.required()}),
    defineField({name: 'order', type: 'number'}),
    defineField({name: 'category', type: 'string', options: {list: ['software', 'training', 'engineering']}, validation: (r) => r.required()}),
    defineField({name: 'name', type: 'localeString', validation: (r) => r.required()}),
    defineField({name: 'role', title: 'One-line role', type: 'localeString'}),
    defineField({name: 'summary', type: 'localeText'}),
    defineField({name: 'body', type: 'localeText'}),
    defineField({name: 'points', title: 'Bullet points', type: 'array', of: [{type: 'localeString'}]}),
    defineField({name: 'status', type: 'localeString'}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
  ],
  orderings: [{title: 'Order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name.en', subtitle: 'category', media: 'image'}},
})
