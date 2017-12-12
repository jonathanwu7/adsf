p7$setTemplate(script = sprintf("
                                <script type='text/javascript'>
                                $(document).ready(function(){
                                draw{{chartId}}(  );
                                });
                                function draw{{chartId}}(  ){  
                                var opts = {{{ opts }}};
                                var data = {{{ data }}};
                                
                                if(!(opts.type==='pieChart' || opts.type==='sparklinePlus' || opts.type==='bulletChart')) {
                                var data = d3.nest()
                                .key(function(d){
                                //return opts.group === undefined ? 'main' : d[opts.group]
                                //instead of main would think a better default is opts.x
                                return opts.group === undefined ? opts.y : d[opts.group];
                                })
                                .entries(data);
                                }
                                
                                if (opts.disabled != undefined){
                                data.map(function(d, i){
                                d.disabled = opts.disabled[i]
                                })
                                }
                                
                                nv.addGraph(function() {
                                chart = nv.models[opts.type]()
                                .width(opts.width)
                                .height(opts.height)
                                
                                if (opts.type != 'bulletChart'){
                                chart
                                .x(function(d) { return d[opts.x] })
                                .y(function(d) { return d[opts.y] })
                                }
                                
                                
                                {{{ chart }}}
                                
                                {{{ xAxis }}}
                                
                                {{{ x2Axis }}}
                                
                                {{{ yAxis }}}
                                
                                d3.select('#' + opts.id)
                                .append('svg')
                                .datum(data)
                                .transition().duration(500)
                                .call(chart);
                                
                                chart.dispatch.brush.on('brushstart',function(){ drawVerticalLines( opts ) });
                                chart.dispatch.brush.on(
                                'brushend',
                                function(){ window.setTimeout(
                                function() {drawVerticalLines( opts )},
                                250
                                )}
                                );
                                
                                nv.utils.windowResize(chart.update);
                                return chart;
                                },%s);
                                };
                                
                                %s
                                </script>
                                "
                                ,
                                #here is where you can type your vertical line/label function
                                "function() { drawHorizontalLines( opts ) }"
                                ,
                                
                                
                                #add the afterScript here if using with shiny
                                "
                                function drawHorizontalLines( opts ){
                                
                                if (!(d3.select('#' + opts.id  + ' .nvd3 .nv-focus .nv-linesWrap').select('.vertical-lines')[0][0])) {
                                d3.select('#' + opts.id  + ' .nvd3 .nv-focus .nv-linesWrap').append('g') 
                                .attr('class', 'vertical-lines')
                                }
                                
                                vertLines = d3.select('#' + opts.id  + ' .nvd3 .nv-focus .nv-linesWrap').select('.vertical-lines').selectAll('.vertical-line')
                                .data(
                                [ 
                                { 'date' : new Date('1967-11-30'),
                                'label' : 'something to highlight 1967'
                                } ,
                                { 'date' : new Date('2001-11-30'),
                                'label' : 'something to highlight 2001'
                                }
                                ] )
                                
                                var vertG = vertLines.enter()
                                .append('g')
                                .attr('class', 'vertical-line')
                                
                                vertG.append('svg:line')
                                vertG.append('text')
                                
                                vertLines.exit().remove()
                                
                                vertLines.selectAll('line')
                                .attr('x1', function(d){
                                return chart.xAxis.scale()(d.date/60/60/24/1000)
                                })
                                .attr('x2', function(d){ return chart.xAxis.scale()(d.date/60/60/24/1000) })
                                .attr('y1', chart.yAxis.scale().range()[0] )
                                .attr('y2', chart.yAxis.scale().range()[1] )
                                .style('stroke', 'red')
                                
                                vertLines.selectAll('text')
                                .text( function(d) { return d.label })
                                .attr('dy', '1em')
                                //x placement ; change dy above for minor adjustments but mainly
                                //    change the d.date/60/60/24/1000 
                                //y placement ; change 2 to where you want vertical placement
                                //rotate -90 but feel free to change to what you would like
                                .attr('transform', function(d){
                                return  'translate(' +
                                chart.xAxis.scale()(d.date/60/60/24/1000) + 
                                ',' + 
                                chart.yAxis.scale()(2) +
                                ') rotate(-90)'
                                })
                                //also you can style however you would like
                                //here is an example changing the font size
                                .style('font-size','80%')
                                
                                }
                                "
))
