import React, { useState, useEffect } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import Auth from './components/Auth';
import WorkspaceSelector from './components/WorkspaceSelector';
import WorkspaceManager from './components/WorkspaceManager';
import './App.css';
import { onAuthStateChange, logout } from './firebase/authService';
import {
  createTodo,
  subscribeToWorkspaceTodos,
  toggleTodoComplete,
  deleteTodo as deleteTodoFromFirebase,
  updateTodo
} from './firebase/todoService';
import { getWorkspaceMembers } from './firebase/workspaceService';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState(null);
  const [todos, setTodos] = useState([]);
  const [showWorkspaceManager, setShowWorkspaceManager] = useState(false);
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  // 인증 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
      if (!user) {
        setWorkspace(null);
        setTodos([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // 워크스페이스 선택 시 Todo 실시간 구독
  useEffect(() => {
    if (!workspace) return;

    const unsubscribe = subscribeToWorkspaceTodos(workspace.id, (todos) => {
      setTodos(todos);
    });

    loadWorkspaceMembers();

    return () => unsubscribe();
  }, [workspace]);

  const loadWorkspaceMembers = async () => {
    if (!workspace) return;
    const result = await getWorkspaceMembers(workspace.id);
    if (result.success) {
      setWorkspaceMembers(result.members);
    }
  };

  const handleAuthSuccess = (user) => {
    setUser(user);
  };

  const handleWorkspaceSelect = (selectedWorkspace) => {
    setWorkspace(selectedWorkspace);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setUser(null);
      setWorkspace(null);
      setTodos([]);
    }
  };

  const handleAddTodo = async (todoData) => {
    if (!workspace || !user) {
      console.error('워크스페이스 또는 사용자 정보가 없습니다:', { workspace, user });
      return;
    }

    console.log('할 일 추가 시도:', todoData);
    console.log('현재 워크스페이스:', workspace);
    console.log('현재 사용자:', user);

    try {
      const result = await createTodo(workspace.id, {
        text: `${todoData.title}${todoData.description ? ' - ' + todoData.description : ''}`,
        dueDate: todoData.date,
        createdBy: user.uid,
        assignedTo: todoData.assignedTo || null
      });

      console.log('할 일 추가 결과:', result);

      if (!result.success) {
        alert('할 일 추가에 실패했습니다: ' + result.error);
        console.error('할 일 추가 실패:', result.error);
      } else {
        console.log('할 일이 성공적으로 추가되었습니다!');
        // 성공 메시지 표시
        alert('할 일이 추가되었습니다!');
      }
    } catch (error) {
      console.error('할 일 추가 중 예외 발생:', error);
      alert('할 일 추가 중 오류가 발생했습니다: ' + error.message);
    }
  };

  const handleToggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    await toggleTodoComplete(id, !todo.completed);
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodoFromFirebase(id);
  };

  const handleWorkspaceLeave = () => {
    setWorkspace(null);
    setShowWorkspaceManager(false);
  };

  const handleChangeWorkspace = () => {
    setWorkspace(null);
    setShowMenu(false);
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="App loading-screen">
        <div className="loading-spinner">⏳</div>
        <p>로딩 중...</p>
      </div>
    );
  }

  // 미인증 상태 - 로그인 화면
  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // 워크스페이스 미선택 - 워크스페이스 선택 화면
  if (!workspace) {
    return (
      <WorkspaceSelector
        user={user}
        onWorkspaceSelect={handleWorkspaceSelect}
      />
    );
  }

  // 메인 Todo 앱 화면
  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              👥 {workspace.name}
            </div>
            <button 
              className="hamburger-menu"
              onClick={() => setShowMenu(!showMenu)}
            >
              ☰
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={() => {
                  setShowWorkspaceManager(true);
                  setShowMenu(false);
                }}>
                  ⚙️ 워크스페이스 설정
                </button>
                <button onClick={handleChangeWorkspace}>
                  🔄 워크스페이스 변경
                </button>
                <button onClick={handleLogout}>
                  🚪 로그아웃
                </button>
              </div>
            )}
          </div>
          <div className="header-right">
            <div className="user-info">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="프로필" 
                  className="user-avatar"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="user-avatar-placeholder"
                style={{ display: user.photoURL ? 'none' : 'flex' }}
              >
                {user.displayName?.charAt(0) || user.email?.charAt(0) || '👤'}
              </div>
              <span className="user-name">{user.displayName || user.email}</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <div className="todo-container">
          <div className="list-title">
            📋 할 일 목록
            <span className="todo-count">({todos.length}개)</span>
          </div>
          <TodoInput 
            onAdd={handleAddTodo}
            members={workspaceMembers}
          />
          <TodoList 
            todos={todos.map(todo => ({
              id: todo.id,
              title: todo.text,
              description: '',
              date: todo.dueDate,
              completed: todo.completed,
              assignedTo: todo.assignedTo,
              createdBy: todo.createdBy
            }))}
            onToggle={handleToggleTodo} 
            onDelete={handleDeleteTodo}
            members={workspaceMembers}
            currentUser={user}
          />
        </div>
      </main>

      {showWorkspaceManager && (
        <WorkspaceManager
          workspace={workspace}
          currentUser={user}
          onClose={() => setShowWorkspaceManager(false)}
          onLeave={handleWorkspaceLeave}
        />
      )}
    </div>
  );
}

export default App;


