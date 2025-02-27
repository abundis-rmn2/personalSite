import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import ForceGraph3D from '3d-force-graph';
import * as THREE from 'three';

// Define the NetworkGraph component, using forwardRef to allow parent components to access its methods
const NetworkGraph = forwardRef(({ posts }, ref) => {
  const containerRef = useRef(null); // Reference to the container div
  const graphRef = useRef(null); // Reference to the ForceGraph3D instance

  // Expose the applyEffect method to parent components via ref
  useImperativeHandle(ref, () => ({
    applyEffect: () => {
      if (graphRef.current) {
        graphRef.current.backgroundColor('#FF0'); // Change background color to white
      }
    }
  }));

  // Function to create a text sprite for node labels
  const createTextSprite = (text, color, font, backgroundColor) => {
    const canvas = document.createElement('canvas'); // Create a canvas element
    const context = canvas.getContext('2d'); // Get the 2D drawing context
    context.font = font; // Set the font
    context.fillStyle = backgroundColor; // Set the background color
    context.fillRect(0, 0, context.measureText(text).width + 10, 30); // Draw the background rectangle
    context.fillStyle = color; // Set the text color
    context.fillText(text, 5, 24); // Draw the text
    const texture = new THREE.CanvasTexture(canvas); // Create a texture from the canvas
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture }); // Create a sprite material using the texture
    const sprite = new THREE.Sprite(spriteMaterial); // Create a sprite using the material
    sprite.scale.set(100, 50, 1); // Adjust the scale to fit the text
    return sprite; // Return the sprite
  };

  // Function to generate graph data from posts
  const generateGraphData = (posts) => {
    const inDegreeMap = {}; // Map to store in-degrees of nodes
    const outDegreeMap = {}; // Map to store out-degrees of nodes

    // Calculate in-degrees and out-degrees
    posts.forEach(post => {
      if (post.related_posts && Array.isArray(post.related_posts)) {
        post.related_posts.forEach(relId => {
          const numericId = typeof relId === 'string' ? parseInt(relId, 10) : relId;
          if (!isNaN(numericId)) {
            inDegreeMap[numericId] = (inDegreeMap[numericId] || 0) + 1;
            outDegreeMap[post.databaseId] = (outDegreeMap[post.databaseId] || 0) + 1;
          }
        });
      }
    });

    // Create nodes array
    const nodes = posts.map(post => ({
      id: post.databaseId,
      name: post.title || post.id,
      group: post.type || 'default',
      val: (inDegreeMap[post.databaseId] || 0) + (outDegreeMap[post.databaseId] || 0),
      type: post.type || 'default',
    }));

    // Create links array
    const links = posts.flatMap(post => {
      if (!post.related_posts || !Array.isArray(post.related_posts)) { return []; }

      return post.related_posts
        .filter(relId => {
          const numericId = typeof relId === 'string' ? parseInt(relId, 10) : relId;
          return !isNaN(numericId) && posts.some(p => p.databaseId === numericId);
        })
        .map(relId => {
          const numericId = typeof relId === 'string' ? parseInt(relId, 10) : relId;
          return {
            source: post.databaseId,
            target: numericId,
            color: '#4285F4',
            value: 3
          };
        });
    });

    return { nodes, links }; // Return the generated graph data
  };

  // useEffect to initialize the graph when the component mounts or posts change
  useEffect(() => {
    if (!containerRef.current || !posts || posts.length === 0) return;

    const graphData = generateGraphData(posts); // Generate graph data from posts

    const Graph = ForceGraph3D(); // Create a new ForceGraph3D instance
    graphRef.current = Graph(containerRef.current)
      .graphData(graphData) // Set the graph data
      .nodeLabel(node => `${node.name} (${node.type})`) // Set the node label
      .nodeAutoColorBy('group') // Automatically color nodes by group
      .linkWidth(link => link.value || 2) // Set the link width
      .linkColor(link => link.color || null) // Set the link color
      .linkDirectionalParticles(5) // Set the number of directional particles
      .linkDirectionalParticleSpeed(0.01) // Set the speed of directional particles
      .backgroundColor('#FFFFFF') // Set the background color
      .cameraPosition({ x: -70, y: 0, z: 400 }) // Set the initial camera position
      .nodeThreeObject(node => { // Customize the node appearance
        const group = new THREE.Group(); // Create a group to hold the node objects
        let object;

        if (node.group === 'special') {
          const texture = new THREE.TextureLoader().load('/path/to/icon.png'); // Load a texture for special nodes
          object = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture })); // Create a sprite using the texture
          object.scale.set(20, 20, 1); // Set the sprite scale
        } else {
          const sphereSize = Math.sqrt(node.val) * 5; // Calculate the sphere size based on node value
          object = new THREE.Mesh(
            new THREE.SphereGeometry(sphereSize, 32, 32), // Create a sphere geometry
            new THREE.MeshStandardMaterial({ color: node.color || '#00f', roughness: 0.5, metalness: 0.5 }) // Create a material for the sphere
          );
        }

        group.add(object); // Add the object to the group

        const nameLabel = createTextSprite(node.name, '#000', 'bold 24px Arial', 'rgba(255, 255, 255, 0.8)'); // Create a name label
        nameLabel.position.set(0, -15, 0); // Set the position of the name label
        group.add(nameLabel); // Add the name label to the group

        const typeLabel = createTextSprite(node.type, '#000', 'bold 18px Arial', 'rgba(255, 255, 255, 0.8)'); // Create a type label
        typeLabel.position.set(0, -30, 0); // Set the position of the type label
        group.add(typeLabel); // Add the type label to the group

        return group; // Return the group as the node object
      });

    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.8); // Create an ambient light
    graphRef.current.scene().add(ambientLight); // Add the ambient light to the scene

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6); // Create a directional light
    directionalLight.position.set(0, 50, 50).normalize(); // Set the position of the directional light
    graphRef.current.scene().add(directionalLight); // Add the directional light to the scene

    return () => {
      Graph._destructor(); // Clean up the graph instance when the component unmounts
    };
  }, []); // Dependency array to re-run the effect when posts change

  return (
    <div 
      className="networkGraph" 
      ref={containerRef} 
      style={{ width: '100vw', height: '100vh', position: 'fixed', zIndex: '5' }} 
    />
  );
});

export default NetworkGraph; // Export the NetworkGraph component