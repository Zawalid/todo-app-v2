import { createContext, useEffect, useState } from 'react';
import { account, appWriteConfig, avatars, databases } from '../AppWrite';
import { ID, Query } from 'appwrite';
import { toast } from 'sonner';

const DATABASE_ID = appWriteConfig.databaseId;
const USERS_COLLECTION_ID = appWriteConfig.usersCollectionId;

export const UserAuthContext = createContext();

function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsAuthenticated(true);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await account.deleteSession('current');
      setIsAuthenticated(false);
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
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    }
  }

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        handleSignUp,
        handleSignIn,
        handleSignOut,
        getCurrentUser,
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
      return 'Invalid email or password. Please try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
export default UserAuthProvider;
