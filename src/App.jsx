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
        throw new Error(response.data.errors[0]?.message || 'Unknown error');
      }

      setUserData(response.data);
    } catch (err) {
      setError(
        err.message === 'That user does not exist.'
          ? 'User not found. Please check the username.'
          : 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) fetchSolvedData();
  };

  const downloadCard = () => {
    const card = document.getElementById('user-card');
    if (card) {
      toPng(card, { pixelRatio: 2 })
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `${username}-leetcode-stats.png`;
          link.click();
        })
        .catch((err) => console.error('Download failed:', err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center bg-clip-text bg-gradient-to-r from-cyan-300 to-pink-300 animate-pulse">
          LeetCode Profile Explorer
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 bg-white/10 backdrop-blur-lg p-4 rounded-xl shadow-xl"
        >
          <input
            type="text"
            placeholder="Enter LeetCode username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
          >
            Explore
          </button>
        </form>

        {loading && (
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-t-cyan-500 border-r-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-2">Loading...</p>
          </div>
        )}

        {error && (
          <p className="text-center text-rose-300 bg-rose-900/20 p-3 rounded-lg animate-fade-in">
            {error}
          </p>
        )}

        {userData && (
          <div className="animate-fade-in">
            <div
              id="user-card"
              className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-gray-800 transform hover:scale-[1.02] transition-transform duration-300"
            >
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                {username}'s LeetCode Journey
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Total Solved', value: userData.solvedProblem, color: 'bg-indigo-100' },
                  { label: 'Easy', value: userData.easySolved, color: 'bg-emerald-100' },
                  { label: 'Medium', value: userData.mediumSolved, color: 'bg-amber-100' },
                  { label: 'Hard', value: userData.hardSolved, color: 'bg-rose-100' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`${stat.color} p-4 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300`}
                  >
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
                  </div>
                ))}
              </div>

              {[
                { title: 'Total Submissions', data: userData.totalSubmissionNum },
                { title: 'Accepted Submissions', data: userData.acSubmissionNum },
              ].map((section) => (
                <div key={section.title} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.data.map((item, index) => (
                      <li
                        key={index}
                        className="text-gray-600 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium">{item.difficulty}:</span> {item.count}{' '}
                        problems ({item.submissions} submissions)
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button
              onClick={downloadCard}
              className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-medium shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Download Stats Card
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
