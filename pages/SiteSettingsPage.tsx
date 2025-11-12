import React from 'react';
import BottomNav from '../components/BottomNav';
import { UserData } from '../types';
import { PlusIcon, SearchIcon, TrashIcon, EditIcon } from '../components/Icons';

interface SiteSettingsPageProps {
  setActivePage: (page: string) => void;
  userData: UserData;
  setUserData: (data: UserData) => void;
}

const SiteSettingsPage: React.FC<SiteSettingsPageProps> = ({ setActivePage, userData, setUserData }) => {
    
    const handleEdit = () => {
        const newName = prompt("请输入新的姓名:", userData.name);
        const newSiteName = prompt("请输入新的现场名称:", userData.siteName);
        if (newName && newName.trim() && newSiteName && newSiteName.trim()) {
            setUserData({ name: newName, siteName: newSiteName });
            alert("用户信息更新成功！")
        } else if (newName !== null || newSiteName !== null) {
            alert("姓名和现场名称不能为空。")
        }
    }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-16">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-center text-gray-800">现场设置</h1>
      </header>
      <main className="flex-grow p-4">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="快速查找现场" className="w-full pl-10 pr-4 py-2 border rounded-md" />
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-bold text-lg">{userData.siteName}</p>
                    <p className="text-sm text-gray-500">创建于: {new Date().toLocaleDateString('zh-CN')}</p>
                    <p className="text-sm text-gray-500">用户: {userData.name}</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={handleEdit} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full" aria-label="编辑"><EditIcon /></button>
                    <button onClick={() => alert("删除功能暂未开放")} className="p-2 text-red-600 hover:bg-red-100 rounded-full" aria-label="删除"><TrashIcon /></button>
                </div>
            </div>
        </div>

      </main>
       <button onClick={() => alert("添加新现场功能暂未开放")} className="fixed bottom-20 right-5 bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors" aria-label="添加现场">
            <PlusIcon className="w-8 h-8"/>
        </button>
      <BottomNav activePage="home" setActivePage={setActivePage} />
    </div>
  );
};

export default SiteSettingsPage;
