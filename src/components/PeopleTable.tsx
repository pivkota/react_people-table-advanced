/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { Person } from '../types';

interface Props {
  people: Person[];
}

export const PeopleTable: React.FC<Props> = ({ people }) => {
  const location = useLocation();
  const { slug: selectedSlug } = useParams();

  return (
    <table
      data-cy="peopleTable"
      className="table is-striped is-hoverable is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Sex</th>
          <th>Born</th>
          <th>Died</th>
          <th>Mother</th>
          <th>Father</th>
        </tr>
      </thead>

      <tbody>
        {people.map(person => {
          const mother = people.find(p => p.name === person.motherName);
          const father = people.find(p => p.name === person.fatherName);

          return (
            <tr
              key={person.slug}
              data-cy="person"
              className={
                person.slug === selectedSlug ? 'has-background-warning' : ''
              }
            >
              <td>
                <Link
                  to={{
                    pathname: `/people/${person.slug}`,
                    search: location.search,
                  }}
                  className={person.sex === 'f' ? 'has-text-danger' : ''}
                >
                  {person.name}
                </Link>
              </td>

              <td>{person.sex}</td>
              <td>{person.born}</td>
              <td>{person.died}</td>

              <td>
                {mother ? (
                  <Link
                    to={{
                      pathname: `/people/${mother.slug}`,
                      search: location.search,
                    }}
                    className="has-text-danger"
                  >
                    {mother.name}
                  </Link>
                ) : person.motherName ? (
                  <span>{person.motherName}</span>
                ) : (
                  '-'
                )}
              </td>

              <td>
                {father ? (
                  <Link
                    to={{
                      pathname: `/people/${father.slug}`,
                      search: location.search,
                    }}
                  >
                    {father.name}
                  </Link>
                ) : person.fatherName ? (
                  <span>{person.fatherName}</span>
                ) : (
                  '-'
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
