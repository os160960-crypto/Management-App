import React, { useState, useEffect } from 'react';
import './WorkspaceSelector.css';
import {
  createWorkspace,
  joinWorkspaceByCode,
  getUserWorkspaces
} from '../firebase/workspaceService';

function WorkspaceSelector({ user, onWorkspaceSelect }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWorkspaces();
  }, [user]);

  const loadWorkspaces = async () => {
    const result = await getUserWorkspaces(user.uid);
    if (result.success) {
      setWorkspaces(result.workspaces);
      
      // 워크스페이스가 하나도 없으면 생성 모달 자동 표시
      if (result.workspaces.length === 0) {
        setShowCreateModal(true);
      }
    }
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!workspaceName.trim()) return;

    setLoading(true);
    setError('');

    const result = await createWorkspace(user.uid, workspaceName);
    
    if (result.success) {
      await loadWorkspaces();
      setShowCreateModal(false);
      setWorkspaceName('');
      
      // 생성된 워크스페이스를 바로 선택
      const workspace = workspaces.find(w => w.id === result.workspaceId);
      if (workspace) {
        onWorkspaceSelect(workspace);
      } else {
        // 새로 생성된 워크스페이스 정보 다시 로드
        const updatedResult = await getUserWorkspaces(user.uid);
        if (updatedResult.success) {
          const newWorkspace = updatedResult.workspaces.find(w => w.id === result.workspaceId);
          if (newWorkspace) {
            onWorkspaceSelect(newWorkspace);
          }
        }
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleJoinWorkspace = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setLoading(true);
    setError('');

    const result = await joinWorkspaceByCode(user.uid, inviteCode);
    
    if (result.success) {
      await loadWorkspaces();
      setShowJoinModal(false);
      setInviteCode('');
      
      // 참여한 워크스페이스를 바로 선택
      const updatedResult = await getUserWorkspaces(user.uid);
      if (updatedResult.success) {
        const joinedWorkspace = updatedResult.workspaces.find(w => w.id === result.workspaceId);
        if (joinedWorkspace) {
          onWorkspaceSelect(joinedWorkspace);
        }
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="workspace-selector">
      <div className="workspace-selector-header">
        <h2>워크스페이스 선택</h2>
        <p>함께 작업할 워크스페이스를 선택하거나 새로 만드세요</p>
      </div>

      <div className="workspace-list">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className="workspace-card"
            onClick={() => onWorkspaceSelect(workspace)}
          >
            <div className="workspace-icon">👥</div>
            <div className="workspace-info">
              <h3>{workspace.name}</h3>
              <p>{workspace.members?.length || 0}명의 멤버</p>
            </div>
          </div>
        ))}
      </div>

      <div className="workspace-actions">
        <button
          className="action-btn create-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <span>➕</span> 새 워크스페이스 만들기
        </button>
        <button
          className="action-btn join-btn"
          onClick={() => setShowJoinModal(true)}
        >
          <span>🔗</span> 초대 코드로 참여하기
        </button>
      </div>

      {/* 워크스페이스 생성 모달 */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>새 워크스페이스 만들기</h3>
            {error && <div className="modal-error">{error}</div>}
            <form onSubmit={handleCreateWorkspace}>
              <input
                type="text"
                placeholder="워크스페이스 이름"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="modal-input"
                autoFocus
                required
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  className="modal-btn cancel-btn"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError('');
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="modal-btn submit-btn"
                  disabled={loading}
                >
                  {loading ? '생성중...' : '만들기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 워크스페이스 참여 모달 */}
      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>워크스페이스 참여하기</h3>
            <p className="modal-description">
              받은 초대 코드를 입력하세요
            </p>
            {error && <div className="modal-error">{error}</div>}
            <form onSubmit={handleJoinWorkspace}>
              <input
                type="text"
                placeholder="초대 코드 입력"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="modal-input"
                autoFocus
                required
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  className="modal-btn cancel-btn"
                  onClick={() => {
                    setShowJoinModal(false);
                    setError('');
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="modal-btn submit-btn"
                  disabled={loading}
                >
                  {loading ? '참여중...' : '참여하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkspaceSelector;

