$(function(){

    var storeBibs = new DevExpress.data.CustomStore({
        //loadMode: "raw",
        load: function () {
            var d = new $.Deferred();
            $.ajax({
                method: 'POST',
                url: graphAPI,
                data: getDataEncoded({ "q": "MATCH (b:Bib) RETURN distinct(b)" }),
                success: function (response) {
                    var data = response.map(function(d){
                        return {"rcr":d._fields[0].properties.rcr,"name":d._fields[0].properties.name}
                    })
                    d.resolve(data)
           }
    });
    return d.promise();
}
})

$("#selectbox-bibs").dxSelectBox({
    dataSource: storeBibs,
    placeholder: "Choisir sa bibliothèque",
    valueExpr: "rcr",
    displayExpr: "name",
    searchEnabled: true,
    onValueChanged: function (data) {     
        $("#selected_bib").val(data.value)
        //var q_cypher = 'MATCH (s)-[o:OWNED_BY]->(b:Bib) WHERE b.rcr="'+data.value+'" OPTIONAL MATCH (s)-[rel:SAME_AS]->(bnf:BnfPresselocale) OPTIONAL MATCH (bnf)-[h:HAS_VERSION]->(num:Numerisation) return *'
        //return postCypherQuery(q_cypher)           
    }
});
})

function postCypherQuery(q_cypher) {
    //var q_cypher = 'MATCH (s:SudocUnica)-[r]->(b:Bib) RETURN * limit 10'
    $.ajax({
        method: 'POST',
        url: graphAPI,
        data: getDataEncoded({ "q": q_cypher }),
        success: function (response) {
            var flatData = response
                           .map(function(d){return d._fields})
                           .flat()
                           .filter(function(d) {return d !== null})
            return datatograph(flatData)
   }
});
}

function datatograph(data){
    console.log(data)
    var nodes = data
                .filter(function(d){return d.labels})
                .map(function(d){return {"id":d.identity.low,"group":d.labels[0],"label":renameKey(d.properties).name,"degre":d.properties.degre.low}})
    console.log(nodes)
    var links = data
                .filter(function(d){return d.type})
                .map(function(d){return {"source":d.start.low,"target":d.end.low,"type":d.type}})
    const gData = {"nodes":_.uniq(nodes, x => x.id), "links":links}
      draw2D(gData)
  } 
  
  getNodeColor = [
    {"group": "SudocUnica", "color":"rgba(243, 118, 187)"},
    {"group": "SudocNotUnica", "color":"rgb(23, 128, 70)"},
    {"group": "BnfPresselocale","color":"rgb(23, 97, 235)"},
    {"group": "Numerisation", "color":"rgb(111, 196, 149)"},
    {"group": "Dpt", "color":"rgb(230, 226, 47)"},
    {"group": "Bib", "color":"black"}
]

  function draw2D(gData){
    const elem = document.getElementById('graph');
    const Graph = ForceGraph()(elem)
        .graphData(gData)
        .nodeId('id')
        //.nodeAutoColorBy('group')
        .linkDirectionalArrowLength(3)
        .nodeVal(node => Math.log(`${node.degre}`))
        .linkWidth(3)
        .nodeLabel(node => `${node.label+ " (" + node.group + ")"}`)
        .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
        .nodeCanvasObject((node, ctx, globalScale) => {
          ctx.fillStyle = getNodeColor.filter(function(d) {return d.group == node.group})[0].color
          if(node.group == "Bib") {
          const label = node.label;
            const fontSize = 12/globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
  
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = "black";
            ctx.fillText(label, node.x, node.y);
          }
          else if (node.group == "Dpt") {
            ctx.fillRect(node.x - 6, node.y - 4, 12, 8);
          }
          else {
            //ctx.fillStyle = node.color;
            ctx.beginPath(); ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false); ctx.fill();
          }
        })
        .onNodeClick(node => {
            // Center/zoom on node
            Graph.centerAt(node.x, node.y, 1000);
            Graph.zoom(6, 2000);
          })
        .onNodeDragEnd(node => {
            node.fx = node.x;
            node.fy = node.y;
          })

  }

  function draw3D(gData){
    const elem = document.getElementById('graph');
    const Graph = ForceGraph3D({extraRenderers: [new THREE.CSS2DRenderer()]})(elem)
                      .graphData(gData)
                      .nodeVal(node => Math.log(`${node.degre}`))
                      .linkWidth(3)
                      .linkDirectionalArrowLength(3)
                     // .nodeLabel(node => `${node.label}`)
                      .nodeAutoColorBy('group')
                      //.onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
                      .nodeThreeObject(node => {
                        const nodeEl = document.createElement('div');
                        nodeEl.textContent = node.label + " (" + node.group + ")";
                        nodeEl.style.color = node.color;
                        nodeEl.className = 'node-label';
                        return new THREE.CSS2DObject(nodeEl);
                      })
                      .nodeThreeObjectExtend(true)
  }
