import 'mocha';

import gql from 'graphql-tag';
import fs from 'fs';
import _ from 'lodash';
import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'node-fetch';
import fastSafeStringify from 'fast-safe-stringify';
import uniqid from 'uniqid';

import { generateApolloClient } from '../../../imports/apollo';
import { generateKnex } from '../../../imports/knex';

import { prepareNodes, linking, load, check, prepareLinks, assert, clear, loadRandoms } from './methods';

describe('triggers', function() {
  this.timeout(100000);

  beforeEach(async () => {
    await clear();
  });
  // afterEach(async () => {
  //   await clear();
  // });

  it.skip('nodes', async () => {
    await prepareNodes(100);
    const data = linking(await load());
    const errors = await check(data);
    assert('nodes', data, errors, []);
  });

  const randomSimpleTree = async function({
    random: prevRandom = loadRandoms(this.test.title),
  }: {
    random?: any;
  }) {
    let data;

    await prepareNodes(5);
    data = linking(await load());

    const _randoms = [
      [ 0, 1, 3, 1 ],
      [ 1, 0, 0, 1, 1, 2, 1, 3 ],
    ];

    const randoms = await prepareLinks(
      data, 4,
      ...(prevRandom ? [
        (nodes, i) => prevRandom[0][i],
        (safetyTargets, i) => prevRandom[1][i],
      ] : []),
    );

    data = linking(await load());

    const errors = await check(data);
    assert(this.test.title, data, errors, randoms);
  };

  it('simple-tree-[[0,1,3,1],[1,0,0,1,1,2,1,3]]', async function() {
    await randomSimpleTree.call(this, { random: [[0,1,3,1],[1,0,0,1,1,2,1,3]] });
  });

  // for (let i = 0; i < 10; i++) {
  //   it(`simple-tree ${i}`, async function() {
  //     await randomSimpleTree.call(this, {});
  //   });
  // }
});