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
  }
`;

const UPDATE_USERS = gql`
  mutation UpdatePost($id: ID!, $name: String!, $email: String!) {
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

function handleRowClick(e, id, router) {
  router.push({ pathname: "/[id]", query: { id } }, `/${id}`);
}

const IndexPage = ({ router }) => {
  const classes = useStyles();

  const { loading, error, data, fetchMore } = useQuery(GET_USERS, {
    notifyOnNetworkStatusChange: true,
  });

  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USERS);
  const [deleteUser] = useMutation(DELETE_USER);

  // const updateUser = () => {
  //   updateUser({
  //     variables: {
  //       id,
  //       votes: votes + 1,
  //     },
  //     optimisticResponse: {
  //       __typename: 'Mutation',
  //       updatePost: {
  //         __typename: 'User',
  //         id,
  //         votes: votes + 1,
  //       },
  //     },
  //   })
  // }

  const loadMoreUsers = (page) => {
    fetchMore({
      variables: {
        skip: page * 10,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          users: [...previousResult.users, ...fetchMoreResult.users],
        });
      },
    });
  };

  if (error) return <ErrorMessage message="Error loading posts." />;
  if (loading) return <div>Loading</div>;

  const users = data?.users;

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Клиентское приложение
        </Typography>
        <ProTip />
      </Box>
      <MaterialTable
        columns={[
          { title: "Имя", field: "name" },
          { title: "Почта", field: "email" },
        ]}
        data={users}
        options={{
          search: false,
          pageSizeOptions: [5],
          pageSize: 5
        }}
        onChangePage={loadMoreUsers}
        title="Список пользователей"
        editable={{
          onRowAdd: async (variables) => {
            await createUser({ variables });
          },
          onRowDelete: async (row) => {
            await deleteUser({ variables: { id: row.id } });
          },
        }}
        onRowClick={(event, rowData) =>
          handleRowClick(event, rowData.id, router)
        }
      />
      <Copyright className={classes.copyright} />
    </Container>
  );
};

export default withApollo({ ssr: true })(withRouter(IndexPage));
