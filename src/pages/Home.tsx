import * as React from "react";
import { Theme, withStyles, Paper, Grid } from "@material-ui/core";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  ResponsiveContainer
} from "recharts";
interface IDashboardProps {
  fetchUsers: (context?: any) => void;
  users: any;
  materialChartData: any[];
  classes?: any;
  theme?: any;
  children?: any;
}

interface IPageState {
  usersTablePage?: number;
  usersTableRowsPerPage: number;
}

class HomePage extends React.Component<IDashboardProps, IPageState> {
  public state: IPageState = {
    usersTablePage: 0,
    usersTableRowsPerPage: 5
  };

  private renderRadialBarChart(): JSX.Element {
    return (
      <Paper className={this.props.classes.paper}>
        <h3 className={this.props.classes.sectionTitle}>
          Products for each category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={this.props.materialChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              label={true}
              fill="#8884d8"
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Paper>
    );
  }

  private renderBarChart(): JSX.Element {
    return (
      <Paper className={this.props.classes.paper}>
        <h3 className={this.props.classes.sectionTitle}>
          Products for each category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={this.props.materialChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    );
  }

  public render(): JSX.Element {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true}>
          <Grid item={true} xs={12} md={6}>
            {this.renderBarChart()}
          </Grid>
          <Grid item={true} xs={12} md={6}>
            {this.renderRadialBarChart()}
          </Grid>
        </Grid>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 24
  },
  paper: {
    padding: theme.spacing.length * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  headerTiles: {
    overflowX: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRight: `5px solid ${theme.palette.secondary.main}`
  },
  headerTileIcon: {
    fontSize: 40,
    color: theme.palette.primary.main,
    paddingRight: 5
  },
  tileText: {
    fontSize: 20,
    color: theme.palette.grey["400"]
  },
  sectionTitle: {
    paddingLeft: theme.spacing.length * 2
  },
  users: {
    marginBottom: 24,
    overflowX: "scroll"
  },
  chart: {
    width: "100%"
  }
});

export default withStyles(styles as any)(HomePage as any) as any;
