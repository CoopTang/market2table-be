
exports.up = function(knex) {
  return knex.schema
    .createTable('markets', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('address');
      table.string('google_link');
      table.string('schedule');
      table.float('latitude');
      table.float('longitude');

      table.timestamps(true, true);
    })
    .createTable('vendors', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('description');
      table.string('image_link');

      table.timestamps(true, true);
    })
    .createTable('products', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.string('description');
      table.float('price');
      table.integer('vendor_id').unsigned();
      table.foreign('vendor_id').references('vendors.id')

      table.timestamps(true, true);
    })
    .createTable('market_vendors', (table) => {
      table.increments('id').primary();
      table.integer('market_id').unsigned();
      table.foreign('market_id').references('markets.id')
      table.integer('vendor_id').unsigned();
      table.foreign('vendor_id').references('vendors.id')

      table.timestamps(true, true);
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('market_vendors')
    .dropTable('products')
    .dropTable('vendors')
    .dropTable('markets')
};
