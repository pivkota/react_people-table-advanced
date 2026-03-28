import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PeopleTable } from './PeopleTable';
import { Person } from '../types';
import { getPeople } from '../api';

export const PeoplePage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [searchParams] = useSearchParams();

  useEffect(() => {
    setLoading(true);
    getPeople()
      .then(setPeople)
      .catch(() => setErrorMessage('Помилка завантаження даних'))
      .finally(() => setLoading(false));
  }, []);

  const filteredPeople = useMemo(() => {
    let result = [...people];

    const query = searchParams.get('query')?.toLowerCase();
    const sex = searchParams.get('sex');
    const sort = searchParams.get('sort');
    const order = searchParams.get('order');

    // Фільтрація по тексту
    if (query) {
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.motherName?.toLowerCase().includes(query) ||
          p.fatherName?.toLowerCase().includes(query),
      );
    }

    if (sex) {
      result = result.filter(p => p.sex === sex);
    }

    // Сортування
    if (sort) {
      result.sort((a, b) => {
        const valA = a[sort as keyof Person] ?? '';
        const valB = b[sort as keyof Person] ?? '';

        if (valA < valB) {
          return order === 'desc' ? 1 : -1;
        }

        if (valA > valB) {
          return order === 'desc' ? -1 : 1;
        }

        return 0;
      });
    }

    return result;
  }, [people, searchParams]);

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">People Page</h1>

        {errorMessage && (
          <div data-cy="peopleLoadingError" className="notification is-danger">
            <button
              type="button"
              className="delete"
              onClick={() => setErrorMessage('')}
            />
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div data-cy="loader">
            <div className="loader is-loading" />
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {filteredPeople.length > 0 ? (
              <PeopleTable people={filteredPeople} />
            ) : (
              <p className="notification is-warning" data-cy="noPeopleMessage">
                There are no people matching the search.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
};
