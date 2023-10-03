const { useRef, useState, useCallback } = React;
fetch("https://daybreak-superpower.netlify.app/force-graph/mainData.json")
  .then((res) => res.json())
  .then((graphData) => {
    // const { ForceGraph2D } = ReactForceGraph;

    const MyForceGraph = () => {
      const fgRef = useRef(null);

      const imgs = graphData.nodes.map((node) => {
        if (node.imageBool == false || node.img == "" || node.img == null) {
          return;
        }
        const img = new Image();
        img.src = `https://daybreak-superpower.netlify.app/force-graph/images/${node.img}`;
        return img;
      });
      const [images, setImages] = useState(imgs);

      const imageGraphData = {
        links: graphData.links,
        nodes: graphData.nodes.map((node, index) => {
          const img = images[index];
          return {
            ...node,
            img: img,
          };
        }),
      };

      const hoverMode = useRef();
      const handleNodeHover = (node) => {
        hoverMode.current = node ? node : null;
        // updateHighlight();
      };

      const paintRing = (node, ctx) => {
        ctx.font = "regular 'nb international pro'";

        const { x, y, value, img } = node;
        const updatedVal = value / 1.5;
        ctx.fillStyle = "red";
        ctx.beginPath();
        // if (hoverMode.current == node) {
        //   ctx.scale(1.2, 1.2);
        // }
        const scale = node === hoverMode.current ? 1.1 : -2;
        ctx.arc(x, y, updatedVal / 2 + scale, 0, 2 * Math.PI, false);
        // ctx.fillStyle = "red";
        // ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#11C182";
        ctx.stroke();
        // ctx.setTransform(1, 0, 0, 1, 0, 0);
        if (img == "" || img == null) {
          ctx.beginPath();
          ctx.arc(x, y, updatedVal / 2, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, updatedVal / 2, 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.drawImage(
            img,
            x - updatedVal / 2,
            y - updatedVal / 2,
            updatedVal,
            updatedVal,
          );
          // ctx.fill(node.color)
          ctx.strokeStyle = "#8F8F8F";
          ctx.lineWidth = 1;

          ctx.stroke();
        }
      };

      return (
        <ForceGraph2D
        // MAIN ATTRIBUTES
          width={window.innerWidth - 100}
          height={window.innerHeight - 100}
          ref={fgRef}
          graphData={imageGraphData}

        // NODES
          nodeVal={(node) => node.value*10}
          nodeRelSize={1}
          cooldownTicks={150}
          nodeLabel="id"

          // ZOOM
          onEngineStop={() => fgRef.current?.zoomToFit(1000)}

        // STYLING
          backgroundColor="white"
          // linkWidth={1}black"}
          nodeCanvasObject={(node, ctx) => paintRing(node, ctx)}
          nodePointerAreaPaint={(node, color, ctx) => {
            const { x, y, value } = node;
            const updatedVal = value / 1.5;

            ctx.fillStyle = color;
            ctx.fillRect(
              node.x - updatedVal / 2,
              node.y - updatedVal / 2,
              updatedVal,
              updatedVal,
            );
          }}
          nodeCanvasObjectMode={() => "replace"}


          // LINKS
          linkWidth={(link) => 2}

          // LINK PARTICLES
          linkDirectionalParticleSpeed={(d) => 0.005 / d.value}
          linkDirectionalParticles={1}
          // linkDirectionalArrowLength={3.5}
          linkDirectionalParticleColor={() => "orange"}
          linkDirectionalParticleWidth={(node) => 4 - node.value}
          // linkCurvature={link => link.curvature}

          dagLevelDistance={75}

          // INTERACTIVITY
          onNodeHover={handleNodeHover}
          enablePanInteraction={false}
          enableZoomPanInteraction={false}




        />
      );
    };

    ReactDOM.render(<MyForceGraph />, document.getElementById("force-graph"));
  });