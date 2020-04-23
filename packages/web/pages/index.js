import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Box } from "@material-ui/core";
import MaterialTable from "material-table";

import ProTip from "../src/ProTip";
import Copyright from "../src/Copyright";
import { withApollo } from "../lib/apollo";

const useStyles = makeStyles((theme) => ({
  copyright: {
    marginTop: theme.spacing(1),
  },
}));

const IndexPage = () => {
  const classes = useStyles();

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
          { title: "Adı", field: "name" },
          { title: "Soyadı", field: "surname" },
          { title: "Doğum Yılı", field: "birthYear", type: "numeric" },
          {
            title: "Doğum Yeri",
            field: "birthCity",
            lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
          },
        ]}
        data={[
          { name: "Mehmet", surname: "Baran", birthYear: 1987, birthCity: 63 },
        ]}
        title="Demo Title"
      />
      <Copyright className={classes.copyright} />
    </Container>
  );
};

export default withApollo({ ssr: true })(IndexPage);
