import './index.css';
import * as d3 from 'd3';
import dataset from './dataset';
// import { get } from "axios";

const height = 640;
const svgContainer = d3.select('svg');
const scaleX = d3.scaleTime().domain([
  new Date(1753, 0),
  new Date(2015, 0)]).range([60, 1260])
;
const baseTemp = dataset['baseTemperature'];
const monthlyVariance = dataset['monthlyVariance'];
const axisX = d3.axisBottom(scaleX);
const scaleY = d3.scaleLinear().domain([1, 12]).range([10, height - 100]);
const scaleYax = d3.scaleTime().domain([
  new Date(2018, 0),
  new Date(2018, 11)]).range([10, height - 100])
;
const axisY = d3.axisRight(scaleYax);

axisY.tickFormat(d3.timeFormat('%B'));
svgContainer
  .append('g')
    .attr('class', 'months-axis')
    .attr('transform', 'translate(-5,20)')
  .call(axisY)
  .append('text')
    .text('Months')
    .attr('fill', 'black')
    .attr('x', -300)
    .attr('y', 60)
    .attr('transform', 'rotate(-90)')
    .attr('class', 'axis-header')
;

axisX.ticks(d3.timeYear.every(10));
svgContainer
  .append('g')
    .attr('transform', `translate(0,${height - 50})`)
  .call(axisX)
  .append('text')
    .text('Years')
    .attr('fill', 'black')
    .attr('x', height)
    .attr('y', 35)
    .attr('class', 'axis-header')
;

const rowHeight = Math.floor((height - 70) / 12.5);
const colorScale = d3.scaleLinear().domain(
  [-7,((7 + 6) / 2) + (-7), 6]).range(["blue", "beige","red"])
;
const tooltip = d3.select('#tooltip');
const dateField = d3.select('#date');
const tempField = d3.select('#temp');
const tempDifField = d3.select('#temp-dif');

svgContainer
  .selectAll('rect')
  .data(monthlyVariance)
  .enter()
  .append('rect')
    .attr('x', (d) => scaleX(new Date(d.year, 0, 1, 1, 0, 0, 0)))
    .attr('y', (d) => scaleY(d.month))
    .attr('width', 4)
    .attr('height', rowHeight)
    .style('fill', (d) => colorScale(d.variance))
    //update tooltip information about the dif of temp of the month
    .on('mouseover', function (d) {
      dateField.text(`${d.year} - ${d3.timeFormat('%B')(new Date(2018, d.month - 1))}`);
      tempField.text((baseTemp + d.variance).toFixed(3) + '°C');
      tempDifField.text(d.variance + '°C');

      const limitWidth = document.body.offsetWidth;
      const pivX = d3.event.pageX;
      tooltip
        .style('display', 'block')
        .style('top', (d3.event.pageY - 100) + 'px')
        .style('left', (pivX + 140) < limitWidth? (pivX + 70) + 'px': (pivX - 250) + 'px')
      ;
    })
    .on('mouseleave', function () {
      tooltip.style('display', 'none');
    })
;

const tempData = [-7, -4, -1, 0, 2, 4 , 6];
d3.select('#color-dif')
    .selectAll('div')
    .data(tempData)
    .enter()
    .append('div')
    .append('div')
      .style('background-color', d => colorScale(d))
;

const colors = Array.prototype.slice.call(document.getElementById('color-dif').children);

colors.map((c, i) => ({ temp: tempData[i], el: c })).forEach(function (e) {
  const el = document.createElement('span');
  el.textContent = e.temp;
  e.el.appendChild(el);
});

//need auto reload to improve development
// const request = setInterval(function do_i_need_to_reload() {
//   get('/reload')
//     .then(function handleResolve({ data: reload }) {
//       if (reload) location.reload(true);
//     })
//     .catch(function handleReject(error) {
//       if (error.message === 'Network Error') {
//         console.log('reconecting...');
//         return;
//       }
//       console.error(error);
//       clearInterval(request);
//     });
//   ;
// }, 6000);
