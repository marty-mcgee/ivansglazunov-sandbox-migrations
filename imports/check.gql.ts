import gql from 'graphql-tag';

export const CHECK = gql`
query {
  nodes {
    id
    links_by_node {
      id
      node_id
      type_id
      source_id
      target_id
      links_indexes_by_index_link {
        depth
        id
        index_link_id
        index_node_id
        list_id
        list_node_id
      }
    }
    links_by_source {
      id
      node_id
      source_id
      type_id
      target_id
      links_indexes_by_index_link {
        depth
        id
        index_link_id
        index_node_id
        list_id
        list_node_id
      }
    }
    links_by_target {
      id
      node_id
      source_id
      type_id
      target_id
      links_indexes_by_index_link {
        depth
        id
        index_link_id
        index_node_id
        list_id
        list_node_id
      }
    }
    links_indexes_by_index_node {
      id
      depth
      index_link_id
      index_node_id
      list_id
      list_node_id
    }
    links_indexes_by_list_node {
      depth
      id
      index_link_id
      index_node_id
      list_id
      list_node_id
    }
  }
  links {
    id
    node_id
    source_id
    target_id
    type_id
    node {
      id
      links_indexes_by_index_node {
        id
        depth
        index_link_id
        index_node_id
        list_id
        list_node_id
      }
      links_indexes_by_list_node {
        depth
        id
        index_link_id
        index_node_id
        list_id
        list_node_id
      }
    }
    target {
      id
      links_indexes_by_index_node {
        id
        depth
        index_link_id
        index_node_id
        list_id
        list_node_id
      }
      links_indexes_by_list_node {
        depth
        id
        index_link_id
        index_node_id
        list_id
        list_node_id
      }
    }
    links_indexes_by_index_link {
      id
      depth
      index_link_id
      index_node_id
      list_id
      list_node_id
    }
    source {
      id
      links_indexes_by_index_node {
        id
        depth
        index_link_id
        index_node_id
        list_id
        list_node_id
      }
      links_indexes_by_list_node {
        depth
        id
        index_link_id
        index_node_id
        list_id
        list_node_id
      }
    }
  }
  links_indexes {
    depth
    id
    index_link_id
    index_node_id
    list_id
    list_node_id
    index_link {
      id
      node_id
      source_id
      type_id
      target_id
    }
    index_node {
      id
    }
    list_node {
      id
    }
  }
}
`