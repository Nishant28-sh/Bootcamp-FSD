import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/axiosInstance';
import StatCards from '../components/StatCards';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeModal from '../components/EmployeeModal';
import DeleteModal from '../components/DeleteModal';

/* ── Toast Hook ──────────────────────────────────────────── */
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);
  return { toasts, add };
}

/* ── Icons map ───────────────────────────────────────────── */
const TOAST_ICON = { success: '✅', error: '❌', info: 'ℹ️' };

/* ─────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const [employees, setEmployees]     = useState([]);
  const [loading, setLoading]         = useState(true);

  // Modal state
  const [modalOpen, setModalOpen]     = useState(false);
  const [modalMode, setModalMode]     = useState('add'); // 'add' | 'edit'
  const [editTarget, setEditTarget]   = useState(null);

  const [delOpen, setDelOpen]         = useState(false);
  const [delTarget, setDelTarget]     = useState(null);

  const { toasts, add: toast }        = useToasts();

  /* ── Fetch employees ─────────────────────────────────── */
  const fetchEmployees = useCallback(async () => {
    try {
      const { data } = await api.get('/');
      setEmployees(data.data || []);
    } catch {
      toast('Failed to load employees. Is the backend running?', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  // Close modals on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') { setModalOpen(false); setDelOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* ── Add ──────────────────────────────────────────────── */
  function openAdd() {
    setModalMode('add');
    setEditTarget(null);
    setModalOpen(true);
  }

  /* ── Edit ─────────────────────────────────────────────── */
  function openEdit(emp) {
    setModalMode('edit');
    setEditTarget(emp);
    setModalOpen(true);
  }

  /* ── Save (add or edit) ───────────────────────────────── */
  async function handleSave(payload) {
    try {
      if (modalMode === 'add') {
        const { data } = await api.post('/', payload);
        setEmployees((prev) => [...prev, data.data]);
        toast('Employee added successfully!', 'success');
      } else {
        const { data } = await api.put(`/${editTarget.id}`, payload);
        setEmployees((prev) =>
          prev.map((e) => (e.id === editTarget.id ? data.data : e))
        );
        toast('Employee updated successfully!', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      toast(msg, 'error');
      throw err; // keep modal open
    }
  }

  /* ── Delete ───────────────────────────────────────────── */
  function openDelete(emp) {
    setDelTarget(emp);
    setDelOpen(true);
  }

  async function handleDelete() {
    try {
      await api.delete(`/${delTarget.id}`);
      setEmployees((prev) => prev.filter((e) => e.id !== delTarget.id));
      toast('Employee deleted successfully!', 'success');
      setDelOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Delete failed';
      toast(msg, 'error');
      throw err;
    }
  }

  /* ── Render ───────────────────────────────────────────── */
  return (
    <>
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-left">
          <h1 className="page-title">Employees</h1>
          <span className="route-chip">GET /employees</span>
        </div>
        <div className="topbar-right">
          <button className="btn btn-primary" onClick={openAdd}>
            ➕ Add Employee
          </button>
        </div>
      </header>

      {/* Page Body */}
      <main className="page-body">
        {loading ? (
          <div className="spinner-wrap">
            <div className="spinner" />
            <p className="spinner-text">Loading employees…</p>
          </div>
        ) : (
          <>
            <StatCards employees={employees} />
            <EmployeeTable
              employees={employees}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </>
        )}
      </main>

      {/* Modals */}
      <EmployeeModal
        isOpen={modalOpen}
        mode={modalMode}
        employee={editTarget}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <DeleteModal
        isOpen={delOpen}
        employee={delTarget}
        onClose={() => setDelOpen(false)}
        onConfirm={handleDelete}
      />

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{TOAST_ICON[t.type]}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </>
  );
}
