import { createContext, useEffect, useState } from 'react';
import { account, appWriteConfig, avatars, databases } from '../lib/appwrite/config';
import { handleDeleteFile, handleUploadFile } from '../lib/appwrite/api';
import { ID, Query } from 'appwrite';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

const DATABASE_ID = appWriteConfig.databaseId;
const USERS_COLLECTION_ID = appWriteConfig.usersCollectionId;

export const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [searchParams] = useSearchParams();

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
      if (user) return;
      const currentAccount = await account.get();
      const res = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
        Query.equal('accountID', currentAccount.$id),
      ]);
      const currentUser = {
        ...res.documents[0],
        ...currentAccount,
      };
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.log(error);
      setUser(null);
    }
  }

  // ------------- Settings

  // Profile
  async function handleUpdateUser(data) {
    try {
      const updatedUser = await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        user.$id,
        data,
      );
      return updatedUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async function handleUpdateName(name) {
    try {
      await account.updateName(name);
      setUser((user) => {
        return {
          ...user,
          name,
        };
      });
      await handleUpdateUser({ name });
    } catch (error) {
      throw new Error(error);
    }
  }

  async function handleUpdateEmail(email, password) {
    try {
      await account.updateEmail(email, password);
      setUser((user) => {
        return {
          ...user,
          email,
        };
      });
      await handleUpdateUser({ email });
    } catch (error) {
      throw new Error(error);
    }
  }

  async function handleUpdateAvatar(file) {
    try {
      const { id, url } = await handleUploadFile(file);
      // Delete the old avatar
      if (user.avatarId) await handleDeleteFile(user.avatarId);
      // Update the user
      await handleUpdateUser({ avatar: url, avatarId: id });
      setUser((user) => {
        return {
          ...user,
          avatar: url,
          avatarId: id,
        };
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleGetInitialsAvatar(avatarUrl) {
    try {
      // Delete the old avatar
      if (user.avatarId) await handleDeleteFile(user.avatarId);
      await handleUpdateUser({ avatar: avatarUrl, avatarId: '' });
      setUser((user) => {
        return {
          ...user,
          avatar: avatarUrl,
        };
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateProfile(name, email, password, avatar, toastId) {
    try {
      if (user.name !== name) await handleUpdateName(name);
      if (user.email !== email) await handleUpdateEmail(email, password);
      if (user.avatar !== avatar.src) {
        avatar.type === 'uploaded'
          ? await handleUpdateAvatar(avatar.file)
          : await handleGetInitialsAvatar(avatar.src);
      }

      toast.success(
        user.name !== name
          ? 'Your name has been updated'
          : user.email !== email
          ? 'Your email has been updated'
          : user.avatar !== avatar.src
          ? 'Your avatar has been updated'
          : 'Your profile has been updated',
        { id: toastId },
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

  // Email Verification
  async function handleSendVerificationEmail() {
    try {
      await account.createVerification('http://localhost:5173/app/'); // TODO: Change this to the production url
      toast.success('We have sent you an email with a link to verify your account.');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  async function handleVerifyAccount(userId, secret) {
    const user = await getCurrentUser();
    if (user.emailVerification) return;
    try {
      await account.updateVerification(userId, secret);
      toast.success('Your account has been verified');
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    // Check if the user is authenticated
    const cookieFallback = localStorage.getItem('cookieFallback');
    setIsUserAuthenticated(cookieFallback !== '[]');
    // Get the current user
    getCurrentUser();
    // Verify the account
    if (searchParams.has('userId') && searchParams.has('secret') && searchParams.has('expire')) {
      handleVerifyAccount(searchParams.get('userId'), searchParams.get('secret'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isUserAuthenticated,
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
        handleSendVerificationEmail,
        handleVerifyAccount,
      }}
    >
      {children}
    </UserContext.Provider>
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
export default UserProvider;
