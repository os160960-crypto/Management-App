import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// Todo 생성
export const createTodo = async (workspaceId, todoData) => {
  try {
    console.log('createTodo 호출됨:', { workspaceId, todoData });
    
    if (!workspaceId) {
      throw new Error('워크스페이스 ID가 필요합니다');
    }
    
    if (!todoData.text) {
      throw new Error('할 일 내용이 필요합니다');
    }

    const todoRef = doc(collection(db, 'todos'));
    const todoId = todoRef.id;

    const todoDoc = {
      id: todoId,
      workspaceId,
      text: todoData.text,
      completed: false,
      dueDate: todoData.dueDate || null,
      assignedTo: todoData.assignedTo || null, // 담당자 userId
      createdBy: todoData.createdBy,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    console.log('Firestore에 저장할 데이터:', todoDoc);

    await setDoc(todoRef, todoDoc);

    console.log('Todo가 성공적으로 저장되었습니다:', todoId);
    return { success: true, todoId };
  } catch (error) {
    console.error('Todo 생성 오류:', error);
    console.error('오류 상세:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    return { success: false, error: error.message };
  }
};

// 워크스페이스의 모든 Todo 가져오기
export const getWorkspaceTodos = async (workspaceId) => {
  try {
    const todosRef = collection(db, 'todos');
    const q = query(
      todosRef,
      where('workspaceId', '==', workspaceId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const todos = [];

    querySnapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, todos };
  } catch (error) {
    console.error('Todo 가져오기 오류:', error);
    return { success: false, error: error.message };
  }
};

// Todo 업데이트
export const updateTodo = async (todoId, updates) => {
  try {
    const todoRef = doc(db, 'todos', todoId);
    await updateDoc(todoRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Todo 업데이트 오류:', error);
    return { success: false, error: error.message };
  }
};

// Todo 완료 상태 토글
export const toggleTodoComplete = async (todoId, completed) => {
  return updateTodo(todoId, { completed });
};

// Todo 삭제
export const deleteTodo = async (todoId) => {
  try {
    const todoRef = doc(db, 'todos', todoId);
    await deleteDoc(todoRef);

    return { success: true };
  } catch (error) {
    console.error('Todo 삭제 오류:', error);
    return { success: false, error: error.message };
  }
};

// 특정 사용자에게 할당된 Todo 가져오기
export const getUserAssignedTodos = async (workspaceId, userId) => {
  try {
    const todosRef = collection(db, 'todos');
    const q = query(
      todosRef,
      where('workspaceId', '==', workspaceId),
      where('assignedTo', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const todos = [];

    querySnapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, todos };
  } catch (error) {
    console.error('할당된 Todo 가져오기 오류:', error);
    return { success: false, error: error.message };
  }
};

// 워크스페이스 Todo 실시간 구독
export const subscribeToWorkspaceTodos = (workspaceId, callback) => {
  const todosRef = collection(db, 'todos');
  const q = query(
    todosRef,
    where('workspaceId', '==', workspaceId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const todos = [];
    snapshot.forEach((doc) => {
      todos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(todos);
  });
};

// Todo에 담당자 할당
export const assignTodoToUser = async (todoId, userId) => {
  return updateTodo(todoId, { assignedTo: userId });
};

// Todo 담당자 제거
export const unassignTodo = async (todoId) => {
  return updateTodo(todoId, { assignedTo: null });
};

