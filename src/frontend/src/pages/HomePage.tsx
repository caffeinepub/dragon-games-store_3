import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useAuth';
import AboutUs from '../components/AboutUs';
import GameCatalog from '../components/GameCatalog';
import UserProfileSetup from '../components/UserProfileSetup';

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <AboutUs />
      <GameCatalog />
      {showProfileSetup && <UserProfileSetup open={showProfileSetup} />}
    </>
  );
}
