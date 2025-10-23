import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Youtube, 
  Mail, 
  Database,
  Calendar,
  Shield,
  Zap,
  FileText,
  // MessageSquare,
  Settings,
  // Plus,
  Bot,
  RefreshCw,
  // Play,
  Pause,
  AlertCircle,
  CheckCircle2,
  Activity,
  Bell
} from 'lucide-react';

const TaskIcons = () => {
  const [selectedBot, setSelectedBot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [botInstances, setBotInstances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newBotConfig, setNewBotConfig] = useState({
    type: 'flipkart',
    config: {}
  });

  const API_BASE_URL = 'http://localhost:5000';

  // ---------------- BOT TYPES -----------------
  const botTypes = [
    {
      id: 'flipkart',
      name: "Flipkart Bot",
      icon: ShoppingCart,
      color: "bg-orange-500 hover:bg-orange-600",
      description: "E-commerce Automation",
      status: 'active',
      configs: [
        'FLIPKART_EMAIL',
        'GMAIL_EMAIL', 
        'GMAIL_PASSWORD',
        'UPI_ID',
        'PRODUCT_URL'
      ]
    },
    {
      id: 'jobalerts', // Job Alerts Bot
      name: "Job Alerts Bot",
      icon: Bell,
      color: "bg-pink-500 hover:bg-pink-600",
      description: "Fetches latest job postings",
      status: 'active',
      configs: [
        'USER_ID',
        'JOB_PREFERENCES',
        'EMAIL_NOTIFICATIONS'
      ]
    },
    {
      id: 'youtube',
      name: "YouTube Bot",
      icon: Youtube,
      color: "bg-red-500 hover:bg-red-600",
      description: "Media Management",
      status: 'active',
      configs: [
        'PLAYLIST_URL',
        'DOWNLOAD_DIR'
      ]
    },
    {
      id: 'gmail',
      name: "Gmail Bot",
      icon: Mail,
      color: "bg-blue-500 hover:bg-blue-600",
      description: "Email Automation",
      status: 'running',
      configs: [
        'WATCH_EMAIL',
        'CHECK_INTERVAL_MINUTES'
      ]
    },
    {
      id: 'backup',
      name: "Backup Bot",
      icon: Database,
      color: "bg-green-500 hover:bg-green-600",
      description: "Data Backup",
      status: 'inactive',
      configs: [
        'BACKUP_PATH',
        'SCHEDULE_TIME',
        'RETENTION_DAYS'
      ]
    },
    {
      id: 'scheduler',
      name: "Task Scheduler",
      icon: Calendar,
      color: "bg-purple-500 hover:bg-purple-600",
      description: "Task Management",
      status: 'active',
      configs: [
        'CRON_EXPRESSION',
        'TASK_CONFIG'
      ]
    },
    {
      id: 'security',
      name: "Security Bot",
      icon: Shield,
      color: "bg-indigo-500 hover:bg-indigo-600",
      description: "Security Monitor",
      status: 'active',
      configs: [
        'MONITOR_PATHS',
        'ALERT_EMAIL'
      ]
    },
    {
      id: 'performance',
      name: "Performance Bot",
      icon: Zap,
      color: "bg-yellow-500 hover:bg-yellow-600",
      description: "System Monitor",
      status: 'running',
      configs: [
        'CPU_THRESHOLD',
        'MEMORY_THRESHOLD'
      ]
    },
    {
      id: 'reports',
      name: "Report Bot",
      icon: FileText,
      color: "bg-cyan-500 hover:bg-cyan-600",
      description: "Auto Reports",
      status: 'inactive',
      configs: [
        'REPORT_TYPE',
        'EMAIL_RECIPIENTS'
      ]
    }
  ];

  // ---------------- FETCH BOT INSTANCES -----------------
  const fetchBotInstances = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/bots/status`);
      if (response.ok) {
        const data = await response.json();
        setBotInstances(data.bots || []);
      } else {
        setError('Failed to fetch bot status');
        setBotInstances([
          { id: 1, name: "Flipkart Order Automation", type: "flipkart", status: "idle" },
          { id: 2, name: "YouTube Playlist Sync", type: "youtube", status: "idle" },
          { id: 3, name: "Gmail Auto Response", type: "gmail", status: "idle" },
          { id: 4, name: "Job Alerts Bot", type: "jobalerts", status: "idle" }
        ]);
      }
    } catch (err) {
      setError('Unable to connect to bot service');
      setBotInstances([
        { id: 1, name: "Flipkart Order Automation", type: "flipkart", status: "idle" },
        { id: 2, name: "YouTube Playlist Sync", type: "youtube", status: "idle" },
        { id: 3, name: "Gmail Auto Response", type: "gmail", status: "idle" },
        { id: 4, name: "Job Alerts Bot", type: "jobalerts", status: "idle" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- CREATE BOT -----------------
  const createBot = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/bots/${newBotConfig.type}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config: newBotConfig.config })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setShowCreateModal(false);
          setNewBotConfig({ type: 'flipkart', config: {} });
          fetchBotInstances();
        } else {
          setError(`Failed to create bot: ${result.error || 'Unknown error'}`);
        }
      } else {
        setError(`Failed to create bot: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      setError('Failed to create bot');
    } finally {
      setLoading(false);
    }
  };

  // ---------------- HELPER FUNCTIONS -----------------
  const getBotTypeCount = (botTypeId) => {
    return botInstances.filter(instance => {
      if (botTypeId === 'flipkart') return instance.name.toLowerCase().includes('flipkart');
      if (botTypeId === 'youtube') return instance.name.toLowerCase().includes('youtube');
      if (botTypeId === 'gmail') return instance.name.toLowerCase().includes('gmail');
      if (botTypeId === 'jobalerts') return instance.name.toLowerCase().includes('job');
      return false;
    }).length;
  };

  const getBotTypeStatus = (botTypeId) => {
    const instances = botInstances.filter(instance => {
      if (botTypeId === 'flipkart') return instance.name.toLowerCase().includes('flipkart');
      if (botTypeId === 'youtube') return instance.name.toLowerCase().includes('youtube');
      if (botTypeId === 'gmail') return instance.name.toLowerCase().includes('gmail');
      if (botTypeId === 'jobalerts') return instance.name.toLowerCase().includes('job');
      return false;
    });

    if (instances.length === 0) return 'inactive';
    if (instances.some(instance => instance.status === 'running')) return 'running';
    if (instances.some(instance => instance.status === 'paused')) return 'paused';
    return 'active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'paused': return 'bg-orange-500';
      case 'active': return 'bg-blue-500';
      case 'inactive': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <Activity className="h-3 w-3 text-green-600 animate-pulse" />;
      case 'paused':
        return <Pause className="h-3 w-3 text-orange-600" />;
      case 'active':
        return <CheckCircle2 className="h-3 w-3 text-blue-600" />;
      case 'inactive':
        return <AlertCircle className="h-3 w-3 text-gray-600" />;
      default:
        return <AlertCircle className="h-3 w-3 text-gray-600" />;
    }
  };

  const handleBotClick = (bot) => {
    const updatedBot = {
      ...bot,
      count: getBotTypeCount(bot.id),
      status: getBotTypeStatus(bot.id)
    };
    setSelectedBot(updatedBot);
    setShowModal(true);
  };

  useEffect(() => {
    fetchBotInstances();
    const interval = setInterval(fetchBotInstances, 30000);
    return () => clearInterval(interval);
  }, []);

  // ---------------- MODALS -----------------
  const ConfigModal = () => {
    if (!showModal || !selectedBot) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${selectedBot.color.split(' ')[0]} rounded-lg flex items-center justify-center`}>
                  <selectedBot.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedBot.name}</h3>
                  <p className="text-sm text-gray-600">{selectedBot.description}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Configuration Fields</h4>
                <div className="space-y-2">
                  {selectedBot.configs.map((config, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Settings className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{config}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Bot Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Active Instances:</span>
                    <div className="font-semibold text-blue-600">{selectedBot.count}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <div className={`inline-flex items-center space-x-1 mt-1`}>
                      {getStatusIcon(selectedBot.status)}
                      <span className="font-semibold capitalize text-gray-700">{selectedBot.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewBotConfig({ type: selectedBot.id, config: {} });
                  setShowCreateModal(true);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Create Instance
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CreateBotModal = () => {
    if (!showCreateModal) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full">
          <h3 className="text-lg font-semibold mb-4">Create New Bot Instance</h3>
          {/* Bot type and configs */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Bot Type</label>
            <select 
              value={newBotConfig.type}
              onChange={(e) => setNewBotConfig({...newBotConfig, type: e.target.value, config: {}})}
              className="w-full p-2 border rounded-lg"
            >
              {botTypes.map(bot => (
                <option key={bot.id} value={bot.id}>{bot.name}</option>
              ))}
            </select>
          </div>
          {/* Simple placeholder config inputs */}
          {newBotConfig.config && Object.keys(newBotConfig.config).map((key) => (
            <div key={key} className="mb-3">
              <label className="block text-sm font-medium mb-1">{key}</label>
              <input 
                type="text"
                value={newBotConfig.config[key] || ''}
                onChange={(e) => setNewBotConfig({
                  ...newBotConfig,
                  config: {...newBotConfig.config, [key]: e.target.value}
                })}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
          <div className="flex space-x-3 mt-6">
            <button 
              onClick={createBot}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Bot'}
            </button>
            <button 
              onClick={() => setShowCreateModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ---------------- JSX -----------------
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bot Arsenal</h2>
          <p className="text-gray-600 mt-1">Available automation bots</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={fetchBotInstances}
            disabled={loading}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <Bot className="h-4 w-4" />
            <span>Click to configure</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700 text-xl leading-none"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-4 mb-6">
        {botTypes.map((botType) => {
          const IconComponent = botType.icon;
          const count = getBotTypeCount(botType.id);
          const status = getBotTypeStatus(botType.id);
          
          return (
            <div
              key={botType.id}
              onClick={() => handleBotClick(botType)}
              className="group cursor-pointer bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 rounded-lg p-4 transition-all duration-200 hover:shadow-md border border-gray-100 hover:border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg ${botType.color} flex items-center justify-center transition-all group-hover:scale-110 transform duration-200 shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {botType.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {botType.description}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                    {getStatusIcon(status)}
                  </div>
                  <div className="text-lg font-bold text-gray-800">{count}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfigModal />
      <CreateBotModal />
    </div>
  );
};

export default TaskIcons;
