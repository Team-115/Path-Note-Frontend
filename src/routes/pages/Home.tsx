import MapWithCategory from '../../components/MapWithCategory';
import Map from '../../components/Map';

export default function Home() {
  return (
    <div className="relative w-full h-screen">
      <MapWithCategory />
      <Map width="100%" height = "calc(100vh)"/>
    </div>
  );
}
