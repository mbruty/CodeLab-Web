import React from "react";
import Paper from "@mui/material/Paper";
import "./index.tsx.css";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { Divider } from "@mui/material";
Chart.register(ArcElement);

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

const modules = [
  {
    name: "COMP2000",
    completedPct: 82,
  },
  {
    name: "COMP2001",
    completedPct: 21,
  },
  {
    name: "COMP2002",
    completedPct: 46,
  },
  {
    name: "COMP2003",
    completedPct: 0,
  },
  {
    name: "COMP2005",
    completedPct: 29,
  },
];

const Courses: React.FC = () => {
  return (
    <div className="courses-page">
      <div style={{ paddingRight: "1rem" }}>
        <h1>Recent Activity</h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Doughnut
            height={200}
            width={200}
            data={data}
            options={{ maintainAspectRatio: false, responsive: false }}
          />
          <div className="col-2 doughnut-grid">
            {data.datasets[0].data.map((item, idx) => (
              <div className="doughnut-legend">
                <div
                  className="circle"
                  style={{ backgroundColor: chartColors[idx] }}
                ></div>
                {data.labels[idx]}: {item}&nbsp;minutes
              </div>
            ))}
          </div>
        </div>
        <div>
          <div>
            <Divider style={{ marginTop: "1rem" }} />
            <h2>Enroled Modules</h2>
            <div className="col-2">
              {modules.map((item, idx) => (
                <div className="module-card">
                  <a href="/">
                    <h3>{item.name}</h3>
                  </a>
                  <div style={{ position: "relative" }}>
                    <Doughnut
                      height={74}
                      width={74}
                      data={{
                        datasets: [
                          {
                            data: [item.completedPct, 100 - item.completedPct],
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
                      {item.completedPct}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Paper elevation={0} style={{ padding: "0 1rem", overflow: "scroll" }}>
        <h2>Recently Accessed Courses</h2>
        <Divider />
        {modules.map((item) => (
          <>
            <h3>{item.name}</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore,
              libero.
            </p>
          </>
        ))}
        <Divider />
        <h2>Popular Free Courses</h2>
        <Divider />
        {modules.map((item) => (
          <>
            <h3>{item.name}</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore,
              libero.
            </p>
          </>
        ))}
      </Paper>
    </div>
  );
};

export default Courses;
