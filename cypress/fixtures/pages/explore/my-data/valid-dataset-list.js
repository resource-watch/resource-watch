
// this list contains the following datasets:
// - a valid one with GEE as provider and one layer,
// - a valid one with CartoDB as provider and one layer,
// - an invalid one with CartoDB as provider but without any layer,
// - an invalid one with featureservice as provider and one layer,
module.exports = [{
  "id": "2063964b-56c8-4080-b2a5-5a7710f321b9",
  "type": "dataset",
  "attributes": {
    "name": "ene.031a Solar Irradiance",
    "slug": "Solar-Irradiance",
    "type": "raster",
    "subtitle": "",
    "application": [
      "rw"
    ],
    "dataPath": "",
    "attributesPath": null,
    "connectorType": "rest",
    "provider": "gee",
    "userId": "5d0901197aabc0001072e40c",
    "connectorUrl": "",
    "sources": [],
    "tableName": "users/resourcewatch/ene_031a_solar_irradiance_GHI/GHI_250_mosaic",
    "status": "saved",
    "published": true,
    "overwrite": false,
    "subscribable": {},
    "mainDateField": "",
    "env": "production",
    "applicationConfig": {
      "rw": {
        "highlighted": "true"
      }
    },
    "geoInfo": true,
    "protected": false,
    "legend": {
      "date": [],
      "region": [],
      "country": [],
      "nested": [],
      "integer": [],
      "short": [],
      "byte": [],
      "double": [],
      "float": [],
      "half_float": [],
      "scaled_float": [],
      "boolean": [],
      "binary": [],
      "text": [],
      "keyword": []
    },
    "clonedHost": {},
    "errorMessage": "",
    "taskId": null,
    "createdAt": "2020-02-24T15:33:22.525Z",
    "updatedAt": "2020-04-27T18:10:43.604Z",
    "dataLastUpdated": null,
    "metadata": [
      {
        "id": "5e6f89e13bdf10001bdf9522",
        "type": "metadata",
        "attributes": {
          "dataset": "2063964b-56c8-4080-b2a5-5a7710f321b9",
          "application": "rw",
          "resource": {
            "id": "2063964b-56c8-4080-b2a5-5a7710f321b9",
            "type": "dataset"
          },
          "language": "en",
          "name": "Solar Energy Potential",
          "description": "### Overview  \n  \nThe Solar Energy Potential dataset is made up of two layers: average daily global horizontal irradiation (GHI) and average daily photovoltaic power potential. GHI is the sum of direct and diffuse radiation received on a horizontal plane presented in the units kilowatt hour per square meter (kWh/m²). Radiation is energy that moves from one place to another and in this dataset it refers to energy released by the sun traveling to Earth. Irradiance refers to the average amount of radiation received in a given area on Earth.  Photovoltaic power potential, or Potential photovoltaic electricity\nProduction (PVOUT), is the estimated amount of energy converted by a photovoltaic system into electricity presented in kilowatt-hour per kilowatt peak of the photovoltaic system (kWh/kWp) according to the geographical conditions of a site and configuration of the photovoltaic system. GHI acts as an important base measurement to help determine regions that receive enough sunlight and is used to assess an area for flat-plate photovoltaic and solar heating technologies. PVOUT works to calculate the actual effectiveness of a solar energy project in the region based on local conditions.\n\n  \n  \nThe datasets were created using geostationary satellite imagery and meteorological models, including SolarGIS’s global solar model (v2.1). Satellite imagery data comes from the National Oceanic and Atmospheric Administration (NOAA), North American Space Agency (NASA), European Organisation for the Exploitation of Meteorological Satellites (EUMESTAT), and Japan Meteorological Administration (JMA).\n\n  \n  \nThe final averages presented in these datasets were created using yearly and daily averages taken between 1994/1999/2007 and 2018, depending on region of the world. The GHI dataset is presented on Resource Watch at a spatial resolution of 250 meters and PVOUT 1 kilometer. \n\n  \n  \nThese datasets are taken from SolarGIS’s Global Solar Atlas, which is funded by the World Bank’s Energy Sector Management Assistance Program (ESMAP). The Global Solar Atlas was created to help companies and governments improve the efficiency of photovoltaic projects. Increasing sustainable energy production, like solar, is a crucial step in reducing the world’s reliance on fossil fuels.\n  \n  \n### Methodology  \n  \nThe average daily global horizontal irradiation (GHI) and average daily photovoltaic power potential layers were created using SolarGIS’s global solar model (v2.1). The model utilizes data from geostationary satellites and metrological models. First, clear-sky irradiance values were calculated using the position of the sun on earth at a given time. The irradiance values used in the calculations assumed that there were no clouds present in the sky. This determined the sun’s irradiance that reached earth based on the effect of altitude, concentration of aerosols (particles coming from different sources, natural and human), water vapor, and ozone. Then data from geostationary meteorological satellites was input to determine cloud cover during the same time period. These two data sources were coupled to provide the global horizontal irradiation values.\n\n  \n  \nThe photovoltaic power potential was calculated by combining the horizontal irradiation dataset with data on surface air temperature and a simulation of photovoltaic power cells. First, the horizontal irradiation dataset was converted into irradiation at optimum tilt to provide ideal conditions for power potential on a photovoltaic cell. Optimum tilt refers to the most efficient angle for a surface to be at to receive the highest amount of the sun’s radiation. Surface air temperature data was collected from meteorological stations when available and otherwise from meteorological models. Data from models was disaggregated by SolarGIS to increase their spatial resolution. The photovoltaic power cell simulation used was the Single-diode equivalent circuit simulation.\n\n\n  \n  \nTo create a daily average value of GHI and PVOUT, data was averaged between 1994 and 2018 for Europe/Africa, 1999 and 2018 for North America/South America/Central Asia, and 2007 and 2018 for East Asia. GHI data was presented in kWh/m² at a spatial resolution of 9 arcsec (250 m). PVOUT data was in kWh/kWp with a spatial resolution of 30 arcsec (1 km).\n\n  \n  \nFor the full documentation, please click on the “Learn more” button.\n  \n  \n### Additional Information  \n  \nResource Watch shows only a subset of the dataset. Additional data for diffuse horizontal irradiation, direct normal irradiation, terrain elevation above sea level, global irradiation for optimally tilted surfaces, optimum tilt to maximize yearly yield, and air temperature at 2 m above ground level is available from the data provider. For access to the full dataset and additional information, click on the “Learn more” button.  \n  \n### Visualizing the Data  \n  \nOur team reformatted this dataset before displaying it on Resource Watch. See the documentation on how Resource Watch retrieved and pre-processed the data on [Github](https://github.com/resource-watch/data-pre-processing/tree/master/ene_031a_solar_irradiance).  \n  \n### Disclaimer  \n  \nExcerpts of this description page were taken from the source metadata.",
          "source": "World Bank Group/ESMAP/Solargis",
          "info": {
            "rwId": "ene.031.rw1",
            "data_type": "Raster",
            "name": "Solar Energy Potential",
            "sources": [
              {
                "source-name": "",
                "id": 0,
                "source-description": "World Bank Group"
              },
              {
                "source-name": "",
                "id": 1,
                "source-description": "Energy Sector Management Assistance Program (ESMAP)"
              },
              {
                "source-name": "",
                "id": 2,
                "source-description": "Solargis"
              }
            ],
            "technical_title": "Global Horizontal Irradiation & Photovoltaic Electricity Output",
            "functions": "Daily global averages of horizontal irradiance and photovoltaic power potential ",
            "cautions": "- Uncertainty for GHI values is around 8% for latitudes above 50 degrees, countries in humid tropical climates, areas with highly variable levels of aerosols (Northern India, West Africa, Gulf region, some regions in China), mountains with snow/ice, and regions with minimal ground measurement data.\n- The amount of data used to create daily averages varies by region of the world, with Africa/Europe’s data starting in 1994 and East Asia’s in 2007. It is possible that regions with lower quantities of data available have slightly less accurate averages.\n",
            "citation": "Global Solar Atlas. 2018. Retrieved from http://globalsolaratlas.info/. Accessed through Resource Watch, (date). https://www.resourcewatch.org.",
            "license": "Creative Commons Attribution 4.0 International",
            "license_link": "https://creativecommons.org/licenses/by/4.0/",
            "geographic_coverage": "Global",
            "spatial_resolution": "Global Horizontal Irradiation = 9 arcsec (250 m)\nPotential Photovoltaic Electricity\nProduction = 30 arcsec (1 km)\n",
            "date_of_content": "1994/1999/2007 - 2018",
            "frequency_of_updates": "Unknown ",
            "learn_more_link": "https://globalsolaratlas.info/support/about",
            "data_download_link": null,
            "data_download_original_link": "https://globalsolaratlas.info/download/world"
          },
          "columns": {},
          "createdAt": "2020-03-16T14:14:57.586Z",
          "updatedAt": "2021-04-01T19:59:22.528Z",
          "status": "published"
        }
      }
    ],
    "layer": [
      {
        "id": "0bb499a3-3a09-4461-a8d6-295b8491cd5a",
        "type": "layer",
        "attributes": {
          "name": "Average Daily Global Horizontal Irradiation (kWh/m²)",
          "slug": "Average-Daily-Global-Horizontal-Irradiation-kWhm_1",
          "dataset": "2063964b-56c8-4080-b2a5-5a7710f321b9",
          "description": "The daily average rate of horizontal irradiation received around the world.",
          "application": [
            "rw"
          ],
          "iso": [],
          "provider": "gee",
          "type": "layer",
          "userId": "5d0901197aabc0001072e40c",
          "default": true,
          "protected": false,
          "published": true,
          "env": "production",
          "layerConfig": {
            "type": "gee",
            "assetId": "users/resourcewatch/ene_031a_solar_irradiance_GHI/GHI_250_mosaic",
            "body": {
              "styleType": "sld",
              "sldValue": "<RasterSymbolizer> <ColorMap type=\"ramp\" extended=\"false\" > '<ColorMapEntry color=\"#000003\" quantity=\"0\"  opacity=\"0\" />' +   '<ColorMapEntry color=\"#270B52\" quantity=\"1\" opacity=\"1\" />'+'<ColorMapEntry color=\"#63146E\" quantity=\"3\"  />'+'<ColorMapEntry color=\"#9E2963\" quantity=\"3\"  />' +  '<ColorMapEntry color=\"#D24742\" quantity=\"4\"  />' + <ColorMapEntry color=\"#F57C15\" quantity=\"5\"  />' + '<ColorMapEntry color=\"#FABF25\" quantity=\"6\"  />' +   '<ColorMapEntry color=\"#FCFEA4\" quantity=\"7.5\" />' + '<ColorMapEntry color=\"#FCFEA4\" quantity=\"8\"  opacity=\"0\"  />' +  </ColorMap>  </RasterSymbolizer>"
            }
          },
          "legendConfig": {
            "items": [
              {
                "color": "#270B52",
                "name": "≤1",
                "id": 0
              },
              {
                "color": "#63146E",
                "name": "≤2",
                "id": 1
              },
              {
                "color": "#9E2963",
                "name": "≤3",
                "id": 2
              },
              {
                "color": "#D24742",
                "name": "≤4",
                "id": 3
              },
              {
                "color": "#F57C15",
                "name": "≤5",
                "id": 4
              },
              {
                "color": "#FABF25",
                "name": "≤6",
                "id": 5
              },
              {
                "color": "#FCFEA4",
                "name": "≤8",
                "id": 6
              }
            ],
            "type": "choropleth"
          },
          "interactionConfig": {
            "type": "intersection",
            "config": {
              "url": "https://api.resourcewatch.org/v1/query/2063964b-56c8-4080-b2a5-5a7710f321b9?sql=select st_summarystats(rast, 'b1', false) as x from 'users/resourcewatch/ene_031a_solar_irradiance_GHI/GHI_250_mosaic' where ST_INTERSECTS(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Point\",\"coordinates\":[{{lng}},{{lat}}]}'),4326),the_geom)"
            },
            "output": [
              {
                "column": "x.b1.mean",
                "property": "Global Horizontal Irradiance",
                "type": "number",
                "format": "0.00",
                "prefix": " ",
                "suffix": " kWh/m²"
              }
            ]
          },
          "applicationConfig": {},
          "staticImageConfig": {},
          "createdAt": "2020-02-24T15:34:09.069Z",
          "updatedAt": "2020-04-23T23:20:47.407Z"
        }
      },
      {
        "id": "68fe6a1e-6481-43ff-8fc2-cf0d23a7b701",
        "type": "layer",
        "attributes": {
          "name": "Average Daily Photovoltaic Power Potential (kWh/kWp)",
          "slug": "Average-Daily-Photovoltaic-Power-Potential-kWhkWp",
          "dataset": "2063964b-56c8-4080-b2a5-5a7710f321b9",
          "description": "The daily average amount of electricity generated by a photovoltaic system with 1 kilowatt peak installed capacity.",
          "application": [
            "rw"
          ],
          "iso": [],
          "provider": "gee",
          "type": "layer",
          "userId": "5d0901197aabc0001072e40c",
          "default": false,
          "protected": false,
          "published": true,
          "env": "production",
          "layerConfig": {
            "body": {
              "sldValue": "<RasterSymbolizer> <ColorMap type=\"ramp\" extended=\"false\" > '<ColorMapEntry color=\"#000003\" quantity=\"1\"  opacity=\"1\" />' +  '<ColorMapEntry color=\"#221150\" quantity=\"2\" />' +    '<ColorMapEntry color=\"#5D177E\" quantity=\"3\" />' +    '<ColorMapEntry color=\"#972C7F\" quantity=\"3.5\" />' +    '<ColorMapEntry color=\"#D1426E\" quantity=\"4\" />' +  '<ColorMapEntry color=\"#F8755C\" quantity=\"4.5\" />' +  '<ColorMapEntry color=\"#FEB97F\" quantity=\"5.5\" />' +    '<ColorMapEntry color=\"#FBFCBF\" quantity=\"8\" opacity=\"0\"  />' +  </ColorMap>  </RasterSymbolizer>",
              "styleType": "sld"
            },
            "assetId": "users/resourcewatch/ene_031a_global_solar_atlas_PVOUT/solar_PVOUT_mosaic",
            "type": "gee"
          },
          "legendConfig": {
            "type": "choropleth",
            "items": [
              {
                "name": "≤1",
                "color": "#000003",
                "id": 0
              },
              {
                "name": "≤2",
                "color": "#221150",
                "id": 1
              },
              {
                "name": "≤3",
                "color": "#5D177E",
                "id": 2
              },
              {
                "name": "≤3.5",
                "color": "#972C7F",
                "id": 3
              },
              {
                "name": "≤4",
                "color": "#D1426E",
                "id": 4
              },
              {
                "name": "≤4.5",
                "color": "#F8755C",
                "id": 5
              },
              {
                "name": "≤5.5",
                "color": "#FEB97F",
                "id": 6
              },
              {
                "name": "≤8",
                "color": "#FBFCBF",
                "id": 7
              }
            ]
          },
          "interactionConfig": {
            "type": "intersection",
            "config": {
              "url": "https://api.resourcewatch.org/v1/query/2063964b-56c8-4080-b2a5-5a7710f321b9?sql=select st_summarystats(rast, 'b1', false) as x from 'users/resourcewatch/ene_031a_global_solar_atlas_PVOUT/solar_PVOUT_mosaic' where ST_INTERSECTS(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Point\",\"coordinates\":[{{lng}},{{lat}}]}'),4326),the_geom)"
            },
            "output": [
              {
                "column": "x.b1.mean",
                "property": "Photovoltaic Power Potential",
                "type": "number",
                "format": "0.00",
                "prefix": " ",
                "suffix": " kWh/kWp"
              }
            ]
          },
          "applicationConfig": {},
          "staticImageConfig": {},
          "createdAt": "2020-02-24T19:02:52.698Z",
          "updatedAt": "2020-04-23T18:08:08.996Z"
        }
      }
    ],
  }
},
{
  "id": "4919be3a-c543-4964-a224-83ef801370de",
  "type": "dataset",
  "attributes": {
    "name": "dis.006 ReliefWeb Disaster Events in the News",
    "slug": "dis006-ReliefWeb-Disasaters",
    "type": "tabular",
    "subtitle": "",
    "application": [
      "rw"
    ],
    "dataPath": "",
    "attributesPath": null,
    "connectorType": "rest",
    "provider": "cartodb",
    "userId": "5ba001878e311b7e3718740f",
    "connectorUrl": "https://rw-nrt.carto.com/tables/dis_006_reliefweb_disasters/public",
    "sources": [],
    "tableName": "dis_006_reliefweb_disasters",
    "status": "saved",
    "published": true,
    "overwrite": false,
    "subscribable": {},
    "mainDateField": "",
    "env": "production",
    "applicationConfig": {
      "rw": {
        "highlighted": "true"
      }
    },
    "geoInfo": true,
    "protected": false,
    "legend": {
      "date": [],
      "region": [],
      "country": [],
      "nested": [],
      "integer": [],
      "short": [],
      "byte": [],
      "double": [],
      "float": [],
      "half_float": [],
      "scaled_float": [],
      "boolean": [],
      "binary": [],
      "text": [],
      "keyword": []
    },
    "clonedHost": {},
    "errorMessage": "",
    "taskId": null,
    "createdAt": "2019-07-09T08:50:59.108Z",
    "updatedAt": "2021-04-09T08:50:23.675Z",
    "dataLastUpdated": "2021-04-09T08:50:22.911Z",
    "metadata": [
      {
        "id": "5d2352b182e9bb001514a9d4",
        "type": "metadata",
        "attributes": {
          "dataset": "4919be3a-c543-4964-a224-83ef801370de",
          "application": "rw",
          "resource": {
            "id": "4919be3a-c543-4964-a224-83ef801370de",
            "type": "dataset"
          },
          "language": "en",
          "name": "Current Disaster Events",
          "description": "### Overview  \n  \nThis dataset shows countries experiencing disaster events that are actively being monitored by ReliefWeb. These disaster events include floods, droughts, severe local storms, tropical cyclones, storm surges, tsunamis, earthquakes, wildfires, cold waves, heat waves, volcanic activity, landslides, mudslides, snow avalanches, epidemics, insect infestations, and technological disasters.\n  \n  \n\nReliefWeb is the leading humanitarian information source on global crises and disasters. ReliefWeb continuously collects the latest information on ongoing crises and monitors for emerging situations. By providing reliable and timely information, they enable humanitarian workers to make informed decisions and plan effective responses.\n  \n  \n### Methodology  \n  \nReliefWeb's editorial team monitors and collects information from more than 4,000 key sources, including humanitarian agencies at the international and local levels, governments, think tanks and research institutions, and the media. From this information, ReliefWeb editors identify and select the content that is most relevant to global humanitarian workers. For the full documentation, please click on the “Learn more” button.  \n  \n### Additional Information  \n  \nResource Watch shows only a subset of the dataset. For access to the full dataset and additional information, click on the “Learn more” button.  \n  \n### Visualizing the Data  \n  \nOur team reformatted this dataset before displaying it on Resource Watch. See the documentation on how Resource Watch processed the data on [Github](https://github.com/resource-watch/nrt-scripts/tree/master/dis_006_reliefweb_disasters). Coordinates provided in the source data were used to map this data for display on Resource Watch.   \n  \n### Disclaimer  \n  \nExcerpts of this description page were taken from the source metadata.",
          "source": "ReliefWeb",
          "info": {
            "rwId": "dis.006.rw0.nrt",
            "data_type": "Tabular",
            "name": "Current Disaster Events",
            "sources": [
              {
                "source-name": "",
                "id": 0,
                "source-description": "ReliefWeb"
              }
            ],
            "technical_title": "ReliefWeb Disasters",
            "functions": "Current and ongoing global disaster events\r",
            "cautions": "Because ReliefWeb editors select the content that is most relevant to global humanitarian workers, not all current disasters may be reported in this dataset.\r\n  \n  \n\r\nEach point is located in the center of a particular country to show that the country is currently experiencing at least one disaster event. The location of this point does not indicate the actual location of the disaster.\r",
            "citation": "OCHA/ReliefWeb. n.d. “Disasters.” Retrieved from https://reliefweb.int/. Accessed through Resource Watch, (date). [www.resourcewatch.org](https://www.resourcewatch.org).",
            "license": "Restrictions apply",
            "license_link": "https://reliefweb.int/terms-conditions",
            "geographic_coverage": "Global",
            "spatial_resolution": "National",
            "date_of_content": "Present",
            "frequency_of_updates": "Daily",
            "learn_more_link": "https://reliefweb.int/disasters",
            "data_download_link": null,
            "data_download_original_link": "https://reliefweb.int/help/api"
          },
          "columns": {
            "event_id": {
              "alias": "Event ID"
            },
            "event_name": {
              "alias": "Event Name"
            },
            "description": {
              "alias": "Description"
            },
            "status": {
              "alias": "Status"
            },
            "date": {
              "alias": "Date"
            },
            "primary_country": {
              "alias": ""
            },
            "country_iso3": {
              "alias": "Country ISO Code"
            },
            "current": {
              "alias": "Current",
              "description": "Status of event: True or False"
            },
            "url": {
              "alias": "Link"
            },
            "lon": {
              "alias": "Longitude"
            },
            "lat": {
              "alias": "Latitude"
            },
            "event_types": {
              "alias": "Event Types"
            },
            "country_name": {
              "alias": "Country"
            }
          },
          "createdAt": "2019-07-08T14:26:57.092Z",
          "updatedAt": "2021-04-01T19:57:43.169Z",
          "status": "published"
        }
      }
    ],
    "layer": [
      {
        "id": "00e688a8-086e-4206-9ea7-b47afca6913c",
        "type": "layer",
        "attributes": {
          "name": "Countries Experiencing Disaster Events",
          "slug": "Disaster-Events-in-the-News-Points",
          "dataset": "4919be3a-c543-4964-a224-83ef801370de",
          "description": "Countries experiencing ongoing disasters that are actively being monitored by ReliefWeb. Each point is located in the center of a particular country and does not indicate where in that country the disaster occurred. The types of disasters being monitored include floods, droughts, severe local storms, tropical cyclones, storm surges, tsunamis, earthquakes, wildfires, cold waves, heat waves, volcanic activity, landslides, mudslides, snow avalanches, epidemics, insect infestations, and technological disasters.",
          "application": [
            "rw"
          ],
          "iso": [],
          "provider": "cartodb",
          "type": "layer",
          "userId": "5ba001878e311b7e3718740f",
          "default": true,
          "protected": false,
          "published": true,
          "env": "production",
          "layerConfig": {
            "account": "rw-nrt",
            "body": {
              "maxzoom": 18,
              "minzoom": 0,
              "layers": [
                {
                  "type": "mapnik",
                  "options": {
                    "sql": "SELECT * FROM dis_006_reliefweb_disasters_interaction",
                    "cartocss": "#dis_006_reliefweb_disasters_interaction  {::halo { marker-width: 20; marker-fill-opacity: 0.2;marker-fill:#FFF; marker-line-color: #FFF; marker-line-width: 0; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-allow-overlap: true; } marker-fill-opacity: 1; marker-line-width: 0.3 ; marker-line-opacity: 1; marker-placement: point; marker-type: ellipse; marker-allow-overlap: true; marker-fill:#42f4f1; marker-line-color: #42f4f1; marker-width: 8;}",
                    "cartocss_version": "2.3.0"
                  }
                }
              ],
              "vectorLayers": [
                {
                  "paint": {
                    "circle-color": "#42f4f1",
                    "circle-stroke-width": [
                      "interpolate",
                      [
                        "linear"
                      ],
                      [
                        "zoom"
                      ],
                      0,
                      2,
                      3,
                      6,
                      12,
                      15
                    ],
                    "circle-stroke-color": "#fff",
                    "circle-opacity": 0.9,
                    "circle-stroke-opacity": 0.3,
                    "circle-radius": [
                      "interpolate",
                      [
                        "linear"
                      ],
                      [
                        "zoom"
                      ],
                      0,
                      3,
                      3,
                      10,
                      12,
                      30
                    ]
                  },
                  "source-layer": "layer0",
                  "type": "circle",
                  "filter": [
                    "all"
                  ]
                }
              ]
            },
            "layerType": "vector"
          },
          "legendConfig": {
            "type": "basic",
            "items": [
              {
                "name": "Country with Current Disaster",
                "color": "#42f4f1",
                "id": 0
              }
            ]
          },
          "interactionConfig": {
            "output": [
              {
                "column": "country_name",
                "format": null,
                "prefix": "",
                "property": "Country",
                "suffix": "",
                "type": "string"
              },
              {
                "column": "interaction",
                "format": null,
                "prefix": "",
                "property": "Current Events (link to description)",
                "suffix": ""
              }
            ]
          },
          "applicationConfig": {},
          "staticImageConfig": {},
          "createdAt": "2019-11-12T19:59:28.596Z",
          "updatedAt": "2020-05-17T22:17:29.089Z"
        }
      }
    ],
  }
},
{
  "id": "acf42a1b-104b-4f81-acd0-549f805873fb",
  "type": "dataset",
  "attributes": {
    "name": "foo.053.nrt Food Price Spikes",
    "slug": "foo053-Food-Price-Spikes",
    "type": "tabular",
    "subtitle": "WFP VAM",
    "application": [
      "rw"
    ],
    "dataPath": "",
    "attributesPath": null,
    "connectorType": "rest",
    "provider": "cartodb",
    "userId": "59a4168c9557070001cb9c77",
    "connectorUrl": "https://rw-nrt.carto.com/tables/foo_053a_alerts_for_price_spikes/public",
    "sources": [],
    "tableName": "foo_053a_alerts_for_price_spikes",
    "status": "saved",
    "published": true,
    "overwrite": false,
    "subscribable": {},
    "mainDateField": "date",
    "env": "production",
    "applicationConfig": {
      "rw": {
        "highlighted": "true"
      }
    },
    "geoInfo": true,
    "protected": false,
    "legend": {
      "date": [],
      "region": [],
      "country": [],
      "nested": [],
      "integer": [],
      "short": [],
      "byte": [],
      "double": [],
      "float": [],
      "half_float": [],
      "scaled_float": [],
      "boolean": [],
      "binary": [],
      "text": [],
      "keyword": []
    },
    "clonedHost": {},
    "errorMessage": "",
    "taskId": null,
    "createdAt": "2019-08-20T21:10:35.517Z",
    "updatedAt": "2021-04-13T04:18:45.516Z",
    "dataLastUpdated": "2021-03-15T00:00:00.000Z",
    "metadata": [
      {
        "id": "5ac924b5976f8a0012fba877",
        "type": "metadata",
        "attributes": {
          "dataset": "acf42a1b-104b-4f81-acd0-549f805873fb",
          "application": "rw",
          "resource": {
            "id": "acf42a1b-104b-4f81-acd0-549f805873fb",
            "type": "dataset"
          },
          "language": "en",
          "name": "Food Price Spikes",
          "description": "### Overview  \n  \nThe Alert for Price Spikes (ALPS) dataset tracks the current prices of key staple food commodities and compares them to expected prices, which are calculated based on seasonal trends. An ALPS value is assigned to a given commodity at a particular market based on how much its current price differs from the expected price. This value is used to categorize a commodity’s price into one of four categories: normal, stress, alert, or crisis.\r\n  \n  \n\r\nFood prices on a local market often correlated with food security crises. Food price spikes can have devastating impacts for rural households in developing countries since they spend a large percentage of income on food. ALPS serves three main purposes for decision-making. First, it can serve as a price monitoring tool that allows users to identify price abnormalities. Second, ALPS can generate early warning information that enables users to prepare and act to reduce harm to households most vulnerable to food price fluctuations. Third, ALPS can trigger contingency planning by anticipating food price crises. \r\n  \n  \n\r\nThe ALPS dataset is generated by the World Food Programme (WFP) and monitors markets spanning more than 60 countries. The time period over which prices have been tracked varies by location, but certain markets have food price data as early as 1994. The data is updated monthly for markets that are actively being monitored.  \n  \n### Methodology  \n  \nSeasonal price trends were determined through reference to monthly commodity prices recorded in the WFP's Vulnerability Analysis and Mapping (VAM) Food and Commodity Price dataset. This dataset was collected by WFP country offices, national government agencies, and partner organizations. \r\n  \n  \n\r\nThe ALPS indicator level was calculated in four steps:\r\n- **Estimation of seasonal price trends**: The seasonal price trend was calculated using a linear regression of market price data over the entire period for which data was available. Both the long-term trend and monthly fluctuations, related to the production or demand of a commodity, were included in the regression.\r\n  \n  \n- **Calculation of the difference between market price and estimated price**: The difference between the observed price and the expected price based on seasonal trends was calculated for each month.\r\n  \n  \n- **Calculation of the ALPS indicator considering price volatility**: Each month’s difference was divided by the standard deviation of the differences over all of the recorded months, producing the value of the ALPS indicator.\r\n  \n  \n- **Categorization of the ALPS indicator**: Based on the ALPS indicator value, markets were assigned to one of four situations:  (1) Normal: ALPS < 0.25; (2) Stress: 0.25 ≤ ALPS < 1; (3) Alert: 1 ≤ ALPS < 2; (4) Crisis: ALPS ≥ 2.\r\n  \n  \n\r\nFor the full documentation, please click on the “Learn more” button.\r\n  \n  \n### Additional Information  \n  \nResource Watch shows only a subset of the dataset. For access to the full dataset and additional information, click on the “Learn more” button.  \n  \n### Visualizing the Data  \n  \nOur team reformatted this dataset before displaying it on Resource Watch. See the documentation on how Resource Watch processed the data on [Github](https://github.com/resource-watch/nrt-scripts/tree/master/foo_053_alerts_price_spikes). Coordinates provided in the source data were used to map this data for display on Resource Watch.  \n  \n### Disclaimer  \n  \nExcerpts of this description page were taken from the source metadata.",
          "source": "WFP",
          "info": {
            "rwId": "foo.053.rw0.nrt",
            "data_type": "Tabular",
            "name": "Food Price Spikes",
            "sources": [
              {
                "source-name": "",
                "id": 0,
                "source-description": "World Food Programme (WFP)"
              }
            ],
            "technical_title": "Alert for Price Spikes (ALPS)",
            "functions": "Deviation of key staple food commodity prices from seasonal trends",
            "cautions": "- These alerts are a result of a statistical process that compares current prices to seasonal trends in prices. It does not account explicitly for other factors in the general economy, such as general price inflation rates, that may impact how seriously fluctuations in key staple food prices affect local buying power and food security. The linear regression used to calculate the seasonal trends and variability in prices assumes that the time series of prices is stationary for each market, i.e., that the nature of the trend doesn't vary over time for each market. The general economic forces affecting prices, such as population growth and inflation, are implicitly represented by the coefficient of the trend term in the linear regression. Under the assumption of stationarity, these forces are assumed to be constant for each market, but this may not be realistic. \n  \n  \n- When using and interpreting ALPS dataset in the context of market and food security analysis, it is important to note that the indicator is more meaningful when used for the most consumed food commodities in the country. Locally produced staples food commodities should also get priority attention, and finally analysts can also consider imported commodities. \n",
            "citation": "World Food Programme, Vulnerability Assessment and Mapping Unit. 2017. \"The ALert for Price Spikes (ALPS). \" https://dataviz.vam.wfp.org/economic_explorer/price-forecasts-alerts. Accessed through Resource Watch, (date). [www.resourcewatch.org](https://www.resourcewatch.org).",
            "license": "Creative Commons Attribution 3.0 IGO",
            "license_link": "https://creativecommons.org/licenses/by/3.0/igo/legalcode",
            "geographic_coverage": "Select countries",
            "spatial_resolution": null,
            "date_of_content": "Varies",
            "frequency_of_updates": "Monthly",
            "learn_more_link": "https://documents.wfp.org/stellent/groups/public/documents/manual_guide_proced/wfp264186.pdf?_ga=2.155059965.418661181.1556120721-1045976685.1553722904",
            "data_download_link": null,
            "data_download_original_link": "https://dataviz.vam.wfp.org/economic_explorer/price-forecasts-alerts"
          },
          "columns": {
            "date": {
              "alias": "Date"
            },
            "currency": {
              "alias": "Currency"
            },
            "category": {
              "alias": "Food Category"
            },
            "mktname": {
              "alias": "Market Name"
            },
            "forecast": {
              "alias": "Forecast",
              "description": "True (for forecast) or False (for historical data)"
            },
            "alps": {
              "alias": "ALPS Category"
            },
            "pewi": {
              "alias": "ALPS Value"
            },
            "mp_price": {
              "alias": "Price"
            },
            "cmname": {
              "alias": "Commodity"
            },
            "unit": {
              "alias": "Unit"
            },
            "admname": {
              "alias": "Region"
            },
            "trend": {
              "alias": "Trend"
            }
          },
          "createdAt": "2018-04-07T20:06:13.495Z",
          "updatedAt": "2021-04-01T20:00:39.231Z",
          "status": "published"
        }
      }
    ],
    "layer": [],
  }
},
{
  "id": "20aead6e-fef9-41c7-92c8-ea00edcae077",
  "type": "dataset",
  "attributes": {
    "name": "bio.030 Tiger Conservation Landscapes",
    "slug": "Tiger-Conservation-Landscapes-1490086842553",
    "type": "tabular",
    "subtitle": null,
    "application": [
      "rw"
    ],
    "dataPath": null,
    "attributesPath": null,
    "connectorType": "rest",
    "provider": "featureservice",
    "userId": "58333dcfd9f39b189ca44c75",
    "connectorUrl": "http://gis-gfw.wri.org/arcgis/rest/services/conservation/MapServer/3?f=pjson",
    "sources": [],
    "tableName": "conservationMapServer3",
    "status": "saved",
    "published": false,
    "overwrite": false,
    "subscribable": {},
    "mainDateField": null,
    "env": "production",
    "geoInfo": true,
    "protected": false,
    "legend": {
      "date": [],
      "region": [],
      "country": [],
      "nested": [],
      "integer": [],
      "short": [],
      "byte": [],
      "double": [],
      "float": [],
      "half_float": [],
      "scaled_float": [],
      "boolean": [],
      "binary": [],
      "text": [],
      "keyword": []
    },
    "clonedHost": {},
    "errorMessage": null,
    "taskId": null,
    "createdAt": "2017-02-15T12:20:35.446Z",
    "updatedAt": "2018-08-09T16:41:50.251Z",
    "dataLastUpdated": null,
    "layer": [
      {
        "id": "84698937-429c-4141-8752-8d8f36a7e98c",
        "type": "layer",
        "attributes": {
          "name": "Tiger Conservation Landscapes and Corridors",
          "slug": "tiger-conservation-landscapes",
          "dataset": "20aead6e-fef9-41c7-92c8-ea00edcae077",
          "description": "Locations of tiger conservation landscapes, Tx2 tiger conservation landscapes, and Terai Arc Landscape corridors.",
          "application": [
            "rw"
          ],
          "iso": [
            ""
          ],
          "provider": "cartodb",
          "userId": "57a0aa1071e394dd32ffe137",
          "default": true,
          "protected": false,
          "published": true,
          "env": "production",
          "layerConfig": {
            "account": "wri-01",
            "body": {
              "maxzoom": 18,
              "extent": [
                16769672.5095,
                -3209132.19552,
                3189564.31628,
                5850795.89306
              ],
              "layers": [
                {
                  "type": "mapnik",
                  "options": {
                    "sql": "SELECT * FROM tiger_conservation_landscapes",
                    "cartocss": "#tiger_conservation_landscapes {  polygon-fill: #FFCC00;  polygon-opacity: 0.8;  line-color: #FF5C00;  line-width: 0.5;  line-opacity: 0.5;}#tiger_conservation_landscapes[tx2_tcl=1] {  polygon-fill: #FF5C00;  line-color: #081B47;}",
                    "cartocss_version": "2.3.0"
                  }
                }
              ],
              "vectorLayers": [
                {
                  "paint": {
                    "line-color": " #FF5C00",
                    "line-width": 0.5,
                    "line-opacity": 0.5
                  },
                  "source-layer": "layer0",
                  "type": "line",
                  "filter": [
                    "all"
                  ]
                },
                {
                  "paint": {
                    "fill-color": " #FFCC00",
                    "fill-opacity": 0.8
                  },
                  "source-layer": "layer0",
                  "type": "fill",
                  "filter": [
                    "all"
                  ]
                },
                {
                  "paint": {
                    "line-color": " #081B47"
                  },
                  "source-layer": "layer0",
                  "type": "line",
                  "filter": [
                    "all",
                    [
                      "==",
                      "tx2_tcl",
                      1
                    ]
                  ]
                },
                {
                  "paint": {
                    "fill-color": " #FF5C00"
                  },
                  "source-layer": "layer0",
                  "type": "fill",
                  "filter": [
                    "all",
                    [
                      "==",
                      "tx2_tcl",
                      1
                    ]
                  ]
                }
              ]
            },
            "layerType": "raster"
          },
          "legendConfig": {
            "items": [
              {
                "color": "#FFCC00",
                "name": "Tiger conservation landscapes"
              },
              {
                "color": "#FF5C00",
                "name": "Tx2 tiger conservation landscapes"
              },
              {
                "color": "#229a00",
                "name": "Terai arc landscape corridors"
              }
            ],
            "type": "basic"
          },
          "interactionConfig": {
            "output": [
              {
                "column": "tcl_name",
                "format": null,
                "prefix": "",
                "property": "Tiger Conservation Landscape",
                "suffix": "",
                "type": "esriFieldTypeString"
              },
              {
                "column": "area_ha",
                "format": null,
                "prefix": "",
                "property": "Area",
                "suffix": " ha",
                "type": "esriFieldTypeInteger"
              }
            ]
          },
          "applicationConfig": {
            "default": true,
            "active": true,
            "global": true,
            "metadata": "tiger_conservation_landscapes"
          },
          "staticImageConfig": {},
          "createdAt": "2017-04-17T09:43:11.508Z",
          "updatedAt": "2020-04-17T13:49:26.993Z"
        }
      }
    ],
  }
}
];
