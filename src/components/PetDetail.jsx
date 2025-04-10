import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/PetDetail.css';

const PetDetail = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY;
  const API_SECRET = ''; // You'll need to add your API secret here

  // Get access token
  useEffect(() => {
    const getAccessToken = async () => {
      try {
        const response = await fetch('https://api.petfinder.com/v2/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `grant_type=client_credentials&client_id=${API_KEY}&client_secret=${API_SECRET}`,
        });
        
        if (!response.ok) throw new Error('Failed to get access token');
        
        const data = await response.json();
        setAccessToken(data.access_token);
      } catch (err) {
        setError('Failed to authenticate with Petfinder API');
        setLoading(false);
      }
    };

    getAccessToken();
  }, []);

  // Fetch pet details when we have an access token
  useEffect(() => {
    const fetchPetDetails = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch(`https://api.petfinder.com/v2/animals/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch pet details');
        
        const data = await response.json();
        setPet(data.animal);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [id, accessToken]);

  if (loading) return <div className="loading">Loading pet details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!pet) return <div className="error">Pet not found</div>;

  return (
    <div className="pet-detail">
      <div className="pet-header">
        <h1>{pet.name}</h1>
        <span className="status">{pet.status}</span>
      </div>

      <div className="pet-content">
        <div className="pet-images">
          {pet.photos.map((photo, index) => (
            <img key={index} src={photo.large} alt={`${pet.name} - ${index + 1}`} />
          ))}
        </div>

        <div className="pet-info">
          <h2>About</h2>
          <p>{pet.description}</p>

          <div className="info-grid">
            <div className="info-item">
              <h3>Breed</h3>
              <p>{pet.breeds.primary}</p>
              {pet.breeds.secondary && <p>Mixed with {pet.breeds.secondary}</p>}
            </div>

            <div className="info-item">
              <h3>Colors</h3>
              <p>{pet.colors.primary}</p>
              {pet.colors.secondary && <p>{pet.colors.secondary}</p>}
            </div>

            <div className="info-item">
              <h3>Age</h3>
              <p>{pet.age}</p>
            </div>

            <div className="info-item">
              <h3>Size</h3>
              <p>{pet.size}</p>
            </div>
          </div>

          <div className="characteristics">
            <h2>Characteristics</h2>
            <ul>
              {pet.tags.map(tag => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>

          <div className="contact">
            <h2>Contact</h2>
            <p>Email: {pet.contact.email}</p>
            {pet.contact.phone && <p>Phone: {pet.contact.phone}</p>}
            <p>Location: {pet.contact.address.city}, {pet.contact.address.state}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetail; 