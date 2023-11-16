import { toast } from 'sonner';
import { account } from './config';

export async function getSessions() {
  try {
    const sessions = await account.listSessions();
    return sessions.sessions;
  } catch (error) {
    toast.error(error.message);
  }
}

export async function deleteSession(sessionId) {
  try {
    await account.deleteSession(sessionId);
    toast.success('Session deleted');
  } catch (error) {
    toast.error(error.message);
  }
}

export async function deleteSessions() {
  try {
    await account.deleteSessions();
  } catch (error) {
    console.log(error);
  }
}
