import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { defaultProfile, sampleBodyData, sampleRunningLogs, sampleStrengthLogs } from './data/sampleData';
import { clearAll, keys, load, save } from './utils/storage';
import { exercises, fatigueStatus, generatePlan, latest, paceZones, sevenDayAverage, sumWeek, weightAdvice } from './utils/logic';

const today = () => new Date().toISOString().slice(0, 10);
const tabs = [
  ['dashboard','🏠','首页'], ['plan','📅','计划'], ['running','🏃','跑步'], ['strength','🏋️','力量'],
  ['body','📊','数据'], ['summary','🧾','总结'], ['settings','⚙️','设置']
];
const emptyRun = { date: today(), type:'轻松跑', distance:'', time:'', pace:'', avgHr:'', maxHr:'', rpe:5, completed:true, notes:'' };
const emptyStrength = { date: today(), part:'上肢推', exercise:'卧推', sets:4, reps:8, weight:'', rpe:7, rest:120, completed:true, notes:'' };
const emptyBody = { date: today(), weight:'', bodyFat:'', waist:'', sleep:7, fatigue:5, hunger:5, dietOk:true, proteinOk:true };

function addId(item){ return { ...item, id: crypto.randomUUID() }; }

export default function App(){
  const [view,setView] = useState('dashboard');
  const [profile,setProfile] = useState(()=>load(keys.profile, defaultProfile));
  const [body,setBody] = useState(()=>load(keys.body, sampleBodyData));
  const [runs,setRuns] = useState(()=>load(keys.runs, sampleRunningLogs));
  const [strength,setStrength] = useState(()=>load(keys.strength, sampleStrengthLogs));
  const [plan,setPlan] = useState(()=>load(keys.plan, generatePlan()));

  useEffect(()=>save(keys.profile,profile),[profile]);
  useEffect(()=>save(keys.body,body),[body]);
  useEffect(()=>save(keys.runs,runs),[runs]);
  useEffect(()=>save(keys.strength,strength),[strength]);
  useEffect(()=>save(keys.plan,plan),[plan]);

  const status = useMemo(()=>fatigueStatus(body,runs,strength),[body,runs,strength]);
  const currentWeight = latest(body)?.weight || profile.weight;
  const weekKm = sumWeek(runs,'distance');
  const strengthTimes = strength.filter(x=>new Date(x.date)>=new Date(Date.now()-6*864e5)).length;
  const donePlan = plan.length ? Math.round(plan.filter(x=>x.completed).length/plan.length*100) : 0;
  const props = { profile,setProfile,body,setBody,runs,setRuns,strength,setStrength,plan,setPlan,status,currentWeight,weekKm,strengthTimes,donePlan };

  return <div className="app">
    <header className="top"><h1>训练助手</h1><p>85kg / 173cm / 半马 PB 1:29:30 · 跑步 + 力量 + 减脂</p></header>
    <main className="main">
      {view==='dashboard' && <Dashboard {...props}/>} {view==='plan' && <Plan {...props}/>} {view==='running' && <Running {...props}/>} {view==='strength' && <Strength {...props}/>} {view==='body' && <BodyData {...props}/>} {view==='summary' && <Summary {...props}/>} {view==='settings' && <Settings {...props}/>}    
    </main>
    <nav className="nav">{tabs.map(t=><button key={t[0]} className={view===t[0]?'active':''} onClick={()=>setView(t[0])}><span>{t[1]}</span>{t[2]}</button>)}</nav>
  </div>;
}

function Dashboard({ body, runs, plan, status, currentWeight, weekKm, strengthTimes, donePlan }){
  const advice = weightAdvice(body);
  const todayPlan = plan.find(x=>!x.completed) || plan[0];
  return <>
    <section className="card"><h2>今日状态</h2><div className="grid">
      <div className="stat"><b>{currentWeight || '--'}kg</b><small>当前体重</small></div>
      <div className="stat"><b>{sevenDayAverage(body) || '--'}kg</b><small>7日平均</small></div>
      <div className="stat"><b>{weekKm.toFixed(1)}km</b><small>近7日跑量</small></div>
      <div className="stat"><b>{strengthTimes}</b><small>近7日力量</small></div>
      <div className="stat"><b>{donePlan}%</b><small>本周计划完成率</small></div>
      <div className="stat"><b>{status.level}</b><small>疲劳状态</small></div>
    </div><div className={`alert ${status.cls}`}>{status.advice}</div></section>
    <section className="card"><div className="section-title"><h2>下一项训练</h2><span className={`badge ${todayPlan?.intensity==='高'?'danger':todayPlan?.intensity==='中'?'warning':'success'}`}>{todayPlan?.intensity || '低'}强度</span></div>
      {todayPlan ? <div><h3>{todayPlan.day}：{todayPlan.title}</h3><p className="muted">{todayPlan.detail}</p><p>{todayPlan.note}</p></div> : <p className="empty">暂无计划</p>}
    </section>
    <section className="card"><h2>减脂反馈</h2>{advice.map((m,i)=><div key={i} className="alert warning">{m}</div>)}</section>
    <section className="card"><h2>配速参考</h2><div className="pace">{Object.entries(paceZones).map(([k,v])=><div key={k}><b>{k}</b><span>{v}</span></div>)}</div></section>
    <section className="card"><h2>最近跑步</h2>{runs.slice(-3).reverse().map(r=><LogRow key={r.id} title={`${r.type} ${r.distance}km`} sub={`${r.date} · ${r.pace || '--'}/km · RPE ${r.rpe}`} />)}</section>
  </>;
}

function Plan({ plan,setPlan,status }){
  const regen = () => setPlan(generatePlan());
  const toggle = (id) => setPlan(plan.map(x=>x.id===id?{...x,completed:!x.completed}:x));
  const update = (id,field,value)=>setPlan(plan.map(x=>x.id===id?{...x,[field]:value}:x));
  return <section className="card"><div className="section-title"><h2>一周训练计划</h2><button className="btn primary small" onClick={regen}>重新生成</button></div>
    <div className={`alert ${status.cls}`}>自动调整原则：间歇跑前不做大重量下肢；长跑前不做高强度腿；下肢后第二天优先轻松跑或休息；每周至少一天恢复。</div>
    {plan.map(item=><div key={item.id} className={`plan-item ${item.completed?'done':''}`}>
      <div className="plan-head"><div><b>{item.day}｜{item.title}</b><p className="muted">{item.detail}</p></div><input className="check" type="checkbox" checked={item.completed} onChange={()=>toggle(item.id)}/></div>
      <div className="pill-list"><span className={`badge ${item.intensity==='高'?'danger':item.intensity==='中'?'warning':'success'}`}>{item.intensity}强度</span><span className="badge blue">{item.note}</span></div>
      <div className="form" style={{marginTop:10}}><label>RPE<input value={item.rpe} onChange={e=>update(item.id,'rpe',e.target.value)} placeholder="1-10"/></label><label>感受<input value={item.feeling} onChange={e=>update(item.id,'feeling',e.target.value)} placeholder="今天状态"/></label></div>
    </div>)}
  </section>;
}

function Running({ runs,setRuns }){
  const [form,setForm]=useState(emptyRun); const [edit,setEdit]=useState(null);
  const submit=()=>{ if(!form.distance) return; if(edit){setRuns(runs.map(x=>x.id===edit?{...form,id:edit}:x));setEdit(null)} else setRuns([...runs,addId(form)]); setForm(emptyRun); };
  const startEdit=(r)=>{setEdit(r.id); setForm({...r});};
  return <><section className="card"><h2>{edit?'编辑跑步记录':'新增跑步记录'}</h2><div className="form"><label>日期<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label><label>类型<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{Object.keys(paceZones).map(x=><option key={x}>{x}</option>)}</select></label><label>距离 km<input value={form.distance} onChange={e=>setForm({...form,distance:e.target.value})}/></label><label>时间<input placeholder="43:20" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></label><label>配速<input placeholder="5:25" value={form.pace} onChange={e=>setForm({...form,pace:e.target.value})}/></label><label>平均心率<input value={form.avgHr} onChange={e=>setForm({...form,avgHr:e.target.value})}/></label><label>最大心率<input value={form.maxHr} onChange={e=>setForm({...form,maxHr:e.target.value})}/></label><label>RPE<input value={form.rpe} onChange={e=>setForm({...form,rpe:e.target.value})}/></label><textarea placeholder="跑后感受" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/><label className="full"><input type="checkbox" checked={form.completed} onChange={e=>setForm({...form,completed:e.target.checked})}/> 完成计划</label></div><div className="btns"><button className="btn primary" onClick={submit}>{edit?'保存修改':'添加记录'}</button>{edit&&<button className="btn" onClick={()=>{setEdit(null);setForm(emptyRun)}}>取消</button>}</div></section><List title="跑步历史" items={runs} render={r=><LogRow title={`${r.type} ${r.distance}km`} sub={`${r.date} · ${r.time || '--'} · ${r.pace || '--'}/km · 心率 ${r.avgHr||'--'} · RPE ${r.rpe}`} onEdit={()=>startEdit(r)} onDelete={()=>setRuns(runs.filter(x=>x.id!==r.id))}/>} /></>;
}

function Strength({ strength,setStrength }){
  const [form,setForm]=useState(emptyStrength); const [edit,setEdit]=useState(null);
  const updatePart=(part)=>setForm({...form,part,exercise:exercises[part][0]});
  const submit=()=>{ if(!form.exercise) return; if(edit){setStrength(strength.map(x=>x.id===edit?{...form,id:edit}:x));setEdit(null)} else setStrength([...strength,addId(form)]); setForm(emptyStrength); };
  const startEdit=(r)=>{setEdit(r.id); setForm({...r});};
  return <><section className="card"><h2>{edit?'编辑力量记录':'新增力量训练'}</h2><div className="form"><label>日期<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label><label>部位<select value={form.part} onChange={e=>updatePart(e.target.value)}>{Object.keys(exercises).map(x=><option key={x}>{x}</option>)}</select></label><label>动作<select value={form.exercise} onChange={e=>setForm({...form,exercise:e.target.value})}>{exercises[form.part].map(x=><option key={x}>{x}</option>)}</select></label><label>组数<input value={form.sets} onChange={e=>setForm({...form,sets:e.target.value})}/></label><label>次数<input value={form.reps} onChange={e=>setForm({...form,reps:e.target.value})}/></label><label>重量 kg<input value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})}/></label><label>RPE<input value={form.rpe} onChange={e=>setForm({...form,rpe:e.target.value})}/></label><label>休息 秒<input value={form.rest} onChange={e=>setForm({...form,rest:e.target.value})}/></label><textarea placeholder="备注" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/><label className="full"><input type="checkbox" checked={form.completed} onChange={e=>setForm({...form,completed:e.target.checked})}/> 完成训练</label></div><div className="btns"><button className="btn primary" onClick={submit}>{edit?'保存修改':'添加记录'}</button>{edit&&<button className="btn" onClick={()=>{setEdit(null);setForm(emptyStrength)}}>取消</button>}</div></section><section className="card"><h2>动作库</h2>{Object.entries(exercises).map(([k,arr])=><p key={k}><b>{k}：</b>{arr.join('、')}</p>)}</section><List title="力量历史" items={strength} render={r=><LogRow title={`${r.part}｜${r.exercise}`} sub={`${r.date} · ${r.sets}组×${r.reps}次 · ${r.weight||0}kg · RPE ${r.rpe}`} onEdit={()=>startEdit(r)} onDelete={()=>setStrength(strength.filter(x=>x.id!==r.id))}/>} /></>;
}

function BodyData({ body,setBody }){
  const [form,setForm]=useState(emptyBody); const [edit,setEdit]=useState(null);
  const submit=()=>{ if(!form.weight) return; if(edit){setBody(body.map(x=>x.id===edit?{...form,id:edit}:x));setEdit(null)} else setBody([...body,addId(form)]); setForm(emptyBody); };
  const startEdit=(r)=>{setEdit(r.id); setForm({...r});};
  const chartData = [...body].sort((a,b)=>a.date.localeCompare(b.date)).map(x=>({date:x.date.slice(5), weight:+x.weight, waist:+x.waist, bodyFat:+x.bodyFat}));
  return <><section className="card"><h2>{edit?'编辑身体数据':'新增身体数据'}</h2><div className="form"><label>日期<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label><label>体重 kg<input value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})}/></label><label>体脂率 %<input value={form.bodyFat} onChange={e=>setForm({...form,bodyFat:e.target.value})}/></label><label>腰围 cm<input value={form.waist} onChange={e=>setForm({...form,waist:e.target.value})}/></label><label>睡眠 h<input value={form.sleep} onChange={e=>setForm({...form,sleep:e.target.value})}/></label><label>疲劳 1-10<input value={form.fatigue} onChange={e=>setForm({...form,fatigue:e.target.value})}/></label><label>饥饿 1-10<input value={form.hunger} onChange={e=>setForm({...form,hunger:e.target.value})}/></label><label><input type="checkbox" checked={form.dietOk} onChange={e=>setForm({...form,dietOk:e.target.checked})}/> 饮食达标</label><label><input type="checkbox" checked={form.proteinOk} onChange={e=>setForm({...form,proteinOk:e.target.checked})}/> 蛋白质达标</label></div><div className="btns"><button className="btn primary" onClick={submit}>{edit?'保存修改':'添加数据'}</button>{edit&&<button className="btn" onClick={()=>{setEdit(null);setForm(emptyBody)}}>取消</button>}</div></section><section className="card"><h2>趋势图</h2><div className="chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="date"/><YAxis domain={['dataMin - 1','dataMax + 1']}/><Tooltip/><Line type="monotone" dataKey="weight" name="体重" strokeWidth={3}/><Line type="monotone" dataKey="waist" name="腰围" strokeWidth={2}/></LineChart></ResponsiveContainer></div></section><section className="card"><h2>减脂建议</h2>{weightAdvice(body).map((m,i)=><div className="alert warning" key={i}>{m}</div>)}</section><List title="身体数据历史" items={body} render={r=><LogRow title={`${r.date}｜${r.weight}kg`} sub={`体脂 ${r.bodyFat||'--'}% · 腰围 ${r.waist||'--'}cm · 睡眠 ${r.sleep}h · 疲劳 ${r.fatigue}`} onEdit={()=>startEdit(r)} onDelete={()=>setBody(body.filter(x=>x.id!==r.id))}/>} /></>;
}

function Summary({ body,runs,strength,plan,status,weekKm,strengthTimes,donePlan }){
  const completedRuns = runs.filter(x=>x.completed).length; const completedStrength = strength.filter(x=>x.completed).length;
  return <><section className="card"><h2>本周总结</h2><div className="grid"><div className="stat"><b>{weekKm.toFixed(1)}km</b><small>近7日跑量</small></div><div className="stat"><b>{strengthTimes}</b><small>近7日力量次数</small></div><div className="stat"><b>{donePlan}%</b><small>计划完成率</small></div><div className="stat"><b>{status.level}</b><small>疲劳状态</small></div></div></section><section className="card"><h2>训练完成情况</h2><p>跑步累计记录：{runs.length} 条，已完成 {completedRuns} 条。</p><p>力量累计记录：{strength.length} 条，已完成 {completedStrength} 条。</p><p>本周计划：{plan.filter(x=>x.completed).length}/{plan.length} 项完成。</p></section><section className="card"><h2>下周建议</h2><div className={`alert ${status.cls}`}>{status.advice}</div>{weightAdvice(body).map((m,i)=><div className="alert warning" key={i}>{m}</div>)}<p className="muted">减脂期优先保持高质量力量训练和2次关键跑，其余跑步用轻松有氧补足消耗。</p></section></>;
}

function Settings({ profile,setProfile,setBody,setRuns,setStrength,setPlan }){
  const update=(k,v)=>setProfile({...profile,[k]:v});
  const reset=()=>{ if(confirm('确定清空所有本地数据并恢复示例数据吗？')){ clearAll(); setProfile(defaultProfile); setBody(sampleBodyData); setRuns(sampleRunningLogs); setStrength(sampleStrengthLogs); setPlan(generatePlan()); } };
  return <><section className="card"><h2>个人设置</h2><div className="form"><label>身高 cm<input value={profile.height} onChange={e=>update('height',e.target.value)}/></label><label>体重 kg<input value={profile.weight} onChange={e=>update('weight',e.target.value)}/></label><label>当前体脂率 %<input value={profile.bodyFat} onChange={e=>update('bodyFat',e.target.value)}/></label><label>目标体重 kg<input value={profile.targetWeight} onChange={e=>update('targetWeight',e.target.value)}/></label><label>目标体脂率 %<input value={profile.targetBodyFat} onChange={e=>update('targetBodyFat',e.target.value)}/></label><label>目标周期 周<input value={profile.targetWeeks} onChange={e=>update('targetWeeks',e.target.value)}/></label><label>半马 PB<input value={profile.halfMarathonPB} onChange={e=>update('halfMarathonPB',e.target.value)}/></label><label>每周训练天数<input value={profile.weeklyTrainingDays} onChange={e=>update('weeklyTrainingDays',e.target.value)}/></label><label>每周跑步次数<input value={profile.weeklyRuns} onChange={e=>update('weeklyRuns',e.target.value)}/></label><label>每周力量次数<input value={profile.weeklyStrength} onChange={e=>update('weeklyStrength',e.target.value)}/></label><label className="full">跑步目标<input value={profile.runningGoal} onChange={e=>update('runningGoal',e.target.value)}/></label><label className="full">力量目标<input value={profile.strengthGoal} onChange={e=>update('strengthGoal',e.target.value)}/></label></div></section><section className="card"><h2>营养参考</h2><div className="alert success">按 85kg 估算，减脂期蛋白质建议约 136–187g/天。高强度跑和长跑日前不要过度低碳，否则会影响表现。</div><button className="btn danger" onClick={reset}>清空并恢复示例数据</button></section></>;
}

function List({ title, items, render }){
  return <section className="card"><h2>{title}</h2>{items.length ? [...items].sort((a,b)=>b.date.localeCompare(a.date)).map(render) : <div className="empty">暂无记录</div>}</section>;
}
function LogRow({ title, sub, onEdit, onDelete }){
  return <div className="row"><div><b>{title}</b><div className="meta">{sub}</div></div><div className="btns">{onEdit&&<button className="btn small" onClick={onEdit}>编辑</button>}{onDelete&&<button className="btn danger small" onClick={onDelete}>删除</button>}</div></div>;
}
