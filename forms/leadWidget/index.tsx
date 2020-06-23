import * as React from "react";
import { ResponsiveBar } from "@nivo/bar";

class LeadWidget extends React.Component {
  state = {
    data: [
        {
          "country": "AD",
          "hot dog": 43,
          "hot dogColor": "hsl(339, 70%, 50%)",
          "burger": 177,
          "burgerColor": "hsl(144, 70%, 50%)",
          "sandwich": 80,
          "sandwichColor": "hsl(151, 70%, 50%)",
          "kebab": 116,
          "kebabColor": "hsl(307, 70%, 50%)",
          "fries": 82,
          "friesColor": "hsl(261, 70%, 50%)",
          "donut": 116,
          "donutColor": "hsl(17, 70%, 50%)"
        },
        {
          "country": "AE",
          "hot dog": 192,
          "hot dogColor": "hsl(27, 70%, 50%)",
          "burger": 111,
          "burgerColor": "hsl(306, 70%, 50%)",
          "sandwich": 177,
          "sandwichColor": "hsl(207, 70%, 50%)",
          "kebab": 91,
          "kebabColor": "hsl(234, 70%, 50%)",
          "fries": 51,
          "friesColor": "hsl(331, 70%, 50%)",
          "donut": 79,
          "donutColor": "hsl(83, 70%, 50%)"
        },
        {
          "country": "AF",
          "hot dog": 69,
          "hot dogColor": "hsl(209, 70%, 50%)",
          "burger": 71,
          "burgerColor": "hsl(263, 70%, 50%)",
          "sandwich": 52,
          "sandwichColor": "hsl(330, 70%, 50%)",
          "kebab": 15,
          "kebabColor": "hsl(324, 70%, 50%)",
          "fries": 14,
          "friesColor": "hsl(248, 70%, 50%)",
          "donut": 198,
          "donutColor": "hsl(50, 70%, 50%)"
        },
        {
          "country": "AG",
          "hot dog": 173,
          "hot dogColor": "hsl(329, 70%, 50%)",
          "burger": 153,
          "burgerColor": "hsl(215, 70%, 50%)",
          "sandwich": 36,
          "sandwichColor": "hsl(232, 70%, 50%)",
          "kebab": 83,
          "kebabColor": "hsl(19, 70%, 50%)",
          "fries": 11,
          "friesColor": "hsl(26, 70%, 50%)",
          "donut": 91,
          "donutColor": "hsl(206, 70%, 50%)"
        },
        {
          "country": "AI",
          "hot dog": 136,
          "hot dogColor": "hsl(96, 70%, 50%)",
          "burger": 13,
          "burgerColor": "hsl(257, 70%, 50%)",
          "sandwich": 68,
          "sandwichColor": "hsl(351, 70%, 50%)",
          "kebab": 119,
          "kebabColor": "hsl(16, 70%, 50%)",
          "fries": 104,
          "friesColor": "hsl(107, 70%, 50%)",
          "donut": 31,
          "donutColor": "hsl(6, 70%, 50%)"
        },
        {
          "country": "AL",
          "hot dog": 43,
          "hot dogColor": "hsl(193, 70%, 50%)",
          "burger": 56,
          "burgerColor": "hsl(323, 70%, 50%)",
          "sandwich": 184,
          "sandwichColor": "hsl(68, 70%, 50%)",
          "kebab": 154,
          "kebabColor": "hsl(356, 70%, 50%)",
          "fries": 77,
          "friesColor": "hsl(122, 70%, 50%)",
          "donut": 1,
          "donutColor": "hsl(67, 70%, 50%)"
        },
        {
          "country": "AM",
          "hot dog": 143,
          "hot dogColor": "hsl(355, 70%, 50%)",
          "burger": 155,
          "burgerColor": "hsl(63, 70%, 50%)",
          "sandwich": 172,
          "sandwichColor": "hsl(161, 70%, 50%)",
          "kebab": 49,
          "kebabColor": "hsl(24, 70%, 50%)",
          "fries": 81,
          "friesColor": "hsl(315, 70%, 50%)",
          "donut": 87,
          "donutColor": "hsl(172, 70%, 50%)"
        }
      ]
  };
  render() {
    return (
      <div className="widgetWrapper">
        <ResponsiveBar
          data={this.state.data}
          keys={["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]}
          indexBy="country"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          colors={{ scheme: "nivo" }}
          defs={[
            {
              id: "dots",
              type: "patternDots",
              background: "inherit",
              color: "#38bcb2",
              size: 4,
              padding: 1,
              stagger: true
            },
            {
              id: "lines",
              type: "patternLines",
              background: "inherit",
              color: "#eed312",
              rotation: -45,
              lineWidth: 6,
              spacing: 10
            }
          ]}
          fill={[
            {
              match: {
                id: "fries"
              },
              id: "dots"
            },
            {
              match: {
                id: "sandwich"
              },
              id: "lines"
            }
          ]}
        //   borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "country",
            legendPosition: "middle",
            legendOffset: 32
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "food",
            legendPosition: "middle",
            legendOffset: -40
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: "left-to-right",
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: "hover",
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
        />
      </div>
    );
  }
}

export default LeadWidget;
