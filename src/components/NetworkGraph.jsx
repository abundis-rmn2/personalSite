import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
//import ForceGraph3D from '3d-force-graph';
//import * as THREE from 'three';

const NetworkGraph = forwardRef(({ posts }, ref) => {
  const containerRef = useRef(null);
  const graphRef = useRef(null);

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());

    // Color mapping for node types
    const nodeTypeColors = {
      blog: '#FF0000',
      conference: '#FF0000',
      codeProject: '#FF0000',
      paper: '#FF0000',
      multimediaProject: '#FF0000',
      mediaAppearance: '#FF0000',
      thesis: '#FF0000',
      default: '#FF0000',
    };

  // Add this function to wrap text
  const wrapText = (text, maxCharsPerLine = 20) => {
    if (!text || text.length <= maxCharsPerLine) return [text];
    
    const lines = [];
    let currentLine = '';
    const words = text.split(' ');
    
    words.forEach(word => {
      // If adding this word would exceed max chars per line
      if ((currentLine + ' ' + word).length > maxCharsPerLine && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = currentLine === '' ? word : `${currentLine} ${word}`;
      }
    });
    
    // Add the last line
    if (currentLine !== '') {
      lines.push(currentLine);
    }
    
    return lines;
  };


  // Function to highlight a node by ID
  const highlightID = (id) => {
    if (graphRef.current) {
      const graphData = graphRef.current.graphData();
      const node = graphData.nodes.find((n) => n.id === id);

      if (node) {
        // Clear previous highlights
        highlightNodes.clear();
        highlightLinks.clear();

        // Highlight the node and its neighbors
        highlightNodes.add(node);
        if (node.neighbors) {
          node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
        }

        // Highlight the links connected to the node
        if (node.links) {
          node.links.forEach((link) => highlightLinks.add(link));
        }

        // Update the graph to reflect the new highlights
        updateHighlight();
      } else {
        console.error(`Node with id ${id} not found.`);
      }
    }
  };

  // Update highlight colors and widths
  const updateHighlight = () => {
    if (graphRef.current) {
      // Force a re-render of nodes and links to update highlighting
      console.log("updateHighlight", highlightNodes, highlightLinks);
      graphRef.current
        .nodeThreeObject(graphRef.current.nodeThreeObject())
        .nodeColor(graphRef.current.nodeColor())
        .linkWidth(graphRef.current.linkWidth())
        .linkDirectionalParticles(graphRef.current.linkDirectionalParticles());
    }
  };

  // Expose methods to parent components via ref
  useImperativeHandle(ref, () => ({
    applyEffect: () => {
      if (graphRef.current) {
        // Apply a custom effect to the graph
        graphRef.current
          .nodeColor(node => {
            // Highlight nodes with a specific type
            return node.type === 'thesis' ? '#FF5733' : nodeTypeColors[node.type] || nodeTypeColors.default;
          })
          .linkWidth(link => {
            // Highlight links with a specific color
            return link.color === '#4285F4' ? 4 : 1;
          });
      }
    },
    setCameraPosition: (x, y, z) => {
      if (graphRef.current) {
        graphRef.current.cameraPosition({ x, y, z }, { x: 0, y: 0, z: 0 }, 1000);
      }
    },
    rotateGraph: (angle) => {
      if (graphRef.current) {
        const controls = graphRef.current.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = angle;
      }
    },
    resizeGraph: (width, height) => {
      if (graphRef.current) {
        graphRef.current.width(width).height(height);
      }
    },
    zoomToFit: () => {
      if (graphRef.current) {
        graphRef.current.zoomToFit(1000, 50);
      }
    },
    zoomToID: (id) => {
      if (graphRef.current) {
        console.log("networkGraph", id);
        const graphData = graphRef.current.graphData();
        const node = graphData.nodes.find((n) => n.id === id);
        
        if (node) {
          // First, highlight the node and its connections
          highlightID(id);
          
          // Then zoom to it
          const distance = 41;
          const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
    
          // Get the target position for the camera
          const targetPosition = {
            x: node.x * distRatio,
            y: node.y * distRatio,
            z: node.z * distRatio
          };
    
          // Store animation frame ID for cleanup
          let animationFrameId;
          
          // Zoom to the node with a callback to start looping animation
          // only after the camera movement is complete
          graphRef.current.cameraPosition(
            targetPosition,
            node,
            1000,
            () => {
              // Now the camera has reached the target position, start continuous orbit
              // Initial angle - use exact position where camera ended up
              let angle = Math.atan2(
                graphRef.current.camera().position.z - node.z, 
                graphRef.current.camera().position.x - node.x
              );
              
              // Calculate actual radius based on current position
              const radius = Math.hypot(
                graphRef.current.camera().position.x - node.x,
                graphRef.current.camera().position.z - node.z
              );
              
              // Store original y-coordinate
              const orbitY = graphRef.current.camera().position.y;
              
              // Animation function for continuous orbit
              const orbitAnimation = () => {
                // Increment angle for continuous rotation (adjust speed as needed)
                angle += 200; // Smaller value for slower rotation
                
                // Calculate new camera position in a circle around the node
                const newX = node.x + radius * Math.cos(angle);
                const newZ = node.z + radius * Math.sin(angle);
                
                // Add gentle bobbing in Y direction
                const bobAmount = 100;
                const newY = orbitY + Math.sin(angle * 2) * bobAmount;
                
                // Update camera position
                graphRef.current.cameraPosition(
                  { x: newX, y: newY, z: newZ },
                  node, // Look at the node
                  0 // Instant update (no transition)
                );
                
                // Continue animation loop indefinitely
                animationFrameId = requestAnimationFrame(orbitAnimation);
              };
              
              // Start the orbit animation
              animationFrameId = requestAnimationFrame(orbitAnimation);
              
              // Store reference to the animation frame ID for cleanup
              graphRef.current.__orbitAnimationId = animationFrameId;
            }
          );
          
          // Return cleanup function
          return () => {
            if (animationFrameId) {
              cancelAnimationFrame(animationFrameId);
            } 
            if (graphRef.current?.__orbitAnimationId) {
              cancelAnimationFrame(graphRef.current.__orbitAnimationId);
            }
          };
        } else {
          console.error(`Node with id ${id} not found.`);
        }
      }
    },
    highlightIDCall: (id) => {
      console.log(highlightLinks, highlightNodes);
      if (id === 99999999) {
        highlightNodes.clear();
        highlightLinks.clear();
        graphRef.current.zoomToFit(1000, 50);
      } else {
      console.log("highlightIDCall", id);
        if (!graphRef.current) return;
        const graphData = graphRef.current.graphData();
        const node = graphData.nodes.find((n) => n.id === id);
        console.log(node)
        // Clear previous highlights
        highlightNodes.clear();
        highlightLinks.clear();
        highlightID(node.id);
      }      
    },
      
  }));

  // Generate graph data from posts (keeping existing implementation)
  const generateGraphData = (posts) => {
    // Existing code for generating graph data
    const inDegreeMap = {};
    const outDegreeMap = {};

    posts.forEach((post) => {
      if (post.related_posts && Array.isArray(post.related_posts)) {
        post.related_posts.forEach((relId) => {
          const numericId = typeof relId === 'string' ? parseInt(relId, 10) : relId;
          if (!isNaN(numericId)) {
            inDegreeMap[numericId] = (inDegreeMap[numericId] || 0) + 1;
            outDegreeMap[post.databaseId] = (outDegreeMap[post.databaseId] || 0) + 1;
          }
        });
      }
    });

    const nodes = posts.map((post) => ({
      id: post.databaseId,
      name: post.title || post.id,
      group: post.type || 'default',
      val: Math.max(1, (inDegreeMap[post.databaseId] || 0) + (outDegreeMap[post.databaseId] || 0)),
      type: post.type || 'default',
    }));

    const links = posts.flatMap((post) => {
      if (!post.related_posts || !Array.isArray(post.related_posts)) return [];

      return post.related_posts
        .filter((relId) => {
          const numericId = typeof relId === 'string' ? parseInt(relId, 10) : relId;
          return !isNaN(numericId) && posts.some((p) => p.databaseId === numericId);
        })
        .map((relId) => {
          const numericId = typeof relId === 'string' ? parseInt(relId, 10) : relId;
          return {
            source: post.databaseId,
            target: numericId,
            color: '#4285F4',
            value: 3,
          };
        });
    });

    links.forEach((link) => {
      const a = nodes.find((n) => n.id === link.source);
      const b = nodes.find((n) => n.id === link.target);
      if (a && b) {
        !a.neighbors && (a.neighbors = []);
        !b.neighbors && (b.neighbors = []);
        a.neighbors.push(b);
        b.neighbors.push(a);

        !a.links && (a.links = []);
        !b.links && (b.links = []);
        a.links.push(link);
        b.links.push(link);
      }
    });

    return { nodes, links };
  };

  // Initialize the graph
  useEffect(() => {
    if (!containerRef.current || !posts || posts.length === 0) return;

    if (typeof window === 'undefined') return; // SSR guard

    const initGraph = async () => {
      const ForceGraph3D = (await import('3d-force-graph')).default;
      const THREE = await import('three');

    const graphData = generateGraphData(posts);

  // Update the createTextSprite function to accept renderOrder and opacity parameters
  const createTextSprite = (text, color = '#000000', font = 'bold 32px Arial', 
    backgroundColor = 'rgba(255, 255, 255, 0.9)', 
    opacity = 1.0, renderOrder = 0) => {
if (typeof window === 'undefined') return null; // SSR guard
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

// Split text into lines
const textLines = wrapText(text, 20);

// Set font for measurement
context.font = font;
const fontSize = parseInt(font.match(/\d+/)[0], 10);

// Measure widest line
let maxWidth = 0;
textLines.forEach(line => {
const lineWidth = context.measureText(line).width;
if (lineWidth > maxWidth) maxWidth = lineWidth;
});

// Set canvas dimensions
const padding = 10;
const lineHeight = fontSize * 1.2;
canvas.width = maxWidth + padding * 2;
canvas.height = (textLines.length * lineHeight) + padding * 2;

// Redraw with proper canvas size
context.font = font;
context.fillStyle = backgroundColor;
context.fillRect(0, 0, canvas.width, canvas.height);

// Add a border for better visibility
context.strokeStyle = '#000000';
context.lineWidth = 2;
context.strokeRect(0, 0, canvas.width, canvas.height);

// Add text with proper positioning for multiple lines
context.fillStyle = color;
context.textAlign = 'center';
context.textBaseline = 'middle';

// Draw each line of text
textLines.forEach((line, i) => {
const y = padding + (i * lineHeight) + lineHeight / 2;
context.fillText(line, canvas.width / 2, y);
});

// Create sprite from canvas
const texture = new THREE.CanvasTexture(canvas);
const spriteMaterial = new THREE.SpriteMaterial({ 
map: texture,
transparent: true,
opacity: opacity,
depthWrite: false, // Don't write to depth buffer (allows stacking)
depthTest: false,  // Don't test against depth buffer (appears in front)
sizeAttenuation: false 
});

const sprite = new THREE.Sprite(spriteMaterial);

// Set render order (higher values render on top)
sprite.renderOrder = renderOrder;

// Adjust scale based on text length for better visibility
const scaleFactor = 0.0008;
//sprite.scale.set(0.5, 0.5, 1); // Adjust the scale to fit the text
sprite.scale.set(canvas.width * scaleFactor, canvas.height * scaleFactor, 1);

return sprite;
};

    // Add light to the scene for better visibility
    const addLights = (scene) => {
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
      directionalLight.position.set(1000, 1000, 1000);
      scene.add(directionalLight);
    };

    const Graph = ForceGraph3D();
    graphRef.current = Graph(containerRef.current)
      .graphData(graphData)
      .nodeLabel((node) => `${node.name} (${node.type} - ${node.id})`)
      .nodeAutoColorBy('group')
      .nodeColor((node) => highlightNodes.has(node) ? '#FFFF00' : nodeTypeColors[node.type] || nodeTypeColors.default)
      .linkWidth((link) => (highlightLinks.has(link) ? 0.4 : 0.4))
      .linkDirectionalParticles((link) => (highlightLinks.has(link) ? 1 : 0))
      .linkDirectionalParticleSpeed(0.01)
      .linkDirectionalParticleWidth(0.5)
      .linkDirectionalParticleResolution(6)
      .linkDirectionalParticleColor((link) => '#FF0000')
      .linkColor((link) => (highlightLinks.has(link) ? '#D3D3D3' : '#CCC'))
      .backgroundColor('#FFFFFF')
      .cameraPosition({ x: -70, y: 0, z: 400 })
      .nodeThreeObject((node) => {
        const group = new THREE.Group();
        
        // Create wireframe sphere for node
        const sphereSize = Math.sqrt(node.val) * 3;
        let geometry;
        if (highlightNodes.has(node)) {
          geometry = new THREE.SphereGeometry(sphereSize, 8, 8);
        } else {
          geometry = new THREE.BoxGeometry(sphereSize*2, sphereSize*2, sphereSize*2, 4);
        }
        const wireframe = new THREE.WireframeGeometry(geometry);
        const line = new THREE.LineSegments(wireframe);
        line.material.depthTest = false;
        line.material.opacity = 0.6;
        line.material.transparent = true;
        line.material.color = new THREE.Color(highlightNodes.has(node) ? nodeTypeColors[node.type] : nodeTypeColors[node.type] || nodeTypeColors.default);
        group.add(line);
        
        // Add labels for highlighted nodes with better positioning
        if (highlightNodes.has(node)) {
          // Name label
          const nameLabel = createTextSprite(node.name, `${nodeTypeColors[node.type] || nodeTypeColors.default}`, 
                                            `bold ${sphereSize * 4}px Arial`, 'rgba(255, 255, 255, 0.9)', 1, 40);
          nameLabel.position.set(0, 0, 4);
          group.add(nameLabel);
          
          
          // Type label
            const typeLabel = createTextSprite(node.type, '#FFFFFF', 'bold 20px Arial', 'rgba(0, 0, 0, 0.8)', 1, 50);
          typeLabel.position.set(-(sphereSize-5), sphereSize + 5, 5);
          group.add(typeLabel);
          
          // ID label - highest renderOrder, full opacity
          const idLabel = createTextSprite(`ID: ${node.id}`, '#000000', 'bold 20px Arial', 'rgba(255, 200, 200, 0.9)', 1, 10);
          idLabel.position.set(0, sphereSize, 0);
          //group.add(idLabel);
          
        }
        
        return group;
      })
      .onNodeClick(node => {
        // Toggle node highlighting on click
        if (highlightNodes.has(node)) {
          setHighlightNodes(new Set());
          setHighlightLinks(new Set());
        } else {
          highlightID(node.id);
        }
        updateHighlight();
      })
      .enableNodeDrag(false)
      .enableNavigationControls(true)
      .enablePointerInteraction(true);
      
    // Add lighting to the scene
    Graph.onEngineTick(() => {
      if (!Graph.scene()) return;
      if (!Graph.scene().userData.lightsAdded) {
        addLights(Graph.scene());
        Graph.scene().userData.lightsAdded = true;
      }
    });

  };

    initGraph();
  
    
    return () => {
      if (graphRef.current) graphRef.current._destructor();
    };
  
  }, []);
  
  return (
    <div
      className="networkGraph"
      ref={containerRef}
      style={{ width: '100vw', height: '100vh', position: 'fixed', zIndex: '1', left:-150}}
    />
  );
});

export default NetworkGraph;