import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';
import { UserData } from '../types';
import { PlusIcon, SearchIcon, TrashIcon, EditIcon } from '../components/Icons';

interface SiteSettingsPageProps {
  setActivePage: (page: string) => void;
  userData: UserData;
  setUserData: (data: UserData) => void;
}

const SiteSettingsPage: React.FC<SiteSettingsPageProps> = ({ setActivePage, userData, setUserData }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(userData.name);
  const [editSiteName, setEditSiteName] = useState(userData.siteName);
  const [editError, setEditError] = useState('');

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
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-16">
      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-title">现场设置</h1>
      </header>

      <main className="flex-grow p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="快速查找现场" className="input-field pl-10" />
        </div>

        {/* Site Info Card */}
        <div className="card">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="badge-primary">当前现场</span>
              </div>
              <p className="text-lg font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {userData.siteName}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                创建于: {new Date().toLocaleDateString('zh-CN')}
              </p>
              <p className="text-sm text-gray-400">
                用户: {userData.name}
              </p>
            </div>
            <div className="flex space-x-1 shrink-0">
              <button
                onClick={handleOpenEdit}
                className="btn-ghost p-2"
                style={{ color: 'var(--theme-primary-600)' }}
                aria-label="编辑"
              >
                <EditIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => alert("删除功能暂未开放")}
                className="btn-ghost p-2 text-red-500 hover:text-red-600"
                aria-label="删除"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="card mt-4 flex flex-col items-center justify-center py-10 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--theme-primary-50)' }}>
            <PlusIcon className="w-7 h-7" style={{ color: 'var(--theme-primary-400)', opacity: 0.4 }} />
          </div>
          <p className="text-gray-400 text-sm">暂无其他现场</p>
          <p className="text-gray-300 text-xs mt-1">点击右下角 + 按钮添加新现场</p>
        </div>
      </main>

      {/* FAB Button */}
      <button
        onClick={() => alert("添加新现场功能暂未开放")}
        className="btn-fab"
        aria-label="添加现场"
      >
        <PlusIcon className="w-6 h-6" />
      </button>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-800 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              编辑用户信息
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">姓名</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="input-field"
                  placeholder="请输入您的姓名"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">现场名称</label>
                <input
                  type="text"
                  value={editSiteName}
                  onChange={(e) => setEditSiteName(e.target.value)}
                  className="input-field"
                  placeholder="请输入现场名称"
                />
              </div>
              {editError && (
                <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{editError}</p>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowEditModal(false)} className="btn-ghost">取消</button>
              <button onClick={handleSaveEdit} className="btn-primary">保存</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav activePage="home" setActivePage={setActivePage} />
    </div>
  );
};

export default SiteSettingsPage;
