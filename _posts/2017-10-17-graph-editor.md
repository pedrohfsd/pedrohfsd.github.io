---
layout: post
title: Graph Editor
date: 2017-10-17
update: 2017-10-28
---
<style>
{% include graph.css %}
</style>

<div class="well graph-demo">
	<div id="div_graph" class="div_graph"></div>
	<div>
		<div class="form-inline">
		    <div class="form-group">
			    <input type="number" id="input_strength" step="5" value="-50">
				<label for="input_strength">Node force ('+' to attract, '-' to repel)</label>
			</div>
		</div>
		<div class="form-inline">
		    <div class="form-group">
			    <input type="number" id="input_distance" min="0" step="50" value="100">
				<label for="input_distance">Edge length</label>
	    	</div>
		</div>
		<div class="form-inline">
		    <div class="form-group">
		<textarea id="input_data" rows="5" cols="50">0, 0, 0, 0, 1, 0, 0, 0, 0, 0,0, 1, 0, 0, 0, 0, 0, 0, 0, 0,0, 0, 0, 1, 0, 0, 0, 0, 0, 1,0, 0, 0, 0, 0, 0, 0, 0, 1, 0,0, 0, 1, 0, 0, 0, 0, 0, 0, 1,0, 0, 0, 0, 0, 0, 1, 0, 0, 0,0, 0, 0, 0
		</textarea>
		<label for="input_data" class="input_data">Adjacency Matrix</label>
		</div>
		</div>
		<div class="form-btn">
			<button onclick="reloadData();" class="btn btn-primary">Load</button>
		</div>

	</div>
</div>

> **Right_Click** anywhere to add a node, **Hold CTRL + Drag from-to node** to add an edge.  
> **Click and Drag** a node to move it, **Click a node/edge** to select it.  
> **Press Delete** to remove a selected node or edge  
> **Use Mouse wheel** to zoom in and out  
> **Click and Drag** on empty space to move the current view

<script type="text/javascript">
{% include d3.v4.min.js %}
{% include graph.js %}
	var plot = start(d3.select("#input_data").node().value, d3.select("#input_strength").node().value, d3.select("#input_distance").node().value);
	function reloadData(){
	    plot.force_strength = d3.select("#input_strength").node().value;
	    plot.force_distance = d3.select("#input_distance").node().value;
	    load(plot, d3.select("#input_data").node().value);
	}
</script>


After looking for a versatile online graph editor tool and failing to find any that fitted my needs, I've decide to build this one using the amazing javascript library [D3.js](https://d3js.org). It only accepts directed edges for now but undirected edges support is on its way ;).

To use it all you need to do is to paste an adjacency matrix (0's and 1's) on the textarea and click the 'Load' button to plot it. You can also add and delete nodes/edges using mouse and keyboard shortcuts (see instructinos above). I plan to add more features as I need or you guys ask (can't promise anything but, hey, ideas are always welcome =D) so ping here once in a while, it may have some new tweaks to play with.

References
---
1. [The D3.js Library](https://d3js.org)
1. [D3 Force plugin for D3.js](https://github.com/d3/d3-force#link_strength)
1. [D3 Zoom plugin for D3.js](https://github.com/d3/d3-zoom)
1. [Modifying a Force Layout](https://bl.ocks.org/mbostock/1095795)
1. [Directed Graph Editor (using D3.js v3)](http://bl.ocks.org/rkirsling/5001347)
1. [Interactive tool for creating directed graphs using d3.js](https://bl.ocks.org/cjrd/6863459)
1. [Static Directed Graph](https://vida.io/documents/wecSnHHaq8EqNMcvp/edit)
1. [Creating node labels in d3.js .v4](https://stackoverflow.com/questions/40942651/creating-node-labels-in-d3-js-v4)
1. [D3 v4 force graph with images as nodes](https://stackoverflow.com/questions/44976802/d3-v4-force-graph-with-images-as-nodes/44981140)