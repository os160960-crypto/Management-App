import React, { useState, useEffect } from 'react';
import './WorkspaceManager.css';
import { getWorkspaceMembers, leaveWorkspace } from '../firebase/workspaceService';

function WorkspaceManager({ workspace, currentUser, onClose, onLeave }) {
  const [members, setMembers] = useState([]);
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadMembers();
  }, [workspace]);

  const loadMembers = async () => {
    const result = await getWorkspaceMembers(workspace.id);
    if (result.success) {
      setMembers(result.members);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(workspace.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveWorkspace = async () => {
    if (workspace.ownerId === currentUser.uid) {
      alert('워크스페이스 소유자는 탈퇴할 수 없습니다.');
      return;
    }

    if (window.confirm('정말 이 워크스페이스를 탈퇴하시겠습니까?')) {
      const result = await leaveWorkspace(currentUser.uid, workspace.id);
      if (result.success) {
        onLeave();
      }
    }
  };

  const isOwner = workspace.ownerId === currentUser.uid;

  return (
    <div className="workspace-manager-overlay" onClick={onClose}>
      <div className="workspace-manager" onClick={(e) => e.stopPropagation()}>
        <div className="manager-header">
          <h2>⚙️ 워크스페이스 설정</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="manager-content">
          {/* 워크스페이스 정보 */}
          <section className="manager-section">
            <h3>워크스페이스 정보</h3>
            <div className="workspace-details">
              <div className="detail-item">
                <span className="detail-label">이름</span>
                <span className="detail-value">{workspace.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">멤버 수</span>
                <span className="detail-value">{members.length}명</span>
              </div>
            </div>
          </section>

          {/* 초대 코드 */}
          <section className="manager-section">
            <h3>팀원 초대하기</h3>
            <p className="section-description">
              초대 코드를 공유하여 팀원을 초대하세요
            </p>
            
            {!showInviteCode ? (
              <button
                className="show-code-btn"
                onClick={() => setShowInviteCode(true)}
              >
                초대 코드 보기
              </button>
            ) : (
              <div className="invite-code-container">
                <div className="invite-code">
                  {workspace.inviteCode}
                </div>
                <button
                  className="copy-btn"
                  onClick={copyInviteCode}
                >
                  {copied ? '✓ 복사됨' : '📋 복사'}
                </button>
              </div>
            )}
          </section>

          {/* 멤버 목록 */}
          <section className="manager-section">
            <h3>멤버 목록 ({members.length}명)</h3>
            <div className="members-list">
              {members.map((member) => (
                <div key={member.uid} className="member-item">
                  <div className="member-avatar">
                    {member.photoURL ? (
                      <img src={member.photoURL} alt={member.displayName} />
                    ) : (
                      <div className="avatar-placeholder">
                        {member.displayName?.charAt(0) || '👤'}
                      </div>
                    )}
                  </div>
                  <div className="member-info">
                    <div className="member-name">
                      {member.displayName || '사용자'}
                      {member.uid === workspace.ownerId && (
                        <span className="owner-badge">소유자</span>
                      )}
                      {member.uid === currentUser.uid && (
                        <span className="you-badge">나</span>
                      )}
                    </div>
                    <div className="member-email">{member.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 위험 구역 */}
          {!isOwner && (
            <section className="manager-section danger-zone">
              <h3>위험 구역</h3>
              <button
                className="danger-btn"
                onClick={handleLeaveWorkspace}
              >
                워크스페이스 탈퇴
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkspaceManager;

