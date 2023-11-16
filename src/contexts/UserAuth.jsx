import { createContext, useEffect, useState } from 'react';
import { account, appWriteConfig, avatars, databases } from '../lib/appwrite/config';
import { ID, Query } from 'appwrite';
import { toast } from 'sonner';

const DATABASE_ID = appWriteConfig.databaseId;
const USERS_COLLECTION_ID = appWriteConfig.usersCollectionId;

export const UserAuthContext = createContext();

function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ------------- Authentication

  async function handleCreateUserAccount(user) {
    try {
      const newAccount = await account.create(ID.unique(), user.email, user.password, user.name);
      const avatarUrl = avatars.getInitials(user.name);
      await handleSaveUserToDb(
        {
          email: user.email,
          name: user.name,
          image: avatarUrl,
          accountID: newAccount.$id,
        },
        newAccount.$id,
      );
      return newAccount;
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleSaveUserToDb(user, accountID) {
    try {
      const newUser = await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        accountID,
        user,
      );
      return newUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async function handleSignUp(user) {
    try {
      setIsLoading(true);
      const newAccount = await handleCreateUserAccount(user);
      if (!newAccount) return;
      await handleSignIn(user.email, user.password);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignIn(email, password) {
    try {
      setIsLoading(true);
      const session = await account.createEmailSession(email, password);
      if (!session) throw new Error('Something went wrong');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  }

  async function getCurrentUser() {
    try {
      const currentAccount = await account.get();
      const currentUser = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
        Query.equal('accountID', currentAccount.$id),
      ]);
      const user = currentUser.documents[0];
      setUser(user);
      return user;
    } catch (error) {
      setUser(null);
    }
  }

  function checkIsUserAuthenticated() {
    const cookieFallback = localStorage.getItem('cookieFallback');
    return cookieFallback && cookieFallback !== '[]';
  }

  // ------------- Settings

  // Profile
  async function handleUpdateName(name) {
    try {
      const res = await account.updateName(name);
      setUser((user) => {
        return {
          ...user,
          name: res.name,
        };
      });
      await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id, {
        name: res.name,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async function handleUpdateEmail(email, password) {
    try {
      const res = await account.updateEmail(email, password);
      setUser((user) => {
        return {
          ...user,
          email: res.email,
        };
      });
      await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id, {
        email: res.email,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async function handleUpdateProfile(name, email, password) {
    console.log(name, email, password);
    try {
      if (user.name !== name) await handleUpdateName(name);
      if (user.email !== email) await handleUpdateEmail(email, password);

      toast.success(
        user.name !== name
          ? 'Your name has been updated'
          : user.email !== email
          ? 'Your email has been updated'
          : 'Your name and email have been updated',
      );
    } catch (error) {
      toast.error('Your password is incorrect. Please try again.');
    }
  }

  // Password
  async function handleUpdatePassword(oldPassword, newPassword) {
    try {
      await account.updatePassword(newPassword, oldPassword);
      toast.success('Your password has been updated');
      return true;
    } catch (error) {
      toast.error('Your password is incorrect. Please try again.');
    }
  }

  // Sessions
  async function handleGetSessions() {
    try {
      const sessions = await account.listSessions();
      return sessions.sessions;
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleDeleteSession(sessionId) {
    try {
      if (sessionId === 'current') return await handleSignOut();
      await account.deleteSession(sessionId);
      toast.success('Session deleted');
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleDeleteSessions() {
    try {
      await account.deleteSessions();
    } catch (error) {
      console.log(error);
    }
  }

  //? Since appwrite doesn't provide a way to delete and account i'll just block it and delete the user from the database
  async function handleDeleteAccount() {
    try {
      await databases.deleteDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id);
      await account.updateStatus();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isLoading,
        checkIsUserAuthenticated,
        handleSignUp,
        handleSignIn,
        handleSignOut,
        getCurrentUser,
        handleUpdateProfile,
        handleUpdatePassword,
        handleGetSessions,
        handleDeleteSession,
        handleDeleteSessions,
        handleDeleteAccount,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

function getErrorMessage(err) {
  const errorMessage = err.message.includes(':') ? err.message.split(':')[0] : err.message;

  switch (errorMessage) {
    case 'Invalid `password` param':
      return 'Your password is invalid. Password must be at least 8 characters long.';
    case 'Invalid `email` param':
      return 'Your email is invalid. Please enter a valid email address.';
    case 'Rate limit for the current endpoint has been exceeded. Please try again after some time.':
      return 'You have made too many requests. Please wait a moment and try again.';
    case 'A user with the same id, email, or phone already exists in this project.':
      return 'An account with this email already exists. Please try again with a different email.';
    case 'Invalid credentials. Please check the email and password.':
    case `The current user has been blocked. You can unblock the user by making a request to the User API's "Update User Status" endpoint or in the Appwrite Console's Auth section.`:
      return 'Invalid email or password. Please try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
export default UserAuthProvider;
