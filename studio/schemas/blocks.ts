import {defineField, defineType} from 'sanity'

export const media = defineType({
  name: 'media',
  title: 'Image or video',
  type: 'object',
  fields: [
    defineField({name: 'image', title: 'Image (poster when a video is set)', type: 'image', options: {hotspot: true}}),
    defineField({name: 'alt', title: 'Alt text', type: 'localeString'}),
    defineField({name: 'videoUrl', title: 'Video URL (mp4 or m3u8). Leave empty to show the image as a video placeholder.', type: 'url'}),
    defineField({name: 'isVideoPlaceholder', title: 'Show as video (poster with play mark) until a video URL is set', type: 'boolean', initialValue: false}),
    defineField({name: 'caption', title: 'Caption', type: 'localeString'}),
  ],
  preview: {select: {media: 'image', title: 'alt.en'}},
})

export const stat = defineType({
  name: 'stat',
  title: 'Figure',
  type: 'object',
  fields: [
    defineField({name: 'value', title: 'Value', type: 'string', description: 'For example "55 min" or "3 000 m"'}),
    defineField({name: 'label', title: 'Label', type: 'localeString'}),
  ],
  preview: {select: {title: 'value', subtitle: 'label.en'}},
})

export const feature = defineType({
  name: 'feature',
  title: 'Feature',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'localeString'}),
    defineField({name: 'text', type: 'localeText'}),
    defineField({name: 'href', title: 'Link (path without locale, e.g. /platforms)', type: 'string'}),
    defineField({name: 'image', type: 'image', options: {hotspot: true}}),
  ],
  preview: {select: {title: 'title.en', media: 'image'}},
})

export const section = defineType({
  name: 'section',
  title: 'Section',
  type: 'object',
  fields: [
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      options: {
        list: [
          {title: 'Prose (eyebrow, title, paragraphs)', value: 'prose'},
          {title: 'Feature grid', value: 'features'},
          {title: 'Media band (full width image or video)', value: 'media'},
          {title: 'Figures strip', value: 'stats'},
          {title: 'Dark band (title, lead, figures)', value: 'dark'},
          {title: 'Referenced documents (cards)', value: 'cards'},
          {title: 'Call to action', value: 'cta'},
          {title: 'Two columns (text left, image right)', value: 'split'},
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({name: 'eyebrow', type: 'localeString'}),
    defineField({name: 'title', type: 'localeString'}),
    defineField({name: 'lead', type: 'localeText'}),
    defineField({name: 'body', type: 'localeText'}),
    defineField({name: 'features', type: 'array', of: [{type: 'feature'}]}),
    defineField({name: 'stats', type: 'array', of: [{type: 'stat'}]}),
    defineField({name: 'media', type: 'media'}),
    defineField({name: 'refs', title: 'Referenced documents', type: 'array', of: [{type: 'reference', to: [{type: 'platform'}, {type: 'application'}, {type: 'offering'}]}]}),
    defineField({name: 'ctaLabel', type: 'localeString'}),
    defineField({name: 'ctaHref', title: 'CTA link (path without locale)', type: 'string'}),
    defineField({name: 'reverse', title: 'Swap columns', type: 'boolean', initialValue: false}),
  ],
  preview: {select: {title: 'title.en', subtitle: 'kind'}},
})
