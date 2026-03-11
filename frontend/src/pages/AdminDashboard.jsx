import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API = "https://dheeraj-portfolio.onrender.com";

// ─── tiny helpers ────────────────────────────────────────────────────────────
const authH = (token) => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" });

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div
      className={`admin-toast ${type}`}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
    >
      {type === "success" ? "✅" : "❌"} {msg}
    </motion.div>
  );
}

function ConfirmModal({ msg, onConfirm, onCancel }) {
  return (
    <div className="admin-modal-backdrop">
      <motion.div className="admin-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <p className="admin-modal-msg">⚠️ {msg}</p>
        <div className="admin-modal-btns">
          <button className="admin-action-btn delete" onClick={onConfirm}>Yes, delete</button>
          <button className="admin-action-btn reply" onClick={onCancel}>Cancel</button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Drag-to-reorder list ────────────────────────────────────────────────────
function SortableList({ items, renderItem, onReorder }) {
  const [list, setList]     = useState(items);
  const [dragIdx, setDrag]  = useState(null);

  useEffect(() => setList(items), [items]);

  const onDragStart = (i) => setDrag(i);
  const onDragOver  = (e, i) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    const next = [...list];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(i, 0, moved);
    setDrag(i);
    setList(next);
  };
  const onDrop = () => {
    setDrag(null);
    onReorder(list.map((item, idx) => ({ id: item._id, order: idx })));
  };

  return (
    <div className="admin-sortable">
      {list.map((item, i) => (
        <div
          key={item._id}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragOver={(e) => onDragOver(e, i)}
          onDrop={onDrop}
          className={`admin-sortable-row ${dragIdx === i ? "dragging" : ""}`}
        >
          <span className="drag-handle">⠿</span>
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MESSAGES TAB
// ═══════════════════════════════════════════════════════════════════
function MessagesTab({ token, toast }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState("all");
  const [confirm, setConfirm]   = useState(null);

  useEffect(() => {
    fetch(`${API}/api/admin/messages`, { headers: authH(token) })
      .then(r => r.json()).then(setMessages).finally(() => setLoading(false));
  }, [token]);

  const markRead = async (id) => {
    await fetch(`${API}/api/admin/messages/${id}/read`, { method: "PATCH", headers: authH(token) });
    setMessages(p => p.map(m => m._id === id ? { ...m, read: true } : m));
  };

  const del = async (id) => {
    await fetch(`${API}/api/admin/messages/${id}`, { method: "DELETE", headers: authH(token) });
    setMessages(p => p.filter(m => m._id !== id));
    if (selected?._id === id) setSelected(null);
    toast("Message deleted", "success");
    setConfirm(null);
  };

  const open = (msg) => { setSelected(msg); if (!msg.read) markRead(msg._id); };
  const unread = messages.filter(m => !m.read).length;
  const filtered = messages.filter(m => filter === "all" ? true : filter === "unread" ? !m.read : m.read);

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /><p>Loading...</p></div>;

  return (
    <>
      {confirm && <ConfirmModal msg="Delete this message?" onConfirm={() => del(confirm)} onCancel={() => setConfirm(null)} />}
      <div className="admin-tab-header">
        <div>
          <h1 className="admin-header-title">Messages</h1>
          <p className="admin-header-sub">{messages.length} total · {unread} unread</p>
        </div>
        <div className="admin-filter-tabs">
          {["all","unread","read"].map(f => (
            <button key={f} className={`admin-filter-tab ${filter===f?"active":""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty"><p className="admin-empty-icon">📭</p><p>No messages</p></div>
      ) : (
        <div className="admin-content">
          <div className="admin-list">
            <AnimatePresence>
              {filtered.map(msg => (
                <motion.div key={msg._id} className={`admin-msg-row ${selected?._id===msg._id?"active":""} ${!msg.read?"unread":""}`}
                  onClick={() => open(msg)} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0 }} layout>
                  <div className="admin-msg-avatar">{msg.name.charAt(0).toUpperCase()}</div>
                  <div className="admin-msg-info">
                    <div className="admin-msg-top">
                      <span className="admin-msg-name">{!msg.read && <span className="admin-unread-dot"/>}{msg.name}</span>
                      <span className="admin-msg-date">{new Date(msg.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</span>
                    </div>
                    <p className="admin-msg-email">{msg.email}</p>
                    <p className="admin-msg-preview">{msg.message.slice(0,60)}{msg.message.length>60?"...":""}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="admin-detail">
            {selected ? (
              <motion.div key={selected._id} initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} className="admin-detail-inner">
                <div className="admin-detail-header">
                  <div className="admin-detail-avatar">{selected.name.charAt(0).toUpperCase()}</div>
                  <div><h2 className="admin-detail-name">{selected.name}</h2>
                    <a href={`mailto:${selected.email}`} className="admin-detail-email">{selected.email}</a></div>
                  <span className="admin-detail-date">{new Date(selected.createdAt).toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
                </div>
                <div className="admin-detail-body">
                  <p className="admin-detail-label">MESSAGE</p>
                  <div className="admin-detail-message">{selected.message}</div>
                </div>
                <div className="admin-detail-actions">
                  <a href={`mailto:${selected.email}?subject=Re: Your message`} className="admin-action-btn reply">📧 Reply</a>
                  <button className="admin-action-btn delete" onClick={() => setConfirm(selected._id)}>🗑️ Delete</button>
                </div>
              </motion.div>
            ) : (
              <div className="admin-detail-empty"><p className="admin-detail-empty-icon">👈</p><p>Select a message</p></div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  GENERIC CRUD TAB (Projects / Experience / Certs / Skills)
// ═══════════════════════════════════════════════════════════════════
function CrudTab({ token, toast, config }) {
  const { endpoint, label, icon, renderCard, FormComponent, emptyIcon } = config;

  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);   // null=closed, {}=new, item=edit
  const [confirm, setConfirm] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch(`${API}/api/admin/${endpoint}`, { headers: authH(token) });
    setItems(await r.json());
    setLoading(false);
  }, [endpoint, token]);

  useEffect(() => { load(); }, [load]);

  const save = async (data) => {
    const isNew = !data._id;
    const url   = isNew ? `${API}/api/admin/${endpoint}` : `${API}/api/admin/${endpoint}/${data._id}`;
    const method = isNew ? "POST" : "PUT";
    const r = await fetch(url, { method, headers: authH(token), body: JSON.stringify(data) });
    if (r.ok) { toast(`${label} ${isNew?"added":"updated"}`, "success"); load(); setEditing(null); }
    else { const e = await r.json(); toast(e.error || "Error", "error"); }
  };

  const del = async (id) => {
    await fetch(`${API}/api/admin/${endpoint}/${id}`, { method: "DELETE", headers: authH(token) });
    toast(`${label} deleted`, "success");
    setConfirm(null);
    load();
  };

  const reorder = async (ordered) => {
    await fetch(`${API}/api/admin/${endpoint}/reorder`, { method: "PATCH", headers: authH(token), body: JSON.stringify(ordered) });
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner"/><p>Loading...</p></div>;

  return (
    <>
      {confirm && <ConfirmModal msg={`Delete this ${label.toLowerCase()}?`} onConfirm={() => del(confirm)} onCancel={() => setConfirm(null)} />}
      {editing !== null && (
        <FormComponent
          initial={editing}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}

      <div className="admin-tab-header">
        <div>
          <h1 className="admin-header-title">{icon} {label}s</h1>
          <p className="admin-header-sub">{items.length} items · drag to reorder</p>
        </div>
        <button className="admin-add-btn" onClick={() => setEditing({})}>+ Add {label}</button>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty"><p className="admin-empty-icon">{emptyIcon}</p><p>No {label.toLowerCase()}s yet</p></div>
      ) : (
        <div className="admin-crud-list">
          <SortableList
            items={items}
            onReorder={reorder}
            renderItem={(item) => (
              <div className="admin-crud-card-inner">
                {renderCard(item)}
                <div className="admin-crud-actions">
                  <button className="admin-action-btn reply" onClick={() => setEditing(item)}>✏️ Edit</button>
                  <button className="admin-action-btn delete" onClick={() => setConfirm(item._id)}>🗑️</button>
                </div>
              </div>
            )}
          />
        </div>
      )}
    </>
  );
}

// ─── Project Form ─────────────────────────────────────────────────────────────
function ProjectForm({ initial, onSave, onClose }) {
  const [d, setD] = useState(() => ({ title:"", type:"", desc:"", color:"#00f5c4", icon:"🚀", ...initial, tags: (initial.tags||[]).join(", ") }));
  const submit = (e) => { e.preventDefault(); onSave({ ...d, tags: d.tags.split(",").map(t=>t.trim()).filter(Boolean) }); };
  return (
    <FormModal title={d._id?"Edit Project":"Add Project"} onClose={onClose} onSubmit={submit}>
      <FormRow label="Title"><input value={d.title} onChange={e=>setD({...d,title:e.target.value})} required/></FormRow>
      <FormRow label="Type (e.g. Machine Learning)"><input value={d.type} onChange={e=>setD({...d,type:e.target.value})} required/></FormRow>
      <FormRow label="Description"><textarea value={d.desc} onChange={e=>setD({...d,desc:e.target.value})} required/></FormRow>
      <FormRow label="Tags (comma separated)"><input value={d.tags} onChange={e=>setD({...d,tags:e.target.value})} placeholder="Python, React, SQL"/></FormRow>
      <FormRow label="Icon (emoji)"><input value={d.icon} onChange={e=>setD({...d,icon:e.target.value})} style={{width:80}}/></FormRow>
      <FormRow label="Accent Color"><input type="color" value={d.color} onChange={e=>setD({...d,color:e.target.value})} style={{width:60,height:36,padding:2}}/></FormRow>
    </FormModal>
  );
}

// ─── Experience Form ──────────────────────────────────────────────────────────
function ExperienceForm({ initial, onSave, onClose }) {
  const [d, setD] = useState({ year:"", title:"", org:"", desc:"", icon:"💼", ...initial });
  const submit = (e) => { e.preventDefault(); onSave(d); };
  return (
    <FormModal title={d._id?"Edit Experience":"Add Experience"} onClose={onClose} onSubmit={submit}>
      <FormRow label="Period (e.g. Jan 2024 - Mar 2024)"><input value={d.year} onChange={e=>setD({...d,year:e.target.value})} required/></FormRow>
      <FormRow label="Title"><input value={d.title} onChange={e=>setD({...d,title:e.target.value})} required/></FormRow>
      <FormRow label="Organisation"><input value={d.org} onChange={e=>setD({...d,org:e.target.value})} required/></FormRow>
      <FormRow label="Description"><textarea value={d.desc} onChange={e=>setD({...d,desc:e.target.value})} required/></FormRow>
      <FormRow label="Icon (emoji)"><input value={d.icon} onChange={e=>setD({...d,icon:e.target.value})} style={{width:80}}/></FormRow>
    </FormModal>
  );
}

// ─── Cert Form ────────────────────────────────────────────────────────────────
function CertForm({ initial, onSave, onClose }) {
  const [d, setD] = useState(() => ({ title:"", issuer:"", date:"", link:"", ...initial, tags:(initial.tags||[]).join(", ") }));
  const submit = (e) => { e.preventDefault(); onSave({ ...d, tags: d.tags.split(",").map(t=>t.trim()).filter(Boolean) }); };
  return (
    <FormModal title={d._id?"Edit Certification":"Add Certification"} onClose={onClose} onSubmit={submit}>
      <FormRow label="Title"><input value={d.title} onChange={e=>setD({...d,title:e.target.value})} required/></FormRow>
      <FormRow label="Issuer"><input value={d.issuer} onChange={e=>setD({...d,issuer:e.target.value})} required/></FormRow>
      <FormRow label="Date (e.g. Nov 2024)"><input value={d.date} onChange={e=>setD({...d,date:e.target.value})} required/></FormRow>
      <FormRow label="Credential URL"><input value={d.link} onChange={e=>setD({...d,link:e.target.value})} placeholder="https://..."/></FormRow>
      <FormRow label="Tags (comma separated)"><input value={d.tags} onChange={e=>setD({...d,tags:e.target.value})} placeholder="Python, SQL"/></FormRow>
    </FormModal>
  );
}

// ─── Skill Form ───────────────────────────────────────────────────────────────
const CATEGORIES = ["Data Science", "Data Engineering", "Data Analytics", "Development"];
function SkillForm({ initial, onSave, onClose }) {
  const [d, setD] = useState({ category:"Data Science", name:"", level:75, ...initial });
  const submit = (e) => { e.preventDefault(); onSave(d); };
  return (
    <FormModal title={d._id?"Edit Skill":"Add Skill"} onClose={onClose} onSubmit={submit}>
      <FormRow label="Category">
        <select value={d.category} onChange={e=>setD({...d,category:e.target.value})} className="admin-select">
          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </select>
      </FormRow>
      <FormRow label="Skill Name"><input value={d.name} onChange={e=>setD({...d,name:e.target.value})} required/></FormRow>
      <FormRow label={`Level: ${d.level}%`}>
        <input type="range" min="0" max="100" value={d.level} onChange={e=>setD({...d,level:+e.target.value})} style={{width:"100%",accentColor:"#00f5c4"}}/>
      </FormRow>
    </FormModal>
  );
}

// ─── Shared form modal shell ──────────────────────────────────────────────────
function FormModal({ title, onClose, onSubmit, children }) {
  return (
    <div className="admin-modal-backdrop">
      <motion.div className="admin-modal admin-form-modal" initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">{title}</h2>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={onSubmit} className="admin-form-body">
          {children}
          <div className="admin-form-footer">
            <button type="submit" className="admin-action-btn reply">💾 Save</button>
            <button type="button" className="admin-action-btn delete" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function FormRow({ label, children }) {
  return (
    <div className="admin-form-row">
      <label className="admin-form-label">{label}</label>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════
const TABS = [
  { id: "messages",   label: "Messages",       icon: "📬" },
  { id: "projects",   label: "Projects",       icon: "🚀" },
  { id: "experience", label: "Experience",     icon: "💼" },
  { id: "certs",      label: "Certifications", icon: "📜" },
  { id: "skills",     label: "Skills",         icon: "🧠" },
];

export default function AdminDashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState("messages");
  const [toasts,    setToasts]    = useState([]);
  const [unreadCount, setUnread]  = useState(0);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/admin/messages`, { headers: authH(token) })
      .then(r => r.json()).then(d => setUnread(d.filter(m => !m.read).length)).catch(() => {});
  }, [token, activeTab]);

  const toast = (msg, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  };

  const CRUD_CONFIGS = {
    projects: {
      endpoint: "projects", label: "Project", icon: "🚀", emptyIcon: "🗂️",
      renderCard: (item) => (
        <div className="admin-card-info">
          <span className="admin-card-icon">{item.icon}</span>
          <div>
            <p className="admin-card-title">{item.title}</p>
            <p className="admin-card-sub" style={{ color: item.color }}>{item.type}</p>
            <p className="admin-card-tags">{(item.tags||[]).join(" · ")}</p>
          </div>
        </div>
      ),
      FormComponent: ProjectForm,
    },
    experience: {
      endpoint: "experience", label: "Experience", icon: "💼", emptyIcon: "🗓️",
      renderCard: (item) => (
        <div className="admin-card-info">
          <span className="admin-card-icon">{item.icon}</span>
          <div>
            <p className="admin-card-title">{item.title}</p>
            <p className="admin-card-sub">{item.org}</p>
            <p className="admin-card-tags">{item.year}</p>
          </div>
        </div>
      ),
      FormComponent: ExperienceForm,
    },
    certs: {
      endpoint: "certs", label: "Certification", icon: "📜", emptyIcon: "🏅",
      renderCard: (item) => (
        <div className="admin-card-info">
          <span className="admin-card-icon">🏅</span>
          <div>
            <p className="admin-card-title">{item.title}</p>
            <p className="admin-card-sub">{item.issuer}</p>
            <p className="admin-card-tags">{item.date}</p>
          </div>
        </div>
      ),
      FormComponent: CertForm,
    },
    skills: {
      endpoint: "skills", label: "Skill", icon: "🧠", emptyIcon: "📊",
      renderCard: (item) => (
        <div className="admin-card-info" style={{ flex: 1 }}>
          <div style={{ flex: 1 }}>
            <p className="admin-card-title">{item.name}</p>
            <p className="admin-card-sub">{item.category}</p>
            <div className="admin-skill-bar-wrap">
              <div className="admin-skill-bar" style={{ width: `${item.level}%` }} />
              <span className="admin-skill-pct">{item.level}%</span>
            </div>
          </div>
        </div>
      ),
      FormComponent: SkillForm,
    },
  };

  return (
    <div className="admin-dash">
      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${mobileNav ? "mobile-open" : ""}`}>
        <div className="admin-logo">
          <span className="admin-logo-icon">⚙️</span>
          <div>
            <p className="admin-logo-title">Admin Panel</p>
            <p className="admin-logo-sub">Dheeraj's Portfolio</p>
          </div>
        </div>

        <nav className="admin-nav">
          <p className="admin-nav-label">SECTIONS</p>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`admin-nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => { setActiveTab(tab.id); setMobileNav(false); }}
            >
              <span>{tab.icon}</span> {tab.label}
              {tab.id === "messages" && unreadCount > 0 && (
                <span className="admin-badge">{unreadCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={onLogout}>🚪 Logout</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="admin-main">
        {/* Mobile top bar */}
        <div className="admin-mobile-bar">
          <button className="admin-hamburger" onClick={() => setMobileNav(v => !v)}>☰</button>
          <span className="admin-mobile-title">
            {TABS.find(t => t.id === activeTab)?.icon} {TABS.find(t => t.id === activeTab)?.label}
          </span>
        </div>

        <div className="admin-tab-content">
          {activeTab === "messages" && <MessagesTab token={token} toast={toast} />}
          {activeTab !== "messages" && CRUD_CONFIGS[activeTab] && (
            <CrudTab token={token} toast={toast} config={CRUD_CONFIGS[activeTab]} />
          )}
        </div>
      </main>

      {/* Toast container */}
      <div className="admin-toast-container">
        <AnimatePresence>
          {toasts.map(t => (
            <Toast key={t.id} msg={t.msg} type={t.type} onClose={() => setToasts(p => p.filter(x => x.id !== t.id))} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}