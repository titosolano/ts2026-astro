export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    { name: 'quote', title: 'Quote', type: 'text' },
    { name: 'authorName', title: 'Author Name', type: 'string' },
    { name: 'authorRole', title: 'Author Role', type: 'string' },
    { name: 'authorCompany', title: 'Author Company', type: 'string' },
    { name: 'authorPhoto', title: 'Author Photo', type: 'image', options: { hotspot: true } },
    { name: 'order', title: 'Order', type: 'number' },
  ],
}
