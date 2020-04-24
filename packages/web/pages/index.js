import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Box } from "@material-ui/core";
import MaterialTable from "material-table";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { NetworkStatus } from "apollo-client";

import ProTip from "../src/ProTip";
import Copyright from "../src/Copyright";
import { withApollo } from "../lib/apollo";

const useStyles = makeStyles((theme) => ({
  copyright: {
    marginTop: theme.spacing(1),
  },
}));

export const GET_USERS = gql`
  query Users($take: Int!, $skip: Int!) {
    users(first: $first, skip: $skip) {
      id
      name
      email
    }
  }
`;

const UPDATE_USERS = gql`
  mutation UpdatePost($id: ID!, $name: String!, $email: String!) {
    updateUser(id: $id, input: {name: $name, email: $email}) {
      id
      name
      email
    }
  }
`

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      name
      email
    }
  }
`

export const usersQueryVars = {
  skip: 0,
  take: 10,
};

const IndexPage = () => {
  const classes = useStyles();

  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    GET_USERS,
    {
      variables: usersQueryVars,
      notifyOnNetworkStatusChange: true,
    }
  );
  const [updateUser] = useMutation(UPDATE_USERS)
  const [createUser] = useMutation(CREATE_USER)
  const [deleteUser] = useMutation(DELETE_USER)

  const udateUser = () => {
    updateUser({
      variables: {
        id,
        votes: votes + 1,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updatePost: {
          __typename: 'User',
          id,
          votes: votes + 1,
        },
      },
    })
  }

  createUser({
    variables: { name, email },
    update: (proxy, { data: { createUser } }) => {
      const data = proxy.readQuery({
        query: GET_USERS,
        variables: usersQueryVars,
      })
      // Update the cache with the new post at the top of the
      proxy.writeQuery({
        query: GET_USERS,
        data: {
          ...data,
          users: [createUser, ...data.users],
        },
        variables: usersQueryVars,
      })
    },
  })

  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore;

  const loadMoreUsers = () => {
    fetchMore({
      variables: {
        skip: users.length,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return previousResult;
        }
        return Object.assign({}, previousResult, {
          // Append the new posts results to the old one
          users: [...previousResult.users, ...fetchMoreResult.users],
        });
      },
    });
  };

  if (error) return <ErrorMessage message="Error loading posts." />;
  if (loading && !loadingMorePosts) return <div>Loading</div>;

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
          { title: "Почта", field: "email.name" },
        ]}
        data={users}
        title="Список пользователей"
      />
      <Copyright className={classes.copyright} />
    </Container>
  );
};

export default withApollo({ ssr: true })(IndexPage);
