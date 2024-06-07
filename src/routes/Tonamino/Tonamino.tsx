import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useEffect } from "react";
import way_points from "../../json/TonaminoWP.json";
import { point } from '@turf/turf';

mapboxgl.accessToken = 'pk.eyJ1IjoiMjM4eSIsImEiOiJja3g0azExMnIwMHU2MnBxbzRxaXFjZnphIn0.EcKvdeVO9iMKaVjZA4auEQ';

const way_point_ids_symbol_layer = {
  'id': 'way_point_ids_symbol',
  'type': 'symbol',
  'source': 'way_point_ids',
  'layout': {
      // get the title name from the source's "title" property
      'text-size': 12,
      'text-field': ['get', 'name_ja'],
      'text-font': [
          'Open Sans Semibold',
          'Arial Unicode MS Bold'
      ],
      'text-offset': [0, 0.25],
      'text-anchor': 'top'
  },
  'paint': {
      'text-color': 'white',
      'text-halo-width': 2,
      'text-halo-color': 'black'
  }
}

const way_point_features = way_points.map((way_point) => {
  return point(
      [way_point.longitude, way_point.latitude],
      {
          'id': way_point.id,
          'name_ja': way_point.name_ja
      }
  )
});

const Tonamino = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const changeIsOpenMenu = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  const mapContainer = useRef<HTMLDivElement>(null);
	const map = useRef<any>(null);

  useEffect(() => {
		if (map.current) return;
		map.current = new mapboxgl.Map({
			container: mapContainer.current as HTMLElement,
			style: 'mapbox://styles/238y/ckyaqps0h53md14odt8waizz6',
			center: [136.93, 36.53],
			zoom: 13,
			pitch: 65,
			maxPitch: 71,
			bearing: 135,
			antialias: true,
		});

		map.current.on('load', () => {
			way_points.map(point => {
				const name = point.name_ja;
				const formal_id = point.formal_id;
				const alt = point.altitude;
				const lng = point.longitude;
				const lat = point.latitude;

				const html = '<h3>' + name + '</h3>' +
					'<table>' +
					'<tr><th>ID</th><th>' + formal_id + '</th></tr>' +
					'<tr><th>標高</th><th>' + String(alt) + 'm</th></tr>' +
					'<tr><th>北緯</th><th>' + String(lat) + '°</th></tr>' +
					'<tr><th>東経</th><th>' + String(lng) + '°</th></tr>' +
					'</table>'

				const popup = new mapboxgl.Popup({
					// closeOnClick: false
					closeButton: false,
					className: 'my-class'
				})
					.setHTML(html)
					.addTo(map.current);

				const marker = new mapboxgl.Marker()
					.setLngLat([point.longitude, point.latitude])
					.setPopup(popup)
					.addTo(map.current);
			});

			map.current.addSource(
				'way_point_ids',
				{
					'type': 'geojson',
					'data': {
						'type': 'FeatureCollection',
						'features': way_point_features
					}
				}
			);

			map.current.addLayer(way_point_ids_symbol_layer);
    });

    // コントロール関係表示
    map.current.addControl(new mapboxgl.NavigationControl());

    // スケール表示
    map.current.addControl(new mapboxgl.ScaleControl({
			maxWidth: 200,
			unit: 'metric'
    }));
	}, []);

  return (
    <main className="mx-auto w-full h-screen">
      <header className="flex justify-between py-5 bg-slate-950 w-full">
      {/* <header className="flex justify-between py-5 bg-slate-100 w-full"> */}
        <h1 className="ml-10 text-3xl text-white">となみ野</h1>
        <button
          className={`mr-10 text-white ${ isOpenMenu ? 'text-3xl' : 'text-2xl' }`}
          onClick={() => changeIsOpenMenu()}
        >
          { isOpenMenu ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />}
        </button>
      </header>
      {/* <div className="w-full h-[calc(100vh-76px)] relative"> */}
      <div className="relative">
        <div>
          <div ref={mapContainer} className="h-[calc(100vh-76px)] map-container" />
          {/* <div ref={mapContainer} className="map-container" /> */}
        </div>
        { isOpenMenu ?
          <div className={`absolute top-0 right-0 bg-slate-950 h-[calc(100vh-76px)] bg-opacity-60 ${ isOpenMenu ? 'w-48' : 'w-0' }`}>
            <ul className="m-5 text-white text-xl">
            <li className="my-3">
                <Link to='/'>
                  ホーム画面
                </Link>
              </li>
              <li className="my-3">
                <Link to='/tsukuba'>
                  つくば
                </Link>
              </li>
              <li className="my-3">
                <Link to='/asagiri'>
                  朝霧
                </Link>
              </li>
              <li className="my-3">
                <Link to='/asagiri_major'>
                  朝霧（主要PT）
                </Link>
              </li>
              <li className="my-3">
                <Link to='/shirataka'>
                  白鷹
                </Link>
              </li>
              <li className="my-3">
                <Link to='/tonamino'>
                  となみ野
                </Link>
              </li>
              <li className="my-3">
                <Link to='/dateh'>
                  Vietnam Dateh
                </Link>
              </li>
            </ul>
          </div>
          : ''
        }
      </div>
    </main>
  );
}

export default Tonamino
