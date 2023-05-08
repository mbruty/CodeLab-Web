import React from "react";
import "./index.tsx.css";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { Link } from "react-router-dom";
import { graphql } from "../../gql";
import { useQuery } from "@apollo/client";
import {
  Card,
  Spinner,
  Divider,
  Heading,
  HStack,
  VStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
Chart.register(ArcElement);

const myModules = graphql(`
  query myModules {
    myModules {
      id
      title
      completedPct
      description
    }
  }
`);

const chartColors = [
  "#fd7f6f",
  "#7eb0d5",
  "#b2e061",
  "#bd7ebe",
  "#ffb55a",
  "#ffee65",
  "#beb9db",
  "#fdcce5",
  "#8bd3c7",
];

const moduleChartColors = ["#00ebc7", "#e7e8ec"];

const data = {
  datasets: [
    {
      backgroundColor: chartColors,
      data: [102, 60, 53, 11],
    },
  ],
  labels: ["COMP2001", "COMP2000", "COMP2003", "BPIE231"],
};

const Courses: React.FC = () => {
  const { data: modules, error, loading } = useQuery(myModules);

  if (loading) {
    return (
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Spinner id="spinner" />
      </div>
    );
  }

  console.log(modules);

  return (
    <div className="courses-page">
      <VStack
        align="flex-start"
        divider={<Divider />}
        paddingLeft="1"
        paddingRight="1"
      >
        <Heading as="h1" fontSize="xxx-large">
          Recent Activity
        </Heading>
        <HStack style={{ width: "100%" }}>
          <Doughnut
            height={200}
            width={200}
            data={data}
            aria-label="Overview chart"
            options={{ maintainAspectRatio: false, responsive: false }}
          />
          <Grid
            style={{ width: "100%" }}
            templateColumns="repeat(2, 1fr)"
            gap={1}
          >
            {data.datasets[0].data.map((item, idx) => (
              <GridItem className="doughnut-legend">
                <div
                  className="circle"
                  style={{ backgroundColor: chartColors[idx] }}
                ></div>
                {data.labels[idx]}: {item}&nbsp;minutes
              </GridItem>
            ))}
          </Grid>
        </HStack>
        <div style={{ width: "100%" }}>
          <Divider style={{ marginTop: "2rem" }} />
          <Heading as="h2" fontSize="xx-large">
            Enroled Modules
          </Heading>
          <Grid
            templateColumns="repeat(2, 1fr)"
            gap="1rem"
            style={{ marginTop: "1rem", width: "100%" }}
          >
            {modules &&
              modules.myModules.map((item, idx) => (
                <Link to={`/module/${item?.id}`}>
                  <Card padding="1" paddingLeft="2">
                    <HStack>
                      <Heading as="h3" fontSize="lg">
                        {item?.title}
                      </Heading>
                      <div style={{ position: "relative", marginRight: "0", marginLeft: "auto" }}>
                        <Doughnut
                          height={74}
                          width={74}
                          aria-label="Completion percentage"
                          data={{
                            datasets: [
                              {
                                data: [
                                  item?.completedPct,
                                  100 - (item?.completedPct ?? 0),
                                ],
                                backgroundColor: moduleChartColors,
                              },
                            ],
                          }}
                          options={{
                            maintainAspectRatio: false,
                            responsive: false,
                          }}
                        />
                        <div className="module--complete-pct">
                          {item?.completedPct}%
                        </div>
                      </div>
                    </HStack>
                  </Card>
                </Link>
              ))}
          </Grid>
        </div>
      </VStack>
      <Card style={{ padding: "0 1rem", overflow: "scroll" }}>
        <Heading as="h2">Recently Accessed Courses</Heading>
        <Divider />
        {modules?.myModules.map((item: any) => (
          <Card style={{ margin: "0.5rem 0", padding: "0.5rem" }}>
            <Heading as="h3" fontSize="lg">
              {item?.title}
            </Heading>
            <p>{item.description}</p>
          </Card>
        ))}
        <Divider />
        <Heading as="h2">Popular Free Courses</Heading>
        <Divider />
        {/* {modules.map((item) => (
          <>
            <h3>{item.name}</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore,
              libero.
            </p>
          </>
        ))} */}
      </Card>
    </div>
  );
};

export default Courses;
