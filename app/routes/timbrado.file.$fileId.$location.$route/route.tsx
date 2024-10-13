import { useEffect, useRef } from "react";
import { Outlet, useNavigate, useParams } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import * as d3 from "d3";
import { useTimbrado } from "~/context/TimbaContetext";
import { initRouteId } from "../timbrado.file.$fileId.$location/location-utils";

const CtoMono = () => {
  const { data } = useTimbrado();
  const { location, route } = useParams();
  const navigate = useNavigate();
  const chartRef = useRef(null);

  const selectDepartment = Array.isArray(data)
    ? data.find((data) => data.department === location) || { routes: [] }
    : { routes: [] };

  const routesList = selectDepartment.routes;
  const selectRoute = routesList?.find(
    (department) => route && department.route === initRouteId(route)
  );

  const handleCto = (cto: string) => {
    navigate(`./${cto}`);
  };

  const groupCtosByState = () => {
    return selectRoute?.ctos.reduce((acc: any, cto) => {
      const state = cto.state;
      if (!acc[state]) {
        acc[state] = [];
      }
      acc[state].push(cto);
      return acc;
    }, {});
  };
  console.log(" group ", groupCtosByState());

  useEffect(() => {
    if (!selectRoute?.ctos.length) return;

    const groupedData = groupCtosByState();
    const states = Object.keys(groupedData);
    const counts = Object.values(groupedData).map((arr: any) => arr.length);
    const total = counts.reduce((sum, count) => sum + count, 0);

    const width = 700;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("class", "rounded-md shadow-md bg-white")
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Utilizando los colores de Tailwind CSS
    const color = d3.scaleOrdinal([
      "rgba(74, 222, 128, 1)", // Tailwind green-500
      "rgba(234, 179, 8, 1)", // Tailwind yellow-500
      "rgba(239, 68, 68, 1)", // Tailwind red-500
      "rgba(75, 85, 99, 1)", // Tailwind gray-500
    ]);

    const pie = d3
      .pie()
      .sort(null)
      .value((d: any) => d.value);

    const data_ready = pie(
      Object.entries(groupedData).map(([key, value]) => ({
        key,
        value: (value as any).length,
      }))
    );

    const arcGenerator = d3
      .arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8);

    const outerArc = d3
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    svg
      .selectAll("allSlices")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", arcGenerator as any)
      .attr("fill", (d: any) => color(d.data.key) as string)
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7)
      .transition()
      .duration(1000)
      .attrTween("d", function (d: any) {
        const i = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
          d.endAngle = i(t);
          return arcGenerator(d as any);
        };
      });

    svg
      .selectAll("allPolylines")
      .data(data_ready)
      .enter()
      .append("polyline")
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr("points", (d: any) => {
        const posA = arcGenerator.centroid(d as any);
        const posB = outerArc.centroid(d as any);
        const posC = outerArc.centroid(d as any);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
        return [posA, posB, posC];
      })
      .style("opacity", 0)
      .transition()
      .delay(1000)
      .duration(500)
      .style("opacity", 1);

    svg
      .selectAll("allLabels")
      .data(data_ready)
      .enter()
      .append("text")
      .text((d: any) => {
        const percent = ((d.data.value / total) * 100).toFixed(1);
        return `${d.data.key} (${percent}%)`;
      })
      .attr("transform", (d: any) => {
        const pos = outerArc.centroid(d as any);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style("text-anchor", (d: any) => {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? "start" : "end";
      })
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .style("opacity", 0)
      .transition()
      .delay(1000)
      .duration(500)
      .style("opacity", 1);

    // Tooltip
    const tooltip = d3
      .select(chartRef.current)
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    svg
      .selectAll("path")
      .on("mouseover", function (event, d: any) {
        d3.select(this).transition().duration(200).style("opacity", 1);
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`${d.data.key}: ${d.data.value} CTOs`)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
        d3.select(this).transition().duration(200).style("opacity", 0.7);
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Legend
    const legendRectSize = 18;
    const legendSpacing = 4;
    const legend = svg
      .selectAll(".legend")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => {
        const height = legendRectSize + legendSpacing;
        const offset = (height * color.domain().length) / 2;
        const horz = -2 * legendRectSize;
        const vert = i * height - offset;
        return `translate(${horz},${vert})`;
      });

    legend
      .append("rect")
      .attr("width", legendRectSize)
      .attr("height", legendRectSize)
      .style("fill", color as any)
      .style("stroke", color as any);

    legend
      .append("text")
      .attr("x", legendRectSize + legendSpacing)
      .attr("y", legendRectSize - legendSpacing)
      .text((d: any) => d);
  }, [selectRoute?.ctos]);

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>CTO Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {selectRoute?.ctos.map((cto, index) => (
              <Button
                key={index}
                className="active:bg-green-600 focus:bg-green-600"
                onClick={() => handleCto(cto.cto)}
                variant="outline"
              >
                {cto.cto}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div ref={chartRef} className="flex justify-center w-full"></div>
        </CardFooter>
      </Card>

      <Outlet />
    </>
  );
};

export default CtoMono;
