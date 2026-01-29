import { Node, Edge } from '@xyflow/react';
export const DEMO_LEGACY_GRAPH = {
  nodes: [
    { id: 'usr-1', type: 'sketchy', position: { x: 50, y: 150 }, data: { label: 'Users', iconType: 'users' } },
    { id: 'fw-1', type: 'sketchy', position: { x: 250, y: 150 }, data: { label: 'Firewall', iconType: 'shield' } },
    { id: 'lb-1', type: 'sketchy', position: { x: 450, y: 150 }, data: { label: 'Load Balancer', iconType: 'layers' } },
    { id: 'app-1', type: 'sketchy', position: { x: 650, y: 150 }, data: { label: 'Web App', iconType: 'server' } },
    { id: 'db-1', type: 'sketchy', position: { x: 850, y: 150 }, data: { label: 'Database', iconType: 'database' } },
  ] as Node[],
  edges: [
    { id: 'e1-2', source: 'usr-1', target: 'fw-1', type: 'sketchy', animated: true },
    { id: 'e2-3', source: 'fw-1', target: 'lb-1', type: 'sketchy', animated: true },
    { id: 'e3-4', source: 'lb-1', target: 'app-1', type: 'sketchy', animated: true },
    { id: 'e4-5', source: 'app-1', target: 'db-1', type: 'sketchy', animated: true },
  ] as Edge[],
};
export const DEMO_FUTURE_GRAPH = {
  nodes: [
    { id: 'usr-1', type: 'sketchy', position: { x: 50, y: 150 }, data: { label: 'Users', iconType: 'users' } },
    { id: 'cf-edge', type: 'sketchy', position: { x: 400, y: 150 }, data: { label: 'Cloudflare Edge', iconType: 'cloud', isPrimary: true } },
    { id: 'db-1', type: 'sketchy', position: { x: 850, y: 150 }, data: { label: 'Origin DB', iconType: 'database' } },
  ] as Node[],
  edges: [
    { id: 'ef-1', source: 'usr-1', target: 'cf-edge', type: 'sketchy', animated: true, style: { stroke: '#F48120', strokeWidth: 3 } },
    { id: 'ef-2', source: 'cf-edge', target: 'db-1', type: 'sketchy', animated: true, style: { stroke: '#F48120', strokeWidth: 3 } },
  ] as Edge[],
};