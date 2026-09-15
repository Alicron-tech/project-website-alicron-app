import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Company name', type: 'string'}),
    defineField({name: 'tagline', type: 'localeString'}),
    defineField({name: 'description', title: 'Meta description', type: 'localeText'}),
    defineField({
      name: 'nav',
      title: 'Navigation',
      type: 'array',
      of: [{type: 'object', fields: [defineField({name: 'label', type: 'localeString'}), defineField({name: 'href', type: 'string'})], preview: {select: {title: 'label.en', subtitle: 'href'}}}],
    }),
    defineField({name: 'email', type: 'string'}),
    defineField({name: 'phone', type: 'string'}),
    defineField({name: 'address', type: 'localeText'}),
    defineField({name: 'footerNote', type: 'localeText'}),
    defineField({name: 'ctaLabel', title: 'Header button label', type: 'localeString'}),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
