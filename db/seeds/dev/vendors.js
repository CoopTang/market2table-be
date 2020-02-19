
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE TABLE vendors CASCADE')
    .then(() => { return Promise.all([
      knex('vendors').insert([
        {
          name: "vendor_1",
          description: "description_1",
          image_link: "image_link_1",
        },
        {
          name: "vendor_2",
          description: "description_2",
          image_link: "image_link_2",
        }
      ], 'id')
    ])
  })
  .then(() => console.log('Vendor Seeding Complete!'))
  .catch(error => console.error(`Oops! Error seeding data: ${error}`));
};
