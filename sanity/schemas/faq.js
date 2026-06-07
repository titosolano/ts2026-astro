export default {
  name: 'faq',
  title: 'FAQ',
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
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (R) => R.required(),
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 5,
      validation: (R) => R.required(),
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      initialValue: 99,
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Optional. For future filtering.',
    },
  ],
  preview: {
    select: { title: 'question', subtitle: 'category' },
  },
}
