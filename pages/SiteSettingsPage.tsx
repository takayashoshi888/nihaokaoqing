import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';
import { UserData, SavedSite } from '../types';
import { PlusIcon, TrashIcon, EditIcon, CheckInIcon } from '../components/Icons';
import { toISODateString } from '../utils/helpers';

interface SiteSettingsPageProps {
  setActivePage: (page: string) => void;
  userData: UserData;
  setUserData: (data: UserData | null) => void;
  sites: SavedSite[];
  setSites: (sites: SavedSite[]) => void;
  onSwitchSite: (site: SavedSite) => void;
  onDeleteSite: (siteId: string) => void;
}

const SiteSettingsPage: React.FC<SiteSettingsPageProps> = ({
  setActivePage, userData, setUserData, sites, setSites,
  onSwitchSite, onDeleteSite,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(userData.name);
  const [editSiteName, setEditSiteName] = useState(userData.siteName);
  const [editError, setEditError] = useState('');
  const [newName, setNewName] = useState('');
  const [newSiteName, setNewSiteName] = useState('');
  const [newError, setNewError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSites = searchQuery
    ? sites.filter(
        (s) =>
          s.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : sites;

  const isCurrentSite = (site: SavedSite) =>
    site.name === userData.name && site.siteName === userData.siteName;

  // --- Edit Modal ---
  const handleOpenEdit = () => {
    setEditName(userData.name);
    setEditSiteName(userData.siteName);
    setEditError('');
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editName.trim() || !editSiteName.trim()) {
      setEditError('姓名和现场名称不能为空');
      return;
    }
    setUserData({ name: editName.trim(), siteName: editSiteName.trim() });
    // Update in sites list too
    setSites(
      sites.map((s) =>
        s.name === userData.name && s.siteName === userData.siteName
          ? { ...s, name: editName.trim(), siteName: editSiteName.trim() }
          : s,
      ),
    );
    setShowEditModal(false);
  };

  // --- Add Modal ---
  const handleOpenAdd = () => {
    setNewName('');
    setNewSiteName('');
    setNewError('');
    setShowAddModal(true);
  };

  const handleSaveNew = () => {
    if (!newName.trim() || !newSiteName.trim()) {
      setNewError('姓名和现场名称不能为空');
      return;
    }
    const exists = sites.some(
      (s) => s.name.trim() === newName.trim() && s.siteName.trim() === newSiteName.trim(),
    );
    if (exists) {
      setNewError('该现场已存在');
      return;
    }
    const newSite: SavedSite = {
      id: Date.now().toString(),
      name: newName.trim(),
      siteName: newSiteName.trim(),
      createdAt: toISODateString(new Date()),
    };
    setSites([newSite, ...sites]);
    setUserData({ name: newSite.name, siteName: newSite.siteName });
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col pb-16" style={{ backgroundColor: 'var(--theme-surface)' }}>
      <header className="page-header">
        <h1 className="page-title">现场设置</h1>
      </header>

      <main className="flex-grow p-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="快速查找现场 …"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Current Site Card */}
        <div className="card mb-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="badge-primary">当前使用中</span>
              </div>
              <p className="font-bold text-lg" style={{ color: 'var(--theme-foreground)' }}>{userData.siteName}</p>
              <p className="text-sm" style={{ color: 'var(--theme-muted)' }}>用户: {userData.name}</p>
            </div>
            <div className="flex space-x-1">
              <button onClick={handleOpenEdit} className="btn-ghost p-2" aria-label="编辑当前现场" style={{ color: 'var(--theme-primary-600)' }}>
                <EditIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* All Sites List */}
        {filteredSites.length > 0 ? (
          <div className="space-y-2">
            {filteredSites.map((site) => {
              const isActive = isCurrentSite(site);
              return (
                <div
                  key={site.id}
                  className={`card flex justify-between items-center ${isActive ? '' : ''}`}
                  style={isActive ? { borderColor: 'var(--theme-primary-300)', borderWidth: '1.5px' } : {}}
                >
                  <button
                    className="flex-1 text-left"
                    onClick={() => onSwitchSite(site)}
                  >
                    <p className="font-semibold" style={{ color: 'var(--theme-foreground)' }}>{site.siteName}</p>
                    <p className="text-xs" style={{ color: 'var(--theme-muted)' }}>
                      {site.name} · 创建于 {site.createdAt}
                    </p>
                  </button>
                  <div className="flex items-center gap-1">
                    {isActive && (
                      <span style={{ color: 'var(--theme-primary-600)' }}>
                        <CheckInIcon className="w-5 h-5" />
                      </span>
                    )}
                    <button
                      onClick={() => onDeleteSite(site.id)}
                      className="btn-ghost p-2 text-red-500 hover:text-red-600"
                      aria-label={`删除 ${site.siteName}`}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--theme-primary-50)' }}>
              <PlusIcon className="w-7 h-7" style={{ color: 'var(--theme-primary-400)', opacity: 0.4 }} />
            </div>
            <p className="text-base font-medium" style={{ color: 'var(--theme-muted)' }}>还没有添加任何现场</p>
            <p className="text-sm mt-1" style={{ color: 'var(--theme-muted)', opacity: 0.7 }}>点击右下角按钮添加新现场</p>
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={handleOpenAdd}
        className="btn-fab"
        aria-label="添加新现场"
      >
        <PlusIcon className="w-8 h-8" />
      </button>

      {/* --- Edit Modal --- */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>编辑用户信息</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--theme-foreground)' }}>姓名</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="input-field" placeholder="请输入您的姓名" autoFocus />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--theme-foreground)' }}>现场名称</label>
                <input type="text" value={editSiteName} onChange={(e) => setEditSiteName(e.target.value)} className="input-field" placeholder="请输入现场名称" />
              </div>
              {editError && <p className="text-red-500 text-sm bg-red-50 rounded-xl py-2 px-3">{editError}</p>}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="btn-ghost">取消</button>
              <button onClick={handleSaveEdit} className="btn-primary">保存</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Add Modal --- */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>添加新现场</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--theme-foreground)' }}>姓名</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="input-field" placeholder="请输入您的姓名" autoFocus />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--theme-foreground)' }}>现场名称</label>
                <input type="text" value={newSiteName} onChange={(e) => setNewSiteName(e.target.value)} className="input-field" placeholder="请输入新现场名称" />
              </div>
              {newError && <p className="text-red-500 text-sm bg-red-50 rounded-xl py-2 px-3">{newError}</p>}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="btn-ghost">取消</button>
              <button onClick={handleSaveNew} className="btn-primary">添加</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav activePage="home" setActivePage={setActivePage} />
    </div>
  );
};

export default SiteSettingsPage;
