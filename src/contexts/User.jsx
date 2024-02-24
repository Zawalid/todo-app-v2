import { createContext, useEffect, useState } from 'react';
import { account, appWriteConfig, avatars, databases } from '../lib/appwrite/config';
import { handleDeleteFile, handleUploadFile } from '../lib/appwrite/api';
import { ID, Query } from 'appwrite';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTrash } from '../hooks';
import { useDispatch, useSelector } from 'react-redux';
import { logUserIn, authenticateUser, logUserOut, updateUserProfile } from '../app/userSlice';

const DATABASE_ID = appWriteConfig.databaseId;
const USERS_COLLECTION_ID = appWriteConfig.usersCollectionId;

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { createTrash } = useTrash();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ------------- Authentication

  async function handleCreateUserAccount(user) {
    try {
      const newAccount = await account.create(ID.unique(), user.email, user.password, user.name);
      const avatarUrl = avatars.getInitials(user.name);
      await handleSaveUserToDb(
        { email: user.email, name: user.name, avatar: avatarUrl, accountID: newAccount.$id },
        newAccount.$id,
      );
      await createTrash(user);
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
      await getCurrentUser();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await account.deleteSession('current');
      dispatch(logUserOut());
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  }

  async function getCurrentUser() {
    try {
      const currentAccount = await account.get();
      const res = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
        Query.equal('accountID', currentAccount.$id),
      ]);
      const currentUser = {
        ...res.documents[0],
        ...currentAccount,
      };
      dispatch(logUserIn(currentUser));
    } catch (error) {
      if (error.code === 401) {
        localStorage.removeItem('cookieFallback');
        return navigate('/sign-in');
      }
      dispatch(logUserOut());
    }
  }

  async function checkIsUserAuthenticated() {
    // Check if the user is authenticated using the cookie fallback
    const cookieFallback = localStorage.getItem('cookieFallback');
    if (cookieFallback && !['{}', '[]', 'undefined', 'null'].includes(cookieFallback)) {
      return true;
    }
    // Check if the user is authenticated using the appwrite session
    const session = await account.get();
    if (session) return true;

    return false;
  }

  // ------------- Password

  async function handleUpdatePassword(currentPassword, newPassword) {
    toast.promise(account.updatePassword(newPassword, currentPassword), {
      loading: 'Updating password...',
      success: 'Your password has been updated',
      error: (err) => {
        console.log(err);
        return 'Your password is incorrect. Please try again.';
      },
    });
  }

  async function handleResetPassword(email) {
    if (!email) return toast.error('Please enter your email address.');
    toast.promise(account.createRecovery(email, import.meta.env.VITE_VERIFICATION_URL), {
      loading: 'Sending recovery email...',
      success: 'Recovery email sent',
      error: (err) => {
        console.log(err);
        return getErrorMessage(err);
      },
    });
  }

  async function handleRecoverPassword(
    userId,
    secret,
    password,
    passwordAgain,
    setIsResetPasswordSuccessful,
  ) {
    if (!password) return toast.error('Please enter your new password.');
    if (!passwordAgain) return toast.error('Please confirm your new password.');
    if (password !== passwordAgain)
      return toast.error('Passwords do not match. Please check the password and confirm password.');

    toast.promise(account.updateRecovery(userId, secret, password, passwordAgain), {
      loading: 'Updating password...',
      success: () => {
        setIsResetPasswordSuccessful(true);
        return 'Your password has been updated';
      },
      error: (err) => {
        console.log(err);
        return getErrorMessage(err);
      },
    });
  }

  // ------------- Profile

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
      await handleUpdateUser({ name });
      dispatch(updateUserProfile({ name }));
    } catch (error) {
      throw new Error(error);
    }
  }

  async function handleUpdateEmail(email, password) {
    try {
      await account.updateEmail(email, password);
      dispatch(updateUserProfile({ email }));
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
      dispatch(updateUserProfile({ avatar: url, avatarId: id }));
    } catch (error) {
      console.log(error);
    }
  }

  async function handleGetInitialsAvatar(avatarUrl) {
    try {
      // Delete the old avatar
      if (user.avatarId) await handleDeleteFile(user.avatarId);
      await handleUpdateUser({ avatar: avatarUrl, avatarId: '' });
      dispatch(updateUserProfile({ avatar: avatarUrl, avatarId: '' }));
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateProfile(name, email, password, avatar) {
    const updatedField = getUpdatedField(
      {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      { name, email, avatar: avatar.src },
    );

    const toastId = toast.loading('Updating profile...');
    try {
      if (user.name !== name) await handleUpdateName(name);
      if (user.email !== email) await handleUpdateEmail(email, password);
      if (user.avatar !== avatar.src) {
        avatar.type === 'uploaded'
          ? await handleUpdateAvatar(avatar.file)
          : await handleGetInitialsAvatar(avatar.src);
      }

      toast.success(
        updatedField === 'multiple'
          ? 'Your profile has been updated'
          : updatedField === 'name'
          ? 'Your name has been updated'
          : updatedField === 'email'
          ? 'Your email has been updated'
          : 'Your avatar has been updated',
        { id: toastId },
      );
    } catch (error) {
      toast.error('Your password is incorrect. Please try again.', { id: toastId });
    }
  }

  // ------------- Sessions
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

  async function handleDeleteSessions(sessionsIds) {
    try {
      toast.promise(Promise.all(sessionsIds.map((sessionId) => account.deleteSession(sessionId))), {
        loading: 'Deleting sessions...',
        success: 'Sessions deleted',
        error: 'Something went wrong. Please try again.',
      });
    } catch (error) {
      console.log(error);
    }
  }

  // ------------- Email Verification

  async function handleSendVerificationEmail() {
    try {
      await account.createVerification(import.meta.env.VITE_VERIFICATION_URL);
      toast.success('We have sent you an email with a link to verify your account.');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  async function handleVerifyAccount(userId, secret) {
    if (user.emailVerification) return;
    try {
      toast.promise(account.updateVerification(userId, secret), {
        loading: 'Verifying account...',
        success: 'Your account has been verified',
      });
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong. Please try again.');
    }
  }

  useEffect(() => {
    checkIsUserAuthenticated().then((isA) => dispatch(authenticateUser(isA)));
    getCurrentUser();
    // Verify the account
    if (searchParams.has('userId') && searchParams.has('secret') && searchParams.has('expire')) {
      handleVerifyAccount(searchParams.get('userId'), searchParams.get('secret'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <UserContext.Provider
      value={{
        isLoading,
        handleSignUp,
        handleSignIn,
        handleSignOut,
        handleUpdateProfile,
        handleUpdatePassword,
        handleGetSessions,
        handleDeleteSession,
        handleDeleteSessions,
        handleSendVerificationEmail,
        handleVerifyAccount,
        handleResetPassword,
        handleRecoverPassword,
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
    case 'User with the requested ID could not be found.':
      return 'The email you entkered is not associated with an account. Please try again.';
    case 'Invalid token passed in the request.':
    case 'Invalid `userId` param':
      return 'Invalid link or link expired. Please request a new one.';
    case 'Network request failed':
      return 'Network request failed. Please check your internet connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
function getUpdatedField(oldProfile, newProfile) {
  return Object.entries(oldProfile).reduce((updated, el) => {
    const key = el[0];
    const val = el[1];

    if (newProfile[key] !== val && !updated) return key;
    if (newProfile[key] !== val) return 'multiple';

    return updated;
  }, false);
}
