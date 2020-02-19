
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE TABLE markets CASCADE')
    .then(() => { return Promise.all([
      knex('markets').insert([
        {
          name: "market_1",
          address: "address_1",
          google_link: "google_link_1",
          schedule: "schedule_1",
          latitude: 1.1,
          longitude: 2.1
        },
        {
          name: "market_2",
          address: "address_2",
          google_link: "google_link_2",
          schedule: "schedule_2",
          latitude: 1.2,
          longitude: 2.2
        }
      ], 'id')
    ])
  })
  .then(() => console.log('Seeding Complete!'))
  .catch(error => console.error(`Oops! Error seeding data: ${error}`));
};
