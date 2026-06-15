import { useState } from 'react';
import { calculateNutritionAdvice } from '../utils/dataAnalyzer';

function Settings({ userProfile, setUserProfile }) {
  const [formData, setFormData] = useState(userProfile);

  // 保存设置
  const handleSubmit = (e) => {
    e.preventDefault();
    setUserProfile(formData);
    alert('设置已保存！');
  };

  // 重置为默认值
  const handleReset = () => {
    if (confirm('确定要重置所有设置吗？')) {
      const defaultProfile = {
        name: '运动员',
        height: 173,
        currentWeight: 85,
        targetWeight: 75,
        currentBodyFat: null,
        targetBodyFat: 15,
        halfMarathonPB: '01:29:30',
        trainingDaysPerWeek: 6,
        runningDaysPerWeek: 4,
        strengthDaysPerWeek: 3,
        trainingGoal: 'weight_loss',
        strengthLevel: 'intermediate',
        targetWeeks: 12
      };
      setFormData(defaultProfile);
      setUserProfile(defaultProfile);
    }
  };

  // 计算营养建议
  const nutritionAdvice = calculateNutritionAdvice(formData.currentWeight);

  return (
    <div>
      {/* 个人信息 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">个人信息</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">姓名</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">身高 (cm)</label>
            <input
              type="number"
              className="form-input"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">当前体重 (kg)</label>
            <input
              type="number"
              step="0.1"
              className="form-input"
              value={formData.currentWeight}
              onChange={(e) => setFormData({ ...formData, currentWeight: parseFloat(e.target.value) })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">目标体重 (kg)</label>
            <input
              type="number"
              step="0.1"
              className="form-input"
              value={formData.targetWeight}
              onChange={(e) => setFormData({ ...formData, targetWeight: parseFloat(e.target.value) })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">目标体脂率 (%)</label>
            <input
              type="number"
              step="0.1"
              className="form-input"
              value={formData.targetBodyFat}
              onChange={(e) => setFormData({ ...formData, targetBodyFat: parseFloat(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">目标周期 (周)</label>
            <input
              type="number"
              className="form-input"
              value={formData.targetWeeks}
              onChange={(e) => setFormData({ ...formData, targetWeeks: parseInt(e.target.value) })}
            />
          </div>
        </form>
      </div>

      {/* 训练目标 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">训练目标</h2>
        </div>

        <div className="form-group">
          <label className="form-label">半程马拉松最好成绩</label>
          <input
            type="text"
            className="form-input"
            placeholder="格式: HH:MM:SS"
            value={formData.halfMarathonPB}
            onChange={(e) => setFormData({ ...formData, halfMarathonPB: e.target.value })}
          />
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            用于计算训练配速区间
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">训练目标</label>
          <select
            className="form-select"
            value={formData.trainingGoal}
            onChange={(e) => setFormData({ ...formData, trainingGoal: e.target.value })}
          >
            <option value="weight_loss">减脂为主</option>
            <option value="maintain_half">维持半马水平</option>
            <option value="improve_10k">提升10K能力</option>
            <option value="strength_gain">力量增长</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">力量训练水平</label>
          <select
            className="form-select"
            value={formData.strengthLevel}
            onChange={(e) => setFormData({ ...formData, strengthLevel: e.target.value })}
          >
            <option value="beginner">初级</option>
            <option value="intermediate">中级</option>
            <option value="advanced">高级</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">每周训练天数</label>
          <select
            className="form-select"
            value={formData.trainingDaysPerWeek}
            onChange={(e) => setFormData({ ...formData, trainingDaysPerWeek: parseInt(e.target.value) })}
          >
            <option value="4">4天</option>
            <option value="5">5天</option>
            <option value="6">6天</option>
            <option value="7">7天</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">每周跑步次数</label>
          <select
            className="form-select"
            value={formData.runningDaysPerWeek}
            onChange={(e) => setFormData({ ...formData, runningDaysPerWeek: parseInt(e.target.value) })}
          >
            <option value="3">3次</option>
            <option value="4">4次</option>
            <option value="5">5次</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">每周力量训练次数</label>
          <select
            className="form-select"
            value={formData.strengthDaysPerWeek}
            onChange={(e) => setFormData({ ...formData, strengthDaysPerWeek: parseInt(e.target.value) })}
          >
            <option value="2">2次</option>
            <option value="3">3次</option>
            <option value="4">4次</option>
          </select>
        </div>
      </div>

      {/* 营养建议 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">营养建议</h2>
          <div className="card-subtitle">基于当前体重 {formData.currentWeight}kg</div>
        </div>

        <div style={{ fontSize: '0.875rem', lineHeight: '1.8' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px', marginBottom: '1rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>🥩 每日蛋白质:</strong>
            <div style={{ marginTop: '0.5rem', fontSize: '1.125rem', color: 'var(--primary-color)', fontWeight: '600' }}>
              {nutritionAdvice.protein.min} - {nutritionAdvice.protein.max} g
            </div>
            <div style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
              约 {(nutritionAdvice.protein.min / formData.currentWeight).toFixed(1)} - {(nutritionAdvice.protein.max / formData.currentWeight).toFixed(1)} g/kg 体重
            </div>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px', marginBottom: '1rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>🔥 每日热量:</strong>
            <div style={{ marginTop: '0.5rem', fontSize: '1.125rem', color: 'var(--primary-color)', fontWeight: '600' }}>
              {nutritionAdvice.calories.min} - {nutritionAdvice.calories.max} kcal
            </div>
            <div style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
              减脂期建议热量范围
            </div>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px', marginBottom: '1rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>🍚 碳水化合物:</strong>
            <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
              {nutritionAdvice.carbs}
            </div>
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '8px' }}>
            <strong style={{ color: 'var(--text-primary)' }}>💧 水分摄入:</strong>
            <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
              {nutritionAdvice.hydration}
            </div>
          </div>
        </div>
      </div>

      {/* 保存按钮 */}
      <div className="card">
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>
            💾 保存设置
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            🔄 重置
          </button>
        </div>
      </div>

      {/* 关于 */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">关于</h2>
        </div>

        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>训练助手 v1.0</strong>
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            一个为跑步爱好者和力量训练者设计的个人训练管理工具。
          </p>
          <p>
            所有数据保存在本地浏览器中，不会上传到服务器。
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
