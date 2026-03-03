import { useState, useEffect } from 'react';
import { api } from '../api';
import { useRole } from '../context/RoleContext';
import MentorshipCard from '../components/MentorshipCard';
import FilterSidebar from '../components/FilterSidebar';

export default function MentorshipListPage() {
  const { isStudent, userId } = useRole();
  const [mentorships, setMentorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    industry: '',
  });

  const fetchMentorships = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append('isActive', '1');
    if (filters.search) params.append('search', filters.search);
    if (filters.location) params.append('location', filters.location);
    if (filters.industry) params.append('industry', filters.industry);
    try {
      const data = await api.get(`/mentorships?${params.toString()}`);
      setMentorships(data);
    } catch {
      setMentorships([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSaved = async () => {
    if (!isStudent || !userId) return;
    try {
      const saved = await api.get(`/saved-postings?studentId=${userId}`);
      setSavedIds(new Set(saved.map((s) => s.jobPostingId)));
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    fetchMentorships();
  }, [filters]);

  useEffect(() => {
    fetchSaved();
  }, [isStudent, userId]);

  const handleSave = async (jobId) => {
    try {
      await api.post('/saved-postings', { studentId: userId, jobPostingId: jobId });
      setSavedIds((prev) => new Set([...prev, jobId]));
    } catch {
      /* already saved */
    }
  };

  const filterConfig = [
    { name: 'search', label: 'Search', type: 'text', placeholder: 'Search mentorships...' },
    { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g., Dallas' },
    { name: 'industry', label: 'Industry', type: 'text', placeholder: 'e.g., Technology' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Browse Mentorships</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 shrink-0">
          <FilterSidebar filters={filters} onChange={setFilters} config={filterConfig} />
        </div>
        <div className="flex-1">
          {loading ? (
            <p className="text-gray-500 text-center py-12">Loading mentorships...</p>
          ) : mentorships.length > 0 ? (
            <div className="space-y-4">
              {mentorships.map((m) => (
                <MentorshipCard
                  key={m.id}
                  job={m}
                  showSave={isStudent && userId}
                  isSaved={savedIds.has(m.id)}
                  onSave={() => handleSave(m.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-12">No mentorships found matching your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
