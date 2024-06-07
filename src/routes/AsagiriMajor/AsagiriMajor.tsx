import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useEffect } from "react";
import way_points from "../../json/AsagiriMajorWP.json";
import ctrs from "../../json/AsagiriCTR.json";
import { point, polygon as polygon_turf, area, circle } from '@turf/turf'

mapboxgl.accessToken = 'pk.eyJ1IjoiMjM4eSIsImEiOiJja3g0azExMnIwMHU2MnBxbzRxaXFjZnphIn0.EcKvdeVO9iMKaVjZA4auEQ';

const empty_data = {
  type: 'FeatureCollection',
  features: []
};

const empty_source = {
  type: "geojson",
  data: empty_data
};

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

const ctr_polygon_layer = {
  "id": "ctr_polygon",
  "type": "fill",
  "source": "ctr",
  "layout": {},
  "paint": {
      // 'fill-antialias': false,
      'fill-color': 'red',
      'fill-opacity': 0.2
  }
};

const ctr_border_layer = {
  "id": "ctr_border",
  "type": "line",
  "source": "ctr",
  "paint": {
      "line-color": "red",
      "line-width": 3,
      "line-opacity": 0.3
  }
};

const highlight_ctr_polygon_layer = {
  "id": "highlight_ctr_polygon",
  "type": "fill",
  "source": "highlight_ctr",
  "layout": {},
  "paint": {
      // 'fill-antialias': false,
      'fill-color': 'red',
      'fill-opacity': 0.4
  }
};

const highlight_ctr_border_layer = {
  "id": "highlight_ctr_border",
  "type": "line",
  "source": "highlight_ctr",
  "paint": {
      "line-color": "red",
      "line-width": 3,
      "line-opacity": 0.3
  }
};

const AsagiriMajor = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const changeIsOpenMenu = () => {
    setIsOpenMenu(!isOpenMenu);
  };

	let before_highlight_ctr_id: number | null = null;
	let now_highlight_ctr_id: number | null = null;

  const mapContainer = useRef<HTMLDivElement>(null);
	const map = useRef<any>(null);

  const ctr_sort = (ctr1: any, ctr2: any) => {
    return ctr1.properties.area - ctr2.properties.area;
	}

  useEffect(() => {
    const ctr_features = ctrs.map(function (ctr) {
			if (ctr.type == 'polygon') {
				const coordinates: number[][] = ctr.area.coordinates;
				const top_coordinate = coordinates[0];
				coordinates.push(top_coordinate);
				let polygon = polygon_turf(
					[coordinates],
					{
						'id': ctr.id,
						'name': ctr.name,
						'ng_max': ctr.ng_max,
						'ng_min': ctr.ng_min
					}
				);
				polygon.properties.area = area(polygon);
				return polygon;
			} else if (ctr.type == 'circle') {
				const coordinates: number[][] = ctr.area.coordinates;
				const top_coordinate = coordinates[0];
				coordinates.push(top_coordinate);
				let polygon = circle(
					ctr.area.center,
					ctr.area.radius,
					{
						units: 'meters',
						properties: {
							'id': ctr.id,
							'name': ctr.name,
							'ng_max': ctr.ng_max,
							'ng_min': ctr.ng_min
						}
					}
				);
				polygon.properties.area = area(polygon);
				return polygon;
			} else {
				return
			}
		});

		if (map.current) return;
		map.current = new mapboxgl.Map({
			container: mapContainer.current as HTMLElement,
			style: 'mapbox://styles/238y/ckyaqps0h53md14odt8waizz6',
			center: [138.55, 35.38],
			zoom: 13,
			pitch: 65,
			maxPitch: 71,
			bearing: -100,
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

        marker.getElement().addEventListener('click', () => {
          map.current.getSource('highlight_ctr').setData(empty_data);
        });
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

      map.current.addSource(
				'ctr',
				{
					'type': 'geojson',
					'data': {
						'type': 'FeatureCollection',
						'features': ctr_features
					}
				}
			);
			map.current.addLayer(ctr_polygon_layer);
			map.current.addLayer(ctr_border_layer);

			map.current.addSource('highlight_ctr', empty_source);
			map.current.addLayer(highlight_ctr_polygon_layer);
			map.current.addLayer(highlight_ctr_border_layer);
    });

    // コントロール関係表示
    map.current.addControl(new mapboxgl.NavigationControl());

    // スケール表示
    map.current.addControl(new mapboxgl.ScaleControl({
			maxWidth: 200,
			unit: 'metric'
    }));

    map.current.on('click', function (e: any) {
			before_highlight_ctr_id = now_highlight_ctr_id;
			now_highlight_ctr_id = null;
			map.current.getSource('highlight_ctr').setData(empty_data);
		});

		map.current.on('click', 'ctr_polygon', (e: any) => {
			const features = e.features.sort(ctr_sort).slice();

			let is_exist = false;
			let i = null;
			for (i = 0; i < features.length - 1; i++) {
        if (features[i].properties.id == before_highlight_ctr_id) {
            is_exist = true;
            break;
        }
			}

			let properties = features[0].properties;
			if (is_exist) {
					properties = features[i + 1].properties;
			}

			const id = properties.id;
			const ng_max = properties.ng_max;
			const ng_min = properties.ng_min;

			before_highlight_ctr_id = now_highlight_ctr_id;
			now_highlight_ctr_id = id;

			let html = '';
			if (ng_min == 0 && ng_max == 10000) {
					html = '<p>高度によらず侵入禁止</p>';
			} else if (ng_min == 0 && ng_max != 10000) {
					html = '<p>' + String(ng_max) + 'm以下侵入禁止</p>';
			}

    	new mapboxgl.Popup({
        closeButton: false,
        className: 'my-class'
    	})
        .setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(map.current);

    	const highlight_ctr_feature = ctr_features.find(ctr_feature => ctr_feature.properties.id == id);

			map.current.getSource('highlight_ctr').setData({
				'type': 'FeatureCollection',
				'features': [highlight_ctr_feature]
			});
    });

    map.current.on('mouseenter', 'ctr_polygon', () => {
			map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'ctr_polygon', () => {
			map.current.getCanvas().style.cursor = '';
    });
	}, []);

  return (
    <main className="mx-auto w-full h-screen">
      <header className="flex justify-between py-5 bg-slate-950 w-full">
      {/* <header className="flex justify-between py-5 bg-slate-100 w-full"> */}
        <h1 className="ml-10 text-3xl text-white">朝霧（主要PT）</h1>
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

export default AsagiriMajor
