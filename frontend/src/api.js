import axios from 'axios'

const isProduction = window.location.hostname !== 'localhost'
const backendBaseURL = isProduction ? window.location.origin : 'http://localhost:7000'

export const findBackendPort = async () => 7000

const API = axios.create({
  baseURL: backendBaseURL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

// AI-Based Platform Methods
export const explainCode = (code, language, gradeLevel, question) =>
  API.post('/api/explain', { code, language, grade_level: gradeLevel, question })

export const debugCode = (code, language, gradeLevel, error) =>
  API.post('/api/debug', { code, language, grade_level: gradeLevel, error_description: error })

export const hintCode = (code, language, gradeLevel, question) =>
  API.post('/api/hint', { code, language, grade_level: gradeLevel, question })

export const getPractice = (language, gradeLevel, difficulty) =>
  API.post('/api/practice', { language, grade_level: gradeLevel, difficulty })

export const simulateCode = (code, language, gradeLevel) =>
  API.post('/api/simulate', { code, language, grade_level: gradeLevel })

export const teachConcept = (concept, language, gradeLevel) =>
  API.post('/api/teach', { concept, language, grade_level: gradeLevel })

export const reviewCode = (code, language, gradeLevel) =>
  API.post('/api/review', { code, language, grade_level: gradeLevel })

export const getLesson = (concept, language, gradeLevel) =>
  API.post('/api/lesson', { concept, language, grade_level: gradeLevel })

export const languageIntro = (language, gradeLevel) =>
  API.post('/api/language-intro', { language, grade_level: gradeLevel })

// Run/Execute Code with local compilers
export const runCode = (code, language) =>
  API.post('/api/run', { code, language, grade_level: '6' })
