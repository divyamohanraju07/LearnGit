import * as React from "react";
import { ResponsiveLine } from "@nivo/line";

class ApplicantWidget extends React.Component {
  state = {
    data: [
      {
        id: "japan",
        color: "hsl(44, 70%, 50%)",
        data: [
          {
            x: "plane",
            y: 53
          },
          {
            x: "helicopter",
            y: 193
          },
          {
            x: "boat",
            y: 29
          },
          {
            x: "train",
            y: 294
          },
          {
            x: "subway",
            y: 205
          },
          {
            x: "bus",
            y: 226
          },
          {
            x: "car",
            y: 172
          },
          {
            x: "moto",
            y: 69
          },
          {
            x: "bicycle",
            y: 254
          },
          {
            x: "horse",
            y: 11
          },
          {
            x: "skateboard",
            y: 285
          },
          {
            x: "others",
            y: 191
          }
        ]
      },
      {
        id: "france",
        color: "hsl(36, 70%, 50%)",
        data: [
          {
            x: "plane",
            y: 263
          },
          {
            x: "helicopter",
            y: 197
          },
          {
            x: "boat",
            y: 76
          },
          {
            x: "train",
            y: 46
          },
          {
            x: "subway",
            y: 237
          },
          {
            x: "bus",
            y: 153
          },
          {
            x: "car",
            y: 101
          },
          {
            x: "moto",
            y: 257
          },
          {
            x: "bicycle",
            y: 197
          },
          {
            x: "horse",
            y: 22
          },
          {
            x: "skateboard",
            y: 86
          },
          {
            x: "others",
            y: 147
          }
        ]
      },
      {
        id: "us",
        color: "hsl(142, 70%, 50%)",
        data: [
          {
            x: "plane",
            y: 214
          },
          {
            x: "helicopter",
            y: 266
          },
          {
            x: "boat",
            y: 278
          },
          {
            x: "train",
            y: 62
          },
          {
            x: "subway",
            y: 53
          },
          {
            x: "bus",
            y: 82
          },
          {
            x: "car",
            y: 215
          },
          {
            x: "moto",
            y: 123
          },
          {
            x: "bicycle",
            y: 260
          },
          {
            x: "horse",
            y: 212
          },
          {
            x: "skateboard",
            y: 69
          },
          {
            x: "others",
            y: 185
          }
        ]
      },
      {
        id: "germany",
        color: "hsl(130, 70%, 50%)",
        data: [
          {
            x: "plane",
            y: 25
          },
          {
            x: "helicopter",
            y: 86
          },
          {
            x: "boat",
            y: 256
          },
          {
            x: "train",
            y: 178
          },
          {
            x: "subway",
            y: 217
          },
          {
            x: "bus",
            y: 130
          },
          {
            x: "car",
            y: 143
          },
          {
            x: "moto",
            y: 138
          },
          {
            x: "bicycle",
            y: 170
          },
          {
            x: "horse",
            y: 23
          },
          {
            x: "skateboard",
            y: 33
          },
          {
            x: "others",
            y: 164
          }
        ]
      },
      {
        id: "norway",
        color: "hsl(19, 70%, 50%)",
        data: [
          {
            x: "plane",
            y: 16
          },
          {
            x: "helicopter",
            y: 278
          },
          {
            x: "boat",
            y: 265
          },
          {
            x: "train",
            y: 266
          },
          {
            x: "subway",
            y: 81
          },
          {
            x: "bus",
            y: 294
          },
          {
            x: "car",
            y: 47
          },
          {
            x: "moto",
            y: 14
          },
          {
            x: "bicycle",
            y: 44
          },
          {
            x: "horse",
            y: 192
          },
          {
            x: "skateboard",
            y: 233
          },
          {
            x: "others",
            y: 288
          }
        ]
      }
    ]
  };
  render() {
    return (
      <div className="widgetWrapper">
        <ResponsiveLine
          data={this.state.data}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", stacked: true, min: "auto", max: "auto" }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "transportation",
            legendOffset: 36,
            legendPosition: "middle"
          }}
          axisLeft={{
            orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "count",
            legendOffset: -40,
            legendPosition: "middle"
          }}
          colors={{ scheme: "nivo" }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabel="y"
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
        />
      </div>
    );
  }
}

export default ApplicantWidget;
