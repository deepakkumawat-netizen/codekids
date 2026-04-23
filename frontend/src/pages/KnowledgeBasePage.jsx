import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGrade } from '../hooks/useGrade';
import Header from '../components/layout/Header';
import Container from '../components/layout/Container';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import ConceptCard from '../components/knowledge/ConceptCard';
import ConceptModal from '../components/knowledge/ConceptModal';
import conceptsData from '../data/concepts.json';
import '../styles/pages/KnowledgeBasePage.css';

const KnowledgeBasePage = ({ onNavigate, profile }) => {
  const navigate = useNavigate();
  const { gradeConfig } = useGrade();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedConcept, setSelectedConcept] = useState(null);

  // Get unique categories and difficulties
  const categories = ['All', ...new Set(conceptsData.concepts.map(c => c.category))];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const languages = ['All', 'Python', 'Java', 'C++', 'Go'];

  // Filter concepts based on search and selections
  const filteredConcepts = useMemo(() => {
    return conceptsData.concepts.filter(concept => {
      const matchesSearch = concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           concept.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || concept.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || concept.difficulty === selectedDifficulty;
      const matchesLanguage = selectedLanguage === 'All' ||
                             concept.languages.map(l => l.charAt(0).toUpperCase() + l.slice(1))
                                             .includes(selectedLanguage);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesLanguage;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedLanguage]);

  const handleLearnMore = (concept) => {
    // Navigate to CodeLab
    navigate('/code');
  };

  const useEmojis = gradeConfig?.features?.useEmojis ?? false;

  const menuItems = [
    { label: 'Home', href: '/', onClick: () => navigate('/') },
    { label: 'Code Lab', href: '/code', onClick: () => navigate('/code') },
    { label: 'Projects', href: '/projects', onClick: () => navigate('/projects') },
    { label: 'Knowledge', href: '/knowledge', onClick: () => navigate('/knowledge'), active: true },
  ];

  return (
    <>
      <Header onNavigate={onNavigate} logo="CodeKids" showMenu={true} menuItems={menuItems} />

      <Container>
        <div className="knowledge-base-page">
          {/* Page Header */}
          <div className="kb-header">
            <h1 className="kb-title">
              {useEmojis ? '📚 ' : ''}Programming Concepts
            </h1>
            <p className="kb-subtitle">Explore fundamental programming concepts and design patterns</p>
          </div>

          {/* Search and Filters */}
          <div className="kb-controls">
            <Input
              label={useEmojis ? '🔍 Search' : 'Search'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts..."
            />

            <div className="filters-grid">
              <Select
                label={useEmojis ? '📂 Category' : 'Category'}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={categories.map(cat => ({
                  value: cat,
                  label: cat
                }))}
              />

              <Select
                label={useEmojis ? '⭐ Difficulty' : 'Difficulty'}
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                options={difficulties.map(diff => ({
                  value: diff,
                  label: diff
                }))}
              />

              <Select
                label={useEmojis ? '🔧 Language' : 'Language'}
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                options={languages.map(lang => ({
                  value: lang,
                  label: lang
                }))}
              />
            </div>
          </div>

          {/* Results Info */}
          <div className="results-info">
            <p>
              {useEmojis ? '📊 ' : ''}
              Showing {filteredConcepts.length} of {conceptsData.concepts.length} concepts
            </p>
          </div>

          {/* Concepts Grid */}
          {filteredConcepts.length > 0 ? (
            <div className="concepts-grid">
              {filteredConcepts.map((concept) => (
                <ConceptCard
                  key={concept.id}
                  concept={concept}
                  onClick={() => setSelectedConcept(concept)}
                  onLearnMore={() => handleLearnMore(concept)}
                  grade={profile?.grade}
                  useEmojis={useEmojis}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p className="empty-icon">{useEmojis ? '🔍' : ''}</p>
              <p className="empty-title">No concepts found</p>
              <p className="empty-subtitle">Try different search terms or filters</p>
            </div>
          )}

          {/* Concept Modal */}
          {selectedConcept && (
            <ConceptModal
              concept={selectedConcept}
              onClose={() => setSelectedConcept(null)}
              onLearnMore={() => handleLearnMore(selectedConcept)}
              grade={profile?.grade}
              useEmojis={useEmojis}
            />
          )}
        </div>
      </Container>
    </>
  );
};

export default KnowledgeBasePage;
