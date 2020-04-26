import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Box } from "@material-ui/core";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Router, { withRouter } from "next/router";

import Copyright from "../../src/Copyright";
import { withApollo } from "../../lib/apollo";
import ErrorMessage from "../../src/ErrorMessage";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  copyright: {
    marginTop: theme.spacing(1),
  },
  info: {
    padding: theme.spacing(3),
  },
}));

export const GET_USER = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      name
      email
    }
  }
`;

const UserPage = ({ router }) => {
  const classes = useStyles();
  const id = router?.query?.id;

  const { loading, error, data, fetchMore } = useQuery(GET_USER, {
    variables: { id },
  });

  if (error) return <ErrorMessage message="Error loading posts." />;
  if (loading) return <div>Loading</div>;

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Детальная информация по пользователю
        </Typography>
        <Button variant="contained" onClick={() => Router.back()}>Назад</Button>
      </Box>
      <Paper className={classes.info}>
        <Grid container>
          <Grid item xs={3}>
            <Typography variant="subtitle1">Имя</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6">{data.user.name}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle1">Почта</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6">{data.user.email}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Copyright className={classes.copyright} />
    </Container>
  );
};

export default withApollo()(withRouter(UserPage));
