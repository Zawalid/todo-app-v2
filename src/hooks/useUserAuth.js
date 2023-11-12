import { useContext } from 'react';
import { UserAuthContext } from '../contexts/UserAuth';

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (context === undefined) throw new Error('useUserAuth must be used within a UserAuthProvider');
  return context;
}
