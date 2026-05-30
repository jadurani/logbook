import { config, collection, fields } from '@keystatic/core';

export default config({
  storage: { kind: 'local' },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date' }),
        zone: fields.select({
          label: 'Zone',
          options: [
            { label: 'Photic', value: 'photic' },
            { label: 'Aphotic', value: 'aphotic' },
            { label: 'Abyssal', value: 'abyssal' },
          ],
          defaultValue: 'photic',
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Diving', value: 'diving' },
            { label: 'Mountains', value: 'mountains' },
            { label: 'Travel', value: 'travel' },
            { label: 'Tech', value: 'tech' },
            { label: 'People', value: 'people' },
            { label: 'Labs', value: 'labs' },
          ],
          defaultValue: 'tech',
        }),
        description: fields.text({ label: 'Description', multiline: true }),
        cover: fields.image({
          label: 'Cover image',
          directory: 'public/images',
          publicPath: '/images/',
        }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        content: fields.mdx({ label: 'Content' }),
      },
    }),
  },
});
