import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthLayout from './components/AuthLayout';
import Profile from './pages/Profile';
import Learning from './pages/Learning';
import ExamEngine from './pages/ExamEngine';
import MockInterview from './pages/MockInterview';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import DomainSelection from './pages/DomainSelection';
import DomainOverview from './pages/DomainOverview';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import ProblemView from './pages/ProblemView';
import InterviewPrep from './pages/InterviewPrep';
import MockAssessment from './pages/MockAssessment';
import MockReport from './pages/MockReport';
import OopsGuide from './pages/OopsGuide';
import OSTutorial from './pages/OSTutorial';
import DBMSTutorial from './pages/DBMSTutorial';
import CNTutorial from './pages/CNTutorial';
import Aptitude from './pages/Aptitude';
import LogicalReasoning from './pages/LogicalReasoning';
import VerbalAbility from './pages/VerbalAbility';
import Tutorials from './pages/Tutorials';
import TutorialPlayer from './pages/TutorialPlayer';
import Features from './pages/Features';
import About from './pages/About';
import Pricing from './pages/Pricing';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Notifications from './pages/Notifications';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes inside AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/onboarding" element={<DomainSelection />} />
            <Route path="/domain/:domainName" element={<DomainOverview />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/exams" element={<ExamEngine />} />
            <Route path="/interview" element={<MockInterview />} />
            <Route path="/resume" element={<ResumeAnalyzer />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:id" element={<ProblemView />} />
            <Route path="/interview-prep" element={<InterviewPrep />} />
            <Route path="/mock-assessment" element={<MockAssessment />} />
            <Route path="/mock-report" element={<MockReport />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/oops" element={<OopsGuide />} />
            <Route path="/os-tutorial" element={<OSTutorial />} />
            <Route path="/dbms-tutorial" element={<DBMSTutorial />} />
            <Route path="/cn-tutorial" element={<CNTutorial />} />
            <Route path="/aptitude" element={<Aptitude />} />
            <Route path="/logical-reasoning" element={<LogicalReasoning />} />
            <Route path="/verbal-ability" element={<VerbalAbility />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/tutorials/:id" element={<TutorialPlayer />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          {/* Catch-all route to redirect back to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
