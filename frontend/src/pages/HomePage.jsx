import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGrade } from '../hooks/useGrade';
import '../styles/pages/HomePage.css';

const HomePage = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { grade, changeGrade } = useGrade();
  const [selectedGrade, setSelectedGrade] = useState(grade);

  const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const handleGradeChange = (newGrade) => {
    setSelectedGrade(newGrade);
    changeGrade(newGrade);
  };

  const problems = [
    {
      id: 1,
      title: 'Hello World',
      difficulty: 'Easy',
      description: 'Print "Hello World" to the console',
      languages: ['Python', 'Java', 'C++', 'Go'],
      views: '1.2K',
      icon: '🔤',
    },
    {
      id: 2,
      title: 'Sum of Two Numbers',
      difficulty: 'Easy',
      description: 'Add two numbers and return the result',
      languages: ['Python', 'Java', 'C++', 'Go'],
      views: '2.5K',
      icon: '🔢',
    },
    {
      id: 3,
      title: 'Loop Through Array',
      difficulty: 'Easy',
      description: 'Iterate through an array and print each element',
      languages: ['Python', 'Java', 'C++', 'Go'],
      views: '1.8K',
      icon: '📋',
    },
    {
      id: 4,
      title: 'Find Maximum',
      difficulty: 'Medium',
      description: 'Find the largest number in an array',
      languages: ['Python', 'Java', 'C++', 'Go'],
      views: '3.2K',
      icon: '📈',
    },
    {
      id: 5,
      title: 'Reverse String',
      difficulty: 'Medium',
      description: 'Reverse a string without using built-in functions',
      languages: ['Python', 'Java', 'C++', 'Go'],
      views: '2.8K',
      icon: '🔄',
    },
  ];

  const getDifficultyClass = (difficulty) => {
    return difficulty.toLowerCase();
  };

  return (
    <div className="leetcode-home">
      {/* Header */}
      <header className="leetcode-header">
        <div className="header-left">
          <div className="logo" onClick={() => navigate('/')}>CodeKids</div>
          <nav className="header-nav">
            <button className="nav-btn active" onClick={() => navigate('/')}>Explore</button>
            <button className="nav-btn" onClick={() => navigate('/code')}>Code Lab</button>
            <button className="nav-btn" onClick={() => navigate('/knowledge')}>Learn</button>
            <button className="nav-btn" onClick={() => navigate('/projects')}>Projects</button>
          </nav>
        </div>
        <div className="header-right">
          <select
            className="grade-select"
            value={selectedGrade}
            onChange={(e) => handleGradeChange(e.target.value)}
          >
            {GRADES.map(g => (
              <option key={g} value={g}>
                {g === 'K' ? 'Kindergarten' : `Grade ${g}`}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="leetcode-container">
        {/* Sidebar */}
        <aside className="leetcode-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Collections</h3>
            <ul className="sidebar-list">
              <li><button className="sidebar-btn active">📚 All Problems</button></li>
              <li><button className="sidebar-btn">⭐ Favorites</button></li>
              <li><button className="sidebar-btn">✅ Solved</button></li>
              <li><button className="sidebar-btn">⏳ In Progress</button></li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Topics</h3>
            <ul className="sidebar-list">
              <li><button className="sidebar-btn">Variables</button></li>
              <li><button className="sidebar-btn">Loops</button></li>
              <li><button className="sidebar-btn">Functions</button></li>
              <li><button className="sidebar-btn">Arrays</button></li>
              <li><button className="sidebar-btn">Strings</button></li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Difficulty</h3>
            <ul className="sidebar-list">
              <li><button className="sidebar-btn">Easy</button></li>
              <li><button className="sidebar-btn">Medium</button></li>
              <li><button className="sidebar-btn">Hard</button></li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="leetcode-main">
          {/* Filter Bar */}
          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search problems..."
              className="search-input"
            />
            <div className="filter-controls">
              <button className="filter-btn">Difficulty ▼</button>
              <button className="filter-btn">Language ▼</button>
            </div>
          </div>

          {/* Problems Table */}
          <div className="problems-table">
            <div className="table-header">
              <div className="col-status"></div>
              <div className="col-title">Title</div>
              <div className="col-difficulty">Difficulty</div>
              <div className="col-acceptance">Acceptance</div>
              <div className="col-views">Views</div>
            </div>

            {problems.map((problem) => (
              <div
                key={problem.id}
                className="table-row"
                onClick={() => navigate('/code')}
              >
                <div className="col-status">
                  <span className="problem-icon">{problem.icon}</span>
                </div>
                <div className="col-title">
                  <div className="problem-title">{problem.title}</div>
                  <div className="problem-desc">{problem.description}</div>
                </div>
                <div className="col-difficulty">
                  <span className={`difficulty-badge ${getDifficultyClass(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>
                <div className="col-acceptance">
                  <span className="acceptance">{Math.floor(Math.random() * 40 + 40)}%</span>
                </div>
                <div className="col-views">
                  <span className="views">{problem.views}</span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
