import { useState, useEffect } from 'react';
import { 
  Droplets, Utensils, Cross, Home, CheckSquare, 
  Armchair, HandHeart, AlertTriangle, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { Header } from './Header';
import { SearchBar } from './SearchBar';
import { fetchServices } from '../services/api';
import type { Service } from '../types';
import './ExplorePage.css';

interface ExplorePageProps {
  onNavigate: (tab: any) => void;
}

const CATEGORIES = [
  { id: 'water', label: 'Water', icon: Droplets, color: 'var(--color-blue-water)' },
  { id: 'food', label: 'Food', icon: Utensils, color: 'var(--color-semantic-food)' },
  { id: 'medical', label: 'Medical', icon: Cross, color: 'var(--color-semantic-medical)' },
  { id: 'stay', label: 'Stay', icon: Home, color: 'var(--color-saffron)' },
  { id: 'toilets', label: 'Toilets', icon: CheckSquare, color: 'var(--color-purple)' },
  { id: 'rest', label: 'Rest', icon: Armchair, color: 'var(--text-secondary)' },
  { id: 'helpers', label: 'Helpers', icon: HandHeart, color: 'var(--color-saffron)' },
  { id: 'emergency', label: 'Emergency', icon: AlertTriangle, color: 'var(--color-semantic-medical)' },
];

const FILTERS = ['Near me', 'Along my route', 'Open now'];

export const ExplorePage = ({ onNavigate }: ExplorePageProps) => {
  const [activeFilter, setActiveFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [nearbyServices, setNearbyServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const services = await fetchServices();
        setNearbyServices(services.slice(0, 3));
      } catch (error) {
        console.error('Failed to load nearby services:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadServices();
  }, []);

  return (
    <div className="explore-container">
      <div className="explore-background" />
      
      <div className="explore-content">
        <Header showGreeting={false} transparentBg={true} />
        
        <div className="explore-intro">
          <h1>Explore the Wari</h1>
          <p>Find places, services and help along your journey.</p>
        </div>

        <SearchBar />

        <div className="quick-filters">
          {FILTERS.map(filter => (
            <button 
              key={filter}
              className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(activeFilter === filter ? '' : filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="explore-section">
          <h2 className="section-title">What do you need?</h2>
          <div className="category-grid">
            {CATEGORIES.map(category => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button 
                  key={category.id}
                  className={`category-card glass-panel ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCategory(isActive ? '' : category.id)}
                >
                  <div className="category-icon" style={{ backgroundColor: `${category.color}15` }}>
                    <Icon size={20} color={category.color} />
                  </div>
                  <span className="category-name">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="explore-section">
          <h2 className="section-title">Nearby now</h2>
          {isLoading ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Finding nearby places...
            </p>
          ) : nearbyServices.length > 0 ? (
            <div className="nearby-list">
              {nearbyServices.map(service => (
                <div key={service._id || service.name} className="nearby-card glass-panel">
                  <div className="nearby-info">
                    <h3>{service.name}</h3>
                    <div className="nearby-meta">
                      <span style={{ textTransform: 'capitalize' }}>{service.type}</span>
                      <span>•</span>
                      {/* Mocked distance for V1 UI */}
                      <span>{(Math.random() * 2 + 0.1).toFixed(1)} km away</span>
                    </div>
                  </div>
                  <div className={`nearby-status ${service.available ? 'open' : 'closed'}`}>
                    {service.available ? 'OPEN' : 'CLOSED'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Nothing nearby yet. Try expanding your search or exploring another category.
            </p>
          )}
        </div>

        <div className="explore-section">
          <h2 className="section-title">Trusted help</h2>
          <div className="trusted-grid">
            <div className="trusted-card glass-panel">
              <div>
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600 }}>Verified Medical Help</h3>
                <div className="verified-badge">
                  <ShieldCheck size={14} /> Official Team
                </div>
              </div>
              <ArrowRight size={20} color="var(--text-secondary)" />
            </div>
            <div className="trusted-card glass-panel">
              <div>
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600 }}>Verified Accommodation</h3>
                <div className="verified-badge">
                  <ShieldCheck size={14} /> Safe Stay
                </div>
              </div>
              <ArrowRight size={20} color="var(--text-secondary)" />
            </div>
          </div>
        </div>

        <div className="emergency-section">
          <div className="emergency-card" onClick={() => onNavigate('help')}>
            <div>
              <h3>Need help right now?</h3>
              <span>Get emergency assistance →</span>
            </div>
            <AlertTriangle size={24} color="var(--color-semantic-medical)" />
          </div>
        </div>

      </div>
    </div>
  );
};
