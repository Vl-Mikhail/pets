import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Box } from "@material-ui/core";
import MaterialTable from "material-table";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { withRouter } from "next/router";

import ProTip from "../src/ProTip";
import Copyright from "../src/Copyright";
import { withApollo } from "../lib/apollo";
import ErrorMessage from "../src/ErrorMessage";

const useStyles = makeStyles((theme) => ({
  copyright: {
    marginTop: theme.spacing(1),
  },
}));

export const GET_USERS = gql`
  query Users($take: Int, $skip: Int) {
    users(take: $take, skip: $skip) {
      id
      name
      email
    }
    _usersMeta
  }
`;

const UPDATE_USERS = gql`
  mutation UpdatePost($id: ID!, $name: String!, $email: Email!) {
    updateUser(id: $id, input: { name: $name, email: $email }) {
      id
      name
      email
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: Email!) {
    createUser(input: { name: $name, email: $email }) {
      id
      name
      email
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      name
      email
    }
  }
`;

export const USERS_SUBSCRIPTION = gql`
  subscription onUserAdded {
    userAdded {
      id
      name
      email
    }
  }
`;

function handleRowClick(e, id, router) {
  router.push({ pathname: "/[id]", query: { id } }, `/${id}`);
}

const IndexPage = ({ router }) => {
  const classes = useStyles();

  const {
    loading,
    error,
    data,
    fetchMore,
    subscribeToMore,
  } = useQuery(GET_USERS, { fetchPolicy: "network-only" });
  const [page, setPage] = useState(0);

  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USERS);
  const [deleteUser] = useMutation(DELETE_USER, {
    update: (cache, { data: { deleteUser } }) => {
      const { users, _usersMeta } = cache.readQuery({ query: GET_USERS });

      cache.writeQuery({
        query: GET_USERS,
        data: {
          users: users.filter((e) => e.id !== deleteUser.id),
          _usersMeta: _usersMeta - 1,
        },
      });
    },
  });

  useEffect(() => {
    subscribeToMore({
      document: USERS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newUsers = subscriptionData.data.userAdded;

        return {
          ...prev,
          users: [...prev.users, newUsers],
        };
      },
    });
  }, [subscribeToMore]);

  const upgradeUser = (variables) => {
    updateUser({
      variables,
      optimisticResponse: {
        __typename: "Mutation",
        updateUser: {
          ...variables,
          __typename: "User",
        },
      },
    });
  };

  const loadMoreUsers = async (newPage) => {
    await fetchMore({
      variables: {
        skip: newPage * 5,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }

        return {
          users: fetchMoreResult.users,
          _usersMeta: fetchMoreResult._usersMeta,
        };
      },
    });
    setPage(newPage);
  };

  if (error) return <ErrorMessage message="Error loading posts." />;

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Клиентское приложение
        </Typography>
        <ProTip />
      </Box>
      {loading ? (
        <p>Загрузка данных пользователей</p>
      ) : (
        <MaterialTable
          columns={[
            { title: "Имя", field: "name" },
            { title: "Почта", field: "email" },
          ]}
          data={data?.users}
          options={{
            search: false,
            pageSizeOptions: [5],
            pageSize: 5,
          }}
          page={page}
          totalCount={data?._usersMeta}
          onChangePage={loadMoreUsers}
          title="Список пользователей"
          editable={{
            onRowAdd: async (variables) => {
              await createUser({ variables });
            },
            onRowUpdate: async (variables) => {
              await upgradeUser(variables);
            },
            onRowDelete: async (row) => {
              await deleteUser({ variables: { id: row.id } });
            },
          }}
          onRowClick={(event, rowData) =>
            handleRowClick(event, rowData.id, router)
          }
        />
      )}
      <Copyright className={classes.copyright} />
    </Container>
  );
};

export default withApollo({ ssr: false })(withRouter(IndexPage));
