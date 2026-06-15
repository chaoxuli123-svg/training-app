import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './App.css';

// 导入工具函数
import { storage, STORAGE_KEYS } from './utils/storage';
import { DEFAULT_USER_PROFILE, SAMPLE_BODY_DATA, SAMPLE_RUNNING_LOGS, SAMPLE_STRENGTH_LOGS } from './data/sampleData';

// 导入组件
import Dashboard from './components/Dashboard';
import TrainingPlan from './components/TrainingPlan';
import RunningLog from './components/RunningLog';
import StrengthLog from './components/StrengthLog';
import BodyData from './components/BodyData';
import WeeklySummary from './components/WeeklySummary';
import Settings from './components/Settings';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userProfile, setUserProfile] = useState(null);
  const [bodyData, setBodyData] = useState([]);
  const [runningLogs, setRunningLogs] = useState([]);
  const [strengthLogs, setStrengthLogs] = useState([]);

  // 初始化数据
  useEffect(() => {
    // 加载用户配置
    let profile = storage.get(STORAGE_KEYS.USER_PROFILE);
    if (!profile) {
      profile = DEFAULT_USER_PROFILE;
      storage.set(STORAGE_KEYS.USER_PROFILE, profile);
    }
    setUserProfile(profile);

    // 加载身体数据
    let body = storage.get(STORAGE_KEYS.BODY_DATA);
    if (!body || body.length === 0) {
      body = SAMPLE_BODY_DATA;
      storage.set(STORAGE_KEYS.BODY_DATA, body);
    }
    setBodyData(body);

    // 加载跑步记录
    let running = storage.get(STORAGE_KEYS.RUNNING_LOGS);
    if (!running || running.length === 0) {
      running = SAMPLE_RUNNING_LOGS;
      storage.set(STORAGE_KEYS.RUNNING_LOGS, running);
    }
    setRunningLogs(running);

    // 加载力量训练记录
    let strength = storage.get(STORAGE_KEYS.STRENGTH_LOGS);
    if (!strength || strength.length === 0) {
      strength = SAMPLE_STRENGTH_LOGS;
      storage.set(STORAGE_KEYS.STRENGTH_LOGS, strength);
    }
    setStrengthLogs(strength);
  }, []);

  // 保存数据到本地存储
  useEffect(() => {
    if (userProfile) {
      storage.set(STORAGE_KEYS.USER_PROFILE, userProfile);
    }
  }, [userProfile]);

  useEffect(() => {
    if (bodyData.length > 0) {
      storage.set(STORAGE_KEYS.BODY_DATA, bodyData);
    }
  }, [bodyData]);

  useEffect(() => {
    if (runningLogs.length > 0) {
      storage.set(STORAGE_KEYS.RUNNING_LOGS, runningLogs);
    }
  }, [runningLogs]);

  useEffect(() => {
    if (strengthLogs.length > 0) {
      storage.set(STORAGE_KEYS.STRENGTH_LOGS, strengthLogs);
    }
  }, [strengthLogs]);

  // 渲染当前视图
  const renderView = () => {
    console.log('App - renderView called, currentView:', currentView);
    console.log('App - userProfile:', userProfile);
    console.log('App - strengthLogs:', strengthLogs);

    if (!userProfile) return <div>加载中...</div>;

    const props = {
      userProfile,
      setUserProfile,
      bodyData,
      setBodyData,
      runningLogs,
      setRunningLogs,
      strengthLogs,
      setStrengthLogs
    };

    try {
      switch (currentView) {
        case 'dashboard':
          return <Dashboard {...props} />;
        case 'plan':
          return <TrainingPlan {...props} />;
        case 'running':
          return <RunningLog {...props} />;
        case 'strength':
          console.log('Rendering StrengthLog with props:', props);
          return <StrengthLog {...props} />;
        case 'body':
          return <BodyData {...props} />;
        case 'summary':
          return <WeeklySummary {...props} />;
        case 'settings':
          return <Settings {...props} />;
        default:
          return <Dashboard {...props} />;
      }
    } catch (error) {
      console.error('Error rendering view:', error);
      return (
        <div className="card">
          <h2 style={{ color: 'red' }}>渲染错误</h2>
          <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
            {error.toString()}
          </pre>
        </div>
      );
    }
  };

  return (
    <div className="app">
      {/* 顶部导航栏 */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span>💪</span>
            训练助手
          </h1>
          <div className="header-date">{format(new Date(), 'yyyy年MM月dd日')}</div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="main-content fade-in">
        {renderView()}
      </main>

      {/* 底部导航栏 */}
      <nav className="bottom-nav">
        <button
          className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          <span className="nav-icon">🏠</span>
          <span>首页</span>
        </button>
        <button
          className={`nav-item ${currentView === 'plan' ? 'active' : ''}`}
          onClick={() => setCurrentView('plan')}
        >
          <span className="nav-icon">📅</span>
          <span>计划</span>
        </button>
        <button
          className={`nav-item ${currentView === 'running' ? 'active' : ''}`}
          onClick={() => setCurrentView('running')}
        >
          <span className="nav-icon">🏃</span>
          <span>跑步</span>
        </button>
        <button
          className={`nav-item ${currentView === 'strength' ? 'active' : ''}`}
          onClick={() => setCurrentView('strength')}
        >
          <span className="nav-icon">🏋️</span>
          <span>力量</span>
        </button>
        <button
          className={`nav-item ${currentView === 'body' ? 'active' : ''}`}
          onClick={() => setCurrentView('body')}
        >
          <span className="nav-icon">📊</span>
          <span>数据</span>
        </button>
        <button
          className={`nav-item ${currentView === 'summary' ? 'active' : ''}`}
          onClick={() => setCurrentView('summary')}
        >
          <span className="nav-icon">📈</span>
          <span>总结</span>
        </button>
        <button
          className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
          onClick={() => setCurrentView('settings')}
        >
          <span className="nav-icon">⚙️</span>
          <span>设置</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
