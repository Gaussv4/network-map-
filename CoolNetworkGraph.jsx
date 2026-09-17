import React, { useRef, useEffect } from 'react';
import { ForceGraph3D } from 'react-force-graph';
import * as THREE from 'three'; // 🌌 Imported to unlock 3D shapes

export default function CoolNetworkGraph({ graphData }) {
  const fgRef = useRef();

  useEffect(() => {
    if (!fgRef.current) return;

    // ⚙️ 1. PHYSICS FINE-TUNING
    // Adjust repulsion: higher negative numbers push nodes further apart
    fgRef.current.d3Force('charge').strength(-500);
    // Adjust connection length: changes the distance between linked nodes
    fgRef.current.d3Force('link').distance(70);

    // 🎥 2. CAMERA AUTOPILOT (Slow Orbit Rotation)
    let angle = 0;
    const interval = setInterval(() => {
      fgRef.current.cameraPosition({
        x: 350 * Math.sin(angle),
        z: 350 * Math.cos(angle)
      });
      angle += 0.001; // Tweak this number to speed up or slow down spin
    }, 10);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#090a0f' }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        
        // 🎨 Background Aesthetics
        backgroundColor="#090a0f"
        showNavInfo={false}
        
        // 📦 3. CUSTOM 3D SHAPES (Replaces spheres with wireframe cubes)
        nodeThreeObject={node => {
          // Adjust numbers inside BoxGeometry(width, height, depth) to resize them
          const geometry = new THREE.BoxGeometry(12, 12, 12);
          const material = new THREE.MeshBasicMaterial({
            color: node.group === 'core' ? '#ff007f' : '#00f0ff',
            wireframe: true // Makes it look like a sci-fi radar construct
          });
          return new THREE.Mesh(geometry, material);
        }}
        
        // ⚡ Glowing Link Data Particles
        linkColor={() => 'rgba(255,255,255,0.12)'}
        linkWidth={1.5}
        linkDirectionalParticles={4}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleColor={() => '#00f0ff'}
        linkDirectionalParticleWidth={3}
        
        // 👆 Smooth Camera Fly-To on Click
        onNodeClick={node => {
          const distance = 60;
          const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
          fgRef.current.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, 
            node, 
            2000
          );
        }}
      />
    </div>
  );
}
