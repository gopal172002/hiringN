'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import JobRow from "@/app/components/JobRow";

export default function Hero() {
  const [jobType, setJobType] = useState({
    fullTime: false,
    internship: false,
  });
  const [experience, setExperience] = useState('');
  const [salary, setSalary] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true); // Set loading before fetching jobs
      try {
        const response = await axios.get('/api/job/filter');
        const sortedJobs = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setJobs(sortedJobs);
        setFilteredJobs(sortedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false); // Stop loading after fetching jobs
      }
    };
    fetchJobs();
  }, []);

  const applyFilters = useCallback(async () => {
    setLoading(true); // Set loading before applying filters
    try {
      const filterParams = {};

      // Only include type if either fullTime or internship is selected
      const selectedTypes = [];
      if (jobType.fullTime) selectedTypes.push('Full');
      if (jobType.internship) selectedTypes.push('Intern');
      if (selectedTypes.length > 0) {
        filterParams.type = selectedTypes;
      }

      // Include experience if selected
      if (experience) {
        filterParams.experience = parseInt(experience.split(' ')[2], 10);
      }

      // Include salary if selected
      if (salary) {
        filterParams.salary = salary;
      }

      // Make the API call with the filterParams
      const response = await axios.get('/api/job/filter', { params: filterParams });
      const sortedFilteredJobs = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFilteredJobs(sortedFilteredJobs);
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false); // Stop loading after applying filters
    }
  }, [jobType, experience, salary]);

  const clearAllFilters = useCallback(() => {
    setJobType({ fullTime: false, internship: false });
    setExperience('');
    setSalary('');
    setFilteredJobs(jobs);
  }, [jobs]);

  const handleJobTypeChange = (type) => {
    setJobType((prevState) => ({ ...prevState, [type]: !prevState[type] }));
  };

  return (
    <section className="w-full my-8 px-4 lg:px-0">
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4 text-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-12 gap-8">
        {/* Filters Section - Left */}
        <div
          className={`col-span-3 lg:block ${showFilters ? 'block' : 'hidden'} lg:static absolute bg-white z-10 lg:bg-transparent lg:z-auto w-full lg:w-auto`}
        >
          <div className="border lg:border-0 lg:border-gray-300 p-4 rounded-md shadow-sm lg:shadow-none">
            <h2 className="text-xl font-bold mb-4">Filters</h2>

            {/* Job Type Filters */}
            <div className="mb-4">
              <h3 className="font-semibold">Job Type</h3>
              <div className="flex flex-wrap gap-4 mt-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={jobType.fullTime}
                    onChange={() => handleJobTypeChange('fullTime')}
                  />
                  Full Time
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={jobType.internship}
                    onChange={() => handleJobTypeChange('internship')}
                  />
                  Internship
                </label>
              </div>
            </div>

            {/* Experience Filters */}
            <div className="mb-4">
              <h3 className="font-semibold">Experience</h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {['More than 0 years', 'More than 1 year', 'More than 2 years', 'More than 3 years', 'More than 4 years'].map(exp => (
                  <label className="flex items-center" key={exp}>
                    <input
                      type="radio"
                      name="experience"
                      className="mr-2"
                      checked={experience === exp}
                      onChange={() => setExperience(exp)}
                    />
                    {exp}
                  </label>
                ))}
              </div>
            </div>

            {/* Salary Filters */}
            <div className="mb-4">
              <h3 className="font-semibold">Salary</h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {['Competitive', '2-4 LPA', '4-6 LPA', '6-10 LPA', '10-20 LPA', '20-30 LPA', '30-40 LPA', '40+ LPA'].map(sal => (
                  <label className="flex items-center" key={sal}>
                    <input
                      type="radio"
                      name="salary"
                      className="mr-2"
                      checked={salary === sal}
                      onChange={() => setSalary(sal)}
                    />
                    {sal}
                  </label>
                ))}
              </div>
            </div>

            {/* Apply and Clear Filters Buttons */}
            <div className="mt-4">
              <button
                type="button"
                onClick={applyFilters}
                className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={clearAllFilters}
                className="bg-gray-400 text-white py-2 px-4 rounded-md"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Job Listings Section - Right */}
        <div className="col-span-9">
          <h2 className="text-2xl font-bold mb-4">Job Openings</h2>
          {loading ? (
            <p>Loading jobs...</p>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobRow key={job._id} jobDoc={job} />
            ))
          ) : (
            <p>No jobs found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
