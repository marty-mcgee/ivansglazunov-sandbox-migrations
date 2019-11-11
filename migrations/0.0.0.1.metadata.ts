import Knex from 'knex';

import { export_metadata } from '../imports/export_metadata';
import { defineTable, deleteTable, defineForeignRelation } from '../imports/metadata';
import { replace_metadata } from '../imports/replace_metadata';

import Debug from 'debug';

const debug = Debug('sandbox:0.0.0 metadata');

const delay = (time) => new Promise(res => setTimeout(res, time));

export async function up(knex: Knex) {
  debug('up');

  const md = await export_metadata();

  const defineEasyPermissions = (table, role, columns, selectFilter = {}) => {
    for (let i = 0; i < md.tables.length; i++) {
      if (md.tables[i].table === table) {
        md.tables[i].insert_permissions.push({
          "role": role,
          "comment": null,
          "permission": {
            "set": {},
            "check": {},
            "columns": columns,
          },
        });
        md.tables[i].select_permissions.push({
          "role": role,
          "comment": null,
          "permission": {
            "allow_aggregations": false,
            "computed_fields": [],
            "columns": columns,
            "filter": selectFilter
          },
        });
        md.tables[i].update_permissions.push({
          "role": role,
          "comment": null,
          "permission": {
            "set": {},
            "columns": columns,
            "filter": {}
          },
        });
        md.tables[i].delete_permissions.push({
          "role": role,
          "comment": null,
          "permission": {
            "filter": {}
          },
        });
      }
    }
  };

  // _sandbox
  debug('_sandbox');
  defineTable(md, '_sandbox');
  defineEasyPermissions('_sandbox', 'user', ['id', 'user_id'], { "user_id": { "_eq": "X-Hasura-User-Id" } });
  defineEasyPermissions('_sandbox', 'anonymous', ['id', 'user_id'], { "user_id": { "_eq": "X-Hasura-User-Id" } });

  // nodes
  debug('nodes');
  defineTable(md, 'nodes');
  defineEasyPermissions('nodes', 'user', ['id']);
  defineEasyPermissions('nodes', 'anonymous', ['id']);

  // nodes_types
  debug('nodes_types');
  defineTable(md, 'nodes_types');
  defineEasyPermissions('nodes_types', 'user', ['id', 'name']);
  defineEasyPermissions('nodes_types', 'anonymous', ['id', 'name']);

  // links_types 
  debug('links_types');
  defineTable(md, 'links_types');
  defineEasyPermissions('links_types', 'user', ['id', 'name', 'indexing']);
  defineEasyPermissions('links_types', 'anonymous', ['id', 'name', 'indexing']);

  // props_types
  debug('props_types');
  defineTable(md, 'props_types');
  defineEasyPermissions('props_types', 'user', ['id', 'name']);
  defineEasyPermissions('props_types', 'anonymous', ['id', 'name']);

  // links
  debug('links');
  defineTable(md, 'links');
  defineEasyPermissions('links', 'user', ['id', 'source_id', 'target_id', 'node_id', 'type_id']);
  defineEasyPermissions('links', 'anonymous', ['id', 'source_id', 'target_id', 'node_id', 'type_id']);

  defineForeignRelation(md, 'links', 'source_id', 'source', 'nodes', 'id', 'links_by_source');
  defineForeignRelation(md, 'links', 'target_id', 'target', 'nodes', 'id', 'links_by_target');
  defineForeignRelation(md, 'links', 'node_id', 'node', 'nodes', 'id', 'links_by_node');
  defineForeignRelation(md, 'links', 'type_id', 'link_type', 'links_types', 'id', 'links');

  // links_indexes
  debug('links_indexes');
  defineTable(md, 'links_indexes');
  defineEasyPermissions('links_indexes', 'user', ['id', 'list_node_id', 'index_node_id', 'index_link_id', 'list_id', 'depth']);
  defineEasyPermissions('links_indexes', 'anonymous', ['id', 'list_node_id', 'index_node_id', 'index_link_id', 'list_id', 'depth']);


  defineForeignRelation(md, 'links_indexes', 'list_node_id', 'list_node', 'nodes', 'id', 'links_indexes_by_list_node');
  defineForeignRelation(md, 'links_indexes', 'index_node_id', 'index_node', 'nodes', 'id', 'links_indexes_by_index_node');
  defineForeignRelation(md, 'links_indexes', 'index_link_id', 'index_link', 'links', 'id', 'links_indexes_by_index_link');

  // nodes_props_types
  debug('nodes_props_types');
  defineTable(md, 'nodes_props_types');
  defineEasyPermissions('nodes_props_types', 'user', ['id', 'prop_type_id', 'prop_node_id', 'node_type_id']);
  defineEasyPermissions('nodes_props_types', 'anonymous', ['id', 'prop_type_id', 'prop_node_id', 'node_type_id']);

  defineForeignRelation(md, 'nodes_props_types', 'prop_type_id', 'prop_type', 'props_types', 'id', 'nodes_props_types');
  defineForeignRelation(md, 'nodes_props_types', 'prop_node_id', 'prop_node', 'nodes', 'id', 'nodes_props_types');

  defineForeignRelation(md, 'nodes_props_types', 'node_type_id', 'node_type', 'nodes_types', 'id', 'nodes_props_types');

  // nodes_props_strings
  debug('nodes_props_strings');
  defineTable(md, 'nodes_props_strings');
  defineEasyPermissions('nodes_props_strings', 'user', ['id', 'prop_type_id', 'prop_node_id', 'value', 'format', 'type']);
  defineEasyPermissions('nodes_props_strings', 'anonymous', ['id', 'prop_type_id', 'prop_node_id', 'value', 'format', 'type']);

  defineForeignRelation(md, 'nodes_props_strings', 'prop_type_id', 'prop_type', 'props_types', 'id', 'nodes_props_strings');
  defineForeignRelation(md, 'nodes_props_strings', 'prop_node_id', 'prop_node', 'nodes', 'id', 'nodes_props_strings');

  // nodes_props_numbers
  debug('nodes_props_numbers');
  defineTable(md, 'nodes_props_numbers');
  defineEasyPermissions('nodes_props_numbers', 'user', ['id', 'prop_type_id', 'prop_node_id', 'value', 'format', 'type']);
  defineEasyPermissions('nodes_props_numbers', 'anonymous', ['id', 'prop_type_id', 'prop_node_id', 'value', 'format', 'type']);

  defineForeignRelation(md, 'nodes_props_numbers', 'prop_type_id', 'prop_type', 'props_types', 'id', 'nodes_props_numbers');
  defineForeignRelation(md, 'nodes_props_numbers', 'prop_node_id', 'prop_node', 'nodes', 'id', 'nodes_props_numbers');
  
  debug('replace_metadata');
  await replace_metadata(md);
}

export async function down(knex: Knex) {
  debug('down');

  const md = await export_metadata();

  // nodes_props_numbers
  debug('nodes_props_numbers');
  deleteTable(md, 'nodes_props_numbers');

  // nodes_props_strings
  debug('nodes_props_strings');
  deleteTable(md, 'nodes_props_strings');

  // nodes_props_types
  debug('nodes_props_types');
  deleteTable(md, 'nodes_props_types');

  // links_indexes
  debug('links_indexes');
  deleteTable(md, 'links_indexes');

  // links
  debug('links');
  deleteTable(md, 'links');

  // props_types
  debug('props_types');
  deleteTable(md, 'props_types');

  // links_types
  debug('links_types');
  deleteTable(md, 'links_types');

  // nodes_types
  debug('nodes_types');
  deleteTable(md, 'nodes_types');

  // nodes
  debug('nodes');
  deleteTable(md, 'nodes');

  // _sandbox
  debug('_sandbox');
  deleteTable(md, '_sandbox');

  debug('replace_metadata');
  await replace_metadata(md);
}
