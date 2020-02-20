
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE TABLE vendors CASCADE')
    .then(() => { return Promise.all([
      knex('vendors').insert(
        {
          name: "vendor_1",
          description: "vendor_1_description_1",
          image_link: "vendor_1_image_link_1",
        },'id')
        .then((id) => { return Promise.all([
          knex('products').insert([
            {
              name: "vendor_1_product_1",
              description: "vendor_1_product_1_description_1",
              price: 0.99,
              vendor_id: id[0]
            },
            {
              name: "vendor_1_product_2",
              description: "vendor_1_product_2_description_2",
              price: 0.99,
              vendor_id: id[0]
            }
          ], 'id')
          ])
        }),
      knex('vendors').insert(
        {
          name: "vendor_2",
          description: "vendor_2_description_2",
          image_link: "vendor_2_image_link_1",
        },'id')
        .then((id) => { return Promise.all([
          knex('products').insert([
            {
              name: "vendor_2_product_1",
              description: "vendor_2_product_1_description_1",
              price: 0.99,
              vendor_id: id[0]
            },
            {
              name: "vendor_2_product_2",
              description: "vendor_2_product_2_description_2",
              price: 0.99,
              vendor_id: id[0]
            }
          ], 'id')
          ])
        })
    ])
  })
  .then(() => console.log('Vendor Seeding Complete!'))
  .catch(error => console.error(`Oops! Error seeding data: ${error}`));
};
