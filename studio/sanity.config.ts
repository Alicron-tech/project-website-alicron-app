import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

const singletons = ['siteSettings']

export default defineConfig({
  name: 'alicron',
  title: 'ALICRON website',
  projectId: 'wividiap',
  dataset: 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Site settings').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('page').title('Pages'),
            S.documentTypeListItem('platform').title('Platform types'),
            S.documentTypeListItem('application').title('Applications'),
            S.documentTypeListItem('offering').title('Software, training, engineering'),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => prev.filter((t) => !singletons.includes(t.schemaType)),
  },
  document: {
    actions: (prev, {schemaType}) =>
      singletons.includes(schemaType) ? prev.filter((a) => !['unpublish', 'delete', 'duplicate'].includes(a.action ?? '')) : prev,
  },
})
