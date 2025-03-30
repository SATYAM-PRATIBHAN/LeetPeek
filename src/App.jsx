import { useState } from 'react';
import axios from 'axios';
import { toPng } from 'html-to-image';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSolvedData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(
        `https://alfa-leetcode-api.onrender.com/${username}/solved`
      );

      if (response.data.errors) {
        const errorMessage = response.data.errors[0]?.message || 'Unknown error.';
        throw new Error(errorMessage);
      }

      setUserData(response.data);
    } catch (err) {
      if (err.message === 'That user does not exist.') {
        setError('User not found. Please check the username and try again.');
      } else {
        setError('An error occurred while fetching data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) {
      fetchSolvedData();
    }
  };

  const downloadCard = () => {
    const card = document.getElementById('user-card');
    if (card) {
      toPng(card)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `${username}-leetcode-card.png`;
          link.click();
        })
        .catch((err) => {
          console.error('Failed to download image:', err);
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col items-center justify-center p-6 text-white">
      <h1 className="text-3xl font-extrabold mb-6">LeetCode User Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white shadow-lg rounded-lg p-4 mb-8 space-x-4"
      >
        <input
          type="text"
          placeholder="Enter LeetCode username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 w-full shadow-2xl"
        />
        <button
          type="submit"
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-6 py-2 text-white rounded-lg font-semibold shadow-md"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-xl font-semibold">Loading...</p>}

      {error && <p className="text-red-300 text-lg font-medium">{error}</p>}

      {userData && (
        <div>
          <div
            id="user-card"
            className="bg-white text-gray-800 rounded-lg shadow-lg p-6 max-w-lg w-full mb-4"
          >
            <h2 className="text-xl font-bold mb-4">{username}'s LeetCode Stats</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Total Problems Solved</p>
                <p className="text-xl font-semibold">{userData.solvedProblem}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Easy Problems</p>
                <p className="text-xl font-semibold">{userData.easySolved}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Medium Problems</p>
                <p className="text-xl font-semibold">{userData.mediumSolved}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg shadow">
                <p className="text-sm text-gray-600">Hard Problems</p>
                <p className="text-xl font-semibold">{userData.hardSolved}</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Total Submissions</h3>
            <ul className="list-disc pl-5 mb-6">
              {userData.totalSubmissionNum.map((item, index) => (
                <li key={index} className="text-gray-700">
                  <strong>{item.difficulty}:</strong> {item.count} problems (
                  {item.submissions} submissions)
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-semibold mb-3">Accepted Submissions</h3>
            <ul className="list-disc pl-5">
              {userData.acSubmissionNum.map((item, index) => (
                <li key={index} className="text-gray-700">
                  <strong>{item.difficulty}:</strong> {item.count} problems (
                  {item.submissions} submissions)
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={downloadCard}
            className="cursor-pointer bg-green-500 hover:bg-green-600 px-4 py-2 text-white rounded-lg font-semibold shadow-md"
          >
            Download Card
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
