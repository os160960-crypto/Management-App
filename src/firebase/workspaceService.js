import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  query,
  where,
  onSnapshot,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// 워크스페이스 생성
export const createWorkspace = async (userId, workspaceName) => {
  try {
    const workspaceRef = doc(collection(db, 'workspaces'));
    const workspaceId = workspaceRef.id;

    await setDoc(workspaceRef, {
      id: workspaceId,
      name: workspaceName,
      ownerId: userId,
      members: [userId],
      createdAt: serverTimestamp(),
      inviteCode: generateInviteCode()
    });

    // 사용자 문서에 워크스페이스 추가
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      workspaces: arrayUnion(workspaceId)
    });

    return { success: true, workspaceId };
  } catch (error) {
    console.error('워크스페이스 생성 오류:', error);
    return { success: false, error: error.message };
  }
};

// 초대 코드 생성
const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

// 초대 코드로 워크스페이스 가입
export const joinWorkspaceByCode = async (userId, inviteCode) => {
  try {
    const workspacesRef = collection(db, 'workspaces');
    const q = query(workspacesRef, where('inviteCode', '==', inviteCode.toUpperCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: '유효하지 않은 초대 코드입니다.' };
    }

    const workspaceDoc = querySnapshot.docs[0];
    const workspaceId = workspaceDoc.id;
    const workspaceData = workspaceDoc.data();

    // 이미 멤버인지 확인
    if (workspaceData.members.includes(userId)) {
      return { success: false, error: '이미 참여중인 워크스페이스입니다.' };
    }

    // 워크스페이스에 멤버 추가
    await updateDoc(doc(db, 'workspaces', workspaceId), {
      members: arrayUnion(userId)
    });

    // 사용자 문서에 워크스페이스 추가
    await updateDoc(doc(db, 'users', userId), {
      workspaces: arrayUnion(workspaceId)
    });

    return { success: true, workspaceId, workspaceName: workspaceData.name };
  } catch (error) {
    console.error('워크스페이스 가입 오류:', error);
    return { success: false, error: error.message };
  }
};

// 사용자의 워크스페이스 목록 가져오기
export const getUserWorkspaces = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return { success: false, error: '사용자를 찾을 수 없습니다.' };
    }

    const workspaceIds = userDoc.data().workspaces || [];
    
    if (workspaceIds.length === 0) {
      return { success: true, workspaces: [] };
    }

    const workspaces = [];
    for (const workspaceId of workspaceIds) {
      const workspaceRef = doc(db, 'workspaces', workspaceId);
      const workspaceDoc = await getDoc(workspaceRef);
      
      if (workspaceDoc.exists()) {
        workspaces.push({
          id: workspaceDoc.id,
          ...workspaceDoc.data()
        });
      }
    }

    return { success: true, workspaces };
  } catch (error) {
    console.error('워크스페이스 목록 가져오기 오류:', error);
    return { success: false, error: error.message };
  }
};

// 워크스페이스 정보 가져오기
export const getWorkspace = async (workspaceId) => {
  try {
    const workspaceRef = doc(db, 'workspaces', workspaceId);
    const workspaceDoc = await getDoc(workspaceRef);

    if (!workspaceDoc.exists()) {
      return { success: false, error: '워크스페이스를 찾을 수 없습니다.' };
    }

    return { success: true, workspace: { id: workspaceDoc.id, ...workspaceDoc.data() } };
  } catch (error) {
    console.error('워크스페이스 정보 가져오기 오류:', error);
    return { success: false, error: error.message };
  }
};

// 워크스페이스 멤버 정보 가져오기
export const getWorkspaceMembers = async (workspaceId) => {
  try {
    const workspaceResult = await getWorkspace(workspaceId);
    if (!workspaceResult.success) {
      return workspaceResult;
    }

    const memberIds = workspaceResult.workspace.members || [];
    const members = [];

    for (const memberId of memberIds) {
      const userRef = doc(db, 'users', memberId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        members.push({
          uid: userDoc.id,
          ...userDoc.data()
        });
      }
    }

    return { success: true, members };
  } catch (error) {
    console.error('멤버 정보 가져오기 오류:', error);
    return { success: false, error: error.message };
  }
};

// 워크스페이스 탈퇴
export const leaveWorkspace = async (userId, workspaceId) => {
  try {
    // 워크스페이스에서 멤버 제거
    const workspaceRef = doc(db, 'workspaces', workspaceId);
    const workspaceDoc = await getDoc(workspaceRef);
    
    if (workspaceDoc.exists()) {
      const currentMembers = workspaceDoc.data().members || [];
      const updatedMembers = currentMembers.filter(id => id !== userId);
      
      await updateDoc(workspaceRef, {
        members: updatedMembers
      });
    }

    // 사용자 문서에서 워크스페이스 제거
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const currentWorkspaces = userDoc.data().workspaces || [];
      const updatedWorkspaces = currentWorkspaces.filter(id => id !== workspaceId);
      
      await updateDoc(userRef, {
        workspaces: updatedWorkspaces
      });
    }

    return { success: true };
  } catch (error) {
    console.error('워크스페이스 탈퇴 오류:', error);
    return { success: false, error: error.message };
  }
};

// 워크스페이스 실시간 구독
export const subscribeToWorkspace = (workspaceId, callback) => {
  const workspaceRef = doc(db, 'workspaces', workspaceId);
  return onSnapshot(workspaceRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
};

