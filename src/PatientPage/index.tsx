import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { Icon } from 'semantic-ui-react';

import { useParams } from 'react-router-dom';
import { Patient } from '../types';
import { apiBaseUrl } from '../constants';
import { useStateValue, updatePatient } from '../state';

export default function PatientPage() {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();
  const fetchStatus = useRef({ shouldFetch: true, hasFetched: false });
  const patient = patients[id];

  useEffect(() => {
    const fetchPatient = async () => {
      console.log('Fetching');
      fetchStatus.current = { ...fetchStatus.current, shouldFetch: false };
      try {
        const { data: patientFromApi } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        dispatch(updatePatient(patientFromApi));
        fetchStatus.current = { ...fetchStatus.current, hasFetched: true };
      } catch (e) {
        console.error(e);
      }
    };

    if (fetchStatus.current.shouldFetch) {
      void fetchPatient();
    }
  }, []);

  if (patient) {
    return (
      <div>
        <h2>
          {patient.name}{' '}
          <Icon name={patient.gender === 'male' ? 'man' : patient.gender === 'female' ? 'woman' : 'genderless'} />{' '}
        </h2>
        <p>ssh: {patient.ssn}</p>
        <p>occupation: {patient.occupation}</p>
      </div>
    );
  }
  return null;
}
