import { useState, useEffect, useRef } from "react";
import { getUsers, createUser, updateUser, deleteUser } from './api/users';

//   import { getUsers, createUser, updateUser, deleteUser } from './api/users';
const ROLES = ["Admin", "Developer", "Designer", "Manager", "Analyst"];
const AVATARS = ["🦊", "🐺", "🦁", "🐯", "🦅", "🦋", "🐉", "🦄"];

let _id = 4;
let _db = [
  { _id: "1", name: "Aria Voss",     email: "aria@nexus.io",    role: "Admin",     avatar: "🦄", createdAt: "2025-01-10" },
  { _id: "2", name: "Kai Renton",    email: "kai@nexus.io",     role: "Developer", avatar: "🐉", createdAt: "2025-01-14" },
  { _id: "3", name: "Zara Osei",     email: "zara@nexus.io",    role: "Designer",  avatar: "🦋", createdAt: "2025-02-01" },
];


const api = {
  getUsers:   ()        => getUsers().then(res => res.data),
  createUser: (data)    => createUser(data).then(res => res.data),
  updateUser: (id, data)=> updateUser(id, data).then(res => res.data),
  deleteUser: (id)      => deleteUser(id).then(res => res.data),
};
// ─────────────────────────────────────────────────────────────────────────────

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #080b0f;
    --surface:  #0f1419;
    --border:   #1e2832;
    --amber:    #f0a500;
    --amber-dim:#7a5200;
    --red:      #ff3b3b;
    --green:    #00e5a0;
    --text:     #c8d4e0;
    --muted:    #4a5a6a;
    --white:    #eef2f7;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; }

  .scanline {
    position: fixed; inset: 0; pointer-events: none; z-index: 999;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
  }

  .shell {
    max-width: 1280px; margin: 0 auto; padding: 0 24px 80px;
  }

  /* ── HEADER ── */
  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 28px 0 24px;
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .header-brand { display: flex; align-items: baseline; gap: 12px; }
  .header-logo { font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: var(--amber); letter-spacing: 3px; line-height: 1; }
  .header-sub { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; }
  .header-meta { display: flex; align-items: center; gap: 16px; }
  .badge-count {
    font-family: 'Space Mono', monospace; font-size: 11px; color: var(--amber);
    border: 1px solid var(--amber-dim); padding: 4px 10px; border-radius: 2px;
    background: rgba(240,165,0,0.06);
  }
  .btn-add {
    font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 1px;
    background: var(--amber); color: #000; border: none; padding: 9px 18px;
    cursor: pointer; font-weight: 700; text-transform: uppercase;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
    transition: all 0.15s;
  }
  .btn-add:hover { background: #ffc23e; transform: scale(1.03); }

  /* ── STATS BAR ── */
  .stats-bar {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
    background: var(--border); margin: 24px 0;
    border: 1px solid var(--border);
  }
  .stat-cell {
    background: var(--surface); padding: 16px 20px;
    display: flex; flex-direction: column; gap: 4px;
  }
  .stat-label { font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
  .stat-value { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--white); letter-spacing: 1px; }
  .stat-value.amber { color: var(--amber); }
  .stat-value.green { color: var(--green); }

  /* ── SEARCH ── */
  .toolbar { display: flex; gap: 12px; margin-bottom: 20px; }
  .search-wrap { flex: 1; position: relative; }
  .search-wrap::before {
    content: '⌕'; position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    font-size: 18px; color: var(--muted); pointer-events: none;
  }
  .search-input {
    width: 100%; background: var(--surface); border: 1px solid var(--border);
    color: var(--white); padding: 10px 12px 10px 36px;
    font-family: 'Space Mono', monospace; font-size: 12px;
    outline: none; transition: border-color 0.2s;
  }
  .search-input:focus { border-color: var(--amber-dim); }
  .search-input::placeholder { color: var(--muted); }
  .filter-select {
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text); padding: 10px 16px;
    font-family: 'Space Mono', monospace; font-size: 11px;
    outline: none; cursor: pointer;
  }
  .filter-select:focus { border-color: var(--amber-dim); }

  /* ── TABLE ── */
  .table-wrap { border: 1px solid var(--border); overflow: hidden; }
  .table-head {
    display: grid; grid-template-columns: 56px 1fr 1fr 120px 110px 100px;
    background: var(--surface); border-bottom: 1px solid var(--border);
    padding: 0;
  }
  .th {
    font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 2px;
    color: var(--muted); text-transform: uppercase; padding: 12px 16px;
    border-right: 1px solid var(--border);
  }
  .th:last-child { border-right: none; }

  .user-row {
    display: grid; grid-template-columns: 56px 1fr 1fr 120px 110px 100px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    transition: background 0.15s;
    animation: rowIn 0.3s ease both;
  }
  .user-row:last-child { border-bottom: none; }
  .user-row:hover { background: #131d27; }
  @keyframes rowIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .td { padding: 14px 16px; display: flex; align-items: center; border-right: 1px solid var(--border); overflow: hidden; }
  .td:last-child { border-right: none; }

  .avatar-cell { justify-content: center; font-size: 22px; }
  .user-name { font-weight: 500; color: var(--white); font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-email { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .role-badge {
    font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 1px;
    padding: 3px 8px; text-transform: uppercase; border-radius: 2px;
  }
  .role-Admin     { background: rgba(240,165,0,0.12);  color: var(--amber); border: 1px solid var(--amber-dim); }
  .role-Developer { background: rgba(0,229,160,0.08);  color: var(--green); border: 1px solid rgba(0,229,160,0.3); }
  .role-Designer  { background: rgba(130,80,255,0.1);  color: #a070ff;      border: 1px solid rgba(130,80,255,0.3); }
  .role-Manager   { background: rgba(255,100,100,0.1); color: #ff8080;      border: 1px solid rgba(255,100,100,0.3); }
  .role-Analyst   { background: rgba(80,160,255,0.1);  color: #80b4ff;      border: 1px solid rgba(80,160,255,0.3); }

  .date-mono { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--muted); }

  .action-btn {
    background: none; border: none; cursor: pointer; padding: 6px 8px;
    font-size: 14px; opacity: 0.5; transition: opacity 0.15s, transform 0.15s;
    border-radius: 2px;
  }
  .action-btn:hover { opacity: 1; transform: scale(1.2); }
  .action-btn.delete:hover { background: rgba(255,59,59,0.15); }
  .action-btn.edit:hover   { background: rgba(240,165,0,0.15); }

  /* ── EMPTY STATE ── */
  .empty-state {
    text-align: center; padding: 64px 24px;
    background: var(--surface); border: 1px solid var(--border);
  }
  .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.3; }
  .empty-text { font-family: 'Space Mono', monospace; font-size: 12px; color: var(--muted); }

  /* ── MODAL OVERLAY ── */
  .overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 100;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal {
    background: var(--surface); border: 1px solid var(--amber-dim);
    width: 100%; max-width: 480px; padding: 0;
    box-shadow: 0 0 60px rgba(240,165,0,0.1);
    animation: slideUp 0.2s ease;
  }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 24px; border-bottom: 1px solid var(--border);
    background: rgba(240,165,0,0.04);
  }
  .modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: var(--amber); letter-spacing: 2px; }
  .modal-close { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 20px; line-height: 1; transition: color 0.15s; }
  .modal-close:hover { color: var(--red); }

  .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; }

  .avatar-picker { display: flex; gap: 10px; flex-wrap: wrap; }
  .avatar-opt {
    font-size: 24px; padding: 8px 10px; cursor: pointer; border: 1px solid transparent;
    background: var(--bg); border-radius: 4px; transition: all 0.15s; line-height: 1;
  }
  .avatar-opt:hover   { border-color: var(--amber-dim); }
  .avatar-opt.selected { border-color: var(--amber); background: rgba(240,165,0,0.1); }

  .field { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
  .field-input, .field-select {
    background: var(--bg); border: 1px solid var(--border);
    color: var(--white); padding: 10px 12px;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    outline: none; transition: border-color 0.2s; width: 100%;
  }
  .field-input:focus, .field-select:focus { border-color: var(--amber); }
  .field-input::placeholder { color: var(--muted); }

  .modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 10px; justify-content: flex-end; }
  .btn-cancel {
    font-family: 'Space Mono', monospace; font-size: 11px;
    background: none; border: 1px solid var(--border); color: var(--muted);
    padding: 9px 18px; cursor: pointer; transition: all 0.15s; text-transform: uppercase;
  }
  .btn-cancel:hover { border-color: var(--text); color: var(--text); }
  .btn-save {
    font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 1px;
    background: var(--amber); color: #000; border: none;
    padding: 9px 22px; cursor: pointer; font-weight: 700; text-transform: uppercase;
    transition: all 0.15s;
    clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
  }
  .btn-save:hover { background: #ffc23e; }

  /* ── TOAST ── */
  .toast {
    position: fixed; bottom: 32px; right: 32px; z-index: 200;
    font-family: 'Space Mono', monospace; font-size: 11px;
    padding: 12px 20px; border-left: 3px solid var(--green);
    background: var(--surface); color: var(--white);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: toastIn 0.3s ease;
  }
  @keyframes toastIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .toast.error { border-left-color: var(--red); }

  /* ── CONFIRM ── */
  .confirm-modal {
    background: var(--surface); border: 1px solid var(--red);
    width: 100%; max-width: 360px; padding: 28px;
    box-shadow: 0 0 40px rgba(255,59,59,0.15);
    animation: slideUp 0.2s ease;
    text-align: center;
  }
  .confirm-title { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--red); margin-bottom: 10px; letter-spacing: 2px; }
  .confirm-text  { font-size: 13px; color: var(--muted); margin-bottom: 24px; line-height: 1.6; }
  .confirm-btns  { display: flex; gap: 10px; justify-content: center; }
  .btn-danger {
    font-family: 'Space Mono', monospace; font-size: 11px;
    background: var(--red); color: #fff; border: none;
    padding: 9px 22px; cursor: pointer; font-weight: 700; text-transform: uppercase;
    transition: all 0.15s;
  }
  .btn-danger:hover { background: #ff6b6b; }
`;

const EMPTY_FORM = { name: "", email: "", role: "Developer", avatar: "🦊" };

export default function App() {
  const [users, setUsers]         = useState([]);
  const [search, setSearch]       = useState("");
  const [roleFilter, setFilter]   = useState("All");
  const [modal, setModal]         = useState(null);   // null | 'add' | 'edit'
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editId, setEditId]       = useState(null);
  const [confirm, setConfirm]     = useState(null);   // userId to delete
  const [toast, setToast]         = useState(null);
  const toastTimer                = useRef(null);

  // ── Fetch on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    api.getUsers().then(setUsers);
  }, []);

  // ── Toast helper ────────────────────────────────────────────────────────────
  const showToast = (msg, type = "ok") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  // ── Derived data ────────────────────────────────────────────────────────────
  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole   = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleCounts = ROLES.reduce((acc, r) => {
    acc[r] = users.filter(u => u.role === r).length;
    return acc;
  }, {});

  const topRole = ROLES.reduce((a, b) => roleCounts[a] >= roleCounts[b] ? a : b, ROLES[0]);

  // ── CRUD handlers ───────────────────────────────────────────────────────────
  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setModal("form"); };
  const openEdit = (u) => { setForm({ name: u.name, email: u.email, role: u.role, avatar: u.avatar }); setEditId(u._id); setModal("form"); };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) { showToast("Name & email required", "error"); return; }
    if (editId) {
      const updated = await api.updateUser(editId, form);
      setUsers(us => us.map(u => u._id === editId ? updated : u));
      showToast("User updated ✓");
    } else {
      const created = await api.createUser(form);
      setUsers(us => [...us, created]);
      showToast("User created ✓");
    }
    setModal(null);
  };

  const handleDelete = async () => {
    await api.deleteUser(confirm);
    setUsers(us => us.filter(u => u._id !== confirm));
    setConfirm(null);
    showToast("User removed");
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="scanline" />

      <div className="shell">
        {/* ── HEADER ──────────────────────────────────────────── */}
        <header className="header">
          <div className="header-brand">
            <span className="header-logo">NEXUS</span>
            <span className="header-sub">User Management System v2.0</span>
          </div>
          <div className="header-meta">
            <span className="badge-count">[ {users.length} RECORDS ]</span>
            <button className="btn-add" onClick={openAdd}>+ Add User</button>
          </div>
        </header>

        {/* ── STATS ───────────────────────────────────────────── */}
        <div className="stats-bar">
          <div className="stat-cell">
            <span className="stat-label">Total Users</span>
            <span className="stat-value amber">{users.length}</span>
          </div>
          <div className="stat-cell">
            <span className="stat-label">Roles Active</span>
            <span className="stat-value">{ROLES.filter(r => roleCounts[r] > 0).length}</span>
          </div>
          <div className="stat-cell">
            <span className="stat-label">Top Role</span>
            <span className="stat-value green" style={{fontSize:20, paddingTop:4}}>{topRole}</span>
          </div>
          <div className="stat-cell">
            <span className="stat-label">Showing</span>
            <span className="stat-value">{filtered.length}</span>
          </div>
        </div>

        {/* ── TOOLBAR ─────────────────────────────────────────── */}
        <div className="toolbar">
          <div className="search-wrap">
            <input
              className="search-input"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="filter-select" value={roleFilter} onChange={e => setFilter(e.target.value)}>
            <option value="All">All Roles</option>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        {/* ── TABLE ───────────────────────────────────────────── */}
        <div className="table-wrap">
          <div className="table-head">
            {["AVT", "Name", "Email", "Role", "Joined", "Actions"].map(h => (
              <div key={h} className="th">{h}</div>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⬡</div>
              <div className="empty-text">NO RECORDS MATCH YOUR QUERY</div>
            </div>
          ) : (
            filtered.map(u => (
              <div key={u._id} className="user-row">
                <div className="td avatar-cell">{u.avatar}</div>
                <div className="td"><span className="user-name">{u.name}</span></div>
                <div className="td"><span className="user-email">{u.email}</span></div>
                <div className="td">
                  <span className={`role-badge role-${u.role}`}>{u.role}</span>
                </div>
                <div className="td"><span className="date-mono">{u.createdAt?.slice(0,10)}</span></div>
                <div className="td" style={{gap:4}}>
                  <button className="action-btn edit"  onClick={() => openEdit(u)} title="Edit">✎</button>
                  <button className="action-btn delete" onClick={() => setConfirm(u._id)} title="Delete">✕</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── FORM MODAL ──────────────────────────────────────────── */}
      {modal === "form" && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editId ? "Edit User" : "New User"}</span>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="field">
                <span className="field-label">Avatar</span>
                <div className="avatar-picker">
                  {AVATARS.map(a => (
                    <span key={a} className={`avatar-opt${form.avatar === a ? " selected" : ""}`} onClick={() => setForm(f => ({ ...f, avatar: a }))}>{a}</span>
                  ))}
                </div>
              </div>
              <div className="field">
                <span className="field-label">Name</span>
                <input className="field-input" placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="field">
                <span className="field-label">Email</span>
                <input className="field-input" placeholder="email@domain.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="field">
                <span className="field-label">Role</span>
                <select className="field-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn-save"   onClick={handleSave}>{editId ? "Save Changes" : "Create User"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE ──────────────────────────────────────── */}
      {confirm && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setConfirm(null)}>
          <div className="confirm-modal">
            <div className="confirm-title">⚠ Confirm Delete</div>
            <p className="confirm-text">This record will be permanently removed from the system. This action cannot be undone.</p>
            <div className="confirm-btns">
              <button className="btn-cancel" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ───────────────────────────────────────────────── */}
      {toast && <div className={`toast${toast.type === "error" ? " error" : ""}`}>{toast.msg}</div>}
    </>
  );
}
