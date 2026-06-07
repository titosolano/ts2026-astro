export default {
  name: 'milestone',
  title: 'Milestone',
  type: 'document',
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required(),
    },
    {
      name: 'body',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (R) => R.required(),
    },
    {
      name: 'url',
      title: 'Link URL',
      type: 'url',
      description: 'Optional external link for "More info" button.',
    },
    {
      name: 'linkLabel',
      title: 'Link Label',
      type: 'string',
      description: 'Label for the external link button (e.g. "View certification", "Watch on YouTube").',
    },
    {
      name: 'icon',
      title: 'Icon',
      type: 'image',
      description: 'Small icon displayed above the title (SVG or PNG, ~32px).',
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 99,
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'body' },
  },
}
