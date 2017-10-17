---
layout: post
title: Interactive Directed Graph Visualizer
date: 2017-10-17
update:
---
<style>
{% include graph.css %}
</style>

<div class="well graph-demo">
	<div id="div_graph" class="div_graph"></div>
	<div>
		<div class="form-inline">
		    <div class="form-group">
		<input type="textarea" id="input_dimension" value="8" size="5"/>
		<label for="input_dimension">Dimension (NxN)</label>
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
			<button onclick="load(plot);" class="btn btn-primary">Load</button>
		</div>

	</div>
</div>


> **Click** to add a node, **Drag from-to node** to add an edge.  
> **Ctrl+Drag** a node to move, **Click a node/edge** to select it.  
> **Press R** to highlight a node  
> **Press Delete** to remove a selected node or edge  
> **Press L or R or B(oth)** on a selected edge to change its direction.

<script type="text/javascript">
{% include d3.v3.min.js %}
{% include graph.js %}
var plot = start();
</script>


The motivation of this online interactive graph visualization tool is to help anyone visualize graph problems when you have an adjacency matrix at hand. I've decided to built it after searching the web for a similar tool and failing to find anyone that could solve this use case. Although it was made for working with adjacency matrixes only it also let's you move, add, remove and link nodes with mouse and keyboard inputs.

Most of the credits go to [Ross Kirsling](https://github.com/rkirsling) who made an incredible [Directed Graph Editor](http://bl.ocks.org/rkirsling/5001347) on top of [D3.js](https://d3js.org) which I forked to build this one. Thank you Ross!

To use it all you need to do is paste an adjacency matrix (0's and 1's) on the textarea and inform a matrix dimension <code>N</code> so it can be properly translated into a full (NxN) matrix. I plan to add more features as I need or you guys ask (can't promise anything, but hey, ideas are always welcome =D) so ping her once in awhile, it may have some new tweaks to play with.