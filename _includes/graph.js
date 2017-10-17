function start(){
  var plot = {
    selected_node : null
    ,selected_link : null
    ,mousedown_link : null
    ,mousedown_node : null
    ,mouseup_node : null
    ,width : d3.select('#div_graph')[0][0].clientWidth
    ,height : 500
    ,colors : d3.scale.category10()
    ,svg : null
    ,nodes : []
    ,links : []
    ,lastNodeId : 0
    ,force : null
    ,drag_line : null
    ,path : null
    ,circle : null
    ,lastKeyDown : -1
  };

  plot.svg = d3.select('#div_graph')
    .append('svg')
    .attr('oncontextmenu', 'return false;')
    .attr('width', plot.width)
    .attr('height', plot.height);

  plot.force = d3.layout.force()
      .nodes(plot.nodes)
      .links(plot.links)
      .size([plot.width, plot.height])
      .linkDistance(200)
      .charge(-800)
      .on('tick', tick)

  plot.svg.append('svg:defs').append('svg:marker')
      .attr('id', 'end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 6)
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#000');

  plot.svg.append('svg:defs').append('svg:marker')
      .attr('id', 'start-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 4)
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M10,-5L0,0L10,5')
      .attr('fill', '#000');

  plot.drag_line = plot.svg.append('svg:path')
    .attr('class', 'link dragline hidden')
    .attr('d', 'M0,0L0,0');

  plot.path = plot.svg.append('svg:g').selectAll('path');
  plot.circle = plot.svg.append('svg:g').selectAll('g');

  load(plot);
  
  plot.svg.on('mousedown', function(){mousedown(plot, plot.svg[0][0]);})
          .on('mousemove', function(){mousemove(plot);})
          .on('mouseup', function(){mouseup(plot);});
  d3.select("body")
    .on('keydown', function(){keydown(plot);})
    .on('keyup', function(){keyup(plot);});

  return plot;
}

function resetMouseVars(plot) {
  plot.mousedown_node = null;
  plot.mouseup_node = null;
  plot.mousedown_link = null;
}

// update force layout (called automatically each iteration)
function tick() {
  // draw directed edges with proper padding from node centers
  plot.path.attr('d', function(d) {
    var deltaX = d.target.x - d.source.x,
        deltaY = d.target.y - d.source.y,
        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
        normX = deltaX / dist,
        normY = deltaY / dist,
        sourcePadding = d.left ? 17 : 12,
        targetPadding = d.right ? 17 : 12,
        sourceX = d.source.x + (sourcePadding * normX),
        sourceY = d.source.y + (sourcePadding * normY),
        targetX = d.target.x - (targetPadding * normX),
        targetY = d.target.y - (targetPadding * normY);
    return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
  });

  plot.circle.attr('transform', function(d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  });
}

// update graph (called when needed)
function restart(plot) {
  // path (link) group
  plot.path = plot.path.data(plot.links);

  // update existing links
  plot.path.classed('selected', function(d) { return d === plot.selected_link; })
      .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
      .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; });


  // add new links
  plot.path.enter()
      .append('svg:path')
      .attr('class', 'link')
      .classed('selected', function(d) { return d === plot.selected_link; })
      .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
      .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; })
      .on('mousedown', function(d) {
      if(d3.event.ctrlKey) return;

      // select link
      plot.mousedown_link = d;
      if(plot.mousedown_link === plot.selected_link) plot.selected_link = null;
      else plot.selected_link = plot.mousedown_link;
      plot.selected_node = null;
      restart(plot);
    });

  // remove old links
  plot.path.exit().remove();


  // circle (node) group
  // NB: the function arg is crucial here! nodes are known by id, not by index!
  plot.circle = plot.circle.data(plot.nodes, function(d) { return d.id; });

  // update existing nodes (reflexive & selected visual states)
  plot.circle.selectAll('circle')
      .style('fill', function(d) { return (d === plot.selected_node) ? d3.rgb(plot.colors(d.id)).brighter().toString() : plot.colors(d.id); })
      .classed('reflexive', function(d) { return d.reflexive; });

  // add new nodes
  var g = plot.circle.enter().append('svg:g');

  g.append('svg:circle')
    .attr('class', 'node')
    .attr('r', 12)
    .style('fill', function(d) { return (d === plot.selected_node) ? d3.rgb(plot.colors(d.id)).brighter().toString() : plot.colors(d.id); })
    // .style('fill', '#fff')
    .style('stroke', function(d) { return d3.rgb(plot.colors(d.id)).toString(); })
    .classed('reflexive', function(d) { return d.reflexive; })
    .on('mouseover', function(d) {
      if(!plot.mousedown_node || d === plot.mousedown_node) return;
      // enlarge target node
      d3.select(plot.svg[0][0]).attr('transform', 'scale(1.1)');
    })
    .on('mouseout', function(d) {
      if(!plot.mousedown_node || d === plot.mousedown_node) return;
      // unenlarge target node
      d3.select(plot.svg[0][0]).attr('transform', '');
    })
    .on('mousedown', function(d) {
      if(d3.event.ctrlKey) return;

      // select node
      plot.mousedown_node = d;
      if(plot.mousedown_node === plot.selected_node) plot.selected_node = null;
      else plot.selected_node = plot.mousedown_node;
      plot.selected_link = null;

      // reposition drag line
      plot.drag_line
        .style('marker-end', 'url(#end-arrow)')
        .classed('hidden', false)
        .attr('d', 'M' + plot.mousedown_node.x + ',' + plot.mousedown_node.y + 'L' + plot.mousedown_node.x + ',' + plot.mousedown_node.y);

      restart(plot);
    })
    .on('mouseup', function(d) {
      if(!plot.mousedown_node) return;

      // needed by FF
      plot.drag_line
        .classed('hidden', true)
        .style('marker-end', '');

      // check for drag-to-self
      plot.mouseup_node = d;
      if(plot.mouseup_node === plot.mousedown_node) { resetMouseVars(plot); return; }

      // unenlarge target node
      d3.select(plot.svg[0][0]).attr('transform', '');

      // add link to graph (update if exists)
      // NB: links are strictly source < target; arrows separately specified by booleans
      var source, target, direction;
      if(plot.mousedown_node.id < plot.mouseup_node.id) {
        source = plot.mousedown_node;
        target = plot.mouseup_node;
        direction = 'right';
      } else {
        source = plot.mouseup_node;
        target = plot.mousedown_node;
        direction = 'left';
      }

      var link;
      link = plot.links.filter(function(l) {
        return (l.source === source && l.target === target);
      })[0];

      if(link) {
        link[direction] = true;
      } else {
        link = {source: source, target: target, left: false, right: false};
        link[direction] = true;
        plot.links.push(link);
      }

      // select new link
      plot.selected_link = link;
      plot.selected_node = null;
      restart(plot);
    })
    ;

  // show node IDs
  g.append('svg:text')
    .attr('x', 0)
    .attr('y', 4)
    .attr('class', 'id')
    .text(function(d) { return d.id; });

  // // remove old nodes
  plot.circle.exit().remove();

  // set the graph in motion
  plot.force.start();
}

function mousedown(plot, that) {
  // prevent I-bar on drag
  //d3.event.preventDefault();
  // because :active only works in WebKit?
  plot.svg.classed('active', true);
  if(d3.event.ctrlKey || plot.mousedown_node || plot.mousedown_link) return;
  // insert new node at point
  var point = d3.mouse(plot.svg[0][0]);
  var node = {id: ++plot.lastNodeId, reflexive: false};
  node.x = point.x;
  node.y = point.y;
  plot.nodes.push(node);

  restart(plot);
}

function mousemove(plot) {
  if(!plot.mousedown_node) return;
  plot.drag_line.attr('d', 'M' + plot.mousedown_node.x + ',' + plot.mousedown_node.y + 'L' + d3.mouse(plot.svg[0][0])[0] + ',' + d3.mouse(plot.svg[0][0])[1]);
  restart(plot);
}

function mouseup(plot) {
  if(plot.mousedown_node) {
    // hide drag line
    plot.drag_line
      .classed('hidden', true)
      .style('marker-end', '');
  }

  // because :active only works in WebKit?
  plot.svg.classed('active', false);

  // clear mouse event vars
  resetMouseVars(plot);
}

function spliceLinksForNode(node) {
  var toSplice = plot.links.filter(function(l) {
    return (l.source === node || l.target === node);
  });
  toSplice.map(function(l) {
    plot.links.splice(plot.links.indexOf(l), 1);
  });
}

function keydown(plot) {
  //d3.event.preventDefault();

  if(plot.lastKeyDown !== -1) return;
  plot.lastKeyDown = d3.event.keyCode;

  // ctrl
  if(d3.event.keyCode === 17) {
    plot.circle.call(plot.force.drag);
    plot.svg.classed('ctrl', true);
  }

  if(!plot.selected_node && !plot.selected_link) return;
  switch(d3.event.keyCode) {
    case 8: // backspace
    case 46: // delete
      if(plot.selected_node) {
        plot.nodes.splice(plot.nodes.indexOf(plot.selected_node), 1);
        spliceLinksForNode(plot.selected_node);
      } else if(plot.selected_link) {
        plot.links.splice(plot.links.indexOf(plot.selected_link), 1);
      }
      plot.selected_link = null;
      plot.selected_node = null;
      restart(plot);
      break;
    case 66: // B
      if(plot.selected_link) {
        // set link direction to both left and right
        plot.selected_link.left = true;
        plot.selected_link.right = true;
      }
      restart(plot);
      break;
    case 76: // L
      if(plot.selected_link) {
        // set link direction to left only
        plot.selected_link.left = true;
        plot.selected_link.right = false;
      }
      restart(plot);
      break;
    case 82: // R
      if(plot.selected_node) {
        // toggle node reflexivity
        plot.selected_node.reflexive = !plot.selected_node.reflexive;
      } else if(plot.selected_link) {
        // set link direction to right only
        plot.selected_link.left = false;
        plot.selected_link.right = true;
      }
      restart(plot);
      break;
  }
}

function keyup(plot) {
  plot.lastKeyDown = -1;

  // ctrl
  if(d3.event.keyCode === 17) {
    plot.circle
        .on('mousedown.drag', null)
        .on('touchstart.drag', null);
    plot.svg.classed('ctrl', false);
  }
}

function load(plot){
  plot.nodes = [];
  plot.links = [];
  plot.lastNodeId = 0;

  var m = readInput();

  var i=0, j=0, n=m.length;
  for(i=1; i<=n; i++){
    plot.nodes.push({id: ++plot.lastNodeId, reflexive: false, x: 100, y: 100});
  }
  for(i=0; i<n; i++){
    for(j=0; j<n; j++){
      if(m[i][j]){
        plot.links.push({source: plot.nodes[i], target: plot.nodes[j], left: false, right: true });
      }
    }
  }

  plot.force.nodes(plot.nodes)
            .links(plot.links);  

  // mouse event vars
  plot.selected_node = null,
  plot.selected_link = null,
  plot.mousedown_link = null,
  plot.mousedown_node = null,
  plot.mouseup_node = null;

  restart(plot);
}

function readInput(plot){
  var n = parseInt(d3.select("#input_dimension")[0][0].value.trim());
  var data = d3.select("#input_data")[0][0].value;
  var edges = data.split(",");
  var m = [], i=0, j=0;
  for(i=0; i<n; i++){
    m.push([]);
    for(j=0; j<n; j++){
      m[i].push(parseInt(edges[n*i+j].trim()));
    }
  }
  return m;
}