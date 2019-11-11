import Knex from 'knex';
import uniqid from 'uniqid';

export async function up(knex: Knex) {
  await knex('links_types').insert({ name: 'nest', indexing: true });

  await knex('nodes').insert({ id: 'anonymous' });
  await knex('nodes_props_strings').insert({ prop_node_id: 'anonymous', value: 'anonymous', format: 'txt', type: 'auth_token' });

  await knex('nodes').insert({ id: 'abc' });
  await knex('nodes_props_strings').insert({ prop_node_id: 'abc', value: 'abc', format: 'txt', type: 'auth_username' });
  await knex('nodes_props_strings').insert({ prop_node_id: 'abc', value: 'abc', format: 'txt', type: 'auth_password' });
}

export async function down(knex: Knex) {}
