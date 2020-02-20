
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE TABLE products CASCADE')
    .then(() => { return Promise.all([
      knex('products').insert([
        {
          name: "product_1",
          description: "description_1",
          price: "price_1",
          vendor_id: "vendor_id_1" 
        },
        {
          name: "product_2",
          description: "description_2",
          price: "price_2",
          vendor_id: "vendor_id_2"
        }
      ], 'id')
    ])
  })
  .then(() => console.log('Product Seeding Complete!'))
  .catch(error => console.error(`Oops! Error seeding data: ${error}`));
};
