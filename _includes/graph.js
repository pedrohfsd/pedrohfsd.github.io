function start(data, force_strength, force_distance, show_orientation, show_costs, show_zero, selection_value_changed){

    var plot = {
        svg : null
        ,view : null
        ,selected_node : null
        ,selected_link : null
        ,width : d3.select('#div_graph').node().getBoundingClientRect().width-3
        ,height : 500
        ,colors : d3.scaleOrdinal(d3.schemeCategory10)
        ,g_links : null
        ,g_nodes : null
        ,g_links_text : null
        ,g_node_element : null
        ,g_link_element  : null
        ,nodes : []
        ,links : []
        ,lastNodeId : -1
        ,simulation : null
        ,drag_line : null
        ,drag_line_source : null
        ,drag_line_target : null
        ,force_strength : -50
        ,force_distance : 100
        ,show_orientation : false
        ,show_costs : false
        ,show_zero : false
        ,selected_value : null
        ,selection_value_changed : function(v){}
    };
    
    plot.force_strength = force_strength;
    plot.force_distance = force_distance;
    plot.show_orientation = show_orientation;
    plot.show_costs = show_costs;
    plot.show_zero = show_zero;
    plot.selection_value_changed = selection_value_changed;

    plot.svg = d3.select('#div_graph')
        .append('svg')
        .attr('oncontextmenu', 'return false;')
        .attr('width', plot.width)
        .attr('height', plot.height);
        
    plot.view = plot.svg.append("g");
        
    var defs = plot.view.append('defs');
    
    defs
        .append("marker")
        .attr('id', 'end-curved')
        .attr('viewBox', '0 -5 10 10')
        .attr("refX", 21)
        .attr("refY", -1.9)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0 -5 L 10 -1.2 L 0 5');
        
    defs
      .append('marker')
      .attr('id', 'end-straight')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 6)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 -5 L 10 0 L 0 5');
        
    plot.drag_line = plot.view.append('path')
        .attr('class', 'link dragline hidden')
        .attr('d', 'M0,0L0,0');

    plot.g_links = plot.view.append('g');
    plot.g_nodes = plot.view.append('g');
    plot.g_links_text = plot.view.append('g');

    plot.simulation = d3.forceSimulation()
        .force("center", d3.forceCenter(plot.width/2, plot.height/2))
        // .force("y", d3.forceY(0))
        // .force("x", d3.forceX(0))
        // .alphaTarget(0.09)
        .on("tick", tick);

    function tick() {
        plot.g_links.selectAll('path').attr("d", function(d) {
            var r= 12;
            var dx = d.target.x - d.source.x;
            var dy = d.target.y - d.source.y;
            var dr = plot.show_orientation ? Math.sqrt(dx * dx + dy * dy) : 0;
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + (d.target.x) + "," + (d.target.y);
        });
        plot.g_nodes.selectAll('g').attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
        plot.svg.select("g").selectAll(".labelText").attr("transform", function(d) {
            var dx = (d.target.x - d.source.x)/3;
            var dy = (d.target.y - d.source.y)/3;
            return "translate(" + (d.source.x+dx) + "," + (d.source.y+dy) + ")rotate(0)";
        });
    }
    
    plot.svg.call(d3.zoom()
        .on("zoom", function zoomed() {
          plot.view.attr("transform", d3.event.transform);
        })
        .on("start", function(){
            if (d3.event.sourceEvent != null && !d3.event.sourceEvent.shiftKey) d3.select('body').style("cursor", "move");
        })
        .on("end", function(){
            d3.select('body').style("cursor", "auto");
        })
    );
    
    load(plot, data);
    return plot;
}

function update(plot){
    // var filtered_links = plot.links.filter(function(e){if(plot.show_zero){ return true;} else{return e.cost!=0;}}); // DOMException: Failed to execute 'insertBefore' on 'Node
    var filtered_links = plot.links.filter(function(e){return e.cost!=0;}).concat(plot.links.filter(function(e){return plot.show_zero && e.cost==0;}));
    
    if(plot.selected_node != null){
        if(plot.selected_node.id != plot.selected_value){
            if(plot.nodes.filter(function(v){return v.id == plot.selected_value}).length == 0){
                plot.selected_node.id = plot.selected_value;
            }else{
                alert("There's a node with this value already");
                plot.selection_value_changed(plot.selected_node.id);
            }
        }
    }else if(plot.selected_link != null) plot.selected_link.cost = plot.selected_value;
    
    var node_path_data = plot.g_nodes.selectAll('g').data(plot.nodes, function(d) { return d.id;});
    plot.g_node_element = node_path_data.enter().append("g");
    plot.g_node_element.append("circle").attr("r", 12);
    plot.g_node_element.append("text")
        .attr("x", 0)
        .attr('y', 4)
        .attr('class', 'id');
    node_path_data.exit().remove();
    
    plot.g_nodes.selectAll('g').selectAll("circle")
        .style('fill', function(v) { if(v==plot.selected_node) return d3.rgb(plot.colors(v.id)).toString(); return "#fff";})
        .style('stroke', function(v) { return d3.rgb(plot.colors(v.id)).toString(); });
    plot.g_nodes.selectAll('g').selectAll("text").text(function(v) {return v.id;});
    
    var link_path_data = plot.g_links.selectAll('path').data(filtered_links, function(d) { return d.source.id + "_" + d.target.id;});
    plot.g_link_element = link_path_data.enter().append("g")
        .append("path")
        .attr("class", "link")
        .attr("id", function(d) { return d.source.id + "_" + d.target.id;});
    plot.g_links.selectAll('path.link')
        .classed('selected', function(d) { return d == plot.selected_link; })
        .classed('focused', function(d) { return d == plot.selected_link; });
    link_path_data.exit().remove();
    
    plot.g_links.selectAll('path').attr("marker-end", plot.show_orientation ? "url(#end-curved)" : "");
    
    var links_text_data = plot.g_links_text.selectAll(".labelText").data(filtered_links, function(d) { return d.source.id + "_" + d.target.id;});
    links_text_data.enter().append("text").attr("class","labelText");
    links_text_data.exit().remove();
    plot.g_links_text.selectAll(".labelText")
        .text(function(d) { return d.cost;})
        .style("display", plot.show_costs?"block":"none");
    
    plot.simulation
    .nodes(plot.nodes)
    .force("link", d3.forceLink(filtered_links).distance(plot.force_distance))
    .force("charge", d3.forceManyBody().strength(plot.force_strength))
    // .force("link").links(filtered_links);
    .alphaTarget(0.01).restart();
    
    install_listeners(plot);
}

function install_listeners(plot){
    install_node_listeners(plot);
    install_link_listeners(plot);
    install_svg_listeners(plot);
    install_body_listeners(plot);
}

function install_node_listeners(plot){
    plot.g_node_element
        .on("mousedown", mousedown)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
        
    plot.g_node_element.call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
                
    function mouseover(element){
        if(d3.event.ctrlKey && plot.drag_line_source != null) plot.drag_line_target = element;
        d3.select(this).select("circle").style('fill', d3.rgb(plot.colors(element.id)).toString());
    }
    
    function mouseout(element){
        if(plot.drag_line_target == element) plot.drag_line_target = null;
        if(plot.selected_node != element) d3.select(this).select("circle").style('fill', "#fff");
    }
    
    function mousedown(element){
        if(d3.event.button == 2) return;
        if(element == plot.selected_node){
            plot.selected_node = null;
            plot.selected_value = null;
            plot.selection_value_changed(plot.selected_value);
        } else {
            plot.selected_node = element;
            plot.selected_value = plot.selected_node.id;
            plot.selection_value_changed(plot.selected_value);
        }
        plot.selected_link = null;
        update(plot);
    }
    
    function dragstarted(element) {
        if(d3.event.sourceEvent.ctrlKey){
            plot.drag_line_source = element;
            plot.drag_line.attr("marker-end", "url(#end-straight)")
                .classed('hidden', false)
                .attr('d', 'M' + element.x + ',' + element.y + 'L' + element.x + ',' + element.y);
        }else{
            element.fx = element.x;
            element.fy = element.y;
        }
    }

    function dragged(element) {
        if(d3.event.sourceEvent.ctrlKey) {
            if(plot.drag_line_source != null) plot.drag_line.attr('d', 'M' + plot.drag_line_source.x + ',' + plot.drag_line_source.y + 'L' + d3.event.x + ',' + d3.event.y)
        } else{
            element.fx = d3.event.x;
            element.fy = d3.event.y;
        }
    }

    function dragended(element) {
        plot.drag_line.classed('hidden', true).style('marker-end', '');
        if(d3.event.sourceEvent.ctrlKey){
            if(plot.drag_line_source != null && plot.drag_line_target != null){
                var source = plot.drag_line_source;
                var target = plot.drag_line_target;
                if(source == target) return;
                addLink(plot, plot.drag_line_source, plot.drag_line_target, 1);
                update(plot);
            }
            plot.drag_line_source = null;
        }else{
            element.fx = null;
            element.fy = null;
        }
    }
}

function install_link_listeners(plot){
    plot.g_link_element
        .on('mousedown', mousedown)
        .on('mouseover', mouseover)
        .on('mouseout', mouseout);
        
    function mousedown(element){
        if(d3.event.button == 2) return;
        if(d3.event.ctrlKey) return;
        if(element == plot.selected_link){
            plot.selected_link = null;
            plot.selected_value = null;
            plot.selection_value_changed(plot.selected_value);
        } else{
            plot.selected_link = element;
            plot.selected_value = plot.selected_link.cost;
            plot.selection_value_changed(plot.selected_value);
        }
        plot.selected_node = null;
        update(plot);
    }
    
    function mouseover(element){
        if(plot.selected_link == element) return;
        if(d3.event.ctrlKey) {d3.select(this).classed('focused', false); return;}
        d3.select(this).classed('focused', true);
    }
    
    function mouseout(element){
        if(plot.selected_link == element) return;
        if(d3.event.ctrlKey) {d3.select(this).classed('focused', false); return;}
        d3.select(this).classed('focused', false);
    }
}

function install_svg_listeners(plot){
    plot.svg.on('contextmenu', click);
    
    function click(){
        if(d3.event.button != 2) return;
        addNode(plot, ++plot.lastNodeId, plot.width/2, plot.height/2);
        update(plot);
    }
    
}

function install_body_listeners(plot){
    d3.select("body")
        .on('keydown', keydown)
        .on('keyup', keyup);
    
    function keydown(element){
        if(!plot.selected_node && !plot.selected_link) return;
        switch(d3.event.keyCode) {
            case 68: // d
            case 46: //del
                if(plot.selected_node) removeNode(plot, plot.selected_node);
                else if(plot.selected_link) removeLink(plot, plot.selected_link);
                plot.selected_link = null;
                plot.selected_node = null;
                update(plot);
            break;
        }
    }
    
    function keyup(element){
        if(!d3.event.ctrlKey) plot.drag_line.classed('hidden', true).style('marker-end', '');
    }
}

function addNode(plot, id, x, y){
    plot.nodes.push({id: id, x: x, y: y});
}

function removeNode(plot, v){
    var i=0;
    plot.nodes.splice(plot.nodes.indexOf(v), 1);
    var links = plot.links.filter(function(l){return l.source==v || l.target==v;});
    for(; i<links.length; i++) removeLink(plot, links[i]);
}

function addLink(plot, source, target, cost){
    var l = plot.links.find(function(e){return e.source==source && e.target==target;});
    if(plot.show_zero) return;// edge is drawed already
    if(l !== undefined){
        if(l.cost != 0) return;// edge is drawed already
        removeLink(plot, l);
    }
    plot.links.push({source: source, target: target, left: false, right: true, cost: cost });
}

function removeLink(plot, l){
    plot.links.splice(plot.links.indexOf(l), 1);
}

function load(plot, data){
    plot.nodes = [];
    plot.links = [];
    plot.lastNodeId = -1;

    var edges = readInputData(data);
    if(!edges) return;
    var i=0, j=0, n=edges.length;
    for(i=0; i<n; i++){
        addNode(plot, ++plot.lastNodeId, plot.width/2, plot.height/2);
    }
    for(i=0; i<n; i++){
        for(j=0; j<n; j++){
            if(i==j) continue;
            addLink(plot, plot.nodes[i], plot.nodes[j], edges[i][j]);
        }
    }
    update(plot);
}

function readInputData(data){
    var edges = data.split(",");
    var n = parseInt(Math.sqrt(edges.length), 10), m = [], i=0, j=0;
    if(n*n !== edges.length){
        alert("The given matrix must be a perfect square");
        return [];
    }
    for(i=0; i<n; i++){
        m.push([]);
        for(j=0; j<n; j++){
            m[i].push(parseFloat(edges[n*i+j].trim()));
        }
    }
    return m;
}