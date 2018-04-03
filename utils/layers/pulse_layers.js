import React from 'react';

// Components
import LayerPill from 'layout/pulse/layer-pill';

export const LAYERS_PLANET_PULSE = [
  {
    label: 'Land use',
    layers: [
      {
        label: 'Crop and vegitation health',
        id: '17b9bf19-e116-4a22-b71a-fe67ce7fd552',
        '3d': false,
        descriptionPulse:
          <div className="description">
						<p>
				The vegetation health index (VHI) is an indicator of water and heat stress on crops and natural vegetation. Values below 40 may indicate reduced crop yields or greater fire risk. VHI is derived from data from the VIIRS sensor on the Suomi NPP satellite.
						</p>
						<p>
							<strong>View with:</strong>
							<LayerPill layerId="c7e76588-6da5-4645-8842-2d2ac0001110" label="Cropland" />
						</p>
          </div>,
        contextLayers: ['c7e76588-6da5-4645-8842-2d2ac0001110'],
        contextLayersOnTop: true,
        widgets: [],
        basemap: {
          name: 'other',
          url: 'https://api.mapbox.com/styles/v1/wri/cjd56ttip0i1s2rnxv8py2km5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid3JpIiwiYSI6Ik9TY2w5RTQifQ.0HV7dQTjK40mk7GpNNA64g'
        }
      },
      {
        label: 'Forest clearing',
        id: 'f4897107-5ae5-4685-8eee-cd1a5745a384',
        '3d': false,
        descriptionPulse:
          <div className="description">
						<p>
							Trees are cut for timber or cleared for agriculture, mining and development. FORMA Active Clearing Alerts detect likely tree cover loss across the tropics using data from the MODIS sensors aboard NASA’s Terra and Aqua satellites. Data only covers select countries.
						</p>
						<p>
							<strong>View with:</strong>
							<LayerPill layerId="7a270c3a-1161-4fb2-a613-090d3e603126" label="Forests" />
							<LayerPill layerId="ed051817-1cb3-42cc-91b5-1caaea6f8ca6" label="Forest loss" />
							<LayerPill layerId="bd9ec0da-84a0-4429-bf30-ffcbe64fbe7b" label="Data coverage" />
						</p>
          </div>,
        contextLayers: ['7a270c3a-1161-4fb2-a613-090d3e603126',
					              'ed051817-1cb3-42cc-91b5-1caaea6f8ca6',
        	              'bd9ec0da-84a0-4429-bf30-ffcbe64fbe7b'],
        contextLayersOnTop: true,
        widgets: [],
        basemap: {
          name: 'other',
          url: 'https://api.mapbox.com/styles/v1/wri/cjd56ttip0i1s2rnxv8py2km5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid3JpIiwiYSI6Ik9TY2w5RTQifQ.0HV7dQTjK40mk7GpNNA64g'
        }
      },
      {
        label: 'Satellite imagery',
        id: 'f4897107-5ae5-4685-8eee-cd1a5745a384',
        '3d': false,
        descriptionPulse:
          <div className="description">
						<p>
							The VIIRS sensor aboard the Suomi NPP satellite collects imagery as it orbits the Earth every 100 minutes. Passing over the poles 14 times per day, it crosses the equator at at 1:30am local time, photographing the entire world each day.
						</p>
          </div>,
        contextLayers: [],
        contextLayersOnTop: true,
        widgets: [],
        basemap: {
          name: 'other',
          url: 'https://api.mapbox.com/styles/v1/wri/cjd56ttip0i1s2rnxv8py2km5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid3JpIiwiYSI6Ik9TY2w5RTQifQ.0HV7dQTjK40mk7GpNNA64g'
        }
      },
      {
        label: 'Nighttime imagery',
        id: 'f4897107-5ae5-4685-8eee-cd1a5745a384',
        '3d': false,
        descriptionPulse:
          <div className="description">
						<p>
							The VIIRS sensor aboard the Suomi NPP satellite collects nighttime imagery as it orbits the Earth every 100 minutes. Passing over the poles 14 times per day, it crosses the equator at on the nighttime side of the Earth at 1:30am local time.
						</p>
          </div>,
        contextLayers: [],
        contextLayersOnTop: true,
        widgets: [],
        basemap: {
          name: 'other',
          url: 'https://api.mapbox.com/styles/v1/wri/cjd56ttip0i1s2rnxv8py2km5/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid3JpIiwiYSI6Ik9TY2w5RTQifQ.0HV7dQTjK40mk7GpNNA64g'
        }
      }
    ]
  },
  {
    label: 'Air quality',
    layers: [
      {
        label: 'Particulate matter (PM 10)',
        id: '73cc7325-a62c-4a8d-9724-af697d3f7072',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        '3d': false,
        descriptionPulse:
          <div className="description">
						<p>
							Dust particles less than 10 microns in diameter from road dust, industrial pollution and other sources affect human health. These air quality measurements are collected from government and research sources by OpenAQ. 
						</p>
						<p>
							<strong>View with:</strong>
							<LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
						</p>
          </div>,
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Fine particulate matter (PM 2.5)',
        id: 'a5136895-9aab-4f2c-8a33-d22b833724ec',
        descriptionPulse:
          <div className="description">
						<p>
							Fine particles less than 2.5 microns in diameter are known to have more severe health impacts than their larger cousins. Air quality measurements are collected from government and research sources by OpenAQ.
						</p>
						<p>
							<strong>View with:</strong>
							<LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
						</p>
          </div>,
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        '3d': false,
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Fires',
        id: '5ca12eec-f8fe-49eb-b353-67c9eeb5bc6a',
        '3d': false,
        descriptionPulse:
          <div className="description">
						<p>
							Fires may occur naturally or be lit to clear land or for other purposes. Smoke from fires can be a major health hazard. NASA detects fires using the VIIRS sensor on the Suomi NPP satellite.
						</p>
						<p>
							<strong>View with:</strong>
							<LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
							<LayerPill layerId="7a270c3a-1161-4fb2-a613-090d3e603126" label="Forests" />
						</p>
          </div>,
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d',
					'7a270c3a-1161-4fb2-a613-090d3e603126'],
        contextLayersOnTop: false,
        widgets: [],
        basemap: {
          name: 'sentinel',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      }
    ]
  },
  {
    label: 'Climate',
    layers: [
      {
        label: 'Temperature anomolies',
        id: 'f1d841cb-a959-4b54-8472-e28f794b2c6a',
        contextLayers: [],
        contextLayersOnTop: true,
        '3d': false,
        widgets: [],
        descriptionPulse:
          <div className="description">
						<p>
							Global patterns behind warm winters and cold summers are revealed by measuring the difference between the current month and the historical average for that month. Globally temperatures have risen nearly 1ºC over the past half century. These temperature anomalies are computed by NASA from a combination of ground and satellite observations.
						</p>
          </div>
      },
      {
        label: 'Droughts',
        id: 'f1d841cb-a959-4b54-8472-e28f794b2c6a',
        contextLayers: ['c7e76588-6da5-4645-8842-2d2ac0001110'],
        contextLayersOnTop: true,
        '3d': false,
        widgets: [],
        descriptionPulse:
          <div className="description">
						<p>
							The 3-month Standardised Precipitation-Evapotranspiration Index (SPEI) is an indicator of short term drought affecting rainfed crops and vegetation. SPEI is calculated by comparing the past three month’s rainfall and evaporation rate to a historical baseline (1950-2010).
						</p>
						<p>
							<strong>View with:</strong>
							<LayerPill layerId="c7e76588-6da5-4645-8842-2d2ac0001110" label="Cropland" />
						</p>
          </div>
      },
      {
        label: 'Arctic sea ice',
        id: 'f1d841cb-a959-4b54-8472-e28f794b2c6a',
        contextLayers: [],
        contextLayersOnTop: true,
        '3d': false,
        widgets: ['d87bb471-1ac0-4f79-818a-e270f04185bf'],
        descriptionPulse:
          <div className="description">
						<p>
							Sea ice grows and shrinks with temperature, affecting global weather patterns and shipping routes. Sea ice extent typically peaks in March reaches its lowest point in September in the northern hemisphere. Extents are measured by NOAA using data from the DSMP satellites.
						</p>
						<p>
							<strong>View with:</strong>
							<LayerPill layerId="d87bb471-1ac0-4f79-818a-e270f04185bf" label="Historical extent" />
						</p>
          </div>
      },
      {
        label: 'Coral reef bleaching',
        id: '73db724d-87b9-41cd-912a-b66eb65eebdd',
        '3d': false,
        descriptionPulse:
          <div className="description">
						<p>
							Abnormally high ocean temperatures can damage coral reefs, turning them a bleached white. NOAA generates bleaching alerts from sea surface temperature data derived from a combination of global weather satellites.
						</p>
						<p>
							<strong>View with:</strong>
							<LayerPill layerId="c7e76588-6da5-4645-8842-2d2ac0001110" label="Reef locations" />
						</p>
          </div>,
        contextLayers: ["c7e76588-6da5-4645-8842-2d2ac0001110"],
        contextLayersOnTop: true,
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Tropospheric CO₂',
        id: 'f1d841cb-a959-4b54-8472-e28f794b2c6a',
        contextLayers: [],
        contextLayersOnTop: true,
        '3d': false,
        widgets: [],
        descriptionPulse:
          <div className="description">
						<p>
							Carbon dioxide gas (CO₂) affects global temperatures by trapping in heat from the sun. Global CO₂ concentrations vary with the seasonal growth of forests and human activities. CO₂ concentrations are detected by the AIRS sensor on NASA’s Aqua satellite.
						</p>
          </div>
      },
    ]
  },

  {
    label: 'Society',
    layers: [
      {
        label: 'Food insecurity',
        id: 'a2eccfd8-de7e-4fb8-93c4-22f119994f3e',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: true,
        '3d': false,
        descriptionPulse:
          <div className="description">
						<p>
							Crop failure, conflict, and market failures can limit people’s ability to access enough food to survive. FEWS NET monitors conditions that could lead to severe food insecurity through a combination of on-the-ground reports, satellite data, and expert knowledge of economic conditions. Data for select countries only.
						</p>
          </div>,
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Conflicts and protests',
        id: '2da3bbb8-a8b7-47b7-b3bc-823ddc330960',
        descriptionPulse:
          <div className="description">
						<p>
							ACLED gathers and reports dates and locations of violence and protests in Africa and 10 countries in South and Southeast Asia. Larger point sizes indicate events with fatalities. Data for select countries only.
						</p>
						<p>
							<strong>View with:</strong>
							<LayerPill layerId="117ef67f-0613-40de-8429-a0097fe4f262" label="Data coverage" />
						</p>
          </div>,
        contextLayers: ['117ef67f-0613-40de-8429-a0097fe4f262'],
        contextLayersOnTop: false,
        '3d': false,
        markerType: 'default',
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Migrant Deaths',
        id: '0c094e37-4563-4633-9a38-28dd4a4724bf',
        descriptionPulse:
          <div className="description">
						<p>
							Migrants seek to cross international borders to flee hardship or find a better life. The International Organization for Migration (IOM) records deaths of migrants who die in accidents, shipwrecks, violent attacks, or medical complications during their journeys.
						</p>
						<p>
							<strong>View with:</strong>
							<LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
						</p>
          </div>,
        contextLayers: [],
        contextLayersOnTop: false,
        '3d': false,
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Asylum requests',
        id: 'd0ec0531-9241-407c-bbae-d3dc55c7d6ea',
        descriptionPulse:
          <div className="description">
						<p>
							People who wish to be resettled in another country can apply for refugee status with a specific destination country. 38 European and 6 non-European countries report the number of asylum requests they receive each month to the United Nations High Commission on Refugees. 
						</p>
						<p>
							<strong>View with:</strong>
							<LayerPill layerId="af3513d5-284f-488c-8256-e90c30a1ca8b" label="Reporting countries" />
						</p>
          </div>,
        contextLayers: ['af3513d5-284f-488c-8256-e90c30a1ca8b'],
        contextLayersOnTop: true,
        '3d': false,
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      }
    ]
  },
  {
    label: 'Disasters',
    layers: [
      {
        label: 'Floods',
        id: '80d2665b-bba4-4de9-ba5e-d0487e920784',
        '3d': false,
        descriptionPulse:
          <div className="description">
						<p>
							Major floods can devastate affected areas, displacing people and disrupting the local economy. The Dartmouth Flood Observatory aggregates flood reports from news, governmental, instrumental, and remote sensing sources.
						</p>
						<p>
							<strong>View with:</strong>
							<LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
						</p>
          </div>,
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Landslide warnings',
        id: '61067a0d-b2a3-441e-85c1-2eef5a18e4a5',
        '3d': false,
        descriptionPulse:
          <div className="description">
						<p>
							Landslides often occur when heavy rains destabilize hillsides. NOAA publishes real-time landslide hazard alerts based on recent precipitation, combined with information on roads, tree cover loss, slope steepness, bedrock structure.
						</p>
						<p>
							<strong>View with:</strong>
							<LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
						</p>
          </div>,
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        widgets: [],
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Earthquakes',
        id: 'd63fff22-8cda-467e-b4ef-df3ab2613505',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d', '47a1b1d7-e5ad-4b79-9f52-bc9435c6ca06'],
        contextLayersOnTop: false,
        '3d': false,
        markerType: 'bar',
        widgets: [],
        descriptionPulse:
          <div className="description">
						<p>
							Earthquakes occur when the Earth’s crust shifts and releases energy in the form of massive vibrations. The USGS monitors earthquakes globally though a network of ground sensors.
						</p>
						<p>
							<strong>View with:</strong>
							<LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
							<LayerPill layerId="47a1b1d7-e5ad-4b79-9f52-bc9435c6ca06" label="Fault lines" />
						</p>
          </div>,
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      },
      {
        label: 'Volcanos',
        id: '667ae321-649e-4caa-b761-35e370c776b0',
        contextLayers: ['84229e01-4e61-4c08-a7dd-efb7259dd85d'],
        contextLayersOnTop: false,
        '3d': true,
        markerType: 'volcano',
        descriptionPulse:
          <div className="description">
						<p>
							The Smithsonian Institution and USGS aggregate reports of volcanic ash cloud releases and new and significant changes in volcanic activity.
						</p>
						<p>
							<strong>View with:</strong>
							<LayerPill layerId="84229e01-4e61-4c08-a7dd-efb7259dd85d" label="Population" />
						</p>
          </div>,
        basemap: {
          name: 'default',
          url: 'https://api.mapbox.com/styles/v1/resourcewatch/cj1erey1c00ia2rqmvh6htv3x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVzb3VyY2V3YXRjaCIsImEiOiJjajFlcXZhNzcwMDBqMzNzMTQ0bDN6Y3U4In0.FRcIP_yusVaAy0mwAX1B8w'
        }
      }
    ]
  }
];
