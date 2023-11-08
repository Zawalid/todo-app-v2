import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className='container'>
      <h1>Welcome to Task Manager</h1>
      <p>Stay organized and get things done with our app.</p>
      <Link to='/app' className='btn btn-primary'>
        View Tasks
      </Link>
    </div>
  );
};

export default HomePage;
