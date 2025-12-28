import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {MiniMap,Controls,Background,addEdge,Handle,Position,useNodesState,useEdgesState,} 
from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Card,
  Button,
  Drawer,
  Typography,
  Space,
  Input,
  message,
  Tooltip,
  Switch,
  Modal,
  Upload,
  Select,
  Form,
  InputNumber,
  Divider,
  Row,
  Col,
} from 'antd';
import {
  MailOutlined,
  ApiOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  FolderOpenOutlined,
  EditOutlined,
  CopyOutlined,
  UndoOutlined,
  RedoOutlined,
  BulbOutlined,
  ImportOutlined,
  ExportOutlined,
  PlayCircleOutlined,
  CloseOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LinkOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const WORKFLOW_STORAGE_KEY = 'workflow_builder_v2';
const THEME_KEY = 'workflow_builder_theme_v2';

/** Custom node component */
function CustomNode({ id, data }) {
  const outputs = Array.isArray(data?.outputs) ? data.outputs : [];

  return (
    <div
      style={{
        minWidth: 180,
        padding: 8,
        borderRadius: 8,
        border: '1px solid #d9d9d9',
        background: data._theme === 'dark' ? '#2b2d35' : '#fff',
        color: data._theme === 'dark' ? '#fff' : '#111',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <Handle type="target" position={Position.Left} id="in" style={{ background: '#555' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700 }}>{data.label}</div>
          <div style={{ fontSize: 12, color: data._theme === 'dark' ? '#bbb' : '#666' }}>{data.type}</div>
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        {outputs.map((o) => (
          <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
            <span style={{ fontSize: 12, color: data._theme === 'dark' ? '#d0d0d0' : '#333' }}>{o.label}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={o.id}
              style={{ background: '#4caf50', width: 10, height: 10, borderRadius: 10 }}
            />
          </div>
        ))}
        {outputs.length === 0 && <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>No outputs — add one in node settings</div>}
      </div>
    </div>
  );
}

const nodeTypes = {
  customNode: CustomNode,
};

/** Toolbox templates */
const TOOLBOX = [
  { type: 'start', label: 'Start', icon: <PlayCircleOutlined />, node: { type: 'customNode', data: { label: 'Start', type: 'start', config: {}, outputs: [{ id: 'next', label: 'Next' }] } } },
  { type: 'task', label: 'Task', icon: <PlusOutlined />, node: { type: 'customNode', data: { label: 'Task', type: 'task', config: { assignee: '' }, outputs: [{ id: 'done', label: 'Done' }, { id: 'fail', label: 'Fail' }] } } },
  { type: 'email', label: 'Email', icon: <MailOutlined />, node: { type: 'customNode', data: { label: 'Send Email', type: 'email', config: { to: '', subject: '', body: '' }, outputs: [{ id: 'sent', label: 'Sent' }, { id: 'error', label: 'Error' }] } } },
  { type: 'api', label: 'API Request', icon: <ApiOutlined />, node: { type: 'customNode', data: { label: 'API', type: 'api', config: { method: 'GET', url: '', headers: '', body: '' }, outputs: [{ id: '200', label: '200' }, { id: 'error', label: 'Error' }] } } },
  { type: 'condition', label: 'Condition', icon: <LinkOutlined />, node: { type: 'customNode', data: { label: 'Condition', type: 'condition', config: { variable: '', operator: '==', value: '' }, outputs: [{ id: 'true', label: 'True' }, { id: 'false', label: 'False' }] } } },
  { type: 'delay', label: 'Delay', icon: <ClockCircleOutlined />, node: { type: 'customNode', data: { label: 'Delay', type: 'delay', config: { waitMs: 60000 }, outputs: [{ id: 'done', label: 'Done' }] } } },
  { type: 'hr', label: 'HR Action', icon: <PlusOutlined />, node: { type: 'customNode', data: { label: 'HR', type: 'hr', config: { action: 'onboard' }, outputs: [{ id: 'ok', label: 'OK' }, { id: 'reject', label: 'Reject' }] } } },
];

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: 'n_start',
      type: 'customNode',
      position: { x: 50, y: 20 },
      data: { label: 'Start', type: 'start', config: {}, outputs: [{ id: 'next', label: 'Next' }], _theme: localStorage.getItem(THEME_KEY) || 'light' },
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const dragNodeType = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem(THEME_KEY) || 'light');
  const [toolboxCollapsed, setToolboxCollapsed] = useState(false);
  const [log, setLog] = useState([]);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [workflowTitle, setWorkflowTitle] = useState('ERP Workflow');
  const [newOutputLabel, setNewOutputLabel] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(WORKFLOW_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.nodes && parsed.edges) {
          setNodes(parsed.nodes.map(n => ({ ...n, data: { ...n.data, _theme: localStorage.getItem(THEME_KEY) || 'light' } })));
          setEdges(parsed.edges);
          if (parsed.title) setWorkflowTitle(parsed.title);
        }
      } catch (e) { }
    }
  }, []);

  const addLog = (msg) => setLog((l) => [msg, ...l.slice(0, 100)]);

  const pushHistory = useCallback(() => {
    setHistory((h) => [...h, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }]);
    setFuture([]);
  }, [nodes, edges]);

  const undo = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setFuture((f) => [{ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }, ...f]);
    setNodes(prev.nodes);
    setEdges(prev.edges);
    setHistory((h) => h.slice(0, -1));
    addLog('Undo');
  };

  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setHistory((h) => [...h, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }]);
    setNodes(next.nodes);
    setEdges(next.edges);
    setFuture((f) => f.slice(1));
    addLog('Redo');
  };

  const createNewNode = (tool, pos = null) => {
    pushHistory();
    const id = `${tool.type}_${Math.floor(Math.random() * 100000)}`;
    const x = pos?.x ?? 200 + Math.random() * 200;
    const y = pos?.y ?? 100 + Math.random() * 200;

    const newNode = {
      id,
      type: tool.node.type,
      position: { x, y },
      data: {
        ...tool.node.data,
        _theme: theme,
        outputs: (Array.isArray(tool.node.data.outputs) ? tool.node.data.outputs : []).map((o, i) => ({ id: o.id ?? `out_${i}`, label: o.label ?? o.id ?? `out_${i}` })),
      },
    };
    setNodes((nds) => [...nds, newNode]);
    addLog(`Added node ${tool.label}`);
    return newNode;
  };

  const deleteNode = (nodeId) => {
    pushHistory();
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    addLog(`Deleted node ${nodeId}`);
    setSelectedNode(null);
    setModalOpen(false);
  };

  const copyNode = (node) => {
    if (!node) return;
    pushHistory();
    const id = `${node.data.type}_${Math.floor(Math.random() * 100000)}`;
    const x = (node.position?.x ?? 200) + 30;
    const y = (node.position?.y ?? 100) + 30;
    const copy = { ...node, id, position: { x, y }, data: { ...node.data, _theme: theme } };
    setNodes((nds) => [...nds, copy]);
    addLog(`Copied node ${node.id}`);
  };

  const updateNodeData = (nodeId, patch) => {
    pushHistory();
    setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...patch, _theme: theme } } : n)));
    addLog(`Updated node ${nodeId}`);
  };

  const addOutputToNode = (nodeId, label) => {
    if (!label) return;
    const uid = `out_${Math.floor(Math.random() * 100000)}`;
    updateNodeData(nodeId, { outputs: [...(nodes.find(n => n.id === nodeId)?.data.outputs || []), { id: uid, label }] });
  };

  const removeOutputFromNode = (nodeId, outputId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const newOutputs = (node.data.outputs || []).filter(o => o.id !== outputId);
    pushHistory();
    setEdges((eds) => eds.filter(e => !(e.source === nodeId && e.sourceHandle === outputId)));
    setNodes((nds) => nds.map(n => n.id === nodeId ? { ...n, data: { ...n.data, outputs: newOutputs, _theme: theme } } : n));
  };

  const onConnect = useCallback((params) => {
    pushHistory();
    const sourceNode = nodes.find(n => n.id === params.source);
    if (sourceNode && !params.sourceHandle && sourceNode.data.outputs?.length) {
      params.sourceHandle = sourceNode.data.outputs[0].id;
    }
    setEdges((eds) => addEdge({ ...params, id: `e_${params.source}_${params.target}_${Date.now()}` }, eds));
    addLog(`Connected ${params.source}:${params.sourceHandle || 'out'} → ${params.target}:${params.targetHandle || 'in'}`);
  }, [pushHistory, nodes]);

  const onDragStart = (event, tool) => { dragNodeType.current = tool; event.dataTransfer.effectAllowed = 'move'; };
  const onDrop = useCallback((event) => {
    event.preventDefault();
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const tool = dragNodeType.current;
    if (!tool) return;
    const pos = { x: event.clientX - reactFlowBounds.left, y: event.clientY - reactFlowBounds.top };
    createNewNode(tool, pos);
    dragNodeType.current = null;
  }, [createNewNode]);
  const onDragOver = (event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; };

  const onNodeDoubleClick = (_evt, node) => { setSelectedNode(node); setModalOpen(true); };
  const onNodeClick = (_evt, node) => { setSelectedNode(node); };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    setNodes((nds) => nds.map(n => ({ ...n, data: { ...n.data, _theme: next } })));
  };

  const saveWorkflow = () => {
    const payload = { title: workflowTitle, nodes: nodes.map(n => ({ ...n, data: { ...n.data, _theme: undefined } })), edges };
    localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(payload));
    message.success('Workflow saved');
  };

  const loadWorkflow = () => {
    const saved = localStorage.getItem(WORKFLOW_STORAGE_KEY);
    if (!saved) return message.warn('No saved workflow');
    try {
      const parsed = JSON.parse(saved);
      setNodes(parsed.nodes.map(n => ({ ...n, data: { ...n.data, _theme: theme } })));
      setEdges(parsed.edges || []);
      if (parsed.title) setWorkflowTitle(parsed.title);
      message.success('Workflow loaded');
    } catch (e) { message.error('Failed to parse workflow'); }
  };

  const exportWorkflow = () => {
    const data = JSON.stringify({ title: workflowTitle, nodes: nodes.map(n => ({ ...n, data: { ...n.data, _theme: undefined } })), edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(workflowTitle || 'workflow').replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importWorkflow = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        setNodes(parsed.nodes.map(n => ({ ...n, data: { ...n.data, _theme: theme } })));
        setEdges(parsed.edges || []);
        if (parsed.title) setWorkflowTitle(parsed.title);
        message.success('Workflow imported');
      } catch (err) { message.error('Invalid workflow file'); }
    };
    reader.readAsText(file);
    return false;
  };

  const runWorkflowSimulation = () => {
    addLog('Simulation started');
    const startNodes = nodes.filter(n => n.data?.type === 'start');
    const visited = new Set();
    const queue = [...startNodes];

    while (queue.length) {
      const cur = queue.shift();
      if (!cur || visited.has(cur.id)) continue;
      visited.add(cur.id);

      switch (cur.data.type) {
        case 'task':
          addLog(`Task "${cur.data.label}" assigned to ${cur.data.config?.assignee || 'unknown'}`);
          break;
        case 'email':
          addLog(`Email sent to ${cur.data.config?.to || 'unknown'} (Subject: ${cur.data.config?.subject || ''})`);
          break;
        case 'api':
          addLog(`API call to ${cur.data.config?.url || 'unknown'} with method ${cur.data.config?.method || 'GET'}`);
          break;
        case 'condition':
          addLog(`Condition "${cur.data.config?.variable} ${cur.data.config?.operator} ${cur.data.config?.value}" evaluated`);
          break;
        case 'delay':
          addLog(`Delay for ${cur.data.config?.waitMs || 0}ms`);
          break;
        default:
          addLog(`Processed node "${cur.data.label}"`);
      }

      const outs = edges.filter(e => e.source === cur.id);
      for (const e of outs) {
        const target = nodes.find(n => n.id === e.target);
        if (target && !visited.has(target.id)) queue.push(target);
      }
    }

    addLog('Simulation finished');
    message.info('Workflow simulation completed.');
  };

  const headerBg = theme === 'dark' ? '#2b2d35' : '#fff';
  const containerBg = theme === 'dark' ? '#121316' : '#f4f8ff';
  const toolboxBg = theme === 'dark' ? '#23272f' : '#fff';

  return (
    <div style={{ display: 'flex', height: '100vh', background: containerBg, color: theme === 'dark' ? '#fff' : '#222' }}>
      {/* Toolbox */}
      <div style={{ width: toolboxCollapsed ? 56 : 300, padding: toolboxCollapsed ? 8 : 18, background: toolboxBg, borderRight: '1px solid #e6e6e6', transition: 'width 0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: toolboxCollapsed ? 'center' : 'space-between', marginBottom: 12 }}>
          {!toolboxCollapsed && <Title level={5} style={{ margin: 0 }}>Toolbox</Title>}
          <Button size="small" onClick={() => setToolboxCollapsed(!toolboxCollapsed)}>{toolboxCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</Button>
        </div>
        {!toolboxCollapsed && TOOLBOX.map((tool) => (
          <Card key={tool.type} size="small" style={{ marginBottom: 6, cursor: 'grab' }} onDragStart={(e) => onDragStart(e, tool)} draggable>
            <Space><span>{tool.icon}</span><span>{tool.label}</span></Space>
          </Card>
        ))}
        <Divider />
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button icon={<UndoOutlined />} onClick={undo} block>Undo</Button>
          <Button icon={<RedoOutlined />} onClick={redo} block>Redo</Button>
          <Button icon={<SaveOutlined />} onClick={saveWorkflow} block>Save</Button>
          <Button icon={<FolderOpenOutlined />} onClick={loadWorkflow} block>Load</Button>
          <Upload beforeUpload={importWorkflow} showUploadList={false} accept=".json">
            <Button icon={<ImportOutlined />} block>Import</Button>
          </Upload>
          <Button icon={<ExportOutlined />} onClick={exportWorkflow} block>Export</Button>
          <Button icon={<BulbOutlined />} onClick={toggleTheme} block>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</Button>
          <Button icon={<PlayCircleOutlined />} onClick={runWorkflowSimulation} type="primary" block>Run Simulation</Button>
        </Space>
      </div>

      {/* Main Canvas */}
      <div style={{ flexGrow: 1 }} onDrop={onDrop} onDragOver={onDragOver}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      {/* Node Modal */}
      <Drawer
        title={selectedNode?.data.label || ''}
        placement="right"
        width={400}
        onClose={() => setModalOpen(false)}
        open={modalOpen}
        extra={<Space>
          <Button icon={<CopyOutlined />} onClick={() => copyNode(selectedNode)}>Copy</Button>
          <Button icon={<DeleteOutlined />} onClick={() => deleteNode(selectedNode?.id)} danger>Delete</Button>
        </Space>}
      >
        {selectedNode && (
          <Space direction="vertical" style={{ width: '100%' }}>
            {/* Label */}
            <Input
              placeholder="Label"
              value={selectedNode.data.label}
              onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
            />

            {/* Type-specific config */}
            {selectedNode.data.type === 'task' && (
              <Input placeholder="Assignee" value={selectedNode.data.config.assignee || ''} onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, assignee: e.target.value } })} />
            )}
            {selectedNode.data.type === 'email' && (
              <>
                <Input placeholder="To" value={selectedNode.data.config.to || ''} onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, to: e.target.value } })} />
                <Input placeholder="Subject" value={selectedNode.data.config.subject || ''} onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, subject: e.target.value } })} />
                <Input.TextArea placeholder="Body" value={selectedNode.data.config.body || ''} onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, body: e.target.value } })} />
              </>
            )}
            {selectedNode.data.type === 'api' && (
              <>
                <Input placeholder="URL" value={selectedNode.data.config.url || ''} onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, url: e.target.value } })} />
                <Select value={selectedNode.data.config.method || 'GET'} style={{ width: '100%' }} onChange={(val) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, method: val } })}>
                  <Option value="GET">GET</Option>
                  <Option value="POST">POST</Option>
                  <Option value="PUT">PUT</Option>
                  <Option value="DELETE">DELETE</Option>
                </Select>
                <Input.TextArea placeholder="Body" value={selectedNode.data.config.body || ''} onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, body: e.target.value } })} />
              </>
            )}
            {selectedNode.data.type === 'condition' && (
              <>
                <Input placeholder="Variable" value={selectedNode.data.config.variable || ''} onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, variable: e.target.value } })} />
                <Select value={selectedNode.data.config.operator || '=='} style={{ width: '100%' }} onChange={(val) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, operator: val } })}>
                  <Option value="==">==</Option>
                  <Option value="!=">!=</Option>
                  <Option value=">">&gt;</Option>
                  <Option value="<">&lt;</Option>
                  <Option value=">=">&gt;=</Option>
                  <Option value="<=">&lt;=</Option>
                </Select>
                <Input placeholder="Value" value={selectedNode.data.config.value || ''} onChange={(e) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, value: e.target.value } })} />
              </>
            )}
            {selectedNode.data.type === 'delay' && (
              <InputNumber style={{ width: '100%' }} min={0} value={selectedNode.data.config.waitMs || 60000} onChange={(val) => updateNodeData(selectedNode.id, { config: { ...selectedNode.data.config, waitMs: val } })} />
            )}

            <Divider>Outputs</Divider>
            {selectedNode.data.outputs.map((o) => (
              <Space key={o.id} style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text>{o.label}</Text>
                <Button icon={<DeleteOutlined />} size="small" onClick={() => removeOutputFromNode(selectedNode.id, o.id)} />
              </Space>
            ))}
            <Space style={{ width: '100%' }}>
              <Input placeholder="New output label" value={newOutputLabel} onChange={(e) => setNewOutputLabel(e.target.value)} />
              <Button icon={<PlusOutlined />} onClick={() => { addOutputToNode(selectedNode.id, newOutputLabel); setNewOutputLabel(''); }}>Add</Button>
            </Space>
          </Space>
        )}
      </Drawer>

      {/* Log */}
      <div style={{ width: 300, borderLeft: '1px solid #e6e6e6', background: theme === 'dark' ? '#1e1f26' : '#f7f9ff', padding: 8, overflowY: 'auto' }}>
        <Title level={5}>Logs</Title>
        <div style={{ maxHeight: 'calc(100vh - 60px)', overflowY: 'auto' }}>
          {log.map((l, i) => <div key={i} style={{ fontSize: 12, padding: 2 }}>{l}</div>)}
        </div>
      </div>
    </div>
  );
}
