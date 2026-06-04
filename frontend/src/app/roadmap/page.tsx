'use client';

import { useState, useEffect, useMemo } from 'react';
import { RoadmapView } from '@/components/roadmap';
import { coursesAPI } from '@/lib/api';
import type { Course } from '@/lib/api';
import { Skeleton } from '@/components/common/Skeleton';

export default function RoadmapPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadCourses() {
      try {
        const data = await coursesAPI.getAll();
        if (!mounted) return;
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourseId(data[0]!.id);
        }
      } catch (err) {
        if (!mounted) return;
        setError(
          err instanceof Error ? err.message : 'Failed to load courses'
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCourses();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === selectedCourseId) ?? null,
    [courses, selectedCourseId]
  );

  return (
    <div className="mx-auto min-h-[calc(100vh-80px)] max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="mb-3 text-4xl font-black tracking-tighter text-white uppercase">
          Interactive <span className="text-[var(--brand)]">Roadmap</span>
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-gray-400">
          Visualize your learning journey through structured levels. Track
          completed modules, see what&apos;s available next, and navigate your
          curriculum path.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-72 rounded-xl" />
          <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-white/5">
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-64 w-96 rounded-xl" />
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
          <p className="text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-red-600 px-6 py-3 text-xs font-bold tracking-widest text-white uppercase hover:bg-red-500"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <label
              htmlFor="course-select"
              className="mb-2 block text-xs font-semibold tracking-widest text-gray-500 uppercase"
            >
              Select Course
            </label>
            <select
              id="course-select"
              value={selectedCourseId ?? ''}
              onChange={(e) => setSelectedCourseId(e.target.value || null)}
              className="w-full max-w-xs rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white transition focus:border-[var(--brand)] focus:outline-none"
              aria-label="Select a course to view its roadmap"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <RoadmapView course={selectedCourse} key={selectedCourseId} />
        </>
      )}
    </div>
  );
}
